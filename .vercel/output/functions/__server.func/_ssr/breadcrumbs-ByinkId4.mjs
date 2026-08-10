import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as useSiteConfig, L as slugify } from "./router-Bg0ak8An.mjs";
import { Rt as ChevronRight } from "../_libs/lucide-react.mjs";
import { i as cn } from "./router-Bg0ak8An2.mjs";
import { t as JsonLd } from "./json-ld-2dnvi90N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/breadcrumbs-ByinkId4.js
var import_jsx_runtime = require_jsx_runtime();
/** Recipes live at /recipes/:slug, everything else at /blog/:slug. */
function contentPath(kind, slug) {
	return kind === "recipe" ? `/recipes/${slug}` : `/blog/${slug}`;
}
/** Roughly 210 words per minute, floored at one minute. */
function readingMinutes(content, stored) {
	if (stored && stored > 0) return stored;
	const words = (content ?? "").trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 210));
}
/** ISO 8601 duration for Recipe structured data, e.g. 25 -> "PT25M". */
function isoDuration(minutes) {
	if (!minutes || minutes <= 0) return void 0;
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return `PT${hours ? `${hours}H` : ""}${mins ? `${mins}M` : ""}`;
}
function formatMinutes(minutes) {
	if (!minutes || minutes <= 0) return null;
	if (minutes < 60) return `${minutes} min`;
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return mins ? `${hours} hr ${mins} min` : `${hours} hr`;
}
function totalMinutes(prep, cook) {
	const total = (prep ?? 0) + (cook ?? 0);
	return total > 0 ? total : null;
}
/** Distinct, sorted category list for filter chips. */
function contentCategories(posts) {
	return Array.from(new Set(posts.map((p) => p.category?.trim()).filter(Boolean))).sort();
}
/** Same-category siblings first, then anything else, excluding the current post. */
function relatedContent(posts, current, limit = 3) {
	const others = posts.filter((p) => p.id !== current.id);
	const sameCategory = others.filter((p) => p.category && p.category === current.category);
	const rest = others.filter((p) => !sameCategory.includes(p));
	return [...sameCategory, ...rest].slice(0, limit);
}
/** Headings pulled from markdown-lite body copy, for a table of contents. */
function extractHeadings(content) {
	if (!content) return [];
	return content.replace(/\r\n/g, "\n").split("\n").map((line) => line.trim()).filter((line) => /^#{1,3}\s+/.test(line)).map((line) => {
		const text = line.replace(/^#{1,3}\s+/, "").replace(/[*_`]/g, "");
		return {
			id: slugify(text),
			text
		};
	}).filter((h) => h.id.length > 0);
}
/** Absolute URL for structured data and share links. */
function absoluteUrl(siteUrl, path) {
	const base = (siteUrl?.trim() || "").replace(/\/$/, "");
	if (!base) return path;
	return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
/**
* Accessible breadcrumb trail plus matching BreadcrumbList structured data.
* The final crumb is the current page and is never a link.
*/
function Breadcrumbs({ items, className }) {
	const { seo } = useSiteConfig();
	const trail = [{
		label: "Home",
		href: "/"
	}, ...items];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonLd, { data: {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: trail.map((crumb, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: crumb.label,
			...crumb.href ? { item: absoluteUrl(seo.site_url, crumb.href) } : {}
		}))
	} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "Breadcrumb",
		className: cn("text-xs text-muted-foreground", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "flex flex-wrap items-center gap-1.5",
			children: trail.map((crumb, index) => {
				const isLast = index === trail.length - 1;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-1.5",
					children: [index > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
						"aria-hidden": true,
						className: "size-3 opacity-50"
					}), crumb.href && !isLast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: crumb.href,
						className: "transition-colors hover:text-accent",
						children: crumb.label
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-current": isLast ? "page" : void 0,
						className: isLast ? "text-foreground" : void 0,
						children: crumb.label
					})]
				}, `${crumb.label}-${index}`);
			})
		})
	})] });
}
//#endregion
export { extractHeadings as a, readingMinutes as c, contentPath as i, relatedContent as l, absoluteUrl as n, formatMinutes as o, contentCategories as r, isoDuration as s, Breadcrumbs as t, totalMinutes as u };
