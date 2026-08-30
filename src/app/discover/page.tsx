import type { Metadata } from "next";
import { AppNavbar } from "@/components/app/AppNavbar";
import { DiscoverControls } from "@/components/discover/DiscoverControls";
import { EventCard } from "@/components/EventCard";
import { getCurrentUser } from "@/lib/auth";
import { listPublishedEvents, getSavedEventIds, getUniversities } from "@/lib/queries";
import { Compass } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Discover",
  description: "Find something worth doing on your campus.",
};

type SearchParams = {
  q?: string;
  category?: string;
  university?: string;
  free?: string;
  locationType?: string;
};

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const user = await getCurrentUser();
  const universities = await getUniversities();

  const events = await listPublishedEvents({
    q: sp.q,
    category: sp.category,
    universitySlug: sp.university,
    free: sp.free === "free" || sp.free === "paid" ? sp.free : undefined,
    locationType: sp.locationType === "online" || sp.locationType === "physical" ? sp.locationType : undefined,
  });

  const savedIds = user ? await getSavedEventIds(user.id) : new Set<string>();

  return (
    <div className="min-h-screen bg-surface">
      <AppNavbar user={user} />

      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">Discover</h1>
          <p className="mt-2 text-slate-500">Find something worth doing.</p>
        </div>

        <DiscoverControls universities={universities} />

        <div className="mt-10">
          {events.length > 0 ? (
            <>
              <p className="mb-5 text-sm text-slate-500">
                {events.length} {events.length === 1 ? "event" : "events"} found
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                {events.map((item) => (
                  <EventCard
                    key={item.event.id}
                    data={item}
                    isSaved={savedIds.has(item.event.id)}
                    isAuthed={!!user}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Compass className="h-6 w-6" />
              </span>
              <h2 className="font-display text-xl font-semibold text-ink">We couldn&apos;t find that.</h2>
              <p className="mt-1.5 max-w-sm text-sm text-slate-500">
                Try another search or category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
