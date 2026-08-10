import { t as supabase } from "./client-Cf-9GAe8.mjs";
import { n as queryOptions } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wholesale-BFAAEWWN.js
var TIER_LABELS = {
	bronze: "Starter",
	silver: "Trade",
	gold: "Distributor"
};
function myWholesaleAccountQuery(userId) {
	return queryOptions({
		queryKey: [
			"wholesale",
			"me",
			userId ?? "anon"
		],
		enabled: Boolean(userId),
		queryFn: async () => {
			const { data, error } = await supabase.from("wholesale_accounts").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle();
			if (error) throw error;
			return data ?? null;
		}
	});
}
function myWholesaleOrdersQuery(userId) {
	return queryOptions({
		queryKey: [
			"wholesale",
			"orders",
			userId ?? "anon"
		],
		enabled: Boolean(userId),
		queryFn: async () => {
			const { data, error } = await supabase.from("orders").select("id,order_number,status,payment_status,subtotal,shipping_fee,total,discount_percent,order_type,created_at,order_items(id,product_name,variant,quantity,unit_price,line_total)").eq("user_id", userId).order("created_at", { ascending: false }).limit(50);
			if (error) throw error;
			return data ?? [];
		}
	});
}
queryOptions({
	queryKey: ["settings", "wholesale"],
	queryFn: async () => {
		const { data, error } = await supabase.from("site_settings").select("value").eq("key", "wholesale").maybeSingle();
		if (error) throw error;
		return data?.value ?? {};
	}
});
//#endregion
export { myWholesaleAccountQuery as n, myWholesaleOrdersQuery as r, TIER_LABELS as t };
