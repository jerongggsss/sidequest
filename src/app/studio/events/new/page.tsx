import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listOrganizationsForUser, getUniversities } from "@/lib/queries";
import { EventEditor } from "@/components/studio/EventEditor";

export const metadata: Metadata = { title: "New Event · Studio" };

export default async function NewEventPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [userOrgs, universities] = await Promise.all([
    listOrganizationsForUser(user.id),
    getUniversities(),
  ]);

  return (
    <EventEditor
      userOrgs={userOrgs}
      universities={universities}
    />
  );
}
