"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  CalendarDays,
  Building2,
  ArrowLeft,
  PlusCircle,
} from "lucide-react";

const navItems = [
  { href: "/studio/events", label: "Events", icon: CalendarDays },
  { href: "/studio/organizations", label: "Organizations", icon: Building2 },
];

export function StudioSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col bg-ink">
      {/* Brand */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <Link href="/" className="font-brand text-sm font-bold tracking-tight text-white/80 hover:text-white transition-colors">
          SIDEQUEST
        </Link>
        <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/60">
          Studio
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Manage
        </p>
        <ul className="flex flex-col gap-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white/90"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 space-y-1">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Quick actions
          </p>
          <Link
            href="/studio/events/new"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand hover:bg-brand/10 transition-all"
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            New Event
          </Link>
          <Link
            href="/studio/organizations/new"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white/90 transition-all"
          >
            <Building2 className="h-4 w-4 shrink-0" />
            New Organization
          </Link>
        </div>
      </nav>

      {/* Back to app */}
      <div className="border-t border-white/10 p-3">
        <Link
          href="/discover"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Discover
        </Link>
      </div>
    </aside>
  );
}

export function StudioMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      <div className="flex">
        {[
          { href: "/studio/events", label: "Events", icon: CalendarDays },
          { href: "/studio/events/new", label: "New", icon: PlusCircle },
          { href: "/studio/organizations", label: "Orgs", icon: Building2 },
          { href: "/discover", label: "Discover", icon: LayoutGrid },
        ].map(({ href, label, icon: Icon }) => {
          const active = href !== "/discover" && pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-semibold transition-colors ${
                active ? "text-brand" : "text-slate-400 hover:text-ink"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
