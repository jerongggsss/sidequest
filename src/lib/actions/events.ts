"use server";

import { db } from "@/db";
import { events } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";
import { slugify, randomSuffix } from "@/lib/slug";
import { isOrganizationMember } from "@/lib/queries";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function uniqueSlug(base: string, ignoreId?: string) {
  let candidate = slugify(base) || "event";
  for (let i = 0; i < 6; i++) {
    const conditions = [eq(events.slug, candidate)];
    const rows = await db.select({ id: events.id }).from(events).where(eq(events.slug, candidate)).limit(1);
    const clash = rows[0] && rows[0].id !== ignoreId;
    if (!clash) return candidate;
    candidate = `${slugify(base)}-${randomSuffix(4)}`;
  }
  return `${slugify(base)}-${randomSuffix(6)}`;
}

function readEventFields(formData: FormData) {
  const get = (key: string) => String(formData.get(key) ?? "").trim();
  return {
    name: get("name"),
    tagline: get("tagline"),
    description: get("description"),
    category: get("category") || "Social",
    eventDate: get("eventDate"),
    startTime: get("startTime"),
    endTime: get("endTime"),
    location: get("location"),
    locationType: get("locationType") || "physical",
    universityId: get("universityId") || null,
    price: get("price"),
    isFree: formData.get("isFree") === "true",
    eligibility: get("eligibility"),
    registrationDeadline: get("registrationDeadline"),
    registrationUrl: get("registrationUrl"),
    tags: get("tags"),
    organizationId: get("organizationId") || null,
  };
}

export async function createEventAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const fields = readEventFields(formData);
  if (!fields.name) {
    throw new Error("Event name is required");
  }

  if (fields.organizationId) {
    const member = await isOrganizationMember(fields.organizationId, user.id);
    if (!member) fields.organizationId = null;
  }

  const slug = await uniqueSlug(fields.name);

  const posterFile = formData.get("poster") as File | null;
  const bannerFile = formData.get("banner") as File | null;
  const posterUrl = posterFile && posterFile.size > 0 ? await saveUploadedFile(posterFile, "events/posters") : null;
  const bannerUrl = bannerFile && bannerFile.size > 0 ? await saveUploadedFile(bannerFile, "events/banners") : null;

  const [event] = await db
    .insert(events)
    .values({
      ...fields,
      slug,
      posterUrl,
      bannerUrl,
      ownerId: user.id,
      status: "draft",
    })
    .returning({ id: events.id });

  revalidatePath("/studio/events");
  redirect(`/studio/events/${event.id}`);
}

export async function updateEventAction(eventId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [existing] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
  if (!existing || existing.ownerId !== user.id) {
    throw new Error("Event not found");
  }

  const fields = readEventFields(formData);
  if (fields.organizationId) {
    const member = await isOrganizationMember(fields.organizationId, user.id);
    if (!member) fields.organizationId = null;
  }

  const intent = String(formData.get("intent") || "save");
  const requestedSlug = String(formData.get("slug") || "").trim();

  let slug = existing.slug;
  if (requestedSlug && slugify(requestedSlug) !== existing.slug) {
    slug = await uniqueSlug(requestedSlug, existing.id);
  } else if (!existing.slug) {
    slug = await uniqueSlug(fields.name, existing.id);
  }

  const posterFile = formData.get("poster") as File | null;
  const bannerFile = formData.get("banner") as File | null;
  const posterUrl = posterFile && posterFile.size > 0 ? await saveUploadedFile(posterFile, "events/posters") : existing.posterUrl;
  const bannerUrl = bannerFile && bannerFile.size > 0 ? await saveUploadedFile(bannerFile, "events/banners") : existing.bannerUrl;

  const removePoster = formData.get("removePoster") === "true";
  const removeBanner = formData.get("removeBanner") === "true";

  const status = intent === "publish" ? "published" : intent === "archive" ? "archived" : intent === "unarchive" ? "draft" : existing.status;

  await db
    .update(events)
    .set({
      ...fields,
      slug,
      posterUrl: removePoster ? null : posterUrl,
      bannerUrl: removeBanner ? null : bannerUrl,
      status,
      publishedAt: status === "published" && !existing.publishedAt ? new Date() : existing.publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(events.id, eventId));

  revalidatePath("/studio/events");
  revalidatePath(`/studio/events/${eventId}`);
  revalidatePath(`/event/${slug}`);

  return { slug, status };
}

export async function deleteEventAction(eventId: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await db.delete(events).where(and(eq(events.id, eventId), eq(events.ownerId, user.id)));
  revalidatePath("/studio/events");
  redirect("/studio/events");
}
