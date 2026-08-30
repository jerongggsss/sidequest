"use client";

import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";

export function HeroSearch() {
  const [value, setValue] = useState("");
  const router = useRouter();

  function go(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.push(`/discover${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form onSubmit={go} className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-4 rounded-[2rem] bg-brand/25 blur-2xl" aria-hidden />
      <div className="relative flex items-center gap-3 rounded-full border border-white/15 bg-white/10 p-2 pl-5 shadow-2xl backdrop-blur-md">
        <Search className="h-5 w-5 shrink-0 text-white/60" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder="Search events, workshops, competitions…"
          className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/50 focus:outline-none sm:text-base"
        />
        <button
          type="submit"
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark sm:px-5"
        >
          <span className="hidden sm:inline">Discover</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
