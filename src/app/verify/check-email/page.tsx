import Link from "next/link";
import { use } from "react";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { MailCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function CheckEmailPage({ searchParams }: { searchParams: Promise<{ email?: string; resent?: string }> }) {
  const params = use(searchParams);
  const email = params.email;
  const isResent = params.resent === "true";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-brand">
            <MailCheck className="h-10 w-10" strokeWidth={1.5} />
          </div>
          
          <h1 className="font-display text-3xl font-semibold text-ink">Check your email</h1>
          
          {isResent && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              Verification email resent
            </div>
          )}

          <p className="mt-4 text-sm text-slate-500">
            We've sent a verification link to <span className="font-semibold text-ink">{email || "your email address"}</span>.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Open your email and click the verification link to verify your account before signing in.
          </p>

          <div className="mt-10 w-full space-y-4">
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800"
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
