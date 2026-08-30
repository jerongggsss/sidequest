import { db } from "@/db";
import { rateLimits } from "@/db/schema";
import { eq } from "drizzle-orm";

type RateLimitOptions = {
  max: number;
  windowMs: number;
};

export async function checkRateLimit(
  action: string,
  identifier: string,
  options: RateLimitOptions,
): Promise<{ success: boolean }> {
  const key = `${action}:${identifier}`;
  const now = new Date();

  // Try to fetch existing limit
  const [existing] = await db
    .select()
    .from(rateLimits)
    .where(eq(rateLimits.key, key))
    .limit(1);

  if (!existing) {
    // First request
    await db.insert(rateLimits).values({
      key,
      points: 1,
      resetAt: new Date(now.getTime() + options.windowMs),
    }).onConflictDoNothing();
    return { success: true };
  }

  if (now > existing.resetAt) {
    // Window expired, reset
    await db
      .update(rateLimits)
      .set({ points: 1, resetAt: new Date(now.getTime() + options.windowMs) })
      .where(eq(rateLimits.key, key));
    return { success: true };
  }

  if (existing.points >= options.max) {
    // Rate limit exceeded
    return { success: false };
  }

  // Increment points
  await db
    .update(rateLimits)
    .set({ points: existing.points + 1 })
    .where(eq(rateLimits.key, key));

  return { success: true };
}
