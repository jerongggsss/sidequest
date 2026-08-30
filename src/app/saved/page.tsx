import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppNavbar } from "@/components/app/AppNavbar";
import { EventCard } from "@/components/EventCard";
import { getCurrentUser } from "@/lib/auth";
import { listSavedEvents } from "@/lib/queries";
import { Bookmark } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Saved Events",
  description: "Events you've saved on SideQuest.",
};

export default async function SavedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const saved = await listSavedEvents(user.id);

  return (
    <div className="min-h-screen bg-surface">
      <AppNavbar user={user} />

      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">
            Saved Events
          </h1>
          <p className="mt-2 text-slate-500">
            {saved.length} {saved.length === 1 ? "event" : "events"} saved
          </p>
        </div>

        {saved.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {saved.map((item) => (
              <EventCard
                key={item.event.id}
                data={item}
                isSaved
                isAuthed
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-24 text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Bookmark className="h-6 w-6" />
            </span>
            <h2 className="font-display text-xl font-semibold text-ink">
              Nothing saved yet
            </h2>
            <p className="mt-1.5 max-w-sm text-sm text-slate-500">
              Tap the bookmark on any event to save it here for later.
            </p>
            <Link
              href="/discover"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Discover Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
