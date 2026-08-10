import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as faqsQuery } from "./queries-BOD52kvY.mjs";
import { t as JsonLd } from "./json-ld-2dnvi90N.mjs";
import { i as AccordionTrigger, n as AccordionContent, r as AccordionItem, t as Accordion } from "./accordion-uwqhymWC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-B_Pau1UA.js
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK = [
	{
		question: "How long does delivery take?",
		answer: "Lagos orders arrive in 1–2 business days. Other Nigerian states take 2–5 business days. International export orders are quoted per shipment."
	},
	{
		question: "How do I pay?",
		answer: "You can pay by card or transfer through Paystack or Flutterwave, by direct bank transfer, or on delivery within Lagos."
	},
	{
		question: "Do you supply restaurants and retailers?",
		answer: "Yes. We supply wholesale, corporate and export partners, and we offer white-label and custom packaging programmes."
	}
];
function FaqPage() {
	const { data } = useQuery(faqsQuery);
	const faqs = data && data.length > 0 ? data : FALLBACK;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page max-w-3xl py-12 md:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonLd, { data: {
				"@context": "https://schema.org",
				"@type": "FAQPage",
				mainEntity: faqs.map((f) => ({
					"@type": "Question",
					name: f.question,
					acceptedAnswer: {
						"@type": "Answer",
						text: f.answer
					}
				}))
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-accent",
				children: "Help centre"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl md:text-5xl",
				children: "Frequently asked questions"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
				type: "single",
				collapsible: true,
				className: "mt-10",
				children: faqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
					value: f.question,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
						className: "text-left",
						children: f.question
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
						className: "leading-relaxed text-muted-foreground",
						children: f.answer
					})]
				}, f.question))
			})
		]
	});
}
//#endregion
export { FaqPage as component };
