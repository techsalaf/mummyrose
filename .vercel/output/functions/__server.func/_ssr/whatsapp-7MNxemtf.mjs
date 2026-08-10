import { j as formatNaira } from "./router-Bg0ak8An.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/whatsapp-7MNxemtf.js
var PAYMENT_LABELS = {
	paystack: "Paystack (card / transfer)",
	flutterwave: "Flutterwave",
	bank_transfer: "Bank transfer",
	pay_on_delivery: "Pay on delivery",
	whatsapp: "WhatsApp order"
};
/** Builds the plain-text order summary the seller receives on WhatsApp. */
function buildWhatsAppMessage(order) {
	const lines = order.items.map((i, index) => `${index + 1}. ${i.product_name}${i.variant ? ` (${i.variant})` : ""} × ${i.quantity} — ${formatNaira(i.unit_price * i.quantity)}`).join("\n");
	return [
		`*NEW ORDER — ${order.order_number}*`,
		"",
		"*Items*",
		lines,
		"",
		`Subtotal: ${formatNaira(order.subtotal)}`,
		`Delivery (${order.shipping_zone}): ${order.shipping_fee === 0 ? "Free" : formatNaira(order.shipping_fee)}`,
		`*Total: ${formatNaira(order.total)}*`,
		"",
		"*Customer*",
		`Name: ${order.customer_name}`,
		`Phone: ${order.customer_phone}`,
		`Email: ${order.customer_email}`,
		"",
		"*Delivery address*",
		`${order.address_line}, ${order.city}, ${order.state}, ${order.country}`,
		order.notes ? `\nNotes: ${order.notes}` : "",
		"",
		`Payment method: ${PAYMENT_LABELS[order.payment_provider] ?? order.payment_provider}`
	].filter(Boolean).join("\n");
}
function whatsAppLink(phone, message) {
	return `https://wa.me/${String(phone ?? "").replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
//#endregion
export { whatsAppLink as n, buildWhatsAppMessage as t };
