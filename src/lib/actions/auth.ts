"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createVerificationToken, sendVerificationEmail, hashToken } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import { headers } from "next/headers";

export type AuthState = { error?: string; code?: string; email?: string } | null;

async function getClientIp() {
  const headersList = await headers();
  return headersList.get("x-forwarded-for") || "unknown";
}

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email format").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(255),
  confirmPassword: z.string().max(255),
  universityId: z.string().max(100).optional().nullable().transform(val => val || null),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format").max(255),
  password: z.string().max(255),
});

const resetSchema = z.object({
  token: z.string().min(1, "Missing reset token"),
  password: z.string().min(6, "Password must be at least 6 characters").max(255),
  confirmPassword: z.string().max(255),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  try {
    const ip = await getClientIp();
    const rateLimit = await checkRateLimit("register", ip, { max: 5, windowMs: 15 * 60 * 1000 });
    if (!rateLimit.success) return { error: "Too many requests. Please try again later." };

    const parsed = registerSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      universityId: formData.get("universityId"),
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const { name, email, password, universityId } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, normalizedEmail)).limit(1);
    if (existing) {
      return { error: "An account with this email already exists." };
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db
      .insert(users)
      .values({ name, email: normalizedEmail, passwordHash, universityId })
      .returning({ id: users.id, name: users.name });

    const token = await createVerificationToken(normalizedEmail);
    const emailResult = await sendVerificationEmail(normalizedEmail, user.name, token);

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
    }
    
    // Using return instead of redirect directly here to safely break out of the try-catch block, but wait, Next.js redirect internally throws an error that must not be caught.
  } catch (err: any) {
    if (err?.message === "NEXT_REDIRECT") throw err;
    console.error(err);
    return { error: "An unexpected error occurred." };
  }
  
  redirect(`/verify/check-email?email=${encodeURIComponent(String(formData.get("email") || "").trim().toLowerCase())}`);
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  let isUnverified = false;
  let rawEmail = "";
  let userIdToLogin = "";

  try {
    const ip = await getClientIp();
    rawEmail = String(formData.get("email") || "").trim().toLowerCase();
    
    const rlIp = await checkRateLimit("login_ip", ip, { max: 20, windowMs: 15 * 60 * 1000 });
    if (!rlIp.success) return { error: "Too many attempts. Please try again later." };
    
    if (rawEmail) {
      const rlEmail = await checkRateLimit("login_email", rawEmail, { max: 10, windowMs: 15 * 60 * 1000 });
      if (!rlEmail.success) return { error: "Too many attempts. Please try again later." };
    }

    const parsed = loginSchema.safeParse({
      email: rawEmail,
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return { error: "Invalid email or password." };
    }

    const { email, password } = parsed.data;

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      return { error: "Invalid email or password." };
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return { error: "Invalid email or password." };
    }

    if (!user.emailVerified) {
      isUnverified = true;
    } else {
      userIdToLogin = user.id;
    }
  } catch (err: any) {
    if (err?.message === "NEXT_REDIRECT") throw err;
    console.error(err);
    return { error: "An unexpected error occurred." };
  }

  if (isUnverified) {
    return { 
      error: "Please verify your email before signing in.",
      code: "unverified",
      email: rawEmail
    };
  }

  if (userIdToLogin) {
    await setSessionCookie(userIdToLogin);
    redirect("/discover");
  }

  return null;
}

export async function resendVerificationAction(_prev: any, formData: FormData) {
  let rawEmail = "";
  try {
    const ip = await getClientIp();
    rawEmail = String(formData.get("email") || "").trim().toLowerCase();
    
    if (!rawEmail) return { error: "Email is required." };

    const rlIp = await checkRateLimit("resend_ip", ip, { max: 5, windowMs: 15 * 60 * 1000 });
    if (!rlIp.success) return { error: "Too many requests. Please try again later." };

    const rlEmail = await checkRateLimit("resend_email", rawEmail, { max: 3, windowMs: 15 * 60 * 1000 });
    if (!rlEmail.success) return { error: "Too many requests for this email." };

    const [user] = await db.select().from(users).where(eq(users.email, rawEmail)).limit(1);
    if (!user) {
      return { error: "Account not found." };
    }
    if (user.emailVerified) {
      return { error: "Account is already verified." };
    }

    const token = await createVerificationToken(rawEmail);
    await sendVerificationEmail(rawEmail, user.name, token);

  } catch (err: any) {
    if (err?.message === "NEXT_REDIRECT") throw err;
    console.error(err);
    return { error: "An unexpected error occurred." };
  }

  redirect(`/verify/check-email?email=${encodeURIComponent(rawEmail)}&resent=true`);
}

export async function forgotPasswordAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  try {
    const ip = await getClientIp();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    
    if (!email) {
      return { error: "Please enter your email address." };
    }

    const rlIp = await checkRateLimit("forgot_ip", ip, { max: 5, windowMs: 15 * 60 * 1000 });
    if (!rlIp.success) return { error: "Too many requests. Please try again later." };

    const rlEmail = await checkRateLimit("forgot_email", email, { max: 3, windowMs: 15 * 60 * 1000 });
    if (!rlEmail.success) return { error: "Too many requests. Please try again later." };

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (user) {
      const { createPasswordResetToken, sendPasswordResetEmail } = await import("@/lib/email");
      const token = await createPasswordResetToken(email);
      await sendPasswordResetEmail(email, user.name, token);
    }
  } catch (err: any) {
    if (err?.message === "NEXT_REDIRECT") throw err;
    console.error(err);
    return { error: "An unexpected error occurred." };
  }

  redirect("/forgot-password/check-email");
}

export async function resetPasswordAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  try {
    const ip = await getClientIp();
    const rlIp = await checkRateLimit("reset_ip", ip, { max: 10, windowMs: 15 * 60 * 1000 });
    if (!rlIp.success) return { error: "Too many requests. Please try again later." };

    const parsed = resetSchema.safeParse({
      token: formData.get("token"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const { token, password } = parsed.data;

    const { passwordResetTokens } = await import("@/db/schema");
    const hashedToken = hashToken(token);
    const [dbToken] = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, hashedToken)).limit(1);

    if (!dbToken) return { error: "Invalid or already used reset link." };
    if (dbToken.expires < new Date()) return { error: "This reset link has expired." };

    const passwordHash = await hashPassword(password);
    
    // Find the user and update password and increment authVersion to invalidate sessions
    const [user] = await db.select().from(users).where(eq(users.email, dbToken.identifier)).limit(1);
    if (user) {
      await db.update(users).set({ passwordHash, authVersion: user.authVersion + 1 }).where(eq(users.id, user.id));
    }

    // Delete the token
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, hashedToken));
  } catch (err: any) {
    if (err?.message === "NEXT_REDIRECT") throw err;
    console.error(err);
    return { error: "An unexpected error occurred." };
  }

  redirect("/login?reset=true");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/");
}
