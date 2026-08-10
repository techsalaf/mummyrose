import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { L as slugify, k as formatDate } from "./router-Bg0ak8An.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { p as adminPostsQuery } from "./admin-queries-DArl0zvx.mjs";
import { n as ResourceManager } from "./resource-manager-Atj0jfrY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.posts-FRWRVTfv.js
var import_jsx_runtime = require_jsx_runtime();
function AdminPosts() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceManager, {
		title: "Journal & recipes",
		description: "Write, draft and schedule recipes, stories and guides. Drafts stay hidden from the storefront.",
		table: "posts",
		singular: "Post",
		query: adminPostsQuery,
		searchKeys: [
			"title",
			"slug",
			"category"
		],
		defaults: {
			kind: "recipe",
			is_published: false
		},
		prepare: (payload) => ({
			...payload,
			slug: payload.slug ? String(payload.slug) : slugify(String(payload.title ?? ""))
		}),
		fields: [
			{
				name: "title",
				label: "Title",
				type: "text"
			},
			{
				name: "slug",
				label: "Slug",
				type: "text"
			},
			{
				name: "kind",
				label: "Type",
				type: "select",
				options: [{
					value: "recipe",
					label: "Recipe"
				}, {
					value: "article",
					label: "Article"
				}]
			},
			{
				name: "category",
				label: "Category",
				type: "text",
				placeholder: "Soups, Baking, Wellness"
			},
			{
				name: "author",
				label: "Author",
				type: "text"
			},
			{
				name: "published_at",
				label: "Publish date",
				type: "date"
			},
			{
				name: "cover_image",
				label: "Cover image",
				type: "image"
			},
			{
				name: "excerpt",
				label: "Excerpt",
				type: "textarea"
			},
			{
				name: "content",
				label: "Content",
				type: "richtext",
				placeholder: "Markdown-style body copy"
			},
			{
				name: "tags",
				label: "Tags",
				type: "tags",
				placeholder: "jollof, rice, weeknight"
			},
			{
				name: "prep_minutes",
				label: "Prep time (minutes)",
				type: "number"
			},
			{
				name: "cook_minutes",
				label: "Cook time (minutes)",
				type: "number"
			},
			{
				name: "servings",
				label: "Servings",
				type: "text",
				placeholder: "4 people"
			},
			{
				name: "difficulty",
				label: "Difficulty",
				type: "select",
				options: [
					{
						value: "Easy",
						label: "Easy"
					},
					{
						value: "Medium",
						label: "Medium"
					},
					{
						value: "Advanced",
						label: "Advanced"
					}
				]
			},
			{
				name: "ingredients",
				label: "Ingredients",
				type: "tags",
				full: true,
				help: "One ingredient per entry, separated by commas."
			},
			{
				name: "instructions",
				label: "Method steps",
				type: "tags",
				full: true,
				help: "One step per entry, separated by commas. Steps are numbered automatically."
			},
			{
				name: "tips",
				label: "Kitchen tips",
				type: "tags",
				full: true
			},
			{
				name: "serving_suggestions",
				label: "Serving suggestions",
				type: "textarea",
				full: true
			},
			{
				name: "related_product_ids",
				label: "Related product IDs",
				type: "tags",
				full: true,
				help: "Paste product IDs to show a Shop this recipe block."
			},
			{
				name: "seo_title",
				label: "SEO title",
				type: "text"
			},
			{
				name: "seo_keywords",
				label: "SEO keywords",
				type: "text"
			},
			{
				name: "canonical_url",
				label: "Canonical URL",
				type: "text",
				help: "Only set this if the piece was first published elsewhere."
			},
			{
				name: "reading_minutes",
				label: "Reading time (minutes)",
				type: "number"
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
			},
			{
				name: "is_featured",
				label: "Featured",
				type: "switch"
			}
		],
		columns: [
			{
				key: "title",
				label: "Title"
			},
			{
				key: "kind",
				label: "Type"
			},
			{
				key: "category",
				label: "Category"
			},
			{
				key: "published_at",
				label: "Publish date",
				render: (row) => formatDate(row.published_at)
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
export { AdminPosts as component };
