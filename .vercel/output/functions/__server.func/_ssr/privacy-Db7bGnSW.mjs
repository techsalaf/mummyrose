import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-Db7bGnSW.js
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		title: "What we collect",
		body: "Your name, email, phone number and delivery address when you place an order or send an enquiry, plus basic analytics about how the site is used."
	},
	{
		title: "How we use it",
		body: "To fulfil and deliver orders, respond to enquiries, and send newsletters if you have opted in. We never sell your data."
	},
	{
		title: "Payments",
		body: "Card and transfer payments are processed by our payment partners. We do not store card details on our systems."
	},
	{
		title: "Your choices",
		body: "You can unsubscribe from emails at any time, and you can ask us to correct or delete your data by emailing hello@mummyrose.com."
	},
	{
		title: "Cookies",
		body: "We use essential cookies to keep your cart and session working, and privacy-respecting analytics to improve the store."
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
				children: "Privacy policy"
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
