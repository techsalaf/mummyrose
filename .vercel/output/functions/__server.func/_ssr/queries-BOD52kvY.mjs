import { t as supabase } from "./client-Cf-9GAe8.mjs";
import { n as queryOptions } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queries-BOD52kvY.js
var PRODUCT_FIELDS = "id,slug,name,short_description,description,image_url,gallery,price,discount_price,sku,stock_quantity,ingredients,nutrition,weight_options,tags,is_featured,category_id,seo_title,seo_description,categories(id,name,slug)";
var categoriesQuery = queryOptions({
	queryKey: ["categories"],
	queryFn: async () => {
		const { data, error } = await supabase.from("categories").select("id,slug,name,description,image_url,sort_order").order("sort_order");
		if (error) throw error;
		return data ?? [];
	}
});
var productsQuery = queryOptions({
	queryKey: ["products"],
	queryFn: async () => {
		const { data, error } = await supabase.from("products").select(PRODUCT_FIELDS).order("created_at", { ascending: false });
		if (error) throw error;
		return data ?? [];
	}
});
function productQuery(slug) {
	return queryOptions({
		queryKey: ["product", slug],
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select(PRODUCT_FIELDS).eq("slug", slug).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
}
var testimonialsQuery = queryOptions({
	queryKey: ["testimonials"],
	queryFn: async () => {
		const { data, error } = await supabase.from("testimonials").select("id,author,role,quote,rating").order("sort_order");
		if (error) throw error;
		return data ?? [];
	}
});
var POST_LIST_FIELDS = "id,slug,title,excerpt,cover_image,category,kind,tags,author,published_at,updated_at,is_featured,reading_minutes,prep_minutes,cook_minutes,servings,difficulty";
/**
* Published posts, newest first. Scheduled posts (a future `published_at`)
* stay hidden until their date arrives, matching the database policy.
*/
function fetchPosts(kind) {
	return async () => {
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		let request = supabase.from("posts").select(POST_LIST_FIELDS).eq("is_published", true).or(`published_at.is.null,published_at.lte.${nowIso}`).order("published_at", { ascending: false });
		if (kind) request = request.eq("kind", kind);
		const { data, error } = await request;
		if (error) throw error;
		return data ?? [];
	};
}
/** Every published post, both recipes and articles. */
var postsQuery = queryOptions({
	queryKey: ["posts", "all"],
	queryFn: fetchPosts()
});
/** Published recipes only — powers /recipes. */
var recipesQuery = queryOptions({
	queryKey: ["posts", "recipe"],
	queryFn: fetchPosts("recipe")
});
/** Published articles only — powers /blog. */
var articlesQuery = queryOptions({
	queryKey: ["posts", "article"],
	queryFn: fetchPosts("article")
});
function postQuery(slug) {
	return queryOptions({
		queryKey: ["post", slug],
		queryFn: async () => {
			const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
}
/** Products explicitly linked to a recipe or article, for "shop this recipe" blocks. */
function relatedProductsQuery(ids) {
	const list = (ids ?? []).filter(Boolean);
	return queryOptions({
		queryKey: ["related_products", list.join(",")],
		queryFn: async () => {
			if (list.length === 0) return [];
			const { data, error } = await supabase.from("products").select(PRODUCT_FIELDS).in("id", list);
			if (error) throw error;
			return data ?? [];
		}
	});
}
var settingsQuery = queryOptions({
	queryKey: ["site_settings"],
	queryFn: async () => {
		const { data, error } = await supabase.from("site_settings").select("key,value");
		if (error) throw error;
		const map = {};
		for (const row of data ?? []) map[row.key] = row.value ?? {};
		return map;
	}
});
var faqsQuery = queryOptions({
	queryKey: ["faqs"],
	queryFn: async () => {
		const { data, error } = await supabase.from("faqs").select("id,question,answer,category,sort_order").eq("is_published", true).order("sort_order");
		if (error) throw error;
		return data ?? [];
	}
});
function productReviewsQuery(productId) {
	return queryOptions({
		queryKey: ["product_reviews", productId ?? "none"],
		queryFn: async () => {
			if (!productId) return [];
			const { data, error } = await supabase.from("product_reviews").select("id,author_name,rating,title,body,created_at,is_approved,user_id").eq("product_id", productId).order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
}
function bannersQuery(placement) {
	return queryOptions({
		queryKey: ["banners", placement],
		queryFn: async () => {
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			const { data, error } = await supabase.from("banners").select("id,title,subtitle,body,image_url,cta_label,cta_href,theme,starts_at,expires_at").eq("placement", placement).eq("is_active", true).order("sort_order");
			if (error) throw error;
			return (data ?? []).filter((b) => (!b.starts_at || b.starts_at <= nowIso) && (!b.expires_at || b.expires_at >= nowIso));
		}
	});
}
function addressesQuery(userId) {
	return queryOptions({
		queryKey: ["customer_addresses", userId ?? "anon"],
		queryFn: async () => {
			if (!userId) return [];
			const { data, error } = await supabase.from("customer_addresses").select("*").eq("user_id", userId).order("is_default", { ascending: false }).order("created_at");
			if (error) throw error;
			return data ?? [];
		}
	});
}
//#endregion
export { faqsQuery as a, productQuery as c, recipesQuery as d, relatedProductsQuery as f, categoriesQuery as i, productReviewsQuery as l, testimonialsQuery as m, articlesQuery as n, postQuery as o, settingsQuery as p, bannersQuery as r, postsQuery as s, addressesQuery as t, productsQuery as u };
