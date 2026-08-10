import { t as supabase } from "./client-Cf-9GAe8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-DzDJOljQ.js
var SESSION_KEY = "mr.sid.v1";
function sessionId() {
	if (typeof window === "undefined") return null;
	try {
		let id = window.localStorage.getItem(SESSION_KEY);
		if (!id) {
			id = Math.random().toString(36).slice(2) + Date.now().toString(36);
			window.localStorage.setItem(SESSION_KEY, id);
		}
		return id;
	} catch {
		return null;
	}
}
/** Fire-and-forget store analytics. Never throws, never blocks the UI. */
function track(name, options = {}) {
	if (typeof window === "undefined") return;
	const payload = {
		name,
		path: (options.path ?? window.location.pathname).slice(0, 300),
		referrer: (document.referrer || null)?.slice(0, 300) ?? null,
		session_id: sessionId(),
		product_id: options.productId ?? null,
		value: options.value ?? null,
		meta: options.meta ?? {}
	};
	supabase.from("analytics_events").insert(payload).then(() => void 0);
}
//#endregion
export { track as t };
