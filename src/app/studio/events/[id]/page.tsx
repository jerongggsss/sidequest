import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getEventById, listOrganizationsForUser, getUniversities } from "@/lib/queries";
import { EventEditor } from "@/components/studio/EventEditor";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const row = await getEventById(id);
  return { title: row ? `Edit: ${row.event.name} · Studio` : "Edit Event · Studio" };
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const row = await getEventById(id);
  if (!row) notFound();

  // Only the event owner can edit
  if (row.event.ownerId !== user.id) notFound();

  const [userOrgs, universities] = await Promise.all([
    listOrganizationsForUser(user.id),
    getUniversities(),
  ]);

  const { event } = row;

  return (
    <EventEditor
      eventId={event.id}
      slug={event.slug}
      status={event.status}
      userOrgs={userOrgs}
      universities={universities}
      initial={{
        name: event.name,
        tagline: event.tagline ?? "",
        category: event.category,
        description: event.description ?? "",
        eventDate: event.eventDate ?? "",
        startTime: event.startTime ?? "",
        endTime: event.endTime ?? "",
        location: event.location ?? "",
        locationType: event.locationType ?? "physical",
        price: event.price ?? "",
        isFree: event.isFree,
        eligibility: event.eligibility ?? "",
        registrationDeadline: event.registrationDeadline ?? "",
        registrationUrl: event.registrationUrl ?? "",
        tags: event.tags ?? "",
        organizationId: event.organizationId ?? "",
        universityId: event.universityId ?? "",
        posterUrl: event.posterUrl,
        bannerUrl: event.bannerUrl,
      }}
    />
  );
}
