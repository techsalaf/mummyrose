import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { o as adminFaqsQuery } from "./admin-queries-DArl0zvx.mjs";
import { n as ResourceManager } from "./resource-manager-Atj0jfrY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.faqs-BVQAnRBW.js
var import_jsx_runtime = require_jsx_runtime();
function AdminFaqs() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceManager, {
		title: "FAQs",
		description: "Questions shown on the public FAQ page and published as FAQ structured data for search engines.",
		table: "faqs",
		singular: "FAQ",
		query: adminFaqsQuery,
		searchKeys: ["question", "category"],
		defaults: {
			is_published: true,
			sort_order: "0"
		},
		prepare: (payload) => ({
			...payload,
			sort_order: Number(payload.sort_order ?? 0)
		}),
		fields: [
			{
				name: "question",
				label: "Question",
				type: "text",
				full: true
			},
			{
				name: "answer",
				label: "Answer",
				type: "textarea"
			},
			{
				name: "category",
				label: "Group",
				type: "text",
				placeholder: "Delivery, Payments, Products"
			},
			{
				name: "sort_order",
				label: "Sort order",
				type: "number"
			},
			{
				name: "is_published",
				label: "Published",
				type: "switch"
			}
		],
		columns: [
			{
				key: "question",
				label: "Question"
			},
			{
				key: "category",
				label: "Group"
			},
			{
				key: "sort_order",
				label: "Order"
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
export { AdminFaqs as component };
