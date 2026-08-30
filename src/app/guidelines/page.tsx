import type { Metadata } from "next";
import Link from "next/link";
import { AppNavbar } from "@/components/app/AppNavbar";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Community Guidelines · SideQuest",
  description: "Guidelines for creating events, organizations, and content on SideQuest.",
};

export default async function GuidelinesPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-surface">
      <AppNavbar user={user} />

      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-sm font-medium text-brand">Community</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Community Guidelines</h1>
        <p className="mt-3 text-slate-500">Last updated: August 2026</p>

        <p className="mt-8 text-slate-600">
          SideQuest exists to help students discover real campus events and connect with genuine
          organisations. These guidelines help keep the platform trustworthy, useful, and welcoming
          for everyone.
        </p>

        <div className="mt-10 space-y-10">

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">1. Respectful Content Creation</h2>
            <p className="mt-3 text-slate-600">
              All events and organisation profiles should be created in good faith. Use accurate
              titles, honest descriptions, and real dates and locations. Your content reflects your
              organisation — keep it professional and welcoming.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">2. Prohibited Content</h2>
            <p className="mt-3 text-slate-600">
              The following types of content are not permitted on SideQuest:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600">
              <li>Content that is sexually explicit, violent, or discriminatory.</li>
              <li>
                Content that targets individuals or groups based on race, religion, gender, sexual
                orientation, disability, or nationality.
              </li>
              <li>Illegal content, or content promoting illegal activities.</li>
              <li>
                Fake organisations or events designed to collect personal information or fees under
                false pretences.
              </li>
              <li>Copyrighted material used without permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">3. No Spam or Misleading Events</h2>
            <p className="mt-3 text-slate-600">
              Do not create duplicate listings for the same event, publish events with no intention
              of hosting them, or use event listings as a vehicle for commercial promotion unrelated
              to student life. Event titles and descriptions must accurately represent what is being
              offered.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">4. No Harassment</h2>
            <p className="mt-3 text-slate-600">
              SideQuest does not tolerate harassment of any kind. This includes targeted abuse of
              other students, organisers, or SideQuest staff — whether through event descriptions,
              organisation names, or any other platform feature. Content that singles out, threatens,
              or demeans individuals will be removed immediately.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">5. Reporting &amp; Moderation</h2>
            <p className="mt-3 text-slate-600">
              If you encounter content that violates these guidelines, please report it via our{" "}
              <Link href="/contact" className="text-brand hover:underline">
                Contact page
              </Link>
              . We review reports promptly. Content found in violation may be removed without
              notice, and responsible accounts may be suspended or permanently banned.
            </p>
            <p className="mt-3 text-slate-600">
              We reserve the right to make moderation decisions at our discretion to maintain a safe
              and trustworthy platform for the campus community.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-400">
        <Link href="/" className="font-brand tracking-wide text-slate-500 hover:text-ink">
          SIDEQUEST
        </Link>
        <p className="mt-1">&copy; {new Date().getFullYear()} SideQuest</p>
      </footer>
    </div>
  );
}
