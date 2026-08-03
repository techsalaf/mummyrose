import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  useSiteConfig,
  usePageSeoMap,
  resolvePageSeo,
  googleFontHref,
  DEFAULT_BRANDING,
} from "@/lib/site-config";


function setMeta(attr: "name" | "property", key: string, content: string) {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string, id: string) {
  if (!href) return;
  let el = document.head.querySelector<HTMLLinkElement>(`link[data-cms="${id}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    el.dataset.cms = id;
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Applies the CMS-managed brand identity to the live document: theme tokens,
 * fonts, favicon and default meta tags. Rendered once from the root route.
 */
export function SiteChrome() {
  const { branding, theme, seo } = useSiteConfig();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const rules: string[] = [];
    const push = (name: string, value: string) => {
      if (value?.trim()) rules.push(`${name}: ${value.trim()};`);
    };
    push("--primary", theme.primary);
    push("--primary-foreground", theme.primary_foreground);
    push("--accent", theme.accent);
    push("--background", theme.background);
    push("--foreground", theme.foreground);
    push("--ink", theme.ink);
    push("--gold", theme.gold);
    push("--radius", theme.radius);

    const heading = theme.heading_font?.trim();
    const body = theme.body_font?.trim();
    const css = [
      rules.length ? `:root{${rules.join("")}}` : "",
      heading
        ? `.font-display,h1,h2,h3,.eyebrow{font-family:"${heading}",ui-serif,Georgia,serif;}`
        : "",
      body ? `body{font-family:"${body}",ui-sans-serif,system-ui,sans-serif;}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    let style = document.getElementById("cms-theme") as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = "cms-theme";
      document.head.appendChild(style);
    }
    style.textContent = css;

    if (heading || body) {
      setLink("stylesheet", googleFontHref([heading, body].filter(Boolean) as string[]), "fonts");
    }
  }, [theme]);

  useEffect(() => {
    if (branding.favicon_url) {
      setLink("icon", branding.favicon_url, "favicon");
      document.head
        .querySelectorAll<HTMLLinkElement>('link[rel="icon"]:not([data-cms])')
        .forEach((el) => el.remove());
    }
  }, [branding.favicon_url]);

  useEffect(() => {
    const name = branding.name?.trim() || DEFAULT_BRANDING.name;
    if (name !== DEFAULT_BRANDING.name && document.title.includes(DEFAULT_BRANDING.name)) {
      document.title = document.title.split(DEFAULT_BRANDING.name).join(name);
    }
    setMeta("property", "og:site_name", name);
    if (seo.description) {
      setMeta("name", "description", seo.description);
      setMeta("property", "og:description", seo.description);
    }
    if (seo.keywords) setMeta("name", "keywords", seo.keywords);
    if (seo.og_image) {
      setMeta("property", "og:image", seo.og_image);
      setMeta("name", "twitter:image", seo.og_image);
    }
    if (seo.twitter_handle) setMeta("name", "twitter:site", seo.twitter_handle);
  }, [branding.name, seo, pathname]);

  return null;
}
