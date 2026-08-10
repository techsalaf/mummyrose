import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as effectivePrice, P as productImage, R as useCart, j as formatNaira } from "./router-Bg0ak8An.mjs";
import { E as ShoppingBag, Tt as Eye, Vt as Check, mt as Heart, ot as Leaf } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as cn, n as Button } from "./router-Bg0ak8An2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-card-nmIB4KSC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product, priority = false }) {
	const { addItem, toggleWishlist, isWishlisted } = useCart();
	const price = effectivePrice(product);
	const hasDiscount = price < Number(product.price);
	const image = productImage(product);
	const soldOut = product.stock_quantity <= 0;
	const saved = isWishlisted(product.slug);
	const weightOptions = product.weight_options && product.weight_options.length > 0 ? product.weight_options : ["100g", "250g"];
	const [selectedWeight, setSelectedWeight] = (0, import_react.useState)(weightOptions[0]);
	const [added, setAdded] = (0, import_react.useState)(false);
	const handleAddToCart = () => {
		addItem({
			product_id: product.id,
			slug: product.slug,
			name: product.name,
			image,
			unit_price: price,
			variant: selectedWeight
		});
		setAdded(true);
		toast.success(`${product.name} (${selectedWeight}) added to cart`);
		setTimeout(() => setAdded(false), 1800);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-400 hover:-translate-y-1 hover:shadow-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hover-zoom-img relative aspect-4/5 w-full bg-secondary/40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/products/$slug",
					params: { slug: product.slug },
					className: "block h-full w-full",
					"aria-label": product.name,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: image,
						alt: product.name,
						loading: priority ? "eager" : "lazy",
						width: 900,
						height: 1125,
						className: "h-full w-full object-cover"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none absolute top-3 left-3 flex flex-wrap gap-1.5 z-10",
					children: [
						hasDiscount ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground uppercase shadow-sm",
							children: "Sale"
						}) : null,
						product.is_featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-background/90 px-2.5 py-0.5 text-[10px] font-bold uppercase backdrop-blur text-foreground shadow-sm",
							children: "Best Seller"
						}) : null,
						soldOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-destructive px-2.5 py-0.5 text-[10px] font-bold text-destructive-foreground uppercase",
							children: "Sold Out"
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`,
					onClick: () => toggleWishlist(product.slug),
					className: "absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur transition-transform hover:scale-110 hover:text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-4 transition-colors", saved && "fill-primary text-primary") })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-x-3 bottom-3 z-10 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hidden sm:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "secondary",
						size: "sm",
						className: "w-full font-semibold shadow-md bg-background/95 hover:bg-background text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/products/$slug",
							params: { slug: product.slug },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-2 size-4" }), " Quick Details"]
						})
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-1 text-[11px] font-semibold text-accent uppercase tracking-wider",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "size-3" }), product.categories?.name ?? "Pantry"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
						children: "100% Natural"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/products/$slug",
					params: { slug: product.slug },
					className: "mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary",
						children: product.name
					})
				}),
				product.short_description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground",
					children: product.short_description
				}) : null,
				weightOptions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3.5 flex flex-wrap items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-semibold text-muted-foreground uppercase mr-1",
						children: "Size:"
					}), weightOptions.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSelectedWeight(w),
						className: `rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${selectedWeight === w ? "bg-primary text-primary-foreground font-semibold shadow-xs" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`,
						children: w
					}, w))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex items-center justify-between pt-5 border-t border-border/60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl font-bold text-foreground",
							children: formatNaira(price)
						}), hasDiscount ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground line-through",
							children: formatNaira(product.price)
						}) : null]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						disabled: soldOut,
						onClick: handleAddToCart,
						className: `font-semibold shadow-xs transition-all ${added ? "bg-accent text-accent-foreground" : ""}`,
						children: added ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1.5 size-4" }), " Added"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "mr-1.5 size-4" }), " Add"] })
					})]
				})
			]
		})]
	});
}
//#endregion
export { ProductCard as t };
