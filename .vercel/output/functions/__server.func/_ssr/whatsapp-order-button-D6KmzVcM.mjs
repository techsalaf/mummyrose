import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { j as formatNaira } from "./router-Bg0ak8An.mjs";
import { Z as MessageCircle } from "../_libs/lucide-react.mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
import { p as settingsQuery } from "./queries-BOD52kvY.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { r as pickWhatsApp } from "./settings-C0klt_FD.mjs";
import { n as whatsAppLink } from "./whatsapp-7MNxemtf.mjs";
import { t as track } from "./analytics-DzDJOljQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/whatsapp-order-button-D6KmzVcM.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Opens WhatsApp pre-filled with the shopper's basket so they can order by chat
* instead of paying online. Hidden when the store has no WhatsApp number set.
*/
function WhatsAppOrderButton({ lines, label = "Order on WhatsApp", size = "lg", className }) {
	const { data: settings } = useQuery(settingsQuery);
	const whatsapp = pickWhatsApp(settings);
	if (whatsapp.enabled === false || !whatsapp.phone) return null;
	const total = lines.reduce((sum, line) => sum + line.unit_price * line.quantity, 0);
	const message = [
		"Hello Mummy Rose 👋 I'd like to order:",
		"",
		...lines.map((line, index) => `${index + 1}. ${line.name}${line.variant ? ` (${line.variant})` : ""} × ${line.quantity} — ${formatNaira(line.unit_price * line.quantity)}`),
		"",
		`Estimated total (before delivery): ${formatNaira(total)}`,
		"",
		"Please confirm availability, delivery fee and payment details."
	].join("\n");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant: "outline",
		size,
		className,
		onClick: () => {
			track("whatsapp_order", { value: total });
			window.open(whatsAppLink(whatsapp.phone, message), "_blank", "noopener,noreferrer");
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }),
			" ",
			label
		]
	});
}
/** Short explainer that sits under the two ordering paths. */
function OrderPathsNote({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Pay online" }),
			" is fastest — your order is reserved instantly, stock is held and you get a tracking number straight away. ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Order on WhatsApp" }),
			" is best if you'd rather talk to a human first, confirm delivery to your street, or pay by transfer; a person replies during business hours, so it isn't instant."
		]
	});
}
//#endregion
export { WhatsAppOrderButton as n, OrderPathsNote as t };
