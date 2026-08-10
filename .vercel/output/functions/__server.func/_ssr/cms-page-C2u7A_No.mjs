import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { nt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-Cf-9GAe8.mjs";
import { i as useQuery, n as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { t as RichText } from "./rich-text-LLOFDu3f.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cms-page-C2u7A_No.js
var import_jsx_runtime = require_jsx_runtime();
var PAGE_FIELDS = "id,slug,title,subtitle,hero_image,sections,seo_title,seo_description";
queryOptions({
	queryKey: ["pages"],
	queryFn: async () => {
		const { data, error } = await supabase.from("pages").select(PAGE_FIELDS).eq("is_published", true).order("sort_order");
		if (error) throw error;
		return data ?? [];
	}
});
function pageQuery(slug) {
	return queryOptions({
		queryKey: ["page", slug],
		queryFn: async () => {
			const { data, error } = await supabase.from("pages").select(PAGE_FIELDS).eq("slug", slug).eq("is_published", true).maybeSingle();
			if (error) throw error;
			return data ?? null;
		}
	});
}
queryOptions({
	queryKey: ["redirects"],
	queryFn: async () => {
		const { data, error } = await supabase.from("redirects").select("from_path,to_path").eq("is_active", true);
		if (error) throw error;
		return data ?? [];
	}
});
/**
* Renders a CMS-managed page (title, subtitle, hero, body sections) from the
* `pages` table so staff can edit legal and brand copy without a deploy.
*/
function CmsPage({ slug, eyebrow, heroImage, fallbackTitle, fallbackSubtitle, fallbackSections = [] }) {
	const { data, isLoading } = useQuery(pageQuery(slug));
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-page grid min-h-[50vh] place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-muted-foreground" })
	});
	const saved = Array.isArray(data?.sections) ? data.sections : [];
	const sections = saved.length ? saved : fallbackSections;
	const image = data?.hero_image || heroImage;
	const subtitle = data?.subtitle || fallbackSubtitle;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page max-w-3xl py-12 md:py-16",
		children: [
			eyebrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-accent",
				children: eyebrow
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl",
				children: data?.title ?? fallbackTitle ?? "Page"
			}),
			subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl leading-relaxed text-muted-foreground",
				children: subtitle
			}) : null,
			image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: image,
				alt: data?.title ?? fallbackTitle ?? "",
				className: "mt-10 w-full rounded-lg object-cover",
				loading: "lazy"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 space-y-8",
				children: sections.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "This page has no content yet."
				}) : sections.map((section, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					section.heading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: section.heading
					}) : null,
					section.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: section.image,
						alt: section.heading ?? "",
						className: "mt-3 w-full rounded-lg object-cover",
						loading: "lazy"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, {
						content: section.body,
						className: "mt-2 space-y-2 leading-relaxed text-muted-foreground"
					})
				] }, `${section.heading ?? "section"}-${index}`))
			})
		]
	});
}
//#endregion
export { pageQuery as n, CmsPage as t };
