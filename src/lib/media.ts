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

/** Uploads a generated blob (e.g. a cropped canvas export) to the library. */
export async function uploadBlob(blob: Blob, name: string, folder = "uploads"): Promise<string> {
  const file = new File([blob], name, { type: blob.type || "image/jpeg" });
  return uploadMedia(file, folder);
}

export type CropSpec = { aspect: number; zoom: number; offsetX: number; offsetY: number };

/**
 * Center-anchored crop of an image URL, returned as a JPEG blob. Offsets are
 * -50..50 percentages of the slack left after zooming.
 */
export async function cropImageUrl(url: string, spec: CropSpec, maxWidth = 1600): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.crossOrigin = "anonymous";
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Could not load the image for cropping."));
    el.src = url;
  });

  const srcAspect = img.width / img.height;
  let sw = img.width;
  let sh = img.height;
  if (srcAspect > spec.aspect) sw = img.height * spec.aspect;
  else sh = img.width / spec.aspect;
  sw /= spec.zoom;
  sh /= spec.zoom;

  const sx = ((img.width - sw) / 2) * (1 + spec.offsetX / 50);
  const sy = ((img.height - sh) / 2) * (1 + spec.offsetY / 50);

  const outW = Math.min(maxWidth, Math.round(sw));
  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = Math.round(outW / spec.aspect);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable in this browser.");
  ctx.drawImage(
    img,
    Math.max(0, sx),
    Math.max(0, sy),
    sw,
    sh,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Crop failed."))), "image/jpeg", 0.9),
  );
}
