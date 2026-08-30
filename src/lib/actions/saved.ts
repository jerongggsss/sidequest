"use server";

import { db } from "@/db";
import { savedEvents } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleSaveEventAction(eventId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, saved: false, requiresAuth: true };
  }

  const [existing] = await db
    .select({ id: savedEvents.id })
    .from(savedEvents)
    .where(and(eq(savedEvents.userId, user.id), eq(savedEvents.eventId, eventId)))
    .limit(1);

  if (existing) {
    await db.delete(savedEvents).where(eq(savedEvents.id, existing.id));
    revalidatePath("/saved");
    return { ok: true, saved: false };
  }

  await db.insert(savedEvents).values({ userId: user.id, eventId });
  revalidatePath("/saved");
  return { ok: true, saved: true };
}
