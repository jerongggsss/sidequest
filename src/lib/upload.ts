import "server-only";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import { getCurrentUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for file uploads.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const BUCKET = "sidequest-uploads";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function getClientIp() {
  const headersList = await headers();
  return headersList.get("x-forwarded-for") || "unknown";
}

export async function saveUploadedFile(
  file: File,
  folder: string,
): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const ip = await getClientIp();
  const rlIp = await checkRateLimit("upload_ip", ip, { max: 10, windowMs: 15 * 60 * 1000 });
  if (!rlIp.success) throw new Error("Too many requests. Please try again later.");

  if (!file || file.size === 0) return null;
  if (file.size > MAX_FILE_SIZE) throw new Error("File exceeds 5MB limit");

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) throw new Error("Invalid file type. Only JPG, PNG, and WebP are allowed.");

  // Force clean folder name to prevent traversal
  const cleanFolder = folder.replace(/[^a-z0-9_-]/gi, "");
  const filename = `${cleanFolder}/${nanoid(16)}.${ext}`;

  const bytes = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error.message);
    throw new Error(`Upload failed`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}
