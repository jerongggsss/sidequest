import Link from "next/link";
import {
  ArrowRight,
  Search as SearchIcon,
  Bookmark,
  SlidersHorizontal,
  Compass,
  Upload,
  FileEdit,
  Eye,
  Send,
  Share2,
  BadgeCheck,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  Camera,
} from "lucide-react";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { HeroSearch } from "@/components/marketing/HeroSearch";
import { TypingRotator } from "@/components/marketing/TypingRotator";
import { FloatingPosters } from "@/components/marketing/FloatingPosters";
import { EventCard } from "@/components/EventCard";
import { getCurrentUser } from "@/lib/auth";
import { listPublishedEvents, getSavedEventIds } from "@/lib/queries";
import { CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  const events = await listPublishedEvents();
  const savedIds = user ? await getSavedEventIds(user.id) : new Set<string>();
  const featured = events.slice(0, 4);

  return (
    <main className="bg-surface">
      <MarketingNavbar isAuthed={!!user} />

      {/* HERO */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 pb-24 pt-32">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-[-10%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand/25 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] h-[400px] w-[500px] rounded-full bg-brand/15 blur-[100px]" />
          <div className="bg-grid absolute inset-0 opacity-40" />
        </div>

        <FloatingPosters />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/70">
            Now piloting at Universiti Malaysia Sabah
          </span>
          <h1 className="animate-fade-up font-display text-balance text-[2.75rem] font-semibold leading-[1.08] text-white sm:text-6xl lg:text-7xl">
            There&apos;s more to university.
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-xl text-balance text-base text-white/70 sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Discover events, activities, competitions, workshops and opportunities happening
            around you.
          </p>
          <p
            className="animate-fade-up mt-3 h-6 font-brand text-sm text-white/50 sm:text-base"
            style={{ animationDelay: "200ms" }}
          >
            <TypingRotator />
          </p>

          <div className="animate-fade-up mt-10 w-full" style={{ animationDelay: "280ms" }}>
            <HeroSearch />
          </div>

          <div
            className="animate-fade-up mt-6 flex flex-wrap items-center justify-center gap-4"
            style={{ animationDelay: "340ms" }}
          >
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              Discover Events <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/85 transition-all hover:border-white/40 hover:text-white"
            >
              Enter Studio
            </Link>
          </div>
        </div>
      </section>

      {/* DISCOVER SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 font-brand text-xs font-semibold uppercase tracking-widest text-brand">
              Discover
            </p>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              Everything happening around you.
            </h2>
          </div>
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
          >
            View all events <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <span
              key={c}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600"
            >
              {c}
            </span>
          ))}
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {featured.map((item) => (
              <EventCard
                key={item.event.id}
                data={item}
                isSaved={savedIds.has(item.event.id)}
                isAuthed={!!user}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500">
            New events are being added soon.
          </div>
        )}
      </section>

      {/* ONE LINK SECTION */}
      <section className="bg-ink py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center lg:px-10">
          <div>
            <p className="mb-3 font-brand text-xs font-semibold uppercase tracking-widest text-brand">
              For organizers
            </p>
            <h2 className="font-display text-3xl font-semibold text-balance sm:text-4xl">
              One link. Everything they need.
            </h2>
            <p className="mt-5 max-w-md text-white/65">
              Stop sending walls of text across five different apps. SideQuest turns your poster,
              WhatsApp announcement, and Google Form into a single, beautiful event page — ready
              to share anywhere.
            </p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 font-brand text-sm text-white/70">
              sidequest.my/event/tech-symposium
            </div>
          </div>

          <div className="relative flex flex-col items-center gap-4">
            <div className="w-full max-w-sm space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/60 line-through decoration-white/30">
              <p className="flex items-center gap-2"><ImageIcon className="h-4 w-4 shrink-0" /> Poster.jpg</p>
              <p className="flex items-center gap-2"><MessageSquare className="h-4 w-4 shrink-0" /> &ldquo;pls read here for info!! link in bio&rdquo;</p>
              <p className="flex items-center gap-2"><FileText className="h-4 w-4 shrink-0" /> Google Form (no context)</p>
              <p className="flex items-center gap-2"><Camera className="h-4 w-4 shrink-0" /> Instagram story, expires in 24h</p>
            </div>
            <div className="text-2xl text-white/40">↓</div>
            <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-brand/40 bg-linear-to-b from-brand/20 to-transparent p-1 shadow-2xl">
              <div className="rounded-xl bg-slate-900 p-5">
                <span className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70">
                  Technology
                </span>
                <p className="font-display text-xl font-semibold text-white">Campus Tech Symposium</p>
                <p className="mt-1 text-xs text-white/60">12 November 2026 · Main Auditorium</p>
                <p className="mt-4 inline-flex items-center gap-1 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white">
                  Register <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BUILT FOR STUDENTS */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <p className="mb-3 font-brand text-xs font-semibold uppercase tracking-widest text-brand">
          For students
        </p>
        <h2 className="mb-12 font-display text-3xl font-semibold text-ink sm:text-4xl">
          Built for students.
        </h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { icon: SearchIcon, label: "Search" },
            { icon: SlidersHorizontal, label: "Filter" },
            { icon: Bookmark, label: "Save" },
            { icon: Compass, label: "Discover" },
            { icon: ArrowRight, label: "Register" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center transition-transform hover:-translate-y-1"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                <s.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-ink">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* BUILT FOR ORGANIZERS */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="mb-3 font-brand text-xs font-semibold uppercase tracking-widest text-brand">
            For organizers
          </p>
          <h2 className="mb-12 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Built for organizers.
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { icon: FileEdit, label: "Create event" },
              { icon: Upload, label: "Upload poster" },
              { icon: FileEdit, label: "Add information" },
              { icon: Eye, label: "Preview" },
              { icon: Send, label: "Publish" },
              { icon: Share2, label: "Share" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-surface p-6 text-center transition-transform hover:-translate-y-1"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-ink">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORGANIZATIONS */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 font-brand text-xs font-semibold uppercase tracking-widest text-brand">
              Organizations
            </p>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              Verified profiles students can trust.
            </h2>
            <p className="mt-5 max-w-md text-slate-600">
              Clubs, societies and student councils get a public profile of their own — every
              past and upcoming event, gathered in one place, with a subtle verified badge for
              trust and recognition.
            </p>
            <Link
              href="/organization/sidequest"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
            >
              View example profile <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <Link
            href="/organization/sidequest"
            className="block rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink font-brand text-lg font-bold text-white">
                SQ
              </div>
              <div>
                <p className="flex items-center gap-1.5 font-display text-lg font-semibold text-ink">
                  SideQuest <BadgeCheck className="h-4 w-4 text-brand" strokeWidth={2.5} />
                </p>
                <p className="text-sm text-slate-500">Universiti Malaysia Sabah</p>
              </div>
            </div>
            <p className="mt-5 text-sm text-slate-600">
              Discover campus events, organizations, and communities through SideQuest — a central place for students to find what's happening around campus.
            </p>
            <div className="mt-6 flex gap-6 border-t border-slate-100 pt-5 text-sm">
              <div>
                <p className="font-display text-xl font-semibold text-ink">5</p>
                <p className="text-slate-500">Upcoming events</p>
              </div>
              <div>
                <p className="font-display text-xl font-semibold text-ink">Verified</p>
                <p className="text-slate-500">Organization</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-ink py-28 text-center text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-[120px]" />
          <div className="bg-grid absolute inset-0 opacity-30" />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl px-6">
          <h2 className="font-display text-balance text-4xl font-semibold sm:text-5xl">
            Your next SideQuest is out there.
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              Discover Events <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white/85 transition-all hover:border-white/40 hover:text-white"
            >
              Enter Studio <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-ink py-16 text-sm text-white/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-8">
            <div className="shrink-0 lg:w-1/4">
              <p className="font-brand text-lg tracking-wide text-white/70">SIDEQUEST</p>
              <p className="mt-2 max-w-xs">Find your next adventure.</p>
            </div>

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:w-3/4">
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-white/85">SideQuest</h3>
                <Link href="/discover" className="transition-colors hover:text-white/70">Discover Events</Link>
                <Link href="/organizations" className="transition-colors hover:text-white/70">Organizations</Link>
                <Link href="/saved" className="transition-colors hover:text-white/70">Saved Events</Link>
                <Link href="/about" className="transition-colors hover:text-white/70">About</Link>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-white/85">For Organizations</h3>
                <Link href="/about" className="transition-colors hover:text-white/70">Why SideQuest</Link>
                <Link href="/organizations" className="transition-colors hover:text-white/70">Organization Profiles</Link>
                <Link href="/studio" className="transition-colors hover:text-white/70">Manage Events</Link>
                <Link href="/studio/events/new" className="transition-colors hover:text-white/70">Create an Event</Link>
                <Link href="/studio/organizations/new" className="transition-colors hover:text-white/70">Create an Organization</Link>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-white/85">Discover</h3>
                <Link href="/discover" className="transition-colors hover:text-white/70">Browse Events</Link>
                <Link href="/organizations" className="transition-colors hover:text-white/70">Organizations</Link>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-white/85">Support &amp; Legal</h3>
                <Link href="/help" className="transition-colors hover:text-white/70">Help / FAQ</Link>
                <Link href="/contact" className="transition-colors hover:text-white/70">Contact</Link>
                <Link href="/privacy" className="transition-colors hover:text-white/70">Privacy Policy</Link>
                <Link href="/terms" className="transition-colors hover:text-white/70">Terms of Service</Link>
                <Link href="/guidelines" className="transition-colors hover:text-white/70">Community Guidelines</Link>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
            <p>&copy; {new Date().getFullYear()} SideQuest</p>
            <div className="flex flex-wrap gap-4 text-xs">
              <Link href="/privacy" className="transition-colors hover:text-white/70">Privacy</Link>
              <Link href="/terms" className="transition-colors hover:text-white/70">Terms</Link>
              <Link href="/guidelines" className="transition-colors hover:text-white/70">Guidelines</Link>
              <Link href="/contact" className="transition-colors hover:text-white/70">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
