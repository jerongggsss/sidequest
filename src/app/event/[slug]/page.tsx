import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppNavbar } from "@/components/app/AppNavbar";
import { EventPageView } from "@/components/event/EventPageView";
import { SaveButton } from "@/components/SaveButton";
import { getCurrentUser } from "@/lib/auth";
import { getEventBySlug, getSavedEventIds } from "@/lib/queries";
import { formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const row = await getEventBySlug(slug);
  if (!row) return { title: "Event not found" };

  const { event, organization } = row;
  const description =
    event.tagline ||
    `${formatEventDate(event.eventDate)} · ${event.location || "Location TBA"}${
      organization ? ` · Hosted by ${organization.name}` : ""
    }`;
  const image = event.bannerUrl || event.posterUrl;

  return {
    title: event.name,
    description,
    openGraph: {
      title: `${event.name} · SideQuest`,
      description,
      images: image ? [{ url: image }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.name} · SideQuest`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const row = await getEventBySlug(slug);
  if (!row || (row.event.status !== "published" && row.event.status !== "archived")) {
    notFound();
  }

  const { event, organization, university, owner } = row;
  const user = await getCurrentUser();
  const savedIds = user ? await getSavedEventIds(user.id) : new Set<string>();

  const isOwner = user?.id === event.ownerId;
  if (event.status !== "published" && !isOwner) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface pb-20 sm:pb-0">
      <AppNavbar user={user} />

      {event.status === "archived" ? (
        <div className="bg-amber-50 py-2 text-center text-xs font-medium text-amber-700">
          This event has ended and is no longer accepting new registrations.
        </div>
      ) : null}

      <EventPageView
        name={event.name}
        tagline={event.tagline}
        category={event.category}
        description={event.description}
        eventDate={event.eventDate}
        startTime={event.startTime}
        endTime={event.endTime}
        location={event.location}
        locationType={event.locationType}
        price={event.price}
        isFree={event.isFree}
        eligibility={event.eligibility}
        registrationDeadline={event.registrationDeadline}
        registrationUrl={event.registrationUrl}
        posterUrl={event.posterUrl}
        bannerUrl={event.bannerUrl}
        universityName={university?.name}
        organization={
          organization
            ? {
                name: organization.name,
                slug: organization.slug,
                verified: organization.verified,
                logoUrl: organization.logoUrl,
                description: organization.description,
              }
            : null
        }
        ownerName={!organization ? owner?.name : null}
        viewOrgHref={organization ? `/organization/${organization.slug}` : null}
        saveSlot={<SaveButton eventId={event.id} initialSaved={savedIds.has(event.id)} isAuthed={!!user} />}
        stickyMobileCta
      />
    </div>
  );
}
