import { i as getRequestHeader, r as createServerFn } from "./server-CTdGS_ot.mjs";
import { d as numberType, f as objectType, p as stringType } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
import { t as checkoutSchema } from "./schemas-CNICxIYS.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { n as quoteShipping } from "./shipping-DS0T1UXJ.mjs";
import { t as createServerRpc } from "./createServerRpc-MY1MXvd9.mjs";
import { initFlutterwave, initPaystack } from "./payments.server-BrZGIjSv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders.functions-0WgMqpj4.js
function generateOrderNumber() {
	const d = /* @__PURE__ */ new Date();
	return `MR-${`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}
/** Resolves the signed-in user from the bearer token, if the checkout was authenticated. */
async function resolveUserId() {
	try {
		const header = getRequestHeader("authorization");
		const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
		if (!token) return null;
		const url = (typeof process !== "undefined" ? process.env?.SUPABASE_URL || process.env?.VITE_SUPABASE_URL : void 0) || "https://dezgbfewaprhxfhnbtqp.supabase.co";
		const key = (typeof process !== "undefined" ? process.env?.SUPABASE_SERVICE_ROLE_KEY || process.env?.SUPABASE_PUBLISHABLE_KEY : void 0) || "sb_publishable_ABDiKOfAfzJYEaf9MAPtgw_ux8asbLh";
		const { data } = await createClient(url, key, { auth: {
			persistSession: false,
			autoRefreshToken: false
		} }).auth.getUser(token);
		return data.user?.id ?? null;
	} catch {
		return null;
	}
}
async function getShippingConfig() {
	const { supabaseAdmin } = await import("./client.server-CuF8Lcbr.mjs");
	const { data } = await supabaseAdmin.from("site_settings").select("value").eq("key", "shipping").maybeSingle();
	return data?.value ?? {};
}
/** Creates the order server-side, pricing every line from the database. */
async function createOrder(input, userId) {
	const { supabaseAdmin } = await import("./client.server-CuF8Lcbr.mjs");
	const ids = [...new Set(input.items.map((i) => i.product_id))];
	const { data: products, error: productError } = await supabaseAdmin.from("products").select("id,name,price,discount_price,stock_quantity,is_active").in("id", ids);
	if (productError) throw new Error(productError.message);
	const byId = new Map((products ?? []).map((p) => [p.id, p]));
	const lines = input.items.map((item) => {
		const product = byId.get(item.product_id);
		if (!product || !product.is_active) throw new Error("One of the products is no longer available.");
		if (product.stock_quantity < item.quantity) throw new Error(`Only ${product.stock_quantity} units of ${product.name} are in stock.`);
		const price = Number(product.price);
		const discount = product.discount_price == null ? null : Number(product.discount_price);
		const unit = discount != null && discount > 0 && discount < price ? discount : price;
		return {
			product_id: product.id,
			product_name: product.name,
			variant: item.variant ?? null,
			unit_price: unit,
			quantity: item.quantity,
			line_total: Number((unit * item.quantity).toFixed(2)),
			remaining: product.stock_quantity - item.quantity
		};
	});
	let discountPercent = 0;
	let wholesaleAccountId = null;
	if (input.order_type === "wholesale" && input.wholesale_account_id && userId) {
		const { data: account } = await supabaseAdmin.from("wholesale_accounts").select("id,discount_percent,status,user_id").eq("id", input.wholesale_account_id).maybeSingle();
		if (account && account.status === "approved" && account.user_id === userId) {
			discountPercent = Number(account.discount_percent ?? 0);
			wholesaleAccountId = account.id;
		}
	}
	if (discountPercent > 0) for (const line of lines) {
		line.unit_price = Number((line.unit_price * (1 - discountPercent / 100)).toFixed(2));
		line.line_total = Number((line.unit_price * line.quantity).toFixed(2));
	}
	const subtotal = lines.reduce((sum, l) => sum + l.line_total, 0);
	const shippingConfig = await getShippingConfig();
	const quote = quoteShipping(shippingConfig, {
		subtotal,
		state: input.state,
		country: input.country
	});
	let couponCode = null;
	let discountAmount = 0;
	if (input.coupon_code && input.order_type !== "wholesale") {
		const { validateCoupon } = await import("./coupons.server-DPJSKaiy.mjs");
		const coupon = await validateCoupon(input.coupon_code, subtotal);
		couponCode = coupon.code;
		discountAmount = coupon.discount;
	}
	const total = Number(Math.max(0, subtotal - discountAmount + quote.fee).toFixed(2));
	const { data: order, error: orderError } = await supabaseAdmin.from("orders").insert({
		order_number: generateOrderNumber(),
		user_id: userId,
		customer_name: input.customer_name,
		customer_email: input.customer_email,
		customer_phone: input.customer_phone,
		address_line: input.address_line,
		city: input.city,
		state: input.state,
		country: input.country,
		postal_code: input.postal_code ?? null,
		notes: input.notes ?? null,
		subtotal,
		shipping_fee: quote.fee,
		coupon_code: couponCode,
		discount_amount: discountAmount,
		total,
		payment_provider: input.payment_provider,
		payment_status: "unpaid",
		status: "pending",
		order_type: wholesaleAccountId ? "wholesale" : "retail",
		discount_percent: discountPercent,
		wholesale_account_id: wholesaleAccountId
	}).select("id,order_number,total,subtotal,shipping_fee,discount_amount,coupon_code").single();
	if (orderError || !order) throw new Error(orderError?.message ?? "Could not create order.");
	const { error: itemsError } = await supabaseAdmin.from("order_items").insert(lines.map((l) => ({
		order_id: order.id,
		product_id: l.product_id,
		product_name: l.product_name,
		variant: l.variant,
		unit_price: l.unit_price,
		quantity: l.quantity,
		line_total: l.line_total
	})));
	if (itemsError) throw new Error(itemsError.message);
	for (const line of lines) {
		await supabaseAdmin.from("products").update({ stock_quantity: line.remaining }).eq("id", line.product_id);
		await supabaseAdmin.from("inventory_logs").insert({
			product_id: line.product_id,
			change: -line.quantity,
			reason: `Order ${order.order_number}`
		});
	}
	if (couponCode) {
		const { redeemCoupon } = await import("./coupons.server-DPJSKaiy.mjs");
		await redeemCoupon(couponCode);
	}
	return {
		id: order.id,
		order_number: order.order_number,
		subtotal: Number(order.subtotal),
		discount_amount: Number(order.discount_amount ?? 0),
		coupon_code: order.coupon_code ?? null,
		shipping_fee: Number(order.shipping_fee),
		shipping_zone: quote.zone,
		total: Number(order.total),
		payment_provider: input.payment_provider,
		items: lines.map((l) => ({
			product_name: l.product_name,
			variant: l.variant,
			quantity: l.quantity,
			unit_price: l.unit_price
		}))
	};
}
async function lookupOrder(orderNumber, email) {
	const { supabaseAdmin } = await import("./client.server-CuF8Lcbr.mjs");
	const { data, error } = await supabaseAdmin.from("orders").select("order_number,customer_name,customer_email,status,payment_status,payment_provider,subtotal,shipping_fee,total,created_at,address_line,city,state,country,order_items(product_name,variant,quantity,unit_price,line_total)").eq("order_number", orderNumber).ilike("customer_email", email).maybeSingle();
	if (error) throw new Error(error.message);
	return data;
}
var placeOrder_createServerFn_handler = createServerRpc({
	id: "a6485a0caa6c7276b8f38fd2e39c7cd965ae3addca5ff318987f97661206380a",
	name: "placeOrder",
	filename: "src/lib/orders.functions.ts"
}, (opts) => placeOrder.__executeServer(opts));
var placeOrder = createServerFn({ method: "POST" }).inputValidator((data) => checkoutSchema.parse(data)).handler(placeOrder_createServerFn_handler, async ({ data }) => {
	const order = await createOrder(data, await resolveUserId());
	if (data.payment_provider === "paystack" || data.payment_provider === "flutterwave") {
		const origin = data.origin ?? "";
		const init = data.payment_provider === "paystack" ? await initPaystack(order, data.customer_email, origin) : await initFlutterwave(order, {
			email: data.customer_email,
			name: data.customer_name,
			phone: data.customer_phone
		}, origin);
		return {
			order,
			redirect_url: init.kind === "redirect" ? init.url : null
		};
	}
	return {
		order,
		redirect_url: null
	};
});
var trackOrder_createServerFn_handler = createServerRpc({
	id: "d74efaed9d368b50c737966712aaf37f9bc30edca8be1eed754f166b39b69dcd",
	name: "trackOrder",
	filename: "src/lib/orders.functions.ts"
}, (opts) => trackOrder.__executeServer(opts));
var trackOrder = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	order_number: stringType().trim().min(4).max(40),
	email: stringType().trim().email()
}).parse(data)).handler(trackOrder_createServerFn_handler, async ({ data }) => {
	return await lookupOrder(data.order_number, data.email);
});
var quoteDelivery_createServerFn_handler = createServerRpc({
	id: "377adb88f76be82b3b842c83d63b452509e037a8f8502f9e653a9f6cb109bc15",
	name: "quoteDelivery",
	filename: "src/lib/orders.functions.ts"
}, (opts) => quoteDelivery.__executeServer(opts));
var quoteDelivery = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	subtotal: numberType().min(0).max(1e8),
	state: stringType().trim().max(120).default(""),
	country: stringType().trim().max(120).default("Nigeria")
}).parse(data)).handler(quoteDelivery_createServerFn_handler, async ({ data }) => {
	const config = await getShippingConfig();
	return quoteShipping(config, data);
});
//#endregion
export { placeOrder_createServerFn_handler, quoteDelivery_createServerFn_handler, trackOrder_createServerFn_handler };
