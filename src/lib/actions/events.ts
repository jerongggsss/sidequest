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
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { z } from "zod";

async function getClientIp() {
  const headersList = await headers();
  return headersList.get("x-forwarded-for") || "unknown";
}

const eventSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name is too long"),
  tagline: z.string().max(300).optional(),
  description: z.string().max(5000).optional(),
  category: z.string().max(100).optional().default("Social"),
  eventDate: z.string().max(100).optional(),
  startTime: z.string().max(100).optional(),
  endTime: z.string().max(100).optional(),
  location: z.string().max(300).optional(),
  locationType: z.string().max(50).optional().default("physical"),
  universityId: z.string().max(100).optional().nullable(),
  price: z.string().max(100).optional(),
  isFree: z.boolean().default(true),
  eligibility: z.string().max(200).optional(),
  registrationDeadline: z.string().max(100).optional(),
  registrationUrl: z.string().url("Invalid registration URL").max(1000).optional().or(z.literal("")),
  tags: z.string().max(200).optional(),
  organizationId: z.string().max(100).optional().nullable(),
});

async function uniqueSlug(base: string, ignoreId?: string) {
  let candidate = slugify(base) || "event";
  for (let i = 0; i < 6; i++) {
    const rows = await db.select({ id: events.id }).from(events).where(eq(events.slug, candidate)).limit(1);
    const clash = rows[0] && rows[0].id !== ignoreId;
    if (!clash) return candidate;
    candidate = `${slugify(base)}-${randomSuffix(4)}`;
  }
  return `${slugify(base)}-${randomSuffix(6)}`;
}

export async function createEventAction(formData: FormData) {
  let eventId = "";
  try {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const ip = await getClientIp();
    const rlIp = await checkRateLimit("create_event_ip", ip, { max: 20, windowMs: 15 * 60 * 1000 });
    if (!rlIp.success) throw new Error("Too many requests. Please try again later.");

    const parsed = eventSchema.safeParse({
      name: formData.get("name"),
      tagline: formData.get("tagline"),
      description: formData.get("description"),
      category: formData.get("category") || "Social",
      eventDate: formData.get("eventDate"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      location: formData.get("location"),
      locationType: formData.get("locationType") || "physical",
      universityId: formData.get("universityId") || null,
      price: formData.get("price"),
      isFree: formData.get("isFree") === "true",
      eligibility: formData.get("eligibility"),
      registrationDeadline: formData.get("registrationDeadline"),
      registrationUrl: formData.get("registrationUrl"),
      tags: formData.get("tags"),
      organizationId: formData.get("organizationId") || null,
    });

    if (!parsed.success) {
      throw new Error(parsed.error.issues[0].message);
    }

    const fields = parsed.data;

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
      
    eventId = event.id;
  } catch (err: any) {
    if (err?.message === "NEXT_REDIRECT") throw err;
    console.error(err);
    throw new Error(err.message || "An unexpected error occurred.");
  }

  revalidatePath("/studio/events");
  redirect(`/studio/events/${eventId}`);
}

export async function updateEventAction(eventId: string, formData: FormData) {
  let slugToReturn = "";
  let statusToReturn = "";
  try {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const ip = await getClientIp();
    const rlIp = await checkRateLimit("update_event_ip", ip, { max: 40, windowMs: 15 * 60 * 1000 });
    if (!rlIp.success) throw new Error("Too many requests. Please try again later.");

    const [existing] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    if (!existing || existing.ownerId !== user.id) {
      throw new Error("Event not found or unauthorized.");
    }

    const parsed = eventSchema.safeParse({
      name: formData.get("name"),
      tagline: formData.get("tagline"),
      description: formData.get("description"),
      category: formData.get("category") || existing.category,
      eventDate: formData.get("eventDate"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      location: formData.get("location"),
      locationType: formData.get("locationType") || existing.locationType,
      universityId: formData.get("universityId") || existing.universityId,
      price: formData.get("price"),
      isFree: formData.get("isFree") === "true",
      eligibility: formData.get("eligibility"),
      registrationDeadline: formData.get("registrationDeadline"),
      registrationUrl: formData.get("registrationUrl"),
      tags: formData.get("tags"),
      organizationId: formData.get("organizationId") || existing.organizationId,
    });

    if (!parsed.success) {
      throw new Error(parsed.error.issues[0].message);
    }

    const fields = parsed.data;

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

    slugToReturn = slug;
    statusToReturn = status;
  } catch (err: any) {
    if (err?.message === "NEXT_REDIRECT") throw err;
    console.error(err);
    throw new Error(err.message || "An unexpected error occurred.");
  }

  revalidatePath("/studio/events");
  revalidatePath(`/studio/events/${eventId}`);
  revalidatePath(`/event/${slugToReturn}`);

  return { slug: slugToReturn, status: statusToReturn };
}

export async function deleteEventAction(eventId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    await db.delete(events).where(and(eq(events.id, eventId), eq(events.ownerId, user.id)));
  } catch (err: any) {
    if (err?.message === "NEXT_REDIRECT") throw err;
    console.error(err);
    throw new Error("An unexpected error occurred.");
  }

  revalidatePath("/studio/events");
  redirect("/studio/events");
}
