"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteEventAction } from "@/lib/actions/events";

export function StudioEventActions({ eventId }: { eventId: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this event permanently? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteEventAction(eventId);
    });
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleDelete}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
      title="Delete event"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
