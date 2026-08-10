//#region node_modules/.nitro/vite/services/ssr/assets/payments.server-BrZGIjSv.js
function money(amount) {
	return Math.round(amount * 100);
}
function paystackKey() {
	return process.env.PAYSTACK_SECRET_KEY ?? "";
}
function flutterwaveKey() {
	return process.env.FLUTTERWAVE_SECRET_KEY ?? "";
}
async function logTransaction(order, provider, reference, status) {
	const { supabaseAdmin } = await import("./client.server-CuF8Lcbr.mjs");
	await supabaseAdmin.from("payment_transactions").upsert({
		order_id: order.id,
		provider,
		reference,
		amount: order.total,
		status
	}, { onConflict: "reference" });
	await supabaseAdmin.from("orders").update({ payment_reference: reference }).eq("id", order.id);
}
async function initPaystack(order, email, origin) {
	const key = paystackKey();
	if (!key) throw new Error("Paystack is not configured yet. Choose bank transfer or pay on delivery.");
	const reference = `${order.order_number}-${Date.now().toString(36)}`;
	const res = await fetch("https://api.paystack.co/transaction/initialize", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${key}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email,
			amount: money(order.total),
			currency: "NGN",
			reference,
			callback_url: `${origin}/payment-callback?provider=paystack`,
			metadata: {
				order_number: order.order_number,
				order_id: order.id
			}
		})
	});
	const json = await res.json();
	if (!res.ok || !json.status || !json.data?.authorization_url) throw new Error(json.message || "Paystack could not start this payment.");
	await logTransaction(order, "paystack", reference, "pending");
	return {
		kind: "redirect",
		url: json.data.authorization_url,
		reference
	};
}
async function initFlutterwave(order, customer, origin) {
	const key = flutterwaveKey();
	if (!key) throw new Error("Flutterwave is not configured yet. Choose bank transfer or pay on delivery.");
	const reference = `${order.order_number}-${Date.now().toString(36)}`;
	const res = await fetch("https://api.flutterwave.com/v3/payments", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${key}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			tx_ref: reference,
			amount: order.total,
			currency: "NGN",
			redirect_url: `${origin}/payment-callback?provider=flutterwave`,
			customer: {
				email: customer.email,
				name: customer.name,
				phonenumber: customer.phone
			},
			customizations: {
				title: "Mummy Rose",
				description: `Order ${order.order_number}`
			},
			meta: {
				order_number: order.order_number,
				order_id: order.id
			}
		})
	});
	const json = await res.json();
	if (!res.ok || json.status !== "success" || !json.data?.link) throw new Error(json.message || "Flutterwave could not start this payment.");
	await logTransaction(order, "flutterwave", reference, "pending");
	return {
		kind: "redirect",
		url: json.data.link,
		reference
	};
}
/** Marks an order paid (idempotent) and records the provider payload. */
async function markPaid(reference, provider, payload) {
	const { supabaseAdmin } = await import("./client.server-CuF8Lcbr.mjs");
	const { data: tx } = await supabaseAdmin.from("payment_transactions").select("id,order_id,status").eq("reference", reference).maybeSingle();
	await supabaseAdmin.from("payment_transactions").update({
		status: "success",
		payload
	}).eq("reference", reference);
	const orderId = tx?.order_id ?? null;
	if (!orderId) return {
		ok: false,
		reason: "unknown_reference"
	};
	await supabaseAdmin.from("orders").update({
		payment_status: "paid",
		status: "confirmed",
		payment_provider: provider,
		payment_reference: reference
	}).eq("id", orderId);
	const { data: order } = await supabaseAdmin.from("orders").select("order_number,total,status,payment_status").eq("id", orderId).maybeSingle();
	return {
		ok: true,
		order
	};
}
async function markFailed(reference) {
	const { supabaseAdmin } = await import("./client.server-CuF8Lcbr.mjs");
	await supabaseAdmin.from("payment_transactions").update({ status: "failed" }).eq("reference", reference);
	const { data: tx } = await supabaseAdmin.from("payment_transactions").select("order_id").eq("reference", reference).maybeSingle();
	if (tx?.order_id) await supabaseAdmin.from("orders").update({ payment_status: "failed" }).eq("id", tx.order_id);
}
async function verifyPaystack(reference) {
	const key = paystackKey();
	if (!key) throw new Error("Paystack is not configured.");
	const json = await (await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${key}` } })).json();
	if (json.data?.status === "success") return await markPaid(reference, "paystack", json);
	await markFailed(reference);
	return {
		ok: false,
		reason: "not_successful"
	};
}
async function verifyFlutterwave(reference, transactionId) {
	const key = flutterwaveKey();
	if (!key) throw new Error("Flutterwave is not configured.");
	const url = transactionId ? `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify` : `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`;
	const json = await (await fetch(url, { headers: { Authorization: `Bearer ${key}` } })).json();
	if (json.data?.status === "successful") return await markPaid(json.data.tx_ref ?? reference, "flutterwave", json);
	await markFailed(reference);
	return {
		ok: false,
		reason: "not_successful"
	};
}
//#endregion
export { initFlutterwave, initPaystack, markFailed, markPaid, verifyFlutterwave, verifyPaystack };
