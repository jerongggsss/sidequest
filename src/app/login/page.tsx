"use client";

import { useActionState, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { loginAction, resendVerificationAction, type AuthState } from "@/lib/actions/auth";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";

function LoginForm({ verified, reset }: { verified: boolean; reset: boolean }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(loginAction, null);
  const [resendState, resendAction, resendPending] = useActionState(resendVerificationAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {verified && !state?.error ? (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          <div>
            <p className="font-semibold text-green-800">Email verified successfully.</p>
            <p className="mt-1 text-green-700">Your SideQuest account is now verified. You can sign in.</p>
          </div>
        </div>
      ) : null}

      {reset && !state?.error ? (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          <div>
            <p className="font-semibold text-green-800">Password reset successfully.</p>
            <p className="mt-1 text-green-700">You can now sign in with your new password.</p>
          </div>
        </div>
      ) : null}

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        {state?.error ? (
          <div className="flex flex-col gap-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
            <p>{state.error}</p>
            {state.code === "unverified" && state.email && (
              <button
                type="submit"
                formAction={resendAction}
                name="email"
                value={state.email}
                disabled={resendPending}
                className="self-start text-xs font-semibold text-rose-700 hover:underline disabled:opacity-50"
              >
                {resendPending ? "Sending..." : "Resend verification email"}
              </button>
            )}
            {resendState?.error && (
              <p className="text-xs font-semibold text-rose-800">{resendState.error}</p>
            )}
          </div>
        ) : null}

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</span>
          <input
            name="email"
            type="email"
            required
            placeholder="you@university.edu"
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Password</span>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <span className="text-right mt-1">
            <Link href="/forgot-password" className="text-xs font-medium text-slate-400 hover:text-brand">
              Forgot password?
            </Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"} <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-brand hover:underline">
          Create account
        </Link>
      </p>

      <div className="mt-auto pt-16 flex justify-center gap-4 text-xs font-medium text-slate-400">
        <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
        <span>&middot;</span>
        <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
      </div>
    </>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified") === "true";
  const reset = searchParams.get("reset") === "true";
  
  return <LoginForm verified={verified} reset={reset} />;
}

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 h-full">
        <div className="mx-auto w-full max-w-sm flex flex-col h-full justify-center">
          <div>
            <Link href="/" className="font-brand text-lg font-bold tracking-tight text-ink lg:hidden">
              SIDEQUEST
            </Link>
            <h1 className="mt-8 font-display text-3xl font-semibold text-ink lg:mt-0">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-500 mb-8">Sign in to save events and manage your studio.</p>
          </div>

          <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
          </Suspense>
        </div>
      </div>

      <AuthBrandPanel />
    </div>
  );
}
