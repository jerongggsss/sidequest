"use client";

import { useActionState, useState, use, Suspense } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, KeyRound } from "lucide-react";
import { resetPasswordAction, type AuthState } from "@/lib/actions/auth";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";

function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(resetPasswordAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      e.preventDefault();
      setPasswordMatchError("Passwords do not match.");
    } else {
      setPasswordMatchError("");
    }
  };

  return (
    <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Hidden input for token */}
      <input type="hidden" name="token" value={token} />

      {(state?.error || passwordMatchError) ? (
        <div className="flex flex-col gap-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
          <p>{passwordMatchError || state?.error}</p>
        </div>
      ) : null}

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">New Password</span>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            placeholder="Create a new password"
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
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Confirm New Password</span>
        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            minLength={6}
            placeholder="Re-enter your new password"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((s) => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Resetting…" : "Reset password"} <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

function ResetPasswordContent({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = use(searchParams);
  const token = params.token;

  if (!token) {
    return (
      <div className="flex flex-col gap-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
        <p>Missing reset token. Please request a new password reset link.</p>
        <Link href="/forgot-password" className="self-start font-semibold hover:underline">
          Go to Forgot Password
        </Link>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
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

          <h1 className="font-display text-3xl font-semibold text-ink">Choose a new password</h1>
          <p className="mt-2 text-sm text-slate-500 mb-8">
            Create a new password that is at least 6 characters long.
          </p>

          <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent searchParams={searchParams} />
          </Suspense>
        </div>
      </div>

      <AuthBrandPanel />
    </div>
  );
}
