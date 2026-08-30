"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, ArrowRight, ExternalLink } from "lucide-react";
import { ImageUploadField } from "@/components/studio/ImageUploadField";
import {
  createOrganizationAction,
  updateOrganizationAction,
} from "@/lib/actions/organizations";
import Link from "next/link";

type Uni = { id: string; name: string };

type OrgEditorProps = {
  orgId?: string;
  slug?: string;
  universities: Uni[];
  initial?: {
    name?: string;
    description?: string;
    website?: string;
    instagram?: string;
    universityId?: string;
    logoUrl?: string | null;
    bannerUrl?: string | null;
  };
};

export function OrgEditor({ orgId, slug, universities, initial = {} }: OrgEditorProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initial.logoUrl ?? null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(initial.bannerUrl ?? null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const isEdit = !!orgId;

  function handleSubmit() {
    const form = formRef.current;
    if (!form) return;
    const formData = new FormData(form);

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        if (isEdit && orgId) {
          await updateOrganizationAction(orgId, formData);
          setSuccess("Organization updated.");
          router.refresh();
        } else {
          await createOrganizationAction(formData);
          // redirect handled by action
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.message?.includes("NEXT_REDIRECT")) return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-colors";
  const labelCls = "flex flex-col gap-1.5";
  const labelSpan = "text-xs font-semibold uppercase tracking-wide text-slate-500";

  return (
    <div className="mx-auto max-w-2xl px-5 py-8 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {isEdit ? "Edit Organization" : "New Organization"}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {isEdit
              ? "Update your organization profile."
              : "Create a profile for your club, council, or society."}
          </p>
        </div>
        {isEdit && slug && (
          <Link
            href={`/organization/${slug}`}
            target="_blank"
            className="flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            View page <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div>
      )}
      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Check className="h-4 w-4 shrink-0" /> {success}
        </div>
      )}

      <form ref={formRef} className="flex flex-col gap-6">
        {/* Identity */}
        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Identity</p>

          <label className={labelCls}>
            <span className={labelSpan}>Organization Name *</span>
            <input
              name="name"
              defaultValue={initial.name}
              required
              placeholder="e.g. UTM Robotics Club"
              className={inputCls}
            />
          </label>

          <label className={labelCls}>
            <span className={labelSpan}>Description</span>
            <textarea
              name="description"
              defaultValue={initial.description}
              rows={4}
              placeholder="Brief description of your organization and what you do…"
              className={`${inputCls} resize-y`}
            />
          </label>

          <label className={labelCls}>
            <span className={labelSpan}>University</span>
            <select name="universityId" defaultValue={initial.universityId ?? ""} className={inputCls}>
              <option value="">— Any university —</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </label>
        </section>

        {/* Contact */}
        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Contact &amp; Links</p>

          <label className={labelCls}>
            <span className={labelSpan}>Website</span>
            <input
              name="website"
              type="url"
              defaultValue={initial.website}
              placeholder="https://yourclub.com"
              className={inputCls}
            />
          </label>

          <label className={labelCls}>
            <span className={labelSpan}>Instagram</span>
            <div className="flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
              <span className="pl-4 text-sm text-slate-400">@</span>
              <input
                name="instagram"
                defaultValue={initial.instagram?.replace(/^@/, "")}
                placeholder="your_club"
                className="w-full rounded-xl bg-transparent px-2 py-3 text-sm text-ink focus:outline-none"
              />
            </div>
          </label>
        </section>

        {/* Media */}
        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Media</p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <ImageUploadField
              name="logo"
              label="Logo"
              hint="Square image recommended"
              currentUrl={logoPreview}
              aspectClass="aspect-square"
              onChange={setLogoPreview}
            />
            <ImageUploadField
              name="banner"
              label="Banner"
              hint="Wide cover image for your profile"
              currentUrl={bannerPreview}
              aspectClass="aspect-[16/9]"
              onChange={setBannerPreview}
            />
          </div>
        </section>

        {/* Submit */}
        <div>
          <button
            type="button"
            disabled={pending}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark hover:-translate-y-0.5 disabled:opacity-50"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            {isEdit ? "Save Changes" : "Create Organization"}
          </button>
        </div>
      </form>
    </div>
  );
}
