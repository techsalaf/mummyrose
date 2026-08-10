import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { j as formatNaira } from "./router-Bg0ak8An.mjs";
import { Dt as Download, It as CircleAlert, L as Printer, Pt as CircleCheck } from "../_libs/lucide-react.mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { C as useAdminRealtime, d as adminOrdersQuery, m as adminProductsQuery, p as adminPostsQuery, r as adminCategoriesQuery, t as adminAnalyticsQuery, v as adminSettingsQuery } from "./admin-queries-DArl0zvx.mjs";
import { c as TableCell, d as TableRow, l as TableHead, o as Table, s as TableBody, u as TableHeader } from "./table-Bc3sudQz.mjs";
import { t as AdminHeader } from "./resource-manager-Atj0jfrY.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as pickSeo } from "./settings-C0klt_FD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.analytics-BLEVfOXs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminAnalytics() {
	const analytics = useQuery(adminAnalyticsQuery);
	const products = useQuery(adminProductsQuery);
	const categories = useQuery(adminCategoriesQuery);
	const posts = useQuery(adminPostsQuery);
	const orders = useQuery(adminOrdersQuery);
	const settings = useQuery(adminSettingsQuery);
	useAdminRealtime(["analytics_events"], [["admin", "analytics"]]);
	const events = analytics.data ?? [];
	const productRows = products.data ?? [];
	const categoryRows = categories.data ?? [];
	const postRows = posts.data ?? [];
	const orderRows = orders.data ?? [];
	const seo = pickSeo(settings.data);
	const counts = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const event of events) map.set(event.name, (map.get(event.name) ?? 0) + 1);
		return map;
	}, [events]);
	const topPaths = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const event of events.filter((e) => e.name === "page_view")) {
			const key = event.path ?? "/";
			map.set(key, (map.get(key) ?? 0) + 1);
		}
		return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
	}, [events]);
	const topProducts = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const event of events.filter((e) => e.name === "product_view" && e.product_id)) map.set(event.product_id, (map.get(event.product_id) ?? 0) + 1);
		return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([id, views]) => ({
			name: productRows.find((p) => p.id === id)?.name ?? "Unknown",
			views
		}));
	}, [events, productRows]);
	const searches = (0, import_react.useMemo)(() => events.filter((e) => e.name === "search").length, [events]);
	const views = counts.get("page_view") ?? 0;
	const carts = counts.get("add_to_cart") ?? 0;
	const checkouts = counts.get("begin_checkout") ?? 0;
	const placed = (counts.get("order_placed") ?? 0) + (counts.get("whatsapp_order") ?? 0);
	const paidRevenue = orderRows.filter((o) => o.payment_status === "paid").reduce((sum, o) => sum + Number(o.total ?? 0), 0);
	const audit = [
		{
			label: "Global SEO title configured",
			pass: Boolean(seo.title && seo.title.length > 10 && seo.title.length < 65),
			hint: "Set a 10–65 character site title in Settings → SEO."
		},
		{
			label: "Global meta description configured",
			pass: Boolean(seo.description && seo.description.length > 50 && seo.description.length < 165),
			hint: "Set a 50–165 character description in Settings → SEO."
		},
		{
			label: "All products have SEO titles",
			pass: productRows.every((p) => Boolean(p.seo_title)),
			hint: `${productRows.filter((p) => !p.seo_title).length} product(s) missing an SEO title.`
		},
		{
			label: "All products have meta descriptions",
			pass: productRows.every((p) => Boolean(p.seo_description ?? p.short_description)),
			hint: `${productRows.filter((p) => !p.seo_description && !p.short_description).length} product(s) missing description copy.`
		},
		{
			label: "All products have imagery",
			pass: productRows.every((p) => Boolean(p.image_url)),
			hint: `${productRows.filter((p) => !p.image_url).length} product(s) without a main image.`
		},
		{
			label: "Product copy is long enough to rank",
			pass: productRows.every((p) => (p.description ?? "").length > 200),
			hint: `${productRows.filter((p) => (p.description ?? "").length <= 200).length} product(s) with thin content (<200 chars).`
		},
		{
			label: "Categories have SEO copy",
			pass: categoryRows.every((c) => Boolean(c.seo_title && c.seo_description)),
			hint: `${categoryRows.filter((c) => !c.seo_title || !c.seo_description).length} category page(s) missing SEO copy.`
		},
		{
			label: "Categories have imagery",
			pass: categoryRows.every((c) => Boolean(c.image_url)),
			hint: "Add a collection image for richer social previews."
		},
		{
			label: "Published posts have descriptions and covers",
			pass: postRows.filter((p) => p.is_published).every((p) => Boolean(p.seo_description ?? p.excerpt) && Boolean(p.cover_image)),
			hint: "Add an excerpt and cover image to every published post."
		},
		{
			label: "Content library is active",
			pass: postRows.filter((p) => p.is_published).length >= 3,
			hint: "Publish at least 3 recipes or articles to build topical authority."
		},
		{
			label: "Social proof published",
			pass: counts.size >= 0 && true,
			hint: ""
		}
	].filter((row) => row.hint !== "");
	const score = Math.round(audit.filter((a) => a.pass).length / Math.max(audit.length, 1) * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminHeader, {
				title: "Analytics & SEO audit",
				description: "Storefront behaviour over the last 30 days, plus an automated on-page SEO health check."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Page views",
						value: views
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Product views",
						value: counts.get("product_view") ?? 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Add to cart",
						value: carts
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Checkouts started",
						value: checkouts
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Orders placed",
						value: placed
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "View → cart",
						value: `${views ? (carts / views * 100).toFixed(1) : "0.0"}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Cart → order",
						value: `${carts ? (placed / carts * 100).toFixed(1) : "0.0"}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "On-site searches",
						value: searches
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Paid revenue",
						value: formatNaira(paidRevenue)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Top pages"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: topPaths.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No traffic recorded yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Path" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-right",
					children: "Views"
				})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: topPaths.map(([path, count]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "truncate",
					children: path
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right",
					children: count
				})] }, path)) })] }) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Most viewed products"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: topProducts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No product views recorded yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Product" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-right",
					children: "Views"
				})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: topProducts.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "truncate",
					children: row.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right",
					children: row.views
				})] }, row.name)) })] }) })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex flex-row flex-wrap items-center justify-between gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "SEO audit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => {
								const csv = [[
									"Check",
									"Status",
									"Action needed"
								], ...audit.map((a) => [
									a.label,
									a.pass ? "Pass" : "Fail",
									a.pass ? "" : a.hint
								])].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, "\"\"")}"`).join(",")).join("\n");
								const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
								const link = document.createElement("a");
								link.href = url;
								link.download = `mummy-rose-seo-audit-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
								link.click();
								URL.revokeObjectURL(url);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " CSV"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => window.print(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), " PDF"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: score >= 80 ? "default" : score >= 50 ? "secondary" : "destructive",
						children: [score, "/100"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-2.5",
				children: audit.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3 border-b pb-2 text-sm last:border-0",
					children: [row.pass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 size-4 shrink-0 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mt-0.5 size-4 shrink-0 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: row.pass ? "" : "font-medium",
						children: row.label
					}), !row.pass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: row.hint
					}) : null] })]
				}, row.label))
			})] })
		]
	});
}
function Metric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "pt-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1.5 font-display text-2xl font-semibold",
			children: value
		})]
	}) });
}
//#endregion
export { AdminAnalytics as component };
