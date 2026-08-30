"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createVerificationToken, sendVerificationEmail } from "@/lib/email";

export type AuthState = { error?: string; code?: string; email?: string } | null;

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  const universityId = String(formData.get("universityId") || "") || null;

  if (!name || !email || !password || !confirmPassword) {
    return { error: "Please fill in all required fields." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(users)
    .values({ name, email, passwordHash, universityId })
    .returning({ id: users.id, name: users.name });

  const token = await createVerificationToken(email);
  const emailResult = await sendVerificationEmail(email, user.name, token);

  if (!emailResult.success) {
    console.error("Failed to send verification email:", emailResult.error);
  }

  redirect(`/verify/check-email?email=${encodeURIComponent(email)}`);
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    return { error: "Invalid email or password." };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  if (!user.emailVerified) {
    return { 
      error: "Please verify your email before signing in.",
      code: "unverified",
      email: user.email
    };
  }

  await setSessionCookie(user.id);
  redirect("/discover");
}

export async function resendVerificationAction(_prev: any, formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) return { error: "Email is required." };

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    return { error: "Account not found." };
  }
  if (user.emailVerified) {
    return { error: "Account is already verified." };
  }

  const token = await createVerificationToken(email);
  await sendVerificationEmail(email, user.name, token);

  redirect(`/verify/check-email?email=${encodeURIComponent(email)}&resent=true`);
}

export async function forgotPasswordAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  
  if (!email) {
    return { error: "Please enter your email address." };
  }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  
  // Generic redirect to prevent email enumeration
  if (user) {
    const { createPasswordResetToken, sendPasswordResetEmail } = await import("@/lib/email");
    const token = await createPasswordResetToken(email);
    await sendPasswordResetEmail(email, user.name, token);
  }

  redirect("/forgot-password/check-email");
}

export async function resetPasswordAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!token) return { error: "Missing reset token." };
  if (!password || !confirmPassword) return { error: "Please fill in all fields." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };
  if (password !== confirmPassword) return { error: "Passwords do not match." };

  const { passwordResetTokens } = await import("@/db/schema");
  const [dbToken] = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token)).limit(1);

  if (!dbToken) return { error: "Invalid or already used reset link." };
  if (dbToken.expires < new Date()) return { error: "This reset link has expired." };

  const passwordHash = await hashPassword(password);
  
  // Find the user and update password
  const [user] = await db.select().from(users).where(eq(users.email, dbToken.identifier)).limit(1);
  if (user) {
    await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));
  }

  // Delete the token
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));

  redirect("/login?reset=true");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/");
}
