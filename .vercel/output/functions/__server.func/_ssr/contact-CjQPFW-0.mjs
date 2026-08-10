import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { B as useSiteConfig } from "./router-Bg0ak8An.mjs";
import { $ as MapPin, Z as MessageCircle, et as Mail, z as Phone } from "../_libs/lucide-react.mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
import { p as settingsQuery } from "./queries-BOD52kvY.mjs";
import { r as pickWhatsApp } from "./settings-C0klt_FD.mjs";
import { n as whatsAppLink } from "./whatsapp-7MNxemtf.mjs";
import { t as InquiryForm } from "./inquiry-form-D2ukzNHe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-CjQPFW-0.js
var import_jsx_runtime = require_jsx_runtime();
function ContactPage() {
	const { footer } = useSiteConfig();
	const { data: settings } = useQuery({
		...settingsQuery,
		staleTime: 3e4
	});
	const whatsapp = pickWhatsApp(settings);
	const telHref = `tel:${(footer.phone || "").replace(/[^\d+]/g, "")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page grid gap-14 py-12 md:py-16 lg:grid-cols-[1fr_1.1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-accent",
				children: "Contact"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl md:text-5xl",
				children: "We'd love to hear from you"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 leading-relaxed text-muted-foreground",
				children: "Questions about an order, a product or a partnership? Call us, message us on WhatsApp, or send a note below — a real person replies within one business day."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `mailto:${footer.email}`,
						className: "flex min-h-11 items-center gap-3 rounded-md px-2 -mx-2 transition-colors hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
							className: "size-4 shrink-0 text-accent",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "break-all",
							children: footer.email
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: telHref,
						className: "flex min-h-11 items-center gap-3 rounded-md px-2 -mx-2 transition-colors hover:bg-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
								className: "size-4 shrink-0 text-accent",
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: footer.phone }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "(tap to call)"
							})
						]
					}),
					whatsapp.enabled && whatsapp.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: whatSappHref(whatsapp.phone),
						target: "_blank",
						rel: "noreferrer",
						className: "flex min-h-11 items-center gap-3 rounded-md px-2 -mx-2 transition-colors hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
							className: "size-4 shrink-0 text-accent",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Chat on WhatsApp" })]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex min-h-11 items-center gap-3 px-2 -mx-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
							className: "size-4 shrink-0 text-accent",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: footer.address })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted-foreground",
				children: "Customer care hours: Monday to Friday, 9am – 5pm WAT."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl",
			children: "Send a message"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InquiryForm, { type: "contact" })
		})] })]
	});
}
function whatSappHref(phone) {
	return whatsAppLink(phone, "Hello Mummy Rose, I have a question about your products.");
}
//#endregion
export { ContactPage as component };
