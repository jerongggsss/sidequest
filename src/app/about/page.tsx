import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search as SearchIcon, Bookmark, Compass, Send, FileEdit, Globe, LayoutDashboard } from "lucide-react";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About · SideQuest",
  description: "Learn what SideQuest is, the problem we solve, and our vision for campus life.",
};

export default async function AboutPage() {
  const user = await getCurrentUser();

  return (
    <main className="bg-surface">
      <MarketingNavbar isAuthed={!!user} />

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-ink px-6 pb-32 pt-40 text-center text-white min-h-[70vh]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-[-10%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand/25 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] h-[400px] w-[500px] rounded-full bg-brand/15 blur-[100px]" />
          <div className="bg-grid absolute inset-0 opacity-40" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/70">
            Our Mission
          </p>
          <h1 className="animate-fade-up font-display text-balance text-[2.75rem] font-semibold leading-[1.08] text-white sm:text-6xl lg:text-7xl">
            Find your next adventure.
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-2xl text-balance text-base text-white/70 sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            We believe there&apos;s more to university than just classes. SideQuest is a campus-focused platform for discovering events, activities, clubs, societies, and student opportunities.
          </p>
        </div>
      </section>

      {/* THE PROBLEM WE SOLVE */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 font-brand text-xs font-semibold uppercase tracking-widest text-brand">
              The Problem
            </p>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              Campus life shouldn&apos;t be a scavenger hunt.
            </h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              Before SideQuest, finding out what was happening on campus meant deciphering a chaotic mess. Events were scattered across Instagram stories that disappeared in 24 hours, buried in noisy WhatsApp or Telegram groups, taped to random walls as physical posters, or hidden on outdated organization pages.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              If you didn&apos;t follow the right account or check the right noticeboard at the right time, you missed out. We built SideQuest to fix this.
            </p>
          </div>
          <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-4 rounded-xl border border-red-100 bg-red-50/50 p-4">
                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-500">✕</div>
                 <p className="text-sm font-medium text-slate-700">Missed the 24h Instagram story</p>
               </div>
               <div className="flex items-center gap-4 rounded-xl border border-red-100 bg-red-50/50 p-4">
                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-500">✕</div>
                 <p className="text-sm font-medium text-slate-700">Buried in 500+ WhatsApp messages</p>
               </div>
               <div className="flex items-center gap-4 rounded-xl border border-green-100 bg-green-50/50 p-4">
                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-500">✓</div>
                 <p className="text-sm font-medium text-slate-700">Everything in one place on SideQuest</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS FOR STUDENTS */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="mb-3 font-brand text-xs font-semibold uppercase tracking-widest text-brand">
            For Students
          </p>
          <h2 className="mb-12 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Everything happening around you.
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Compass, title: "Discover", desc: "See what's happening this week on your campus." },
              { icon: SearchIcon, title: "Search", desc: "Find specific events, workshops, or competitions." },
              { icon: Bookmark, title: "Save", desc: "Keep track of events you're interested in attending." },
              { icon: Globe, title: "Explore", desc: "Find organizations and read detailed event information." },
            ].map((s) => (
              <div
                key={s.title}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-surface p-6 transition-transform hover:-translate-y-1"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <s.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS FOR ORGANIZERS */}
      <section className="bg-ink py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="mb-3 font-brand text-xs font-semibold uppercase tracking-widest text-brand">
            For Organizers
          </p>
          <h2 className="mb-12 font-display text-3xl font-semibold sm:text-4xl">
            Reach students where they are.
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: LayoutDashboard, title: "Create Orgs", desc: "Build a verified profile for your club or society." },
              { icon: FileEdit, title: "Publish Events", desc: "Create beautiful event pages in minutes." },
              { icon: SearchIcon, title: "Manage Info", desc: "Keep dates, times, and details up to date easily." },
              { icon: Send, title: "Reach Students", desc: "Get your events in front of the whole campus." },
            ].map((s) => (
              <div
                key={s.title}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 transition-transform hover:-translate-y-1"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/20 text-brand">
                  <s.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-white/90">{s.title}</h3>
                  <p className="mt-1 text-sm text-white/60">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE VISION & MEANING */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-brand text-xs font-semibold uppercase tracking-widest text-brand">
            Our Vision
          </p>
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Make campus life easier to discover.
          </h2>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Our vision is simple: to help students find experiences beyond their usual routine. 
            When we say <strong>&ldquo;Find your next adventure&rdquo;</strong>, we mean exactly that. 
            University is a time for exploration. Whether it&apos;s a hackathon, a cultural night, a sports tournament, or a quiet workshop—there is always a side quest waiting for you. 
          </p>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            We want to be the map that guides you there.
          </p>
          <div className="mt-10 flex items-center justify-center">
             <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                Start Exploring <ArrowRight className="h-4 w-4" />
              </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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
                <Link href="/studio" className="transition-colors hover:text-white/70">Studio</Link>
                <Link href="/studio/events/new" className="transition-colors hover:text-white/70">Create an Event</Link>
                <Link href="/studio/organizations/new" className="transition-colors hover:text-white/70">Create an Organization</Link>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-white/85">For Organizations</h3>
                <Link href="/" className="transition-colors hover:text-white/70">Why SideQuest</Link>
                <Link href="/organizations" className="transition-colors hover:text-white/70">Organization Profiles</Link>
                <Link href="/studio" className="transition-colors hover:text-white/70">Manage Events</Link>
                <Link href="/studio" className="transition-colors hover:text-white/70">Publish Events</Link>
                <Link href="/" className="transition-colors hover:text-white/70">Community Reach</Link>
                <Link href="/organizations" className="transition-colors hover:text-white/70">Verified Organizations</Link>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-white/85">Discover</h3>
                <Link href="/discover" className="transition-colors hover:text-white/70">Browse Events</Link>
                <Link href="/discover" className="transition-colors hover:text-white/70">Events by Category</Link>
                <Link href="/discover" className="transition-colors hover:text-white/70">Upcoming Events</Link>
                <Link href="/discover" className="transition-colors hover:text-white/70">Campus Events</Link>
                <Link href="/discover" className="transition-colors hover:text-white/70">Featured Events</Link>
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
