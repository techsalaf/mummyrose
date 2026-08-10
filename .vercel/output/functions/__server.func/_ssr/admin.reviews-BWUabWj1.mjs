import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { g as adminReviewsQuery } from "./admin-queries-DArl0zvx.mjs";
import { n as ResourceManager } from "./resource-manager-Atj0jfrY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.reviews-BWUabWj1.js
var import_jsx_runtime = require_jsx_runtime();
function AdminReviews() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceManager, {
		title: "Reviews & ratings",
		description: "Approve customer reviews before they appear on product pages. Flip Approved on to publish instantly.",
		table: "product_reviews",
		singular: "Review",
		query: adminReviewsQuery,
		searchKeys: [
			"author_name",
			"title",
			"body"
		],
		defaults: {
			is_approved: false,
			rating: "5"
		},
		prepare: (payload) => ({
			...payload,
			rating: Number(payload.rating ?? 5)
		}),
		fields: [
			{
				name: "author_name",
				label: "Author",
				type: "text"
			},
			{
				name: "rating",
				label: "Rating (1-5)",
				type: "number"
			},
			{
				name: "title",
				label: "Headline",
				type: "text"
			},
			{
				name: "body",
				label: "Review",
				type: "textarea",
				full: true
			},
			{
				name: "is_approved",
				label: "Approved",
				type: "switch"
			}
		],
		columns: [
			{
				key: "author_name",
				label: "Author"
			},
			{
				key: "product",
				label: "Product",
				render: (row) => String(row.products?.name ?? "—")
			},
			{
				key: "rating",
				label: "Rating",
				render: (row) => `${row.rating} ★`
			},
			{
				key: "title",
				label: "Headline"
			},
			{
				key: "is_approved",
				label: "Status",
				render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: row.is_approved ? "default" : "secondary",
					children: row.is_approved ? "Published" : "Pending"
				})
			}
		]
	});
}
//#endregion
export { AdminReviews as component };
