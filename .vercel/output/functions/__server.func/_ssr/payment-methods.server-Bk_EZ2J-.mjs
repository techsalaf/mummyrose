//#region node_modules/.nitro/vite/services/ssr/assets/payment-methods.server-Bk_EZ2J-.js
async function readPaymentsSetting() {
	const { supabaseAdmin } = await import("./client.server-CuF8Lcbr.mjs");
	const { data } = await supabaseAdmin.from("site_settings").select("value").eq("key", "payments").maybeSingle();
	return data?.value ?? {};
}
async function readPaymentMethodFlags() {
	const value = await readPaymentsSetting();
	const on = (key) => value[key] !== false;
	return {
		paystack_enabled: on("paystack_enabled"),
		flutterwave_enabled: on("flutterwave_enabled"),
		bank_transfer_enabled: on("bank_transfer_enabled"),
		pay_on_delivery_enabled: on("pay_on_delivery_enabled")
	};
}
async function readBankDetailsForOrder(orderNumber) {
	const { supabaseAdmin } = await import("./client.server-CuF8Lcbr.mjs");
	const { data: order } = await supabaseAdmin.from("orders").select("id").eq("order_number", orderNumber).maybeSingle();
	if (!order) return null;
	const value = await readPaymentsSetting();
	const number = String(value.account_number ?? "");
	if (!number) return null;
	return {
		bank_name: String(value.bank_name ?? ""),
		account_name: String(value.account_name ?? ""),
		account_number: number
	};
}
//#endregion
export { readBankDetailsForOrder, readPaymentMethodFlags };
