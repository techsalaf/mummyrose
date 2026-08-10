import { r as createServerFn } from "./server-CTdGS_ot.mjs";
import { n as inquirySchema, r as newsletterSchema } from "./schemas-CNICxIYS.mjs";
import { t as createServerRpc } from "./createServerRpc-MY1MXvd9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leads.functions-CT2IRrLW.js
async function saveInquiry(input) {
	const { supabaseAdmin } = await import("./client.server-CuF8Lcbr.mjs");
	const { error } = await supabaseAdmin.from("inquiries").insert({
		type: input.type,
		name: input.name,
		company: input.company ?? null,
		email: input.email,
		phone: input.phone ?? null,
		country: input.country ?? null,
		requirements: input.requirements ?? null,
		message: input.message ?? null
	});
	if (error) throw new Error(error.message);
	return { ok: true };
}
async function saveSubscriber(email) {
	const { supabaseAdmin } = await import("./client.server-CuF8Lcbr.mjs");
	const { error } = await supabaseAdmin.from("newsletter_subscribers").upsert({ email: email.toLowerCase() }, { onConflict: "email" });
	if (error) throw new Error(error.message);
	return { ok: true };
}
var submitInquiry_createServerFn_handler = createServerRpc({
	id: "aae52ddaafa71e2fd6fe4f654d6748821a7a052b23661038917bedf31f658b0c",
	name: "submitInquiry",
	filename: "src/lib/leads.functions.ts"
}, (opts) => submitInquiry.__executeServer(opts));
var submitInquiry = createServerFn({ method: "POST" }).inputValidator((data) => inquirySchema.parse(data)).handler(submitInquiry_createServerFn_handler, async ({ data }) => await saveInquiry(data));
var subscribeNewsletter_createServerFn_handler = createServerRpc({
	id: "3cbee22e85d2a0512250a9b1695d1c0b39c73579ab0fa99c92f8e0c3d5eefe2b",
	name: "subscribeNewsletter",
	filename: "src/lib/leads.functions.ts"
}, (opts) => subscribeNewsletter.__executeServer(opts));
var subscribeNewsletter = createServerFn({ method: "POST" }).inputValidator((data) => newsletterSchema.parse(data)).handler(subscribeNewsletter_createServerFn_handler, async ({ data }) => await saveSubscriber(data.email));
//#endregion
export { submitInquiry_createServerFn_handler, subscribeNewsletter_createServerFn_handler };
