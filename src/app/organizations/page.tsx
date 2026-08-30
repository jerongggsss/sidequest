import type { Metadata } from "next";
import Link from "next/link";
import { AppNavbar } from "@/components/app/AppNavbar";
import { VerifiedBadge } from "@/components/ui/Badge";
import { getCurrentUser } from "@/lib/auth";
import { listAllOrganizations } from "@/lib/queries";
import { Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Organizations",
  description: "Browse verified student organizations and clubs.",
};

export default async function OrganizationsPage() {
  const user = await getCurrentUser();
  const orgs = await listAllOrganizations();

  return (
    <div className="min-h-screen bg-surface">
      <AppNavbar user={user} />
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">Organizations</h1>
        <p className="mt-2 text-slate-500">Clubs, councils and societies publishing on SideQuest.</p>

        {orgs.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {orgs.map(({ organization, university }) => (
              <Link
                key={organization.id}
                href={`/organization/${organization.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-ink font-brand text-lg font-bold text-white">
                  {organization.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={organization.logoUrl} alt={organization.name} className="h-full w-full object-cover" />
                  ) : (
                    organization.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <p className="mt-4 flex items-center gap-1.5 font-display text-lg font-semibold text-ink">
                  {organization.name}
                  {organization.verified ? <VerifiedBadge /> : null}
                </p>
                {university ? <p className="text-sm text-slate-500">{university.name}</p> : null}
                {organization.description ? (
                  <p className="mt-3 line-clamp-2 text-sm text-slate-600">{organization.description}</p>
                ) : null}
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Building2 className="h-6 w-6" />
            </span>
            <h2 className="font-display text-xl font-semibold text-ink">No organizations yet.</h2>
            <p className="mt-1.5 max-w-sm text-sm text-slate-500">
              Organizations will appear here once they publish their profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
