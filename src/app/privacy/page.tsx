import type { Metadata } from "next";
import Link from "next/link";
import { AppNavbar } from "@/components/app/AppNavbar";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Privacy Policy · SideQuest",
  description: "How SideQuest collects, uses, and protects your information.",
};

export default async function PrivacyPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-surface">
      <AppNavbar user={user} />

      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-sm font-medium text-brand">Legal</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Privacy Policy</h1>
        <p className="mt-3 text-slate-500">Last updated: August 2026</p>

        <div className="prose-slate prose mt-10 max-w-none [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_p]:text-slate-600 [&_ul]:text-slate-600">

          <p>
            SideQuest (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is a campus event
            discovery platform. This Privacy Policy explains what information we collect, how we use
            it, and your rights regarding that information.
          </p>

          <h2 className="mt-10 font-display text-xl font-semibold text-ink">1. Information We Collect</h2>
          <p className="mt-3 text-slate-600">
            We collect information you provide directly when you use SideQuest:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600">
            <li>
              <strong>Account information</strong> — your name and email address when you register.
              We do not collect your phone number, address, or payment information.
            </li>
            <li>
              <strong>Saved events</strong> — the events you bookmark are stored to your account so
              you can access them later.
            </li>
            <li>
              <strong>Organizer and event content</strong> — if you create an organization or event,
              we store the content you upload, including descriptions, dates, images, and links.
            </li>
            <li>
              <strong>Usage data</strong> — basic, anonymous information about how you interact with
              the platform (pages visited, search queries) to improve the service.
            </li>
          </ul>

          <h2 className="mt-10 font-display text-xl font-semibold text-ink">2. Authentication &amp; Cookies</h2>
          <p className="mt-3 text-slate-600">
            SideQuest uses a secure, HTTP-only session cookie to keep you logged in. We do not use
            third-party tracking cookies or advertising cookies. The session expires automatically
            after a period of inactivity.
          </p>

          <h2 className="mt-10 font-display text-xl font-semibold text-ink">3. How We Use Your Information</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600">
            <li>To provide and maintain your account and saved events.</li>
            <li>To display event and organization information you have created.</li>
            <li>To improve platform features and fix bugs.</li>
            <li>To send essential account-related notifications (e.g., password changes).</li>
          </ul>
          <p className="mt-3 text-slate-600">
            We do not sell your personal information. We do not use your data for advertising
            purposes.
          </p>

          <h2 className="mt-10 font-display text-xl font-semibold text-ink">4. Data Storage &amp; Security</h2>
          <p className="mt-3 text-slate-600">
            Your data is stored on secure cloud infrastructure (Supabase/PostgreSQL). Passwords are
            hashed using industry-standard algorithms and are never stored in plain text. We use
            HTTPS for all data in transit. While we take reasonable precautions, no system is
            perfectly secure — please use a strong, unique password.
          </p>

          <h2 className="mt-10 font-display text-xl font-semibold text-ink">5. Your Rights &amp; Data Deletion</h2>
          <p className="mt-3 text-slate-600">
            You may request access to, correction of, or deletion of your personal data at any time
            by contacting us at the address below. We will process your request within 30 days. Upon
            account deletion, your saved events and profile data are permanently removed. Public
            event and organization content you created may remain on the platform unless you
            separately request its removal.
          </p>

          <h2 className="mt-10 font-display text-xl font-semibold text-ink">6. Third-Party Services</h2>
          <p className="mt-3 text-slate-600">
            SideQuest uses Supabase for database and file storage. Files you upload (event posters,
            organization logos) are stored in Supabase Storage and served via public URLs. Please
            review Supabase&rsquo;s own privacy policy for details on their data handling.
          </p>

          <h2 className="mt-10 font-display text-xl font-semibold text-ink">7. Changes to This Policy</h2>
          <p className="mt-3 text-slate-600">
            We may update this policy from time to time. Significant changes will be announced on
            the platform. Continued use of SideQuest after changes constitutes acceptance of the
            updated policy.
          </p>

          <h2 className="mt-10 font-display text-xl font-semibold text-ink">8. Contact</h2>
          <p className="mt-3 text-slate-600">
            For privacy-related enquiries, please use our{" "}
            <Link href="/contact" className="text-brand hover:underline">
              Contact page
            </Link>
            .
          </p>
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
