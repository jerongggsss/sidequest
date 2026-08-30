import Link from "next/link";
import { redirect } from "next/navigation";
import { AppNavbar } from "@/components/app/AppNavbar";
import { EventCard } from "@/components/EventCard";
import { getCurrentUser } from "@/lib/auth";
import { listSavedEvents, getUniversities } from "@/lib/queries";
import { logoutAction } from "@/lib/actions/auth";
import { User, Bookmark, LayoutGrid, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const universities = await getUniversities();
  const university = universities.find((u) => u.id === user.universityId);
  const saved = await listSavedEvents(user.id);

  const todayStr = new Date().toISOString().slice(0, 10);
  const upcoming = saved.filter((s) => !s.event.eventDate || s.event.eventDate >= todayStr).slice(0, 4);

  return (
    <div className="min-h-screen bg-surface">
      <AppNavbar user={user} />

      <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-14">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white p-8 text-center sm:flex-row sm:text-left">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
            <User className="h-8 w-8" />
          </span>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-semibold text-ink">{user.name}</h1>
            <p className="text-sm text-slate-500">{user.email}</p>
            {university ? <p className="mt-1 text-sm text-slate-500">{university.name}</p> : null}
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </form>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2">
          <Link
            href="/saved"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Bookmark className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="font-display text-xl font-semibold text-ink">{saved.length}</p>
              <p className="text-xs text-slate-500">Saved events</p>
            </div>
          </Link>
          <Link
            href="/studio"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/10 text-ink">
              <LayoutGrid className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="font-display text-xl font-semibold text-ink">Studio</p>
              <p className="text-xs text-slate-500">Create &amp; manage events</p>
            </div>
          </Link>
        </div>

        <div className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ink">Upcoming saved events</h2>
            <Link href="/saved" className="text-sm font-semibold text-brand hover:underline">
              View all
            </Link>
          </div>
          {upcoming.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {upcoming.map((item) => (
                <EventCard key={item.event.id} data={item} isSaved isAuthed />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <p className="font-display text-lg font-semibold text-ink">Nothing saved yet.</p>
              <p className="mt-1 text-sm text-slate-500">Find something you want to do.</p>
              <Link
                href="/discover"
                className="mt-4 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Discover Events
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
