import type { Metadata } from "next";
import Link from "next/link";
import { AppNavbar } from "@/components/app/AppNavbar";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Terms of Service · SideQuest",
  description: "The terms and conditions governing use of SideQuest.",
};

export default async function TermsPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-surface">
      <AppNavbar user={user} />

      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-sm font-medium text-brand">Legal</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Terms of Service</h1>
        <p className="mt-3 text-slate-500">Last updated: August 2026</p>

        <div className="mt-10 space-y-10">

          <p className="text-slate-600">
            By creating an account or using SideQuest, you agree to these Terms of Service. Please
            read them carefully. If you do not agree, do not use the platform.
          </p>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">1. Account Responsibilities</h2>
            <p className="mt-3 text-slate-600">
              You are responsible for maintaining the confidentiality of your login credentials. You
              must not share your account or allow others to access it on your behalf. You must
              provide accurate information when registering. SideQuest accounts are for individual
              use only.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">2. Event &amp; Organisation Content</h2>
            <p className="mt-3 text-slate-600">
              You are fully responsible for all content you publish on SideQuest, including event
              listings, descriptions, images, and organisation profiles. Content must be accurate,
              relevant to students, and comply with these terms. You must not publish false, misleading,
              or deceptive event information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">3. Organiser Responsibilities</h2>
            <p className="mt-3 text-slate-600">
              If you create events or manage an organisation on SideQuest, you are responsible for
              ensuring that all event details (date, time, location, registration process) are kept
              accurate and up to date. You must honour the commitments described in your event
              listings. SideQuest is not liable for events that are cancelled, changed, or
              misrepresented by organisers.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">4. Prohibited Use</h2>
            <p className="mt-3 text-slate-600">You may not use SideQuest to:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600">
              <li>Post spam, unsolicited promotions, or repetitive content.</li>
              <li>Impersonate any person, organisation, or official body.</li>
              <li>Distribute malware, phishing links, or harmful code.</li>
              <li>Harass, threaten, or discriminate against any individual or group.</li>
              <li>Violate any applicable law or university regulation.</li>
              <li>Scrape or systematically harvest data from the platform without permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">5. Content Ownership</h2>
            <p className="mt-3 text-slate-600">
              You retain ownership of the content you create. By posting content on SideQuest, you
              grant us a non-exclusive, royalty-free licence to display, reproduce, and distribute
              that content solely for the purpose of operating the platform. We will not use your
              content for commercial advertising without your consent.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">6. Platform Limitations</h2>
            <p className="mt-3 text-slate-600">
              SideQuest is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. We do not
              guarantee that the platform will be uninterrupted, error-free, or fully secure. We are
              not responsible for any loss arising from reliance on platform content, organiser
              actions, or service interruptions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">7. Account Termination</h2>
            <p className="mt-3 text-slate-600">
              We reserve the right to suspend or permanently terminate accounts that violate these
              terms, without prior notice. You may delete your account at any time by contacting us.
              Termination does not relieve you of responsibility for content posted prior to
              termination.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">8. Changes to These Terms</h2>
            <p className="mt-3 text-slate-600">
              We may revise these terms from time to time. We will notify users of material changes
              via the platform. Continued use after changes take effect constitutes your acceptance
              of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">9. Contact</h2>
            <p className="mt-3 text-slate-600">
              Questions about these terms? Visit our{" "}
              <Link href="/contact" className="text-brand hover:underline">
                Contact page
              </Link>
              .
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
