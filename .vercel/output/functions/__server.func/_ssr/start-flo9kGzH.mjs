import { n as createCsrfMiddleware, r as createMiddleware } from "./server-CTdGS_ot2.mjs";
import { t as supabase } from "./client-Cf-9GAe8.mjs";
import { t as renderErrorPage } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/start-flo9kGzH.js
function dedupeSerializationAdapters(deduped, serializationAdapters) {
	for (let i = 0, len = serializationAdapters.length; i < len; i++) {
		const current = serializationAdapters[i];
		if (!deduped.has(current)) {
			deduped.add(current);
			if (current.extends) dedupeSerializationAdapters(deduped, current.extends);
		}
	}
}
var createStart = (getOptions) => {
	return {
		getOptions: async () => {
			const options = await getOptions();
			if (options.serializationAdapters) {
				const deduped = /* @__PURE__ */ new Set();
				dedupeSerializationAdapters(deduped, options.serializationAdapters);
				options.serializationAdapters = Array.from(deduped);
			}
			return options;
		},
		createMiddleware
	};
};
var attachSupabaseAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { data } = await supabase.auth.getSession();
	const token = data.session?.access_token;
	return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
});
var errorMiddleware = createMiddleware().server(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		if (error != null && typeof error === "object" && "statusCode" in error) throw error;
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
});
var securityHeaders = {
	"content-security-policy": [
		"default-src 'self'",
		`script-src 'self' 'unsafe-inline' https://js.paystack.co https://checkout.flutterwave.com https://www.googletagmanager.com`,
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"font-src 'self' data: https://fonts.gstatic.com",
		"img-src 'self' data: blob: https:",
		`connect-src 'self' https://*.supabase.co https://*.lovable.cloud wss://*.supabase.co https://api.paystack.co https://api.flutterwave.com https://www.google-analytics.com`,
		"frame-src 'self' https://checkout.paystack.com https://checkout.flutterwave.com",
		"frame-ancestors 'self' https://*.lovable.app https://*.lovable.dev",
		"form-action 'self'",
		"base-uri 'self'",
		"object-src 'none'",
		...["upgrade-insecure-requests"]
	].join("; "),
	"x-content-type-options": "nosniff",
	"referrer-policy": "strict-origin-when-cross-origin",
	"permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(self)",
	"cross-origin-opener-policy": "same-origin-allow-popups",
	"strict-transport-security": "max-age=31536000; includeSubDomains; preload"
};
function applySecurityHeaders(response) {
	for (const [key, value] of Object.entries(securityHeaders)) if (!response.headers.has(key)) response.headers.set(key, value);
}
var securityHeadersMiddleware = createMiddleware().server(async ({ next }) => {
	const result = await next();
	if (result instanceof Response) {
		applySecurityHeaders(result);
		return result;
	}
	const response = result?.response;
	if (response instanceof Response) applySecurityHeaders(response);
	return result;
});
var csrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var startInstance = createStart(() => ({
	functionMiddleware: [attachSupabaseAuth],
	requestMiddleware: [
		securityHeadersMiddleware,
		errorMiddleware,
		csrfMiddleware
	]
}));
//#endregion
export { startInstance };
