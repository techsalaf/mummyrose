import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { L as slugify } from "./router-Bg0ak8An.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { f as adminPagesQuery } from "./admin-queries-DArl0zvx.mjs";
import { n as ResourceManager } from "./resource-manager-Atj0jfrY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.pages-3QJlSLqq.js
var import_jsx_runtime = require_jsx_runtime();
function AdminPages() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceManager, {
		title: "Pages",
		description: "Edit About, Terms, Privacy and any other standalone page. Sections are a JSON list of { heading, body, image } blocks and go live the moment you save.",
		table: "pages",
		singular: "Page",
		query: adminPagesQuery,
		searchKeys: ["title", "slug"],
		defaults: {
			is_published: true,
			sections: "[]",
			sort_order: "0"
		},
		prepare: (payload) => ({
			...payload,
			slug: payload.slug ? slugify(String(payload.slug)) : slugify(String(payload.title ?? "")),
			sort_order: Number(payload.sort_order ?? 0)
		}),
		fields: [
			{
				name: "title",
				label: "Page title",
				type: "text",
				placeholder: "About Mummy Rose"
			},
			{
				name: "slug",
				label: "Slug",
				type: "text",
				help: "Used in the URL, e.g. about"
			},
			{
				name: "subtitle",
				label: "Subtitle",
				type: "textarea",
				full: true
			},
			{
				name: "hero_image",
				label: "Hero image",
				type: "image"
			},
			{
				name: "sort_order",
				label: "Order",
				type: "number"
			},
			{
				name: "sections",
				label: "Sections (JSON)",
				type: "json",
				full: true,
				placeholder: "[{\"heading\":\"Our story\",\"body\":\"Paragraph one.\\n\\nParagraph two.\"}]",
				help: "A list of blocks. Each block accepts heading, body and image."
			},
			{
				name: "seo_title",
				label: "SEO title",
				type: "text"
			},
			{
				name: "seo_description",
				label: "SEO description",
				type: "textarea"
			},
			{
				name: "is_published",
				label: "Published",
				type: "switch"
			}
		],
		columns: [
			{
				key: "title",
				label: "Page"
			},
			{
				key: "slug",
				label: "Slug"
			},
			{
				key: "sections",
				label: "Blocks",
				render: (row) => String(Array.isArray(row.sections) ? row.sections.length : 0)
			},
			{
				key: "is_published",
				label: "Status",
				render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: row.is_published ? "default" : "secondary",
					children: row.is_published ? "Live" : "Draft"
				})
			}
		]
	});
}
//#endregion
export { AdminPages as component };
