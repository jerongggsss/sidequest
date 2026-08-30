import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { XCircle, ArrowRight } from "lucide-react";
import { db } from "@/db";
import { verificationTokens, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  
  if (token) {
    const [dbToken] = await db.select().from(verificationTokens).where(eq(verificationTokens.token, token)).limit(1);
    
    if (dbToken && dbToken.expires >= new Date()) {
      // Valid token! Find user and update.
      const [user] = await db.select().from(users).where(eq(users.email, dbToken.identifier)).limit(1);
      
      if (user) {
        if (!user.emailVerified) {
          await db.update(users).set({ emailVerified: new Date() }).where(eq(users.id, user.id));
          await db.delete(verificationTokens).where(eq(verificationTokens.token, token));
        }
        redirect("/login?verified=true");
      }
    }
  }

  // If we reach here, it's a failure (invalid, expired, or missing token)
  let message = "This verification link is invalid or has expired.";
  
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <XCircle className="h-10 w-10" strokeWidth={1.5} />
          </div>
          
          <h1 className="font-display text-3xl font-semibold text-ink">
            Verification failed
          </h1>
          <p className="mt-3 text-sm text-slate-500">{message}</p>
          <p className="mt-2 text-sm text-slate-500">Please sign in to request a new verification email.</p>

          <div className="mt-10 w-full">
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark"
            >
              Continue to Sign In <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <AuthBrandPanel />
    </div>
  );
}
