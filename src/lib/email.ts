import { Resend } from "resend";
import { nanoid } from "nanoid";
import { createHash } from "crypto";
import { db } from "@/db";
import { verificationTokens, passwordResetTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createVerificationToken(email: string) {
  // Delete any existing tokens for this email
  await db.delete(verificationTokens).where(eq(verificationTokens.identifier, email));

  // Generate secure token (we use a long nanoid which is URL safe and secure enough for this purpose)
  const token = nanoid(32);
  const hashedToken = hashToken(token);
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await db.insert(verificationTokens).values({
    identifier: email,
    token: hashedToken,
    expires,
  });

  return token;
}

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/verify?token=${token}`;
  
  // Use a public asset or placeholder for the banner
  const bannerUrl = `${baseUrl}/images/loginimage.jpg`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your SideQuest account</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .hero { width: 100%; height: 200px; background-color: #0f172a; position: relative; overflow: hidden; }
        .hero img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 24px; }
        .logo { font-size: 14px; font-weight: bold; letter-spacing: 0.1em; color: #ff5e3a; margin-bottom: 8px; text-transform: uppercase; }
        .title { font-size: 24px; font-weight: bold; color: #ffffff; margin: 0; }
        .content { padding: 32px 24px; color: #334155; line-height: 1.6; }
        .greeting { font-size: 18px; font-weight: 600; color: #0f172a; margin-top: 0; }
        .button-container { text-align: center; margin: 32px 0; }
        .button { display: inline-block; background-color: #ff5e3a; color: #ffffff; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-size: 16px; }
        .fallback { font-size: 12px; color: #64748b; margin-top: 24px; word-break: break-all; }
        .footer { background-color: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; }
        .footer p { margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="hero">
          <img src="${bannerUrl}" alt="SideQuest Campus">
          <div class="hero-overlay">
            <div class="logo">SideQuest</div>
            <h1 class="title">Verify your email</h1>
          </div>
        </div>
        <div class="content">
          <p class="greeting">Hi ${name},</p>
          <p>Welcome to SideQuest! We're excited to have you join. To start saving events, joining organizations, and finding your next adventure on campus, please verify your email address.</p>
          
          <div class="button-container">
            <a href="${verifyUrl}" class="button">Verify Email</a>
          </div>
          
          <p>If you didn't create an account with SideQuest, you can safely ignore this email.</p>
          
          <div class="fallback">
            <p>Button not working? Paste this link into your browser:</p>
            <p><a href="${verifyUrl}" style="color: #ff5e3a;">${verifyUrl}</a></p>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} SideQuest. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: "SideQuest <onboarding@resend.dev>", // Using default resend.dev for testing, should be a verified domain in prod
      to: email,
      subject: "Verify your SideQuest account",
      html: html,
    });
    
    console.log("Verification email sent:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, error };
  }
}

export async function createPasswordResetToken(email: string) {
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.identifier, email));

  const token = nanoid(32);
  const hashedToken = hashToken(token);
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await db.insert(passwordResetTokens).values({
    identifier: email,
    token: hashedToken,
    expires,
  });

  return token;
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  
  const bannerUrl = `${baseUrl}/images/loginimage.jpg`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset your password</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .hero { width: 100%; height: 200px; background-color: #0f172a; position: relative; overflow: hidden; }
        .hero img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 24px; }
        .logo { font-size: 14px; font-weight: bold; letter-spacing: 0.1em; color: #ff5e3a; margin-bottom: 8px; text-transform: uppercase; }
        .title { font-size: 24px; font-weight: bold; color: #ffffff; margin: 0; }
        .content { padding: 32px 24px; color: #334155; line-height: 1.6; }
        .greeting { font-size: 18px; font-weight: 600; color: #0f172a; margin-top: 0; }
        .button-container { text-align: center; margin: 32px 0; }
        .button { display: inline-block; background-color: #ff5e3a; color: #ffffff; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-size: 16px; }
        .fallback { font-size: 12px; color: #64748b; margin-top: 24px; word-break: break-all; }
        .footer { background-color: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; }
        .footer p { margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="hero">
          <img src="${bannerUrl}" alt="SideQuest Campus">
          <div class="hero-overlay">
            <div class="logo">SideQuest</div>
            <h1 class="title">Reset your password</h1>
          </div>
        </div>
        <div class="content">
          <p class="greeting">Hi ${name},</p>
          <p>We received a request to reset the password for your SideQuest account. Click the button below to choose a new password. This link will expire in 24 hours.</p>
          
          <div class="button-container">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          
          <div class="fallback">
            <p>Button not working? Paste this link into your browser:</p>
            <p><a href="${resetUrl}" style="color: #ff5e3a;">${resetUrl}</a></p>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} SideQuest. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: "SideQuest <onboarding@resend.dev>",
      to: email,
      subject: "Reset your SideQuest password",
      html: html,
    });
    
    console.log("Password reset email sent:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error };
  }
}
