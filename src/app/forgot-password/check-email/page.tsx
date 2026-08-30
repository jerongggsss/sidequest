import Link from "next/link";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { MailCheck, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ForgotPasswordCheckEmailPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-brand">
            <MailCheck className="h-10 w-10" strokeWidth={1.5} />
          </div>
          
          <h1 className="font-display text-3xl font-semibold text-ink">Check your email</h1>

          <p className="mt-4 text-sm text-slate-500">
            If an account exists for this email, we&apos;ve sent a password reset link.
          </p>
          <p className="text-gray-400">
          We&apos;ve sent a password reset link to your email. Please check your inbox and spam folder.
        </p>

          <div className="mt-10 w-full space-y-4">
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800"
            >
              Return to Sign In <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <AuthBrandPanel />
    </div>
  );
}
