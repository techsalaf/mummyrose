import { slugify } from "@/lib/format";
import type { PostListRow } from "@/lib/queries";

export type ContentKind = "recipe" | "article";

/** Recipes live at /recipes/:slug, everything else at /blog/:slug. */
export function contentPath(kind: string | null | undefined, slug: string) {
  return kind === "recipe" ? `/recipes/${slug}` : `/blog/${slug}`;
}

/** Roughly 210 words per minute, floored at one minute. */
export function readingMinutes(content: string | null | undefined, stored?: number | null) {
  if (stored && stored > 0) return stored;
  const words = (content ?? "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 210));
}

/** ISO 8601 duration for Recipe structured data, e.g. 25 -> "PT25M". */
export function isoDuration(minutes: number | null | undefined) {
  if (!minutes || minutes <= 0) return undefined;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `PT${hours ? `${hours}H` : ""}${mins ? `${mins}M` : ""}`;
}

export function formatMinutes(minutes: number | null | undefined) {
  if (!minutes || minutes <= 0) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hours} hr ${mins} min` : `${hours} hr`;
}

export function totalMinutes(prep: number | null | undefined, cook: number | null | undefined) {
  const total = (prep ?? 0) + (cook ?? 0);
  return total > 0 ? total : null;
}

/** Distinct, sorted category list for filter chips. */
export function contentCategories(posts: Pick<PostListRow, "category">[]) {
  return Array.from(new Set(posts.map((p) => p.category?.trim()).filter(Boolean) as string[])).sort();
}

/** Same-category siblings first, then anything else, excluding the current post. */
export function relatedContent<T extends { id: string; category: string | null }>(
  posts: T[],
  current: { id: string; category: string | null | undefined },
  limit = 3,
) {
  const others = posts.filter((p) => p.id !== current.id);
  const sameCategory = others.filter((p) => p.category && p.category === current.category);
  const rest = others.filter((p) => !sameCategory.includes(p));
  return [...sameCategory, ...rest].slice(0, limit);
}

/** Headings pulled from markdown-lite body copy, for a table of contents. */
export function extractHeadings(content: string | null | undefined) {
  if (!content) return [];
  return content
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^#{1,3}\s+/.test(line))
    .map((line) => {
      const text = line.replace(/^#{1,3}\s+/, "").replace(/[*_`]/g, "");
      return { id: slugify(text), text };
    })
    .filter((h) => h.id.length > 0);
}

/** Absolute URL for structured data and share links. */
export function absoluteUrl(siteUrl: string | undefined, path: string) {
  const base = (siteUrl?.trim() || "").replace(/\/$/, "");
  if (!base) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
