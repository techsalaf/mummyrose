import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { O as effectivePrice } from "./router-Bg0ak8An.mjs";
import { C as Sparkles, N as RotateCcw, j as Search } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as ProductCard } from "./product-card-nmIB4KSC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-grid-B_kEwo_f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sorts = [
	{
		key: "featured",
		label: "Sort by: Bestsellers"
	},
	{
		key: "newest",
		label: "Sort by: Newest Batch"
	},
	{
		key: "price-asc",
		label: "Price: Low to High"
	},
	{
		key: "price-desc",
		label: "Price: High to Low"
	},
	{
		key: "name",
		label: "Name: A to Z"
	}
];
function ProductGrid({ products, categories = [], initialQuery = "", showCategoryFilter = true }) {
	const [query, setQuery] = (0, import_react.useState)(initialQuery);
	const [sort, setSort] = (0, import_react.useState)("featured");
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)(null);
	const [inStockOnly, setInStockOnly] = (0, import_react.useState)(false);
	const [onOfferOnly, setOnOfferOnly] = (0, import_react.useState)(false);
	const results = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		let list = products.filter((p) => {
			if (q) {
				if (!`${p.name} ${p.short_description ?? ""} ${(p.tags ?? []).join(" ")} ${p.categories?.name ?? ""}`.toLowerCase().includes(q)) return false;
			}
			if (selectedCategory && p.category_id !== selectedCategory) return false;
			if (inStockOnly && p.stock_quantity <= 0) return false;
			if (onOfferOnly && effectivePrice(p) >= Number(p.price)) return false;
			return true;
		});
		list = [...list];
		switch (sort) {
			case "price-asc":
				list.sort((a, b) => effectivePrice(a) - effectivePrice(b));
				break;
			case "price-desc":
				list.sort((a, b) => effectivePrice(b) - effectivePrice(a));
				break;
			case "name":
				list.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case "featured": list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
		}
		return list;
	}, [
		products,
		query,
		sort,
		selectedCategory,
		inStockOnly,
		onOfferOnly
	]);
	const resetFilters = () => {
		setQuery("");
		setSelectedCategory(null);
		setInStockOnly(false);
		setOnOfferOnly(false);
		setSort("featured");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		showCategoryFilter && categories.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setSelectedCategory(null),
				className: `rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${selectedCategory === null ? "bg-primary text-primary-foreground shadow-md" : "bg-secondary text-foreground hover:bg-secondary/80"}`,
				children: [
					"All Products (",
					products.length,
					")"
				]
			}), categories.map((c) => {
				const isSelected = selectedCategory === c.id;
				const count = products.filter((p) => p.category_id === c.id).length;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSelectedCategory(isSelected ? null : c.id),
					className: `whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${isSelected ? "bg-primary text-primary-foreground shadow-md" : "bg-secondary text-foreground hover:bg-secondary/80"}`,
					children: [
						c.name,
						" (",
						count,
						")"
					]
				}, c.id);
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-col gap-3 sm:flex-row sm:items-center justify-between border-y border-border/60 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1 max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search spices, flours, tea infusions…",
					"aria-label": "Search products",
					className: "pl-9 bg-card border-border/80"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setInStockOnly((v) => !v),
						className: `rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${inStockOnly ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`,
						children: "In Stock Only"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setOnOfferOnly((v) => !v),
						className: `rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${onOfferOnly ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`,
						children: "Special Offers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: sort,
						onChange: (e) => setSort(e.target.value),
						"aria-label": "Sort products",
						className: "h-9 rounded-lg border border-input bg-card px-3 text-xs font-semibold text-foreground",
						children: sorts.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.key,
							children: s.label
						}, s.key))
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs font-semibold tracking-wider text-muted-foreground uppercase",
				children: [
					"Showing ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground font-bold",
						children: results.length
					}),
					" of ",
					products.length,
					" Products"
				]
			}), (query || selectedCategory || inStockOnly || onOfferOnly) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: resetFilters,
				className: "inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), " Reset Filters"]
			})]
		}),
		results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "my-16 rounded-2xl border border-dashed border-border bg-card p-12 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mx-auto size-10 text-muted-foreground/60" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-2xl font-bold text-foreground mt-4",
					children: "No pantry items match your search"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground max-w-sm mx-auto",
					children: "Try adjusting your search query or clear the active category filters."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: resetFilters,
					variant: "outline",
					className: "mt-6 font-semibold",
					children: "Clear All Filters"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
			children: results.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
		})
	] });
}
//#endregion
export { ProductGrid as t };
