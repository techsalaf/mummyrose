import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as supabase } from "./client-Cf-9GAe8.mjs";
import { n as queryOptions, o as useQueryClient } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-queries-DArl0zvx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var adminProductsQuery = queryOptions({
	queryKey: ["admin", "products"],
	queryFn: async () => {
		const { data, error } = await supabase.from("products").select("*, categories(id,name,slug)").order("created_at", { ascending: false });
		if (error) throw error;
		return data ?? [];
	}
});
var adminCategoriesQuery = queryOptions({
	queryKey: ["admin", "categories"],
	queryFn: async () => {
		const { data, error } = await supabase.from("categories").select("*").order("sort_order");
		if (error) throw error;
		return data ?? [];
	}
});
var adminOrdersQuery = queryOptions({
	queryKey: ["admin", "orders"],
	queryFn: async () => {
		const { data, error } = await supabase.from("orders").select("*, order_items(id,product_name,variant,quantity,unit_price,line_total)").order("created_at", { ascending: false }).limit(200);
		if (error) throw error;
		return data ?? [];
	}
});
var adminPostsQuery = queryOptions({
	queryKey: ["admin", "posts"],
	queryFn: async () => {
		const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
		if (error) throw error;
		return data ?? [];
	}
});
var adminTestimonialsQuery = queryOptions({
	queryKey: ["admin", "testimonials"],
	queryFn: async () => {
		const { data, error } = await supabase.from("testimonials").select("*").order("sort_order");
		if (error) throw error;
		return data ?? [];
	}
});
var adminInquiriesQuery = queryOptions({
	queryKey: ["admin", "inquiries"],
	queryFn: async () => {
		const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(200);
		if (error) throw error;
		return data ?? [];
	}
});
var adminWholesaleQuery = queryOptions({
	queryKey: ["admin", "wholesale"],
	queryFn: async () => {
		const { data, error } = await supabase.from("wholesale_accounts").select("*").order("created_at", { ascending: false });
		if (error) throw error;
		return data ?? [];
	}
});
var adminSubscribersQuery = queryOptions({
	queryKey: ["admin", "subscribers"],
	queryFn: async () => {
		const { data, error } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }).limit(500);
		if (error) throw error;
		return data ?? [];
	}
});
var adminSettingsQuery = queryOptions({
	queryKey: ["admin", "settings"],
	queryFn: async () => {
		const { data, error } = await supabase.from("site_settings").select("key,value");
		if (error) throw error;
		const map = {};
		for (const row of data ?? []) map[row.key] = row.value ?? {};
		return map;
	}
});
var adminAnalyticsQuery = queryOptions({
	queryKey: ["admin", "analytics"],
	queryFn: async () => {
		const since = (/* @__PURE__ */ new Date(Date.now() - 2592e6)).toISOString();
		const { data, error } = await supabase.from("analytics_events").select("name,path,value,created_at,product_id").gte("created_at", since).order("created_at", { ascending: false }).limit(5e3);
		if (error) throw error;
		return data ?? [];
	}
});
var adminInventoryLogsQuery = queryOptions({
	queryKey: ["admin", "inventory_logs"],
	queryFn: async () => {
		const { data, error } = await supabase.from("inventory_logs").select("*, products(name)").order("created_at", { ascending: false }).limit(100);
		if (error) throw error;
		return data ?? [];
	}
});
var adminFaqsQuery = queryOptions({
	queryKey: ["admin", "faqs"],
	queryFn: async () => {
		const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
		if (error) throw error;
		return data ?? [];
	}
});
var adminNavQuery = queryOptions({
	queryKey: ["admin", "nav_links"],
	queryFn: async () => {
		const { data, error } = await supabase.from("nav_links").select("*").order("menu_group").order("sort_order");
		if (error) throw error;
		return data ?? [];
	}
});
var adminCustomersQuery = queryOptions({
	queryKey: ["admin", "customers"],
	queryFn: async () => {
		const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(500);
		if (error) throw error;
		return data ?? [];
	}
});
var adminRolesQuery = queryOptions({
	queryKey: ["admin", "user_roles"],
	queryFn: async () => {
		const { data, error } = await supabase.from("user_roles").select("*");
		if (error) throw error;
		return data ?? [];
	}
});
var adminPagesQuery = queryOptions({
	queryKey: ["admin", "pages"],
	queryFn: async () => {
		const { data, error } = await supabase.from("pages").select("*").order("sort_order");
		if (error) throw error;
		return data ?? [];
	}
});
var adminCouponsQuery = queryOptions({
	queryKey: ["admin", "coupons"],
	queryFn: async () => {
		const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
		if (error) throw error;
		return data ?? [];
	}
});
var adminVariantsQuery = queryOptions({
	queryKey: ["admin", "product_variants"],
	queryFn: async () => {
		const { data, error } = await supabase.from("product_variants").select("*, products(name,slug)").order("sort_order");
		if (error) throw error;
		return data ?? [];
	}
});
var adminRedirectsQuery = queryOptions({
	queryKey: ["admin", "redirects"],
	queryFn: async () => {
		const { data, error } = await supabase.from("redirects").select("*").order("created_at", { ascending: false });
		if (error) throw error;
		return data ?? [];
	}
});
var adminNotificationsQuery = queryOptions({
	queryKey: ["admin", "notifications"],
	queryFn: async () => {
		const { data, error } = await supabase.from("admin_notifications").select("id,title,body,href,kind,is_read,created_at").order("created_at", { ascending: false }).limit(30);
		if (error) throw error;
		return data ?? [];
	}
});
var adminReviewsQuery = queryOptions({
	queryKey: ["admin", "product_reviews"],
	queryFn: async () => {
		const { data, error } = await supabase.from("product_reviews").select("*, products(name,slug)").order("created_at", { ascending: false });
		if (error) throw error;
		return data ?? [];
	}
});
var adminBannersQuery = queryOptions({
	queryKey: ["admin", "banners"],
	queryFn: async () => {
		const { data, error } = await supabase.from("banners").select("*").order("sort_order");
		if (error) throw error;
		return data ?? [];
	}
});
/** Subscribes to Postgres changes and invalidates the matching admin query keys. */
function useAdminRealtime(tables, keys) {
	const queryClient = useQueryClient();
	const signature = tables.join(",");
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel(`admin-${signature}`);
		for (const table of tables) channel.on("postgres_changes", {
			event: "*",
			schema: "public",
			table
		}, () => {
			for (const key of keys) queryClient.invalidateQueries({ queryKey: key });
		});
		channel.subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [signature]);
}
//#endregion
export { useAdminRealtime as C, adminWholesaleQuery as S, adminRolesQuery as _, adminCustomersQuery as a, adminTestimonialsQuery as b, adminInventoryLogsQuery as c, adminOrdersQuery as d, adminPagesQuery as f, adminReviewsQuery as g, adminRedirectsQuery as h, adminCouponsQuery as i, adminNavQuery as l, adminProductsQuery as m, adminBannersQuery as n, adminFaqsQuery as o, adminPostsQuery as p, adminCategoriesQuery as r, adminInquiriesQuery as s, adminAnalyticsQuery as t, adminNotificationsQuery as u, adminSettingsQuery as v, adminVariantsQuery as x, adminSubscribersQuery as y };
