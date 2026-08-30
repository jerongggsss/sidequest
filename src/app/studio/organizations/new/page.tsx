import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUniversities } from "@/lib/queries";
import { OrgEditor } from "@/components/studio/OrgEditor";

export const metadata: Metadata = { title: "New Organization · Studio" };

export default async function NewOrgPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const universities = await getUniversities();

  return <OrgEditor universities={universities} />;
}
