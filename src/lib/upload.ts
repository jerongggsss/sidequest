import "server-only";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

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

export async function saveUploadedFile(
  file: File,
  folder: string,
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = (file.name.split(".").pop() || "jpg")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const filename = `${folder}/${nanoid(12)}.${ext || "jpg"}`;

  const bytes = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, bytes, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error.message);
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}
