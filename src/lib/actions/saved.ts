"use server";

import { db } from "@/db";
import { savedEvents } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

async function getClientIp() {
  const headersList = await headers();
  return headersList.get("x-forwarded-for") || "unknown";
}

export async function toggleSaveEventAction(eventId: string) {
  try {
    const ip = await getClientIp();
    const rlIp = await checkRateLimit("toggle_save_ip", ip, { max: 100, windowMs: 15 * 60 * 1000 });
    if (!rlIp.success) return { ok: false, saved: false, error: "Too many requests" };

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
  } catch (err: any) {
    console.error(err);
    return { ok: false, saved: false, error: "An unexpected error occurred" };
  }
}
