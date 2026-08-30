import type { Metadata } from "next";
import Link from "next/link";
import { AppNavbar } from "@/components/app/AppNavbar";
import { getCurrentUser } from "@/lib/auth";
import { Mail, MessageSquare, Shield, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact · SideQuest",
  description: "Get in touch with the SideQuest team.",
};

const topics = [
  {
    icon: HelpCircle,
    title: "General enquiries",
    description: "Questions about how SideQuest works, partnerships, or anything else.",
    href: "mailto:hello@sidequest.my",
    linkLabel: "hello@sidequest.my",
  },
  {
    icon: MessageSquare,
    title: "Event & organiser support",
    description: "Need help with your Studio, an event listing, or organisation profile?",
    href: "mailto:support@sidequest.my",
    linkLabel: "support@sidequest.my",
  },
  {
    icon: Shield,
    title: "Privacy & account deletion",
    description: "Requests to access, correct, or permanently delete your personal data.",
    href: "mailto:privacy@sidequest.my",
    linkLabel: "privacy@sidequest.my",
  },
  {
    icon: Mail,
    title: "Content & moderation",
    description: "Report content that violates our Community Guidelines.",
    href: "mailto:report@sidequest.my",
    linkLabel: "report@sidequest.my",
  },
];

export default async function ContactPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-surface">
      <AppNavbar user={user} />

      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-sm font-medium text-brand">Get in touch</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Contact</h1>
        <p className="mt-3 max-w-lg text-slate-500">
          We&rsquo;re a small team. Pick the right channel below and we&rsquo;ll get back to you as
          soon as we can.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {topics.map((t) => {
            const Icon = t.icon;
            return (
              <a
                key={t.title}
                href={t.href}
                className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-ink group-hover:text-brand transition-colors">{t.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{t.description}</p>
                  <p className="mt-3 text-sm font-medium text-brand">{t.linkLabel}</p>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          <p>
            <strong className="text-ink">Response time:</strong> We aim to respond within 2–3
            business days. For urgent moderation issues, please use the report address above.
          </p>
          <p className="mt-2">
            Looking for answers to common questions? Check the{" "}
            <Link href="/help" className="text-brand hover:underline">
              Help &amp; FAQ
            </Link>{" "}
            page first — it might save you the wait.
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
