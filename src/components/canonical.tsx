import { useEffect } from "react";

/**
 * Lets a leaf route override the self-referencing canonical URL that
 * SiteChrome writes (used when an editor sets a canonical URL on a post).
 */
export function useCanonicalOverride(url: string | null | undefined) {
  useEffect(() => {
    const href = url?.trim();
    if (!href) return;
    const el = document.head.querySelector<HTMLLinkElement>('link[data-cms="canonical"]');
    if (el) el.href = href;
  }, [url]);
}
