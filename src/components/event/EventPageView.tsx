import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, Wallet, Users, ArrowRight, ArrowUpRight } from "lucide-react";
import { VerifiedBadge } from "@/components/ui/Badge";
import { formatEventDate, formatTimeRange, priceLabel } from "@/lib/format";
import { formatDescription } from "@/lib/richtext";

export type EventPageViewProps = {
  name: string;
  tagline?: string | null;
  category: string;
  description?: string | null;
  eventDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  location?: string | null;
  locationType?: string | null;
  price?: string | null;
  isFree?: boolean;
  eligibility?: string | null;
  registrationDeadline?: string | null;
  registrationUrl?: string | null;
  posterUrl?: string | null;
  bannerUrl?: string | null;
  universityName?: string | null;
  organization?: {
    name: string;
    slug?: string;
    verified?: boolean;
    logoUrl?: string | null;
    description?: string | null;
  } | null;
  ownerName?: string | null;
  saveSlot?: ReactNode;
  registerHref?: string | null;
  viewOrgHref?: string | null;
  compact?: boolean;
  stickyMobileCta?: boolean;
};

export function EventPageView({
  name,
  tagline,
  category,
  description,
  eventDate,
  startTime,
  endTime,
  location,
  locationType,
  price,
  isFree = true,
  eligibility,
  registrationDeadline,
  registrationUrl,
  posterUrl,
  bannerUrl,
  universityName,
  organization,
  ownerName,
  saveSlot,
  registerHref,
  viewOrgHref,
  compact = false,
  stickyMobileCta = false,
}: EventPageViewProps) {
  const heroImage = bannerUrl || posterUrl;
  const timeRange = formatTimeRange(startTime, endTime);
  const html = formatDescription(description);

  const heroHeight = compact ? "h-[280px]" : "h-[340px] sm:h-[420px] lg:h-[480px]";
  const posterSize = compact ? "h-40 w-32" : "h-56 w-44 sm:h-64 sm:w-52 lg:h-72 lg:w-56";
  const titleSize = compact ? "text-2xl" : "text-3xl sm:text-4xl lg:text-5xl";

  return (
    <div className="bg-surface">
      {/* HERO */}
      <div className={`relative ${heroHeight} w-full overflow-hidden bg-ink`}>
        {heroImage ? (
          <div
            className="absolute inset-0 scale-105 bg-cover bg-center blur-[2px]"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-ink to-slate-900" />
        )}
        <div className="absolute inset-0 bg-ink/50" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-surface via-surface/70 to-transparent" />

        {saveSlot ? <div className="absolute right-4 top-4 z-10 sm:right-8 sm:top-6">{saveSlot}</div> : null}

        {/* Poster overlapping bottom */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-center">
          <div className={`relative ${posterSize} overflow-hidden rounded-2xl border-4 border-white bg-slate-200 shadow-2xl`}>
            {posterUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={posterUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400 font-display text-3xl text-white">
                {name.slice(0, 1)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* INFO */}
      <div
        className={`mx-auto flex max-w-3xl flex-col items-center px-6 text-center ${
          compact ? "pt-24" : "pt-32 sm:pt-36 lg:pt-40"
        }`}
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
            {category}
          </span>
          {organization ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
              {organization.name}
              {organization.verified ? <VerifiedBadge /> : null}
            </span>
          ) : ownerName ? (
            <span className="text-xs font-medium text-slate-500">by {ownerName}</span>
          ) : null}
        </div>

        <h1 className={`mt-4 font-display font-semibold leading-tight text-ink ${titleSize}`}>{name}</h1>
        {tagline ? <p className="mt-2 text-balance text-slate-500">{tagline}</p> : null}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-brand" /> {formatEventDate(eventDate)}
          </span>
          {timeRange ? (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-brand" /> {timeRange}
            </span>
          ) : null}
          {location ? (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-brand" /> {location}
            </span>
          ) : null}
        </div>

        <div className="mt-8">
          {registrationUrl ? (
            <a
              href={registerHref ?? registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              Register <ArrowRight className="h-4 w-4" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-8 py-3.5 text-sm font-semibold text-slate-500">
              Registration coming soon
            </span>
          )}
        </div>
      </div>

      {/* ABOUT */}
      <div className={`mx-auto max-w-3xl px-6 ${compact ? "py-10" : "py-16"}`}>
        <h2 className="font-display text-xl font-semibold text-ink">About this event</h2>
        {html ? (
          <div
            className="prose-event mt-4 text-[15px] text-slate-700"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="mt-4 text-sm text-slate-400">No description provided yet.</p>
        )}

        {/* DETAILS */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 font-display text-lg font-semibold text-ink">Event details</h3>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Detail icon={CalendarDays} label="Date" value={formatEventDate(eventDate)} />
            {timeRange ? <Detail icon={Clock} label="Time" value={timeRange} /> : null}
            <Detail icon={MapPin} label="Location" value={location || "TBA"} />
            <Detail
              icon={Wallet}
              label="Price"
              value={priceLabel(!!isFree, price)}
            />
            {eligibility ? <Detail icon={Users} label="Eligibility" value={eligibility} /> : null}
            {registrationDeadline ? (
              <Detail icon={CalendarDays} label="Registration deadline" value={formatEventDate(registrationDeadline)} />
            ) : null}
            <Detail label="Format" value={locationType === "online" ? "Online" : "Physical"} />
            {universityName ? <Detail label="University" value={universityName} /> : null}
          </dl>
        </div>

        {/* ORGANIZER */}
        {organization ? (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-center sm:flex-row sm:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-ink font-brand font-bold text-white">
              {organization.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={organization.logoUrl} alt={organization.name} className="h-full w-full object-cover" />
              ) : (
                organization.name.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <p className="flex items-center justify-center gap-1.5 font-display text-base font-semibold text-ink sm:justify-start">
                {organization.name}
                {organization.verified ? <VerifiedBadge /> : null}
              </p>
              {universityName ? <p className="text-sm text-slate-500">{universityName}</p> : null}
              {organization.description ? (
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{organization.description}</p>
              ) : null}
            </div>
            {viewOrgHref ? (
              <Link
                href={viewOrgHref}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-slate-50"
              >
                View Organization <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>

      {stickyMobileCta ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-4 backdrop-blur sm:hidden">
          {registrationUrl ? (
            <a
              href={registerHref ?? registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white shadow-lg"
            >
              Register <ArrowRight className="h-4 w-4" />
            </a>
          ) : (
            <span className="flex w-full items-center justify-center rounded-full bg-slate-200 py-3.5 text-sm font-semibold text-slate-500">
              Registration coming soon
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon ? (
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Icon className="h-4 w-4" />
        </span>
      ) : (
        <span className="mt-0.5 h-8 w-8 shrink-0" />
      )}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}
