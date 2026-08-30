"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { loginAction, type AuthState } from "@/lib/actions/auth";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="font-brand text-lg font-bold tracking-tight text-ink lg:hidden">
            SIDEQUEST
          </Link>
          <h1 className="mt-8 font-display text-3xl font-semibold text-ink lg:mt-0">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to save events and manage your studio.</p>

          <form action={formAction} className="mt-8 flex flex-col gap-4">
            {state?.error ? (
              <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{state.error}</p>
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
              <span className="text-right">
                <Link href="/register" className="text-xs font-medium text-slate-400 hover:text-brand">
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

          <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-center text-xs text-slate-500">
            Demo account: <span className="font-medium text-ink">demo@sidequest.my</span> /{" "}
            <span className="font-medium text-ink">sidequest123</span>
          </p>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-brand hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>

      <AuthBrandPanel />
    </div>
  );
}
