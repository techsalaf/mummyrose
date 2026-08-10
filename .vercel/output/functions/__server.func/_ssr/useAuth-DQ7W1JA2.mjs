import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as supabase } from "./client-Cf-9GAe8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useAuth-DQ7W1JA2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useAuth() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [user, setUser] = (0, import_react.useState)(null);
	const [isStaff, setIsStaff] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let active = true;
		const loadRole = async (uid) => {
			if (!uid) {
				if (active) setIsStaff(false);
				return;
			}
			const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
			if (active) setIsStaff((data ?? []).some((r) => r.role === "admin" || r.role === "staff"));
		};
		const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
			if (!active) return;
			setSession(next);
			setUser(next?.user ?? null);
			setTimeout(() => void loadRole(next?.user?.id), 0);
		});
		supabase.auth.getSession().then(({ data }) => {
			if (!active) return;
			setSession(data.session);
			setUser(data.session?.user ?? null);
			loadRole(data.session?.user?.id).finally(() => active && setLoading(false));
			setLoading(false);
		});
		return () => {
			active = false;
			sub.subscription.unsubscribe();
		};
	}, []);
	return {
		session,
		user,
		isStaff,
		loading
	};
}
//#endregion
export { useAuth as t };
