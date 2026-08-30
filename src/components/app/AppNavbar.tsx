"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, User } from "lucide-react";

export function AppNavbar({
  user,
}: {
  user: { name: string; avatarUrl?: string | null } | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/discover", label: "Discover" },
    { href: "/organizations", label: "Organizations" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-brand text-lg font-bold tracking-tight text-ink">
            SIDEQUEST
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${pathname.startsWith(l.href) ? "text-brand" : "text-slate-600 hover:text-ink"
                  }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/discover"
            aria-label="Search events"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 sm:flex"
          >
            <Search className="h-4 w-4" />
          </Link>
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-full border border-slate-200 py-1.5 pl-1.5 pr-3 text-sm font-medium text-ink transition-colors hover:bg-slate-50"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-brand">
                <User className="h-4 w-4" />
              </span>
              <span className="hidden sm:inline max-w-32 truncate">{user.name}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Log in
            </Link>
          )}
          <button
            className="text-ink md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="flex flex-col gap-1 px-5 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-slate-50"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <Link
                href="/saved"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-slate-50"
              >
                Saved events
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
