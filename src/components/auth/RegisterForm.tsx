"use client";

import { useActionState, useState, useRef } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { registerAction, type AuthState } from "@/lib/actions/auth";

export function RegisterForm({ universities }: { universities: { id: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(registerAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [clientError, setClientError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      e.preventDefault();
      setClientError("Passwords do not match.");
    } else {
      setClientError("");
    }
  };

  const error = clientError || state?.error;

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
      {error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>
      ) : null}

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Full name</span>
        <input
          name="name"
          type="text"
          required
          placeholder="HEZRON LLAU"
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </label>

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

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Password</span>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            placeholder="Create a password"
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
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Confirm password</span>
        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            minLength={6}
            placeholder="Re-enter your password"
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

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">University</span>
        <select
          name="universityId"
          defaultValue=""
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="">Select your university</option>
          {universities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create account"} <ArrowRight className="h-4 w-4" />
      </button>

      <p className="mt-2 text-center text-xs text-slate-500">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="text-slate-600 hover:text-ink hover:underline">
          Terms of Service
        </Link>{" "}
        and acknowledge our{" "}
        <Link href="/privacy" className="text-slate-600 hover:text-ink hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      <p className="mt-4 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
