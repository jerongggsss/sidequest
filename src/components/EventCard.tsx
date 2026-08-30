import Link from "next/link";
import Image from "next/image";
import { MapPin, CalendarDays } from "lucide-react";
import { VerifiedBadge } from "@/components/ui/Badge";
import { SaveButton } from "@/components/SaveButton";
import { formatEventDateShort, priceLabel } from "@/lib/format";
import type { organizations, universities } from "@/db/schema";

export type EventCardData = {
  event: {
    id: string;
    slug: string;
    name: string;
    tagline: string | null;
    category: string;
    eventDate: string | null;
    location: string | null;
    posterUrl: string | null;
    bannerUrl: string | null;
    isFree: boolean;
    price: string | null;
  };
  organization: typeof organizations.$inferSelect | null;
  university: typeof universities.$inferSelect | null;
};

export function EventCard({
  data,
  isSaved = false,
  isAuthed = false,
  priority = false,
}: {
  data: EventCardData;
  isSaved?: boolean;
  isAuthed?: boolean;
  priority?: boolean;
}) {
  const { event, organization } = data;
  const image = event.posterUrl || event.bannerUrl;

  return (
    <Link
      href={`/event/${event.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ borderColor: "#e5e7eb" }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-ink to-slate-700">
        {image ? (
          <Image
            src={image}
            alt={event.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 280px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-2xl text-white/50">{event.name.slice(0, 1)}</span>
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink shadow-sm backdrop-blur">
            {event.category}
          </span>
          <SaveButton eventId={event.id} initialSaved={isSaved} isAuthed={isAuthed} size="sm" />
        </div>
        {!event.isFree ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            {priceLabel(event.isFree, event.price)}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink line-clamp-2">
          {event.name}
        </h3>
        <div className="flex flex-col gap-1 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            {formatEventDateShort(event.eventDate)}
          </span>
          {event.location ? (
            <span className="flex items-center gap-1.5 truncate">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{event.location}</span>
            </span>
          ) : null}
        </div>
        {organization ? (
          <div className="mt-1 flex items-center gap-1.5 border-t border-slate-100 pt-2 text-xs font-medium text-slate-600">
            <span className="truncate">{organization.name}</span>
            {organization.verified ? <VerifiedBadge /> : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
