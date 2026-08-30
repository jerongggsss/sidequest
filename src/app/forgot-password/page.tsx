"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, KeyRound } from "lucide-react";
import { forgotPasswordAction, type AuthState } from "@/lib/actions/auth";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(forgotPasswordAction, null);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="font-brand text-lg font-bold tracking-tight text-ink lg:hidden">
            SIDEQUEST
          </Link>
          
          <div className="mt-8 mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand lg:mt-0">
            <KeyRound className="h-6 w-6" strokeWidth={2} />
          </div>

          <h1 className="font-display text-3xl font-semibold text-ink">Reset password</h1>
          <p className="text-gray-400">
            Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
          </p>

          <form action={formAction} className="flex flex-col gap-4">
            {state?.error ? (
              <div className="flex flex-col gap-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
                <p>{state.error}</p>
              </div>
            ) : null}

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</span>
              <input
                name="email"
                type="email"
                required
                placeholder="email@gmail.com"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </label>

            <button
              type="submit"
              disabled={pending}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark disabled:opacity-60"
            >
              {pending ? "Sending…" : "Send reset link"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            <Link href="/login" className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-ink">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
            </Link>
          </p>
        </div>
      </div>

      <AuthBrandPanel />
    </div>
  );
}
