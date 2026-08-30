import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listOrganizationsForUser } from "@/lib/queries";
import { VerifiedBadge } from "@/components/ui/Badge";
import { PlusCircle, Building2, Edit2, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "My Organizations · Studio" };

export default async function StudioOrgsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orgs = await listOrganizationsForUser(user.id);

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Organizations</h1>
          <p className="mt-0.5 text-sm text-slate-500">Manage the organizations you belong to</p>
        </div>
        <Link
          href="/studio/organizations/new"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark hover:-translate-y-0.5"
        >
          <PlusCircle className="h-4 w-4" /> New Organization
        </Link>
      </div>

      {orgs.length > 0 ? (
        <div className="flex flex-col gap-4">
          {orgs.map((org) => (
            <div
              key={org.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-ink font-brand text-lg font-bold text-white">
                {org.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={org.logoUrl} alt={org.name} className="h-full w-full object-cover" />
                ) : (
                  org.name.slice(0, 2).toUpperCase()
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 font-display font-semibold text-ink">
                  {org.name}
                  {org.verified && <VerifiedBadge />}
                </p>
                {org.description && (
                  <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">{org.description}</p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/organization/${org.slug}`}
                  target="_blank"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-ink"
                  title="View public page"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link
                  href={`/studio/organizations/${org.id}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-ink"
                  title="Edit organization"
                >
                  <Edit2 className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
          <Building2 className="mb-4 h-10 w-10 text-slate-300" />
          <p className="font-display text-lg font-semibold text-ink">No organizations yet</p>
          <p className="mt-1.5 max-w-sm text-sm text-slate-500">
            Create an organization to publish events under a club, society, or group identity.
          </p>
          <Link
            href="/studio/organizations/new"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            <PlusCircle className="h-4 w-4" /> Create Organization
          </Link>
        </div>
      )}
    </div>
  );
}
