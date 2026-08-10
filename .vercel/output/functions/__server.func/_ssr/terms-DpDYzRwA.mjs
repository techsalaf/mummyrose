import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/terms-DpDYzRwA.js
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		title: "Orders",
		body: "An order is confirmed once you receive an order number. We may cancel and refund an order if an item is out of stock."
	},
	{
		title: "Pricing",
		body: "All prices are in Nigerian Naira and include applicable taxes. Shipping is free over 50,000 Naira, otherwise a flat 2,500 Naira fee applies."
	},
	{
		title: "Delivery",
		body: "Lagos deliveries take 1-2 business days; other states 2-5 business days. Export shipments are quoted individually."
	},
	{
		title: "Returns",
		body: "Unopened items may be returned within 7 days of delivery. Contact us with your order number to arrange collection."
	},
	{
		title: "Liability",
		body: "Our liability for any order is limited to the value of that order. Always check ingredient decks if you have allergies."
	}
];
function LegalPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page max-w-3xl py-12 md:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-accent",
				children: "Legal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl",
				children: "Terms of service"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 space-y-8",
				children: sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: section.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 leading-relaxed text-muted-foreground",
					children: section.body
				})] }, section.title))
			})
		]
	});
}
//#endregion
export { LegalPage as component };
