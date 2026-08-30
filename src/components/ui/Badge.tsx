import { BadgeCheck } from "lucide-react";

export function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <BadgeCheck
      aria-label="Verified"
      className={`inline-block h-4 w-4 shrink-0 text-brand ${className}`}
      strokeWidth={2.5}
    />
  );
}

export function CategoryBadge({ category, className = "" }: { category: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink shadow-sm backdrop-blur ${className}`}
    >
      {category}
    </span>
  );
}

export function StatusPill({ status }: { status: "draft" | "published" | "archived" }) {
  const styles = {
    draft: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    published: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    archived: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  } as const;
  const label = { draft: "Draft", published: "Published", archived: "Archived" } as const;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {label[status]}
    </span>
  );
}
