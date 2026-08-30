"use client";

import { useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { toggleSaveEventAction } from "@/lib/actions/saved";
import { useRouter } from "next/navigation";

export function SaveButton({
  eventId,
  initialSaved,
  isAuthed,
  size = "md",
  className = "",
}: {
  eventId: string;
  initialSaved: boolean;
  isAuthed: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const dims = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconDims = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save event"}
      disabled={pending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthed) {
          router.push("/login");
          return;
        }
        setSaved((s) => !s);
        startTransition(async () => {
          const res = await toggleSaveEventAction(eventId);
          if (!res.ok) {
            setSaved((s) => !s);
          } else {
            setSaved(res.saved);
          }
        });
      }}
      className={`flex ${dims} shrink-0 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition-transform duration-300 hover:scale-105 active:scale-95 ${className}`}
    >
      <Bookmark
        className={`${iconDims} transition-colors ${saved ? "fill-brand text-brand" : "text-ink"}`}
      />
    </button>
  );
}
