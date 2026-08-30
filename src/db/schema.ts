import { nanoid } from "nanoid";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(12));

export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "published",
  "archived",
]);

export const orgRoleEnum = pgEnum("org_role", ["owner", "admin", "member"]);

export const universities = pgTable("universities", {
  id: id(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  city: text("city"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  authVersion: integer("auth_version").notNull().default(1),
  universityId: text("university_id").references(() => universities.id, {
    onDelete: "set null",
  }),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  emailVerified: timestamp("email_verified"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
}, (t) => [
  unique("verification_tokens_identifier_token_unique").on(t.identifier, t.token)
]);

export const passwordResetTokens = pgTable("password_reset_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
}, (t) => [
  unique("password_reset_tokens_identifier_token_unique").on(t.identifier, t.token)
]);

export const organizations = pgTable(
  "organizations",
  {
    id: id(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    logoUrl: text("logo_url"),
    bannerUrl: text("banner_url"),
    website: text("website"),
    instagram: text("instagram"),
    universityId: text("university_id").references(() => universities.id, {
      onDelete: "set null",
    }),
    verified: boolean("verified").notNull().default(false),
    createdBy: text("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("organizations_university_idx").on(t.universityId)],
);

export const organizationMembers = pgTable(
  "organization_members",
  {
    id: id(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: orgRoleEnum("role").notNull().default("member"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [unique("org_member_unique").on(t.organizationId, t.userId)],
);

export const events = pgTable(
  "events",
  {
    id: id(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    tagline: text("tagline"),
    description: text("description"),
    category: text("category").notNull().default("Social"),
    eventDate: text("event_date"),
    startTime: text("start_time"),
    endTime: text("end_time"),
    location: text("location"),
    locationType: text("location_type").notNull().default("physical"),
    universityId: text("university_id").references(() => universities.id, {
      onDelete: "set null",
    }),
    price: text("price"),
    isFree: boolean("is_free").notNull().default(true),
    eligibility: text("eligibility"),
    registrationDeadline: text("registration_deadline"),
    registrationUrl: text("registration_url"),
    posterUrl: text("poster_url"),
    bannerUrl: text("banner_url"),
    tags: text("tags"),
    status: eventStatusEnum("status").notNull().default("draft"),
    organizationId: text("organization_id").references(
      () => organizations.id,
      { onDelete: "set null" },
    ),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    views: integer("views").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    publishedAt: timestamp("published_at"),
  },
  (t) => [
    index("events_status_idx").on(t.status),
    index("events_org_idx").on(t.organizationId),
    index("events_owner_idx").on(t.ownerId),
    index("events_university_idx").on(t.universityId),
  ],
);

export const savedEvents = pgTable(
  "saved_events",
  {
    id: id(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [unique("saved_event_unique").on(t.userId, t.eventId)],
);

export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  points: integer("points").notNull().default(0),
  resetAt: timestamp("reset_at").notNull(),
});
