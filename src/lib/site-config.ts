import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/queries";

/**
 * Every piece of storefront chrome — brand identity, theme tokens, fonts,
 * meta tags, home page copy/imagery and footer details — is stored in
 * `site_settings` and edited from /admin/settings. These defaults are only
 * used until a value is saved.
 */

export type BrandingConfig = {
  name: string;
  tagline: string;
  logo_url: string;
  favicon_url: string;
  announcement: string;
  announcement_enabled: boolean;
};

export type ThemeConfig = {
  primary: string;
  primary_foreground: string;
  accent: string;
  background: string;
  foreground: string;
  ink: string;
  gold: string;
  radius: string;
  heading_font: string;
  body_font: string;
};

export type SeoMetaConfig = {
  title: string;
  description: string;
  keywords: string;
  og_image: string;
  twitter_handle: string;
};

export type HomePromise = { title: string; body: string; icon?: string };

/** Ordered, toggleable home page content blocks. */
export const HOME_SECTIONS = [
  { id: "banners", label: "CMS banners" },
  { id: "promises", label: "Trust badges" },
  { id: "categories", label: "Categories" },
  { id: "featured", label: "Best sellers" },
  { id: "story", label: "Story" },
  { id: "testimonials", label: "Testimonials" },
] as const;

export type HomeSectionId = (typeof HOME_SECTIONS)[number]["id"];

export type HomeConfig = {
  hero_eyebrow: string;
  hero_title: string;
  hero_body: string;
  hero_image: string;
  hero_image_alt: string;
  hero_overlay: number;
  primary_cta_label: string;
  primary_cta_href: string;
  secondary_cta_label: string;
  secondary_cta_href: string;
  section_order: HomeSectionId[];
  promises: HomePromise[];
  promises_enabled: boolean;
  categories_eyebrow: string;
  categories_title: string;
  categories_enabled: boolean;
  featured_eyebrow: string;
  featured_title: string;
  featured_enabled: boolean;
  story_eyebrow: string;
  story_title: string;
  story_body: string;
  story_image: string;
  story_image_alt: string;
  story_cta_label: string;
  story_cta_href: string;
  story_enabled: boolean;
  testimonials_eyebrow: string;
  testimonials_enabled: boolean;
};


export type FooterConfig = {
  blurb: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  facebook: string;
  twitter: string;
  tiktok: string;
  youtube: string;
  copyright: string;
  shop_heading: string;
  business_heading: string;
  newsletter_heading: string;
  newsletter_body: string;
};

export type SiteConfig = {
  branding: BrandingConfig;
  theme: ThemeConfig;
  seo: SeoMetaConfig;
  home: HomeConfig;
  footer: FooterConfig;
};

export const DEFAULT_BRANDING: BrandingConfig = {
  name: "Mummy Rose",
  tagline: "Natural Nigerian Pantry",
  logo_url: "",
  favicon_url: "",
  announcement: "Free delivery on orders over ₦50,000",
  announcement_enabled: true,
};

export const DEFAULT_THEME: ThemeConfig = {
  primary: "",
  primary_foreground: "",
  accent: "",
  background: "",
  foreground: "",
  ink: "",
  gold: "",
  radius: "",
  heading_font: "Fraunces",
  body_font: "Karla",
};

export const DEFAULT_SEO_META: SeoMetaConfig = {
  title: "Mummy Rose — Natural Nigerian Spices, Flours & Infusions",
  description:
    "Small-batch Nigerian spices, stone-milled flours and herbal infusions. Shop retail, or partner with us for wholesale, export and white-label supply.",
  keywords: "",
  og_image: "",
  twitter_handle: "",
};

export const DEFAULT_HOME: HomeConfig = {
  hero_eyebrow: "Natural Nigerian pantry",
  hero_title: "Real food ingredients, milled and blended in small batches",
  hero_body:
    "Spices, stone-milled flours, cereals and herbal infusions sourced directly from Nigerian farms — for home kitchens, restaurants and global distributors.",
  hero_image: "",
  hero_image_alt: "",
  hero_overlay: 35,
  primary_cta_label: "Shop the pantry",
  primary_cta_href: "/products",
  secondary_cta_label: "Wholesale & export",
  secondary_cta_href: "/wholesale",
  section_order: ["banners", "promises", "categories", "featured", "story", "testimonials"],

  promises: [
    { icon: "leaf", title: "100% natural", body: "No preservatives, fillers or artificial colouring — ever." },
    { icon: "package", title: "Small batch", body: "Milled and blended weekly so nothing sits on a shelf." },
    { icon: "truck", title: "Nationwide delivery", body: "Fast dispatch across Nigeria, export worldwide." },
    { icon: "shield", title: "Traceable sourcing", body: "Direct farm partnerships across Nigeria's food belt." },
  ],
  promises_enabled: true,
  categories_eyebrow: "Shop by category",
  categories_title: "Everything from the Nigerian pantry",
  categories_enabled: true,
  featured_eyebrow: "Best sellers",
  featured_title: "Loved in kitchens nationwide",
  featured_enabled: true,
  story_eyebrow: "Our story",
  story_title: "Started in a family kitchen in Lagos",
  story_body:
    "Mummy Rose began with one conviction: Nigerian food deserves ingredients that are clean, honest and consistent. We work directly with farming cooperatives, dry and mill in controlled batches, and pack without preservatives so every jar tastes the way it should.",
  story_image: "",
  story_image_alt: "",

  story_cta_label: "Read our story",
  story_cta_href: "/about",
  story_enabled: true,
  testimonials_eyebrow: "What customers say",
  testimonials_enabled: true,
};

export const DEFAULT_FOOTER: FooterConfig = {
  blurb:
    "Natural spices, stone-milled flours and herbal infusions, sourced from Nigerian farms and packed in small batches for kitchens around the world.",
  email: "hello@mummyrose.com",
  phone: "+234 800 000 0000",
  address: "Lagos, Nigeria",
  instagram: "https://instagram.com/mummyrose",
  facebook: "",
  twitter: "",
  tiktok: "",
  youtube: "",
  copyright: "",
  shop_heading: "Shop",
  business_heading: "Business",
  newsletter_heading: "Stay in the kitchen",
  newsletter_body: "Recipes, restocks and quiet offers. No noise.",
};

export const SITE_CONFIG_DEFAULTS: SiteConfig = {
  branding: DEFAULT_BRANDING,
  theme: DEFAULT_THEME,
  seo: DEFAULT_SEO_META,
  home: DEFAULT_HOME,
  footer: DEFAULT_FOOTER,
};

function merge<T extends object>(defaults: T, saved: unknown): T {
  const out = { ...defaults } as Record<string, unknown>;
  const value = (saved ?? {}) as Record<string, unknown>;
  for (const [key, raw] of Object.entries(value)) {
    if (raw === null || raw === undefined || raw === "") continue;
    out[key] = raw;
  }
  return out as T;
}

export function buildSiteConfig(map: Record<string, Record<string, unknown>> | undefined): SiteConfig {
  return {
    branding: merge(DEFAULT_BRANDING, map?.branding),
    theme: merge(DEFAULT_THEME, map?.theme),
    seo: merge(DEFAULT_SEO_META, map?.seo),
    home: merge(DEFAULT_HOME, map?.home),
    footer: merge(DEFAULT_FOOTER, map?.footer),
  };
}

/** Live storefront configuration; re-renders as soon as an admin saves. */
export function useSiteConfig(): SiteConfig {
  const { data } = useQuery({ ...settingsQuery, staleTime: 30_000 });
  return buildSiteConfig(data);
}

/* ---------------------------------------------------------------- per-page SEO */

export type PageSeo = {
  title: string;
  description: string;
  keywords: string;
  og_image: string;
};

/** Every storefront route whose meta tags can be centrally overridden. */
export const SEO_PAGES: { path: string; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/products", label: "Products" },
  { path: "/recipes", label: "Recipes & journal" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/faq", label: "FAQ" },
  { path: "/wholesale", label: "Wholesale" },
  { path: "/export", label: "Export" },
  { path: "/white-labelling", label: "White labelling" },
  { path: "/corporate-supply", label: "Corporate supply" },
  { path: "/custom-packaging", label: "Custom packaging" },
  { path: "/track-order", label: "Track order" },
  { path: "/cart", label: "Cart" },
  { path: "/checkout", label: "Checkout" },
];

export const EMPTY_PAGE_SEO: PageSeo = { title: "", description: "", keywords: "", og_image: "" };

/** Longest-prefix match so /products/ogiri inherits the /products overrides. */
export function resolvePageSeo(
  pages: Record<string, Partial<PageSeo>> | undefined,
  pathname: string,
): Partial<PageSeo> {
  if (!pages) return {};
  if (pages[pathname]) return pages[pathname];
  const match = Object.keys(pages)
    .filter((p) => p !== "/" && pathname.startsWith(p))
    .sort((a, b) => b.length - a.length)[0];
  return match ? pages[match] : {};
}

/** Meta overrides keyed by route path, edited in /admin/settings → SEO. */
export function usePageSeoMap(): Record<string, Partial<PageSeo>> {
  const { data } = useQuery({ ...settingsQuery, staleTime: 30_000 });
  return (data?.pages_seo ?? {}) as Record<string, Partial<PageSeo>>;
}

/* ------------------------------------------------------------- media metadata */

export type MediaMeta = { alt: string; seo_title: string };

export function useMediaMeta(): Record<string, MediaMeta> {
  const { data } = useQuery({ ...settingsQuery, staleTime: 30_000 });
  return (data?.media_meta ?? {}) as Record<string, MediaMeta>;
}


export const GOOGLE_FONTS = [
  "Fraunces",
  "Karla",
  "Playfair Display",
  "DM Serif Display",
  "Cormorant Garamond",
  "Lora",
  "Libre Baskerville",
  "Space Grotesk",
  "Inter",
  "Manrope",
  "Work Sans",
  "Outfit",
  "Sora",
  "Jost",
  "Nunito Sans",
];

export function googleFontHref(fonts: string[]) {
  const families = Array.from(new Set(fonts.filter(Boolean)))
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@300;400;500;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
