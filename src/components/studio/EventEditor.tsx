"use client";

import { useReducer, useTransition, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Loader2,
  Link2,
  Copy,
  CheckCheck,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { EventPageView } from "@/components/event/EventPageView";
import { ImageUploadField } from "@/components/studio/ImageUploadField";
import { createEventAction, updateEventAction, deleteEventAction } from "@/lib/actions/events";
import type { organizations, universities } from "@/db/schema";

type Org = Pick<typeof organizations.$inferSelect, "id" | "name" | "logoUrl" | "verified" | "slug" | "description">;
type Uni = Pick<typeof universities.$inferSelect, "id" | "name">;

export type EventEditorProps = {
  eventId?: string;
  slug?: string;
  status?: "draft" | "published" | "archived";
  userOrgs: Org[];
  universities: Uni[];
  initial?: Partial<State>;
};

type State = {
  name: string;
  tagline: string;
  category: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  locationType: string;
  price: string;
  isFree: boolean;
  eligibility: string;
  registrationDeadline: string;
  registrationUrl: string;
  tags: string;
  organizationId: string;
  universityId: string;
  posterUrl: string | null;
  bannerUrl: string | null;
};

type Action =
  | { type: "SET"; field: keyof State; value: string | boolean | null }
  | { type: "RESET"; state: State };

const defaultState: State = {
  name: "",
  tagline: "",
  category: "Social",
  description: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  location: "",
  locationType: "physical",
  price: "",
  isFree: true,
  eligibility: "",
  registrationDeadline: "",
  registrationUrl: "",
  tags: "",
  organizationId: "",
  universityId: "",
  posterUrl: null,
  bannerUrl: null,
};

function reducer(state: State, action: Action): State {
  if (action.type === "SET") return { ...state, [action.field]: action.value };
  if (action.type === "RESET") return action.state;
  return state;
}

function set(dispatch: React.Dispatch<Action>, field: keyof State) {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    dispatch({ type: "SET", field, value: e.target.value });
}

export function EventEditor({
  eventId,
  slug,
  status,
  userOrgs,
  universities,
  initial = {},
}: EventEditorProps) {
  const [state, dispatch] = useReducer(reducer, { ...defaultState, ...initial });
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const isEdit = !!eventId;
  const org = userOrgs.find((o) => o.id === state.organizationId) ?? null;
  const uni = universities.find((u) => u.id === state.universityId) ?? null;
  const publicUrl = slug ? `${typeof window !== "undefined" ? window.location.origin : ""}/event/${slug}` : null;

  function handleSubmit(intent: "save" | "publish" | "archive" | "unarchive") {
    const form = formRef.current;
    if (!form) return;
    const formData = new FormData(form);
    formData.set("intent", intent);

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        if (isEdit && eventId) {
          const result = await updateEventAction(eventId, formData);
          if (result?.slug) {
            setSuccess(
              intent === "publish"
                ? "Event published! Share the link below."
                : intent === "archive"
                ? "Event archived."
                : "Changes saved.",
            );
            router.refresh();
          }
        } else {
          // createEventAction redirects on success — that causes a special throw
          await createEventAction(formData);
        }
      } catch (err: unknown) {
        // Next.js redirect() throws internally — it's not a real error
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("NEXT_REDIRECT") || msg.includes("redirect")) return;
        setError(msg || "Something went wrong. Please try again.");
      }
    });
  }

  async function handleCopyLink() {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select input
    }
  }

  async function handleDelete() {
    if (!eventId) return;
    if (!confirm("Delete this event permanently? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteEventAction(eventId);
    });
  }

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-colors";
  const labelCls = "flex flex-col gap-1.5";
  const labelSpan = "text-xs font-semibold uppercase tracking-wide text-slate-500";

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* ────────── LEFT: FORM ────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-5 py-8 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink">
                {isEdit ? "Edit Event" : "New Event"}
              </h1>
              {isEdit && status && (
                <p className="mt-1 text-sm text-slate-500">
                  Status:{" "}
                  <span className={
                    status === "published" ? "font-semibold text-emerald-600" :
                    status === "draft" ? "font-semibold text-amber-600" :
                    "font-semibold text-slate-500"
                  }>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </p>
              )}
            </div>
            {/* Mobile preview toggle */}
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 lg:hidden"
            >
              {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <Check className="h-4 w-4 shrink-0" /> {success}
            </div>
          )}

          {/* Copy link (published only) */}
          {status === "published" && publicUrl && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <Link2 className="h-4 w-4 shrink-0 text-brand" />
              <p className="min-w-0 flex-1 truncate text-sm text-slate-600">{publicUrl}</p>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                {copied ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          )}

          <form ref={formRef} className="flex flex-col gap-6">
            {/* BASICS */}
            <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Basics</p>

              <label className={labelCls}>
                <span className={labelSpan}>Event Name *</span>
                <input
                  name="name"
                  value={state.name}
                  onChange={set(dispatch, "name")}
                  placeholder="e.g. Annual Hackathon 2025"
                  required
                  className={inputCls}
                />
              </label>

              <label className={labelCls}>
                <span className={labelSpan}>Tagline</span>
                <input
                  name="tagline"
                  value={state.tagline}
                  onChange={set(dispatch, "tagline")}
                  placeholder="A short hook for your event"
                  className={inputCls}
                />
              </label>

              <label className={labelCls}>
                <span className={labelSpan}>Category</span>
                <select
                  name="category"
                  value={state.category}
                  onChange={set(dispatch, "category")}
                  className={inputCls}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label className={labelCls}>
                <span className={labelSpan}>Organization</span>
                <select
                  name="organizationId"
                  value={state.organizationId}
                  onChange={set(dispatch, "organizationId")}
                  className={inputCls}
                >
                  <option value="">— No organization —</option>
                  {userOrgs.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </label>

              <label className={labelCls}>
                <span className={labelSpan}>University</span>
                <select
                  name="universityId"
                  value={state.universityId}
                  onChange={set(dispatch, "universityId")}
                  className={inputCls}
                >
                  <option value="">— Any university —</option>
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </label>
            </section>

            {/* DATE & TIME */}
            <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Date &amp; Time</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <label className={labelCls}>
                  <span className={labelSpan}>Event Date</span>
                  <input
                    name="eventDate"
                    type="date"
                    value={state.eventDate}
                    onChange={set(dispatch, "eventDate")}
                    className={inputCls}
                  />
                </label>
                <label className={labelCls}>
                  <span className={labelSpan}>Start Time</span>
                  <input
                    name="startTime"
                    type="time"
                    value={state.startTime}
                    onChange={set(dispatch, "startTime")}
                    className={inputCls}
                  />
                </label>
                <label className={labelCls}>
                  <span className={labelSpan}>End Time</span>
                  <input
                    name="endTime"
                    type="time"
                    value={state.endTime}
                    onChange={set(dispatch, "endTime")}
                    className={inputCls}
                  />
                </label>
              </div>
            </section>

            {/* LOCATION */}
            <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Location</p>

              <div className="flex gap-3">
                {(["physical", "online"] as const).map((t) => (
                  <label
                    key={t}
                    className={`flex flex-1 cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                      state.locationType === t
                        ? "border-brand bg-brand/5 text-brand"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="locationType"
                      value={t}
                      checked={state.locationType === t}
                      onChange={set(dispatch, "locationType")}
                      className="hidden"
                    />
                    {t === "physical" ? "📍 Physical" : "🌐 Online"}
                  </label>
                ))}
              </div>

              <label className={labelCls}>
                <span className={labelSpan}>
                  {state.locationType === "online" ? "Meeting link or platform" : "Venue / Address"}
                </span>
                <input
                  name="location"
                  value={state.location}
                  onChange={set(dispatch, "location")}
                  placeholder={state.locationType === "online" ? "e.g. Zoom, Google Meet link…" : "e.g. DK5, Faculty of Engineering, UTM"}
                  className={inputCls}
                />
              </label>
            </section>

            {/* PRICING */}
            <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Pricing</p>

              <div className="flex gap-3">
                {([true, false] as const).map((isFreeVal) => (
                  <label
                    key={String(isFreeVal)}
                    className={`flex flex-1 cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                      state.isFree === isFreeVal
                        ? "border-brand bg-brand/5 text-brand"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="isFree"
                      value={String(isFreeVal)}
                      checked={state.isFree === isFreeVal}
                      onChange={() => dispatch({ type: "SET", field: "isFree", value: isFreeVal })}
                      className="hidden"
                    />
                    {isFreeVal ? "🎟 Free" : "💳 Paid"}
                  </label>
                ))}
              </div>

              {!state.isFree && (
                <label className={labelCls}>
                  <span className={labelSpan}>Price</span>
                  <input
                    name="price"
                    value={state.price}
                    onChange={set(dispatch, "price")}
                    placeholder="e.g. RM 20 / RM 10 students"
                    className={inputCls}
                  />
                </label>
              )}
            </section>

            {/* REGISTRATION */}
            <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Registration</p>

              <label className={labelCls}>
                <span className={labelSpan}>Registration URL</span>
                <input
                  name="registrationUrl"
                  type="url"
                  value={state.registrationUrl}
                  onChange={set(dispatch, "registrationUrl")}
                  placeholder="https://forms.google.com/…"
                  className={inputCls}
                />
                <span className="text-xs text-slate-400">
                  Link to Google Forms, Microsoft Forms, Eventbrite, your website, etc.
                </span>
              </label>

              <label className={labelCls}>
                <span className={labelSpan}>Registration Deadline</span>
                <input
                  name="registrationDeadline"
                  type="date"
                  value={state.registrationDeadline}
                  onChange={set(dispatch, "registrationDeadline")}
                  className={inputCls}
                />
              </label>

              <label className={labelCls}>
                <span className={labelSpan}>Eligibility</span>
                <input
                  name="eligibility"
                  value={state.eligibility}
                  onChange={set(dispatch, "eligibility")}
                  placeholder="e.g. Open to all UTM students"
                  className={inputCls}
                />
              </label>
            </section>

            {/* DESCRIPTION */}
            <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Description</p>

              <label className={labelCls}>
                <span className={labelSpan}>About this event</span>
                <textarea
                  name="description"
                  value={state.description}
                  onChange={set(dispatch, "description")}
                  rows={8}
                  placeholder={"Tell people what to expect.\n\nUse **bold** for emphasis.\nUse - bullet points for lists.\nUse # Heading for sections."}
                  className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
                />
                <span className="text-xs text-slate-400">
                  Supports **bold**, # headings, - bullet lists, and [link](url).
                </span>
              </label>

              <label className={labelCls}>
                <span className={labelSpan}>Tags</span>
                <input
                  name="tags"
                  value={state.tags}
                  onChange={set(dispatch, "tags")}
                  placeholder="e.g. hackathon, coding, prize"
                  className={inputCls}
                />
              </label>
            </section>

            {/* MEDIA */}
            <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Media</p>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <ImageUploadField
                  name="poster"
                  label="Poster"
                  hint="Primary event artwork (portrait recommended)"
                  currentUrl={state.posterUrl}
                  aspectClass="aspect-[4/5]"
                  onChange={(url) => dispatch({ type: "SET", field: "posterUrl", value: url })}
                />
                <ImageUploadField
                  name="banner"
                  label="Banner (Optional)"
                  hint="Wide atmospheric background image"
                  currentUrl={state.bannerUrl}
                  aspectClass="aspect-[16/9]"
                  onChange={(url) => dispatch({ type: "SET", field: "bannerUrl", value: url })}
                />
              </div>
            </section>

            {/* ACTIONS */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={pending}
                onClick={() => handleSubmit("save")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save Draft
              </button>

              {(!status || status === "draft") && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => handleSubmit("publish")}
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  Publish
                </button>
              )}

              {status === "published" && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => handleSubmit("archive")}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  Archive
                </button>
              )}

              {status === "archived" && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => handleSubmit("unarchive")}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  Restore to Draft
                </button>
              )}

              {isEdit && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={handleDelete}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-50 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* ────────── RIGHT: LIVE PREVIEW ────────── */}
      <div className={`border-l border-slate-200 bg-surface lg:w-[480px] lg:shrink-0 ${showPreview ? "block" : "hidden lg:block"}`}>
        <div className="sticky top-0 h-screen overflow-y-auto">
          <div className="border-b border-slate-200 bg-white px-4 py-3">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              <Eye className="h-3.5 w-3.5" /> Live Preview
            </p>
          </div>
          <div className="origin-top scale-[0.88] transform-gpu">
            <EventPageView
              name={state.name || "Event Name"}
              tagline={state.tagline || undefined}
              category={state.category}
              description={state.description || undefined}
              eventDate={state.eventDate || undefined}
              startTime={state.startTime || undefined}
              endTime={state.endTime || undefined}
              location={state.location || undefined}
              locationType={state.locationType}
              price={state.price || undefined}
              isFree={state.isFree}
              eligibility={state.eligibility || undefined}
              registrationDeadline={state.registrationDeadline || undefined}
              registrationUrl={state.registrationUrl || undefined}
              posterUrl={state.posterUrl}
              bannerUrl={state.bannerUrl}
              universityName={uni?.name}
              organization={
                org
                  ? {
                      name: org.name,
                      slug: org.slug,
                      verified: org.verified,
                      logoUrl: org.logoUrl,
                      description: org.description,
                    }
                  : null
              }
              compact
            />
          </div>
        </div>
      </div>
    </div>
  );
}
