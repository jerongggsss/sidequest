"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

type University = { slug: string; name: string };

export function DiscoverControls({ universities }: { universities: University[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  const category = searchParams.get("category") ?? "All";
  const university = searchParams.get("university") ?? "";
  const free = searchParams.get("free") ?? "";
  const locationType = searchParams.get("locationType") ?? "";

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "" || value === "All") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: q || null });
  }

  const activeFilterCount = [university, free, locationType].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={submitSearch} className="relative">
        <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow focus-within:shadow-md">
          <Search className="ml-4 h-5 w-5 shrink-0 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="text"
            placeholder="Search events, workshops, competitions…"
            className="w-full bg-transparent px-3 py-4 text-sm text-ink placeholder:text-slate-400 focus:outline-none sm:text-base"
          />
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="mr-2 flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-ink hover:bg-slate-50 lg:hidden"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {activeFilterCount > 0 ? activeFilterCount : ""}
          </button>
          <button
            type="submit"
            className="mr-2 hidden shrink-0 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:block"
          >
            Search
          </button>
        </div>
      </form>

      <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => updateParams({ category: c })}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              category === c
                ? "border-brand bg-brand text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="hidden flex-wrap items-center gap-3 lg:flex">
        <FilterSelect
          label="University"
          value={university}
          onChange={(v) => updateParams({ university: v })}
          options={[{ value: "", label: "All universities" }, ...universities.map((u) => ({ value: u.slug, label: u.name }))]}
        />
        <FilterSelect
          label="Price"
          value={free}
          onChange={(v) => updateParams({ free: v })}
          options={[
            { value: "", label: "Free / Paid" },
            { value: "free", label: "Free" },
            { value: "paid", label: "Paid" },
          ]}
        />
        <FilterSelect
          label="Format"
          value={locationType}
          onChange={(v) => updateParams({ locationType: v })}
          options={[
            { value: "", label: "Online / Physical" },
            { value: "physical", label: "Physical" },
            { value: "online", label: "Online" },
          ]}
        />
        {activeFilterCount > 0 ? (
          <button
            onClick={() => updateParams({ university: null, free: null, locationType: null })}
            className="text-xs font-semibold text-slate-500 underline-offset-2 hover:underline"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {sheetOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSheetOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-display text-lg font-semibold text-ink">Filters</p>
              <button onClick={() => setSheetOpen(false)} aria-label="Close filters">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <FilterSelect
                label="University"
                value={university}
                onChange={(v) => updateParams({ university: v })}
                options={[{ value: "", label: "All universities" }, ...universities.map((u) => ({ value: u.slug, label: u.name }))]}
                full
              />
              <FilterSelect
                label="Price"
                value={free}
                onChange={(v) => updateParams({ free: v })}
                options={[
                  { value: "", label: "Free / Paid" },
                  { value: "free", label: "Free" },
                  { value: "paid", label: "Paid" },
                ]}
                full
              />
              <FilterSelect
                label="Format"
                value={locationType}
                onChange={(v) => updateParams({ locationType: v })}
                options={[
                  { value: "", label: "Online / Physical" },
                  { value: "physical", label: "Physical" },
                  { value: "online", label: "Online" },
                ]}
                full
              />
            </div>
            <button
              onClick={() => setSheetOpen(false)}
              className="mt-6 w-full rounded-full bg-brand py-3.5 text-sm font-semibold text-white"
            >
              Show results
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  full = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  full?: boolean;
}) {
  return (
    <label className={`flex ${full ? "w-full flex-col gap-1.5" : "items-center gap-2"}`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none ${
          full ? "w-full" : ""
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
