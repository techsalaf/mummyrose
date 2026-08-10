import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { b as adminTestimonialsQuery } from "./admin-queries-DArl0zvx.mjs";
import { n as ResourceManager } from "./resource-manager-Atj0jfrY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.testimonials-a4l70qyI.js
var import_jsx_runtime = require_jsx_runtime();
function AdminTestimonials() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceManager, {
		title: "Testimonials",
		description: "Customer quotes shown on the home page and business landing pages.",
		table: "testimonials",
		singular: "Testimonial",
		query: adminTestimonialsQuery,
		searchKeys: ["author", "quote"],
		defaults: {
			is_published: true,
			rating: "5",
			sort_order: "0"
		},
		prepare: (payload) => ({
			...payload,
			rating: Number(payload.rating ?? 5),
			sort_order: Number(payload.sort_order ?? 0)
		}),
		fields: [
			{
				name: "author",
				label: "Author",
				type: "text"
			},
			{
				name: "role",
				label: "Role / location",
				type: "text"
			},
			{
				name: "rating",
				label: "Rating (1-5)",
				type: "number"
			},
			{
				name: "sort_order",
				label: "Sort order",
				type: "number"
			},
			{
				name: "quote",
				label: "Quote",
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
				key: "author",
				label: "Author"
			},
			{
				key: "role",
				label: "Role"
			},
			{
				key: "rating",
				label: "Rating"
			},
			{
				key: "is_published",
				label: "Status",
				render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: row.is_published ? "default" : "secondary",
					children: row.is_published ? "Live" : "Hidden"
				})
			}
		]
	});
}
//#endregion
export { AdminTestimonials as component };
