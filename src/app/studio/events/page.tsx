import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listEventsByOwner } from "@/lib/queries";
import { StatusPill } from "@/components/ui/Badge";
import { formatEventDateShort } from "@/lib/format";
import { PlusCircle, CalendarDays, Eye, Edit2 } from "lucide-react";
import { StudioEventActions } from "@/components/studio/StudioEventActions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "My Events · Studio" };

type Tab = "all" | "published" | "draft" | "archived";

export default async function StudioEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const sp = await searchParams;
  const tab = (sp.tab ?? "all") as Tab;

  const allEvents = await listEventsByOwner(user.id);

  const filtered = allEvents.filter((r) => {
    if (tab === "all") return true;
    return r.event.status === tab;
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "published", label: "Published" },
    { key: "draft", label: "Drafts" },
    { key: "archived", label: "Archived" },
  ];

  const counts = {
    all: allEvents.length,
    published: allEvents.filter((r) => r.event.status === "published").length,
    draft: allEvents.filter((r) => r.event.status === "draft").length,
    archived: allEvents.filter((r) => r.event.status === "archived").length,
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">My Events</h1>
          <p className="mt-0.5 text-sm text-slate-500">Create and manage your events</p>
        </div>
        <Link
          href="/studio/events/new"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark hover:-translate-y-0.5"
        >
          <PlusCircle className="h-4 w-4" /> New Event
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-slate-200">
        {tabs.map(({ key, label }) => (
          <Link
            key={key}
            href={`/studio/events?tab=${key}`}
            className={`flex items-center gap-1.5 -mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${tab === key
                ? "border-brand text-brand"
                : "border-transparent text-slate-500 hover:text-ink"
              }`}
          >
            {label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${tab === key ? "bg-brand/10 text-brand" : "bg-slate-100 text-slate-500"
                }`}
            >
              {counts[key]}
            </span>
          </Link>
        ))}
      </div>

      {/* Event list */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filtered.map(({ event, organization }) => (
            <div
              key={event.id}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Poster thumbnail */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-slate-300 to-slate-400">
                {event.posterUrl || event.bannerUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={event.posterUrl || event.bannerUrl!}
                    alt={event.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-display text-xl font-bold text-white">
                    {event.name.slice(0, 1)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-display font-semibold text-ink">{event.name}</p>
                  <StatusPill status={event.status} />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {formatEventDateShort(event.eventDate)}
                  </span>
                  {organization && <span className="truncate">{organization.name}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2">
                {event.status === "published" && (
                  <Link
                    href={`/event/${event.slug}`}
                    target="_blank"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-ink"
                    title="View public page"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                )}
                <Link
                  href={`/studio/events/${event.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-ink"
                  title="Edit event"
                >
                  <Edit2 className="h-4 w-4" />
                </Link>
                <StudioEventActions eventId={event.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
          <CalendarDays className="mb-4 h-10 w-10 text-slate-300" />
          <p className="font-display text-lg font-semibold text-ink">
            {tab === "all" ? "No events yet" : `No ${tab} events`}
          </p>
          <p className="mt-1.5 text-sm text-slate-500">
            {tab === "all"
              ? "Create your first event to get started."
              : `You don't have any ${tab} events.`}
          </p>
          {tab === "all" && (
            <Link
              href="/studio/events/new"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              <PlusCircle className="h-4 w-4" /> Create Event
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
