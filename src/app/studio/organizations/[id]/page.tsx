import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getOrganizationById, isOrganizationMember, getUniversities } from "@/lib/queries";
import { OrgEditor } from "@/components/studio/OrgEditor";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const row = await getOrganizationById(id);
  return { title: row ? `Edit: ${row.organization.name} · Studio` : "Edit Organization · Studio" };
}

export default async function EditOrgPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [row, universities] = await Promise.all([
    getOrganizationById(id),
    getUniversities(),
  ]);

  if (!row) notFound();

  const isMember = await isOrganizationMember(id, user.id);
  if (!isMember) notFound();

  const { organization } = row;

  return (
    <OrgEditor
      orgId={organization.id}
      slug={organization.slug}
      universities={universities}
      initial={{
        name: organization.name,
        description: organization.description ?? "",
        website: organization.website ?? "",
        instagram: organization.instagram ?? "",
        universityId: organization.universityId ?? "",
        logoUrl: organization.logoUrl,
        bannerUrl: organization.bannerUrl,
      }}
    />
  );
}
