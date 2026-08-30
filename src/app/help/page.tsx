import type { Metadata } from "next";
import Link from "next/link";
import { AppNavbar } from "@/components/app/AppNavbar";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Help · SideQuest",
  description: "Frequently asked questions about SideQuest — discovering events, Studio, and your account.",
};

const faqs: { category: string; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    category: "Discovering Events",
    items: [
      {
        q: "How do I find events on SideQuest?",
        a: (
          <>
            Head to the{" "}
            <Link href="/discover" className="text-brand hover:underline">
              Discover
            </Link>{" "}
            page. You can search by keyword, filter by category, university, price, or event type
            (in-person vs. online).
          </>
        ),
      },
      {
        q: "Are all events free?",
        a: "Some events are free and some are paid. Every event listing clearly shows whether it is free or indicates the price. Use the 'Free only' filter on Discover to see only free events.",
      },
      {
        q: "Can I see events from other universities?",
        a: "Yes. SideQuest lists events from all participating universities. You can filter by university on the Discover page to narrow results.",
      },
    ],
  },
  {
    category: "Saving Events",
    items: [
      {
        q: "How do I save an event?",
        a: "Click the bookmark icon on any event card or event detail page. You need to be logged in to save events.",
      },
      {
        q: "Where can I find my saved events?",
        a: (
          <>
            Visit your{" "}
            <Link href="/saved" className="text-brand hover:underline">
              Saved Events
            </Link>{" "}
            page from the navigation bar.
          </>
        ),
      },
      {
        q: "Do saved events expire?",
        a: "No. Saved events remain in your list indefinitely, even after the event has passed.",
      },
    ],
  },
  {
    category: "Creating Events & Studio",
    items: [
      {
        q: "How do I create an event?",
        a: (
          <>
            Log in and go to{" "}
            <Link href="/studio" className="text-brand hover:underline">
              Studio
            </Link>
            . From there, navigate to &ldquo;My Events&rdquo; and click &ldquo;New Event&rdquo;.
            Fill in the event details, upload a poster, and publish when ready.
          </>
        ),
      },
      {
        q: "Do I need an organisation to create events?",
        a: "No. You can publish events as an individual organiser. However, creating an organisation gives your events a verified profile page and builds trust with students.",
      },
      {
        q: "How do I get my organisation verified?",
        a: (
          <>
            Create your organisation profile in{" "}
            <Link href="/studio/organizations" className="text-brand hover:underline">
              Studio → Organisations
            </Link>
            , then contact us via the{" "}
            <Link href="/contact" className="text-brand hover:underline">
              Contact page
            </Link>{" "}
            to request verification. We verify official clubs, societies, and student councils.
          </>
        ),
      },
      {
        q: "Can I edit or unpublish an event after publishing?",
        a: "Yes. Go to Studio → My Events, open the event, and update any details or change its status to Draft or Archived.",
      },
    ],
  },
  {
    category: "Accounts",
    items: [
      {
        q: "How do I create an account?",
        a: (
          <>
            Click{" "}
            <Link href="/register" className="text-brand hover:underline">
              Create account
            </Link>{" "}
            and enter your name, university email address, and a password.
          </>
        ),
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: (
          <>
            Password reset is not yet self-service. Please{" "}
            <Link href="/contact" className="text-brand hover:underline">
              contact us
            </Link>{" "}
            and we will help you regain access.
          </>
        ),
      },
      {
        q: "How do I delete my account?",
        a: (
          <>
            Account deletion is handled on request. Please reach out via the{" "}
            <Link href="/contact" className="text-brand hover:underline">
              Contact page
            </Link>{" "}
            and we will process your deletion within 30 days.
          </>
        ),
      },
    ],
  },
];

export default async function HelpPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-surface">
      <AppNavbar user={user} />

      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-sm font-medium text-brand">Support</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Help &amp; FAQ</h1>
        <p className="mt-3 text-slate-500">Common questions about using SideQuest.</p>

        <div className="mt-12 space-y-12">
          {faqs.map((section) => (
            <section key={section.category}>
              <h2 className="font-display text-xl font-semibold text-ink">{section.category}</h2>
              <div className="mt-5 space-y-6">
                {section.items.map((item) => (
                  <div key={item.q} className="rounded-2xl border border-slate-200 bg-white p-6">
                    <p className="font-semibold text-ink">{item.q}</p>
                    <p className="mt-2 text-sm text-slate-600">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">Still have a question?</p>
          <p className="mt-2 text-sm text-slate-500">
            We&rsquo;re happy to help. Send us a message and we&rsquo;ll get back to you.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Contact us
          </Link>
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
