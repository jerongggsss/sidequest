"use server";

import { db } from "@/db";
import { organizations, organizationMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";
import { slugify, randomSuffix } from "@/lib/slug";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Organization name is required");

  const description = String(formData.get("description") || "").trim();
  const website = String(formData.get("website") || "").trim();
  const instagram = String(formData.get("instagram") || "").trim();
  const universityId = String(formData.get("universityId") || "") || null;

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

  revalidatePath("/studio/organizations");
  redirect(`/studio/organizations/${org.id}`);
}

export async function updateOrganizationAction(orgId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [existing] = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
  if (!existing) throw new Error("Organization not found");

  // Permission: must be a member
  const { isOrganizationMember } = await import("@/lib/queries");
  const isMember = await isOrganizationMember(orgId, user.id);
  if (!isMember) throw new Error("You are not a member of this organization.");

  const name = String(formData.get("name") || existing.name).trim();
  const description = String(formData.get("description") || "").trim();
  const website = String(formData.get("website") || "").trim();
  const instagram = String(formData.get("instagram") || "").trim();
  const universityId = String(formData.get("universityId") || "") || null;

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

  revalidatePath("/studio/organizations");
  revalidatePath(`/studio/organizations/${orgId}`);
  revalidatePath(`/organization/${existing.slug}`);
}
