"use server";

import { db } from "@/db";
import { organizations, organizationMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";
import { slugify, randomSuffix } from "@/lib/slug";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { z } from "zod";

async function getClientIp() {
  const headersList = await headers();
  return headersList.get("x-forwarded-for") || "unknown";
}

const orgSchema = z.object({
  name: z.string().min(1, "Organization name is required").max(100, "Name is too long"),
  description: z.string().max(2000).optional(),
  website: z.string().url("Invalid website URL").max(500).optional().or(z.literal("")),
  instagram: z.string().max(100).optional(),
  universityId: z.string().max(100).optional().nullable(),
});

async function uniqueOrgSlug(base: string, ignoreId?: string) {
  let candidate = slugify(base) || "org";
  for (let i = 0; i < 6; i++) {
    const rows = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, candidate))
      .limit(1);
    const clash = rows[0] && rows[0].id !== ignoreId;
    if (!clash) return candidate;
    candidate = `${slugify(base)}-${randomSuffix(4)}`;
  }
  return `${slugify(base)}-${randomSuffix(6)}`;
}

export async function createOrganizationAction(formData: FormData) {
  let orgId = "";
  try {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const ip = await getClientIp();
    const rlIp = await checkRateLimit("create_org_ip", ip, { max: 10, windowMs: 15 * 60 * 1000 });
    if (!rlIp.success) throw new Error("Too many requests. Please try again later.");

    const parsed = orgSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      website: formData.get("website"),
      instagram: formData.get("instagram"),
      universityId: formData.get("universityId") || null,
    });

    if (!parsed.success) {
      throw new Error(parsed.error.issues[0].message);
    }

    const { name, description, website, instagram, universityId } = parsed.data;

    const slug = await uniqueOrgSlug(name);

    const logoFile = formData.get("logo") as File | null;
    const bannerFile = formData.get("banner") as File | null;
    const logoUrl = logoFile && logoFile.size > 0 ? await saveUploadedFile(logoFile, "organizations/logos") : null;
    const bannerUrl = bannerFile && bannerFile.size > 0 ? await saveUploadedFile(bannerFile, "organizations/banners") : null;

    const [org] = await db
      .insert(organizations)
      .values({
        name,
        slug,
        description,
        website,
        instagram,
        universityId,
        logoUrl,
        bannerUrl,
        createdBy: user.id,
      })
      .returning({ id: organizations.id });

    await db.insert(organizationMembers).values({
      organizationId: org.id,
      userId: user.id,
      role: "owner",
    });

    orgId = org.id;
  } catch (err: any) {
    if (err?.message === "NEXT_REDIRECT") throw err;
    console.error(err);
    throw new Error(err.message || "An unexpected error occurred.");
  }

  revalidatePath("/studio/organizations");
  redirect(`/studio/organizations/${orgId}`);
}

export async function updateOrganizationAction(orgId: string, formData: FormData) {
  let slugToReturn = "";
  try {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const ip = await getClientIp();
    const rlIp = await checkRateLimit("update_org_ip", ip, { max: 40, windowMs: 15 * 60 * 1000 });
    if (!rlIp.success) throw new Error("Too many requests. Please try again later.");

    const [existing] = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
    if (!existing) throw new Error("Organization not found");

    // Permission: must be an admin or owner
    const { isOrganizationAdmin } = await import("@/lib/queries");
    const isAdmin = await isOrganizationAdmin(orgId, user.id);
    if (!isAdmin) throw new Error("You do not have permission to update this organization.");

    const parsed = orgSchema.safeParse({
      name: formData.get("name") || existing.name,
      description: formData.get("description"),
      website: formData.get("website"),
      instagram: formData.get("instagram"),
      universityId: formData.get("universityId") || existing.universityId,
    });

    if (!parsed.success) {
      throw new Error(parsed.error.issues[0].message);
    }

    const { name, description, website, instagram, universityId } = parsed.data;

    const logoFile = formData.get("logo") as File | null;
    const bannerFile = formData.get("banner") as File | null;
    const removeLogo = formData.get("removeLogo") === "true";
    const removeBanner = formData.get("removeBanner") === "true";

    let logoUrl = existing.logoUrl;
    if (removeLogo) logoUrl = null;
    else if (logoFile && logoFile.size > 0) logoUrl = await saveUploadedFile(logoFile, "organizations/logos");

    let bannerUrl = existing.bannerUrl;
    if (removeBanner) bannerUrl = null;
    else if (bannerFile && bannerFile.size > 0) bannerUrl = await saveUploadedFile(bannerFile, "organizations/banners");

    await db
      .update(organizations)
      .set({ name, description, website, instagram, universityId, logoUrl, bannerUrl })
      .where(eq(organizations.id, orgId));

    slugToReturn = existing.slug;
  } catch (err: any) {
    if (err?.message === "NEXT_REDIRECT") throw err;
    console.error(err);
    throw new Error(err.message || "An unexpected error occurred.");
  }

  revalidatePath("/studio/organizations");
  revalidatePath(`/studio/organizations/${orgId}`);
  revalidatePath(`/organization/${slugToReturn}`);
}
