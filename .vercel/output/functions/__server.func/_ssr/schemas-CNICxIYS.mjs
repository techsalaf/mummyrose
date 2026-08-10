import { d as numberType, f as objectType, l as arrayType, p as stringType, u as enumType } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schemas-CNICxIYS.js
var inquirySchema = objectType({
	type: enumType([
		"wholesale",
		"export",
		"white_label",
		"corporate",
		"custom_packaging",
		"contact"
	]),
	name: stringType().trim().min(2, "Please enter your name").max(120),
	company: stringType().trim().max(160).optional().nullable(),
	email: stringType().trim().email("Enter a valid email").max(255),
	phone: stringType().trim().max(40).optional().nullable(),
	country: stringType().trim().max(80).optional().nullable(),
	requirements: stringType().trim().max(2e3).optional().nullable(),
	message: stringType().trim().max(4e3).optional().nullable()
});
var newsletterSchema = objectType({ email: stringType().trim().email("Enter a valid email").max(255) });
var checkoutSchema = objectType({
	customer_name: stringType().trim().min(2, "Full name is required").max(120),
	customer_email: stringType().trim().email("Enter a valid email").max(255),
	customer_phone: stringType().trim().min(7, "Phone number is required").max(40),
	address_line: stringType().trim().min(4, "Delivery address is required").max(300),
	city: stringType().trim().min(2, "City is required").max(120),
	state: stringType().trim().min(2, "State is required").max(120),
	country: stringType().trim().min(2).max(120).default("Nigeria"),
	postal_code: stringType().trim().max(20).optional().nullable(),
	notes: stringType().trim().max(1e3).optional().nullable(),
	payment_provider: enumType([
		"paystack",
		"flutterwave",
		"bank_transfer",
		"pay_on_delivery",
		"whatsapp"
	]),
	origin: stringType().trim().url().max(300).optional().nullable(),
	order_type: enumType(["retail", "wholesale"]).default("retail"),
	wholesale_account_id: stringType().uuid().optional().nullable(),
	coupon_code: stringType().trim().max(40).optional().nullable(),
	items: arrayType(objectType({
		product_id: stringType().uuid(),
		variant: stringType().max(60).optional().nullable(),
		quantity: numberType().int().min(1).max(999)
	})).min(1, "Your cart is empty").max(60)
});
var wholesaleApplicationSchema = objectType({
	company: stringType().trim().min(2, "Company name is required").max(160),
	contact_name: stringType().trim().min(2, "Contact name is required").max(120),
	email: stringType().trim().email("Enter a valid email").max(255),
	phone: stringType().trim().min(7, "Phone number is required").max(40),
	country: stringType().trim().max(80).optional().nullable(),
	monthly_volume: stringType().trim().max(120).optional().nullable(),
	notes: stringType().trim().max(2e3).optional().nullable()
});
//#endregion
export { wholesaleApplicationSchema as i, inquirySchema as n, newsletterSchema as r, checkoutSchema as t };
