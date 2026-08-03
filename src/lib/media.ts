import { supabase } from "@/integrations/supabase/client";

const BUCKET = "media";
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

function safeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(-80);
}

/** Uploads a file to the media bucket and returns a long-lived signed URL. */
export async function uploadMedia(file: File, folder = "uploads"): Promise<string> {
  if (file.size > 8 * 1024 * 1024) throw new Error("File is larger than 8MB.");
  const path = `${folder}/${Date.now()}-${safeName(file.name)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw new Error(error.message);

  const { data, error: signError } = await supabase.storage.from(BUCKET).createSignedUrl(path, TEN_YEARS);
  if (signError || !data?.signedUrl) throw new Error(signError?.message ?? "Could not create a public link.");
  return data.signedUrl;
}

export type MediaFile = { name: string; path: string; url: string; size: number; updated_at: string | null };

/** Lists everything in the media library with shareable links. */
export async function listMedia(folder = "uploads"): Promise<MediaFile[]> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(folder, { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  if (error) throw new Error(error.message);
  const files = (data ?? []).filter((f) => f.id);
  if (files.length === 0) return [];
  const paths = files.map((f) => `${folder}/${f.name}`);
  const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrls(paths, TEN_YEARS);
  const urlByPath = new Map((signed ?? []).map((s) => [s.path ?? "", s.signedUrl]));
  return files.map((f, i) => ({
    name: f.name,
    path: paths[i],
    url: urlByPath.get(paths[i]) ?? "",
    size: (f.metadata as { size?: number } | null)?.size ?? 0,
    updated_at: f.updated_at ?? null,
  }));
}

export async function deleteMedia(path: string) {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(error.message);
}
