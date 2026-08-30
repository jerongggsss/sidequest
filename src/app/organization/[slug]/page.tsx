import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppNavbar } from "@/components/app/AppNavbar";
import { EventCard } from "@/components/EventCard";
import { VerifiedBadge } from "@/components/ui/Badge";
import { getCurrentUser } from "@/lib/auth";
import { getOrganizationBySlug, listOrganizationEvents, getSavedEventIds } from "@/lib/queries";
import { Globe, AtSign, CalendarClock } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const row = await getOrganizationBySlug(slug);
  if (!row) return { title: "Organization not found" };
  return {
    title: row.organization.name,
    description: row.organization.description || `${row.organization.name} on SideQuest`,
  };
}

export default async function OrganizationPage({ params }: Props) {
  const { slug } = await params;
  const row = await getOrganizationBySlug(slug);
  if (!row) notFound();

  const { organization, university } = row;
  const user = await getCurrentUser();
  const { upcoming, past } = await listOrganizationEvents(organization.id);
  const savedIds = user ? await getSavedEventIds(user.id) : new Set<string>();

  return (
    <div className="min-h-screen bg-surface">
      <AppNavbar user={user} />

      <div className="relative h-52 w-full overflow-hidden bg-ink sm:h-64">
        {organization.bannerUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${organization.bannerUrl})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-ink to-slate-900" />
        )}
        <div className="absolute inset-0 bg-ink/40" />
        <div className="bg-grid absolute inset-0 opacity-20" />
      </div>

      <div className="mx-auto max-w-5xl px-6">
        <div className="-mt-14 flex flex-col items-center text-center sm:-mt-16">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-ink font-brand text-2xl font-bold text-white shadow-xl sm:h-32 sm:w-32">
            {organization.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={organization.logoUrl} alt={organization.name} className="h-full w-full object-cover" />
            ) : (
              organization.name.slice(0, 2).toUpperCase()
            )}
          </div>
          <h1 className="mt-4 flex items-center gap-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
            {organization.name}
            {organization.verified ? <VerifiedBadge className="h-5 w-5" /> : null}
          </h1>
          {university ? <p className="mt-1 text-slate-500">{university.name}</p> : null}
          {organization.description ? (
            <p className="mt-4 max-w-xl text-slate-600">{organization.description}</p>
          ) : null}

          <div className="mt-4 flex items-center gap-4">
            {organization.website ? (
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand"
              >
                <Globe className="h-4 w-4" /> Website
              </a>
            ) : null}
            {organization.instagram ? (
              <a
                href={
                  organization.instagram.startsWith("http")
                    ? organization.instagram
                    : `https://instagram.com/${organization.instagram.replace("@", "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand"
              >
                <AtSign className="h-4 w-4" /> Instagram
              </a>
            ) : null}
          </div>
        </div>

        <section className="py-14">
          <h2 className="mb-6 font-display text-2xl font-semibold text-ink">Upcoming Events</h2>
          {upcoming.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {upcoming.map((item) => (
                <EventCard key={item.event.id} data={item} isSaved={savedIds.has(item.event.id)} isAuthed={!!user} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <CalendarClock className="mb-3 h-8 w-8 text-slate-300" />
              <p className="text-sm text-slate-500">No upcoming events right now. Check back soon.</p>
            </div>
          )}
        </section>

        {past.length > 0 ? (
          <section className="pb-16">
            <h2 className="mb-6 font-display text-2xl font-semibold text-ink">Past Events</h2>
            <div className="grid grid-cols-2 gap-4 opacity-80 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {past.map((item) => (
                <EventCard key={item.event.id} data={item} isSaved={savedIds.has(item.event.id)} isAuthed={!!user} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
