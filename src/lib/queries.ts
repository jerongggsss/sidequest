import "server-only";
import { db } from "@/db";
import {
  events,
  organizations,
  universities,
  savedEvents,
  organizationMembers,
  users,
} from "@/db/schema";
import { and, desc, eq, ilike, or } from "drizzle-orm";

export type EventWithRelations = Awaited<ReturnType<typeof getEventBySlug>>;

export async function getUniversities() {
  return db.select().from(universities).orderBy(universities.name);
}

export async function getUniversityBySlug(slug: string) {
  const [u] = await db
    .select()
    .from(universities)
    .where(eq(universities.slug, slug))
    .limit(1);
  return u ?? null;
}

const eventSelect = {
  id: events.id,
  slug: events.slug,
  name: events.name,
  tagline: events.tagline,
  description: events.description,
  category: events.category,
  eventDate: events.eventDate,
  startTime: events.startTime,
  endTime: events.endTime,
  location: events.location,
  locationType: events.locationType,
  universityId: events.universityId,
  price: events.price,
  isFree: events.isFree,
  eligibility: events.eligibility,
  registrationDeadline: events.registrationDeadline,
  registrationUrl: events.registrationUrl,
  posterUrl: events.posterUrl,
  bannerUrl: events.bannerUrl,
  tags: events.tags,
  status: events.status,
  organizationId: events.organizationId,
  ownerId: events.ownerId,
  views: events.views,
  createdAt: events.createdAt,
  updatedAt: events.updatedAt,
  publishedAt: events.publishedAt,
};

export async function getEventBySlug(slug: string) {
  const [row] = await db
    .select({
      event: eventSelect,
      organization: organizations,
      university: universities,
      owner: { id: users.id, name: users.name, avatarUrl: users.avatarUrl },
    })
    .from(events)
    .where(eq(events.slug, slug))
    .leftJoin(organizations, eq(events.organizationId, organizations.id))
    .leftJoin(universities, eq(events.universityId, universities.id))
    .leftJoin(users, eq(events.ownerId, users.id))
    .limit(1);

  return row ?? null;
}

export async function getEventById(id: string) {
  const [row] = await db
    .select({ event: eventSelect, organization: organizations, university: universities })
    .from(events)
    .where(eq(events.id, id))
    .leftJoin(organizations, eq(events.organizationId, organizations.id))
    .leftJoin(universities, eq(events.universityId, universities.id))
    .limit(1);
  return row ?? null;
}

export type DiscoverFilters = {
  q?: string;
  category?: string;
  universitySlug?: string;
  free?: "free" | "paid";
  locationType?: "online" | "physical";
  organizationSlug?: string;
};

export async function listPublishedEvents(filters: DiscoverFilters = {}) {
  const conditions = [eq(events.status, "published")];

  if (filters.q) {
    conditions.push(
      or(
        ilike(events.name, `%${filters.q}%`),
        ilike(events.tagline, `%${filters.q}%`),
        ilike(events.location, `%${filters.q}%`),
        ilike(events.tags, `%${filters.q}%`),
      )!,
    );
  }
  if (filters.category && filters.category !== "All") {
    conditions.push(eq(events.category, filters.category));
  }
  if (filters.free === "free") conditions.push(eq(events.isFree, true));
  if (filters.free === "paid") conditions.push(eq(events.isFree, false));
  if (filters.locationType) conditions.push(eq(events.locationType, filters.locationType));

  let universityId: string | undefined;
  if (filters.universitySlug) {
    const uni = await getUniversityBySlug(filters.universitySlug);
    universityId = uni?.id;
    if (universityId) conditions.push(eq(events.universityId, universityId));
  }

  let organizationId: string | undefined;
  if (filters.organizationSlug) {
    const [org] = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, filters.organizationSlug))
      .limit(1);
    organizationId = org?.id;
    if (organizationId) conditions.push(eq(events.organizationId, organizationId));
  }

  return db
    .select({ event: eventSelect, organization: organizations, university: universities })
    .from(events)
    .where(and(...conditions))
    .leftJoin(organizations, eq(events.organizationId, organizations.id))
    .leftJoin(universities, eq(events.universityId, universities.id))
    .orderBy(desc(events.publishedAt));
}

export async function listEventsByOwner(ownerId: string) {
  return db
    .select({ event: eventSelect, organization: organizations, university: universities })
    .from(events)
    .where(eq(events.ownerId, ownerId))
    .leftJoin(organizations, eq(events.organizationId, organizations.id))
    .leftJoin(universities, eq(events.universityId, universities.id))
    .orderBy(desc(events.updatedAt));
}

export async function getOrganizationBySlug(slug: string) {
  const [row] = await db
    .select({ organization: organizations, university: universities })
    .from(organizations)
    .where(eq(organizations.slug, slug))
    .leftJoin(universities, eq(organizations.universityId, universities.id))
    .limit(1);
  return row ?? null;
}

export async function listOrganizationsForUser(userId: string) {
  const memberships = await db
    .select({ organization: organizations })
    .from(organizationMembers)
    .where(eq(organizationMembers.userId, userId))
    .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id));

  return memberships.map((m) => m.organization);
}

export async function listAllOrganizations() {
  return db
    .select({ organization: organizations, university: universities })
    .from(organizations)
    .leftJoin(universities, eq(organizations.universityId, universities.id))
    .orderBy(organizations.name);
}

export async function getSavedEventIds(userId: string) {
  const rows = await db
    .select({ eventId: savedEvents.eventId })
    .from(savedEvents)
    .where(eq(savedEvents.userId, userId));
  return new Set(rows.map((r) => r.eventId));
}

export async function listSavedEvents(userId: string) {
  const rows = await db
    .select({ event: eventSelect, organization: organizations, university: universities })
    .from(savedEvents)
    .where(eq(savedEvents.userId, userId))
    .innerJoin(events, eq(savedEvents.eventId, events.id))
    .leftJoin(organizations, eq(events.organizationId, organizations.id))
    .leftJoin(universities, eq(events.universityId, universities.id))
    .orderBy(desc(savedEvents.createdAt));
  return rows;
}

export async function listOrganizationEvents(organizationId: string) {
  const rows = await db
    .select({ event: eventSelect, organization: organizations, university: universities })
    .from(events)
    .where(and(eq(events.organizationId, organizationId), eq(events.status, "published")))
    .leftJoin(organizations, eq(events.organizationId, organizations.id))
    .leftJoin(universities, eq(events.universityId, universities.id))
    .orderBy(desc(events.eventDate));

  const todayStr = new Date().toISOString().slice(0, 10);
  const upcoming = rows.filter((r) => !r.event.eventDate || r.event.eventDate >= todayStr);
  const past = rows.filter((r) => r.event.eventDate && r.event.eventDate < todayStr);
  return { upcoming, past };
}

export async function isOrganizationMember(organizationId: string, userId: string) {
  const [row] = await db
    .select({ id: organizationMembers.id })
    .from(organizationMembers)
    .where(
      and(
        eq(organizationMembers.organizationId, organizationId),
        eq(organizationMembers.userId, userId),
      ),
    )
    .limit(1);
  return !!row;
}

export async function getOrganizationById(id: string) {
  const [row] = await db
    .select({ organization: organizations, university: universities })
    .from(organizations)
    .where(eq(organizations.id, id))
    .leftJoin(universities, eq(organizations.universityId, universities.id))
    .limit(1);
  return row ?? null;
}

export async function getOrganizationMembers(organizationId: string) {
  return db
    .select({
      id: organizationMembers.id,
      role: organizationMembers.role,
      createdAt: organizationMembers.createdAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(organizationMembers)
    .where(eq(organizationMembers.organizationId, organizationId))
    .innerJoin(users, eq(organizationMembers.userId, users.id));
}
