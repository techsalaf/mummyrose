import { o as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as Qs } from "../_libs/streamdown+[...].mjs";
import { a as require_jsx_runtime, i as streamText, n as DefaultChatTransport, o as require_react, r as convertToModelMessages, t as useChat } from "../_libs/@ai-sdk/react+[...].mjs";
import { a as getServerFnById, c as __exportAll, r as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-CTdGS_ot.mjs";
import { F as isRedirect, R as redirect, V as notFound, _ as createRootRouteWithContext, b as useRouter, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as createTanStackListToolsHandler, c as ToolError, d as numberType, f as objectType, i as createTanStackInvokeToolHandler, n as defineMcp, o as createTanStackMcpHandler, p as stringType, r as defineTool, s as createTanStackOAuthProtectedResourceMetadataHandler, t as auth, u as enumType } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
import { n as inquirySchema, r as newsletterSchema } from "./schemas-CNICxIYS.mjs";
import { $ as MapPin, At as CornerDownLeft, E as ShoppingBag, G as Music2, Q as Menu, Qt as ArrowRight, S as Square, Z as MessageCircle, c as User, en as ArrowDown, et as Mail, j as Search, mt as Heart, n as X, nt as LoaderCircle, p as TrendingUp, t as Youtube, u as Twitter, ut as Instagram, wt as Facebook, z as Phone, zt as ChevronDown } from "../_libs/lucide-react.mjs";
import { d as DialogContent$1, f as DialogDescription$1, h as DialogTitle$1, l as Dialog$1, m as DialogPortal$1, p as DialogOverlay$1, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Sheet, r as SheetContent, s as SheetTrigger, t as Input } from "./input-B8Q2ztVi.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as supabase } from "./client-Cf-9GAe8.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as QueryClientProvider, i as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as faqsQuery, c as productQuery, d as recipesQuery, i as categoriesQuery, m as testimonialsQuery, n as articlesQuery, o as postQuery, p as settingsQuery, s as postsQuery, u as productsQuery } from "./queries-BOD52kvY.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as useStickToBottomContext, t as StickToBottom } from "../_libs/use-stick-to-bottom.mjs";
import { t as A } from "../_libs/@streamdown/cjk+[...].mjs";
import { t as G } from "../_libs/shiki+streamdown__code.mjs";
import { t as h } from "../_libs/@streamdown/math+[...].mjs";
import { t as f } from "../_libs/@streamdown/mermaid+[...].mjs";
import { t as nanoid } from "../_libs/nanoid.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { t as createOpenAICompatible } from "../_libs/ai-sdk__openai-compatible.mjs";
import { i as cn, n as Button } from "./router-Bg0ak8An2.mjs";
import { createHmac, timingSafeEqual } from "crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-BRjDdn1h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/leads.functions-BiyqDpQ_.js
var submitInquiry = createServerFn({ method: "POST" }).inputValidator((data) => inquirySchema.parse(data)).handler(createSsrRpc("aae52ddaafa71e2fd6fe4f654d6748821a7a052b23661038917bedf31f658b0c"));
var subscribeNewsletter = createServerFn({ method: "POST" }).inputValidator((data) => newsletterSchema.parse(data)).handler(createSsrRpc("3cbee22e85d2a0512250a9b1695d1c0b39c73579ab0fa99c92f8e0c3d5eefe2b"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-Bg0ak8An.js
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-VoYjhs65.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
var CART_KEY = "mr.cart.v1";
var WISH_KEY = "mr.wishlist.v1";
var RECENT_KEY = "mr.recent.v1";
var CartContext = (0, import_react.createContext)(null);
function read(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function CartProvider({ children }) {
	const [items, setItems] = (0, import_react.useState)([]);
	const [wishlist, setWishlist] = (0, import_react.useState)([]);
	const [recentlyViewed, setRecentlyViewed] = (0, import_react.useState)([]);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setItems(read(CART_KEY, []));
		setWishlist(read(WISH_KEY, []));
		setRecentlyViewed(read(RECENT_KEY, []));
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(items));
	}, [items, hydrated]);
	(0, import_react.useEffect)(() => {
		if (hydrated) window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
	}, [wishlist, hydrated]);
	(0, import_react.useEffect)(() => {
		if (hydrated) window.localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyViewed));
	}, [recentlyViewed, hydrated]);
	const addItem = (0, import_react.useCallback)((item, quantity = 1) => {
		setItems((prev) => {
			const idx = prev.findIndex((i) => i.product_id === item.product_id && i.variant === item.variant);
			if (idx === -1) return [...prev, {
				...item,
				quantity
			}];
			const next = [...prev];
			next[idx] = {
				...next[idx],
				quantity: next[idx].quantity + quantity
			};
			return next;
		});
	}, []);
	const updateQuantity = (0, import_react.useCallback)((product_id, variant, quantity) => {
		setItems((prev) => quantity <= 0 ? prev.filter((i) => !(i.product_id === product_id && i.variant === variant)) : prev.map((i) => i.product_id === product_id && i.variant === variant ? {
			...i,
			quantity
		} : i));
	}, []);
	const removeItem = (0, import_react.useCallback)((product_id, variant) => {
		setItems((prev) => prev.filter((i) => !(i.product_id === product_id && i.variant === variant)));
	}, []);
	const clear = (0, import_react.useCallback)(() => setItems([]), []);
	const toggleWishlist = (0, import_react.useCallback)((slug) => {
		setWishlist((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
	}, []);
	const pushRecentlyViewed = (0, import_react.useCallback)((slug) => {
		setRecentlyViewed((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 8));
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		items,
		count: items.reduce((sum, i) => sum + i.quantity, 0),
		subtotal: items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0),
		wishlist,
		recentlyViewed,
		addItem,
		updateQuantity,
		removeItem,
		clear,
		toggleWishlist,
		isWishlisted: (slug) => wishlist.includes(slug),
		pushRecentlyViewed
	}), [
		items,
		wishlist,
		recentlyViewed,
		addItem,
		updateQuantity,
		removeItem,
		clear,
		toggleWishlist,
		pushRecentlyViewed
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartContext.Provider, {
		value,
		children
	});
}
function useCart() {
	const ctx = (0, import_react.useContext)(CartContext);
	if (!ctx) throw new Error("useCart must be used inside CartProvider");
	return ctx;
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var Command$1 = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}));
Command$1.displayName = _e.displayName;
var CommandInput = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
		ref,
		className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	})]
}));
CommandInput.displayName = _e.Input.displayName;
var CommandList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}));
CommandList.displayName = _e.List.displayName;
var CommandEmpty = import_react.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}));
CommandEmpty.displayName = _e.Empty.displayName;
var CommandGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}));
CommandGroup.displayName = _e.Group.displayName;
var CommandSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}));
CommandSeparator.displayName = _e.Separator.displayName;
var CommandItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
	ref,
	className: cn("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
	...props
}));
CommandItem.displayName = _e.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	});
};
CommandShortcut.displayName = "CommandShortcut";
function formatNaira(value) {
	const n = Number(value ?? 0);
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		maximumFractionDigits: 0
	}).format(Number.isFinite(n) ? n : 0);
}
function formatDate(value) {
	if (!value) return "—";
	return new Intl.DateTimeFormat("en-NG", {
		day: "numeric",
		month: "short",
		year: "numeric"
	}).format(new Date(value));
}
function formatDateTime(value) {
	if (!value) return "—";
	return new Intl.DateTimeFormat("en-NG", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	}).format(new Date(value));
}
function effectivePrice(product) {
	const price = Number(product.price ?? 0);
	const discount = product.discount_price == null ? null : Number(product.discount_price);
	return discount != null && discount > 0 && discount < price ? discount : price;
}
function slugify(input) {
	return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
var cat_flours_default = "/assets/cat-flours-Exw2OzrL.jpg";
var cat_spices_default = "/assets/cat-spices-AL6nHNwX.jpg";
var cat_tea_default = "/assets/cat-tea-CReIrD0m.jpg";
var cat_cereals_default = "/assets/cat-cereals-F1Yhnk0Q.jpg";
/**
* Fallback imagery per category slug, used until the team uploads
* product photography through the admin media fields.
*/
var bySlug = {
	flours: cat_flours_default,
	seasonings: cat_spices_default,
	spices: cat_spices_default,
	"sweet-savory": cat_cereals_default,
	"tea-infusions": cat_tea_default,
	cereals: cat_cereals_default
};
function categoryImage(slug) {
	return slug && bySlug[slug] || "/assets/cat-spices-AL6nHNwX.jpg";
}
function productImage(product, categorySlug) {
	return product.image_url || categoryImage(product.categories?.slug ?? categorySlug);
}
/** Smart search with live product, category and tag suggestions (⌘K / Ctrl+K). */
function SearchCommand() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [term, setTerm] = (0, import_react.useState)("");
	const navigate = useNavigate();
	const { data: products = [] } = useQuery({
		...productsQuery,
		enabled: open
	});
	const { data: categories = [] } = useQuery({
		...categoriesQuery,
		enabled: open
	});
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				setOpen((prev) => !prev);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	const needle = term.trim().toLowerCase();
	const matches = (0, import_react.useMemo)(() => {
		if (!needle) return products.filter((product) => product.is_featured).slice(0, 5);
		return products.filter((product) => [
			product.name,
			product.short_description,
			...product.tags ?? []
		].filter(Boolean).some((field) => String(field).toLowerCase().includes(needle))).slice(0, 7);
	}, [products, needle]);
	const categoryMatches = (0, import_react.useMemo)(() => needle ? categories.filter((c) => c.name.toLowerCase().includes(needle)).slice(0, 4) : categories.slice(0, 4), [categories, needle]);
	const go = (fn) => {
		setOpen(false);
		setTerm("");
		fn();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "ghost",
		size: "icon",
		"aria-label": "Search products",
		onClick: () => setOpen(true),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "overflow-hidden p-0 sm:max-w-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "sr-only",
				children: "Search Mummy Rose"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Command$1, {
				shouldFilter: false,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandInput, {
					value: term,
					onValueChange: setTerm,
					placeholder: "Search spices, blends, flours, recipes…"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandList, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandEmpty, { children: "No matches. Try “curry”, “thyme” or “jollof”." }),
					matches.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
						heading: needle ? "Products" : "Popular right now",
						children: matches.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							value: product.slug,
							onSelect: () => go(() => navigate({
								to: "/products/$slug",
								params: { slug: product.slug }
							})),
							className: "gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: productImage(product),
									alt: "",
									className: "size-9 shrink-0 rounded-md object-cover",
									loading: "lazy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 flex-1 truncate",
									children: product.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: formatNaira(effectivePrice(product))
								})
							]
						}, product.id))
					}) : null,
					categoryMatches.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
						heading: "Categories",
						children: categoryMatches.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							value: `category-${category.slug}`,
							onSelect: () => go(() => navigate({
								to: "/category/$slug",
								params: { slug: category.slug }
							})),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4 text-accent" }), category.name]
						}, category.id))
					}) : null,
					needle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
						heading: "Search",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							value: "see-all",
							onSelect: () => go(() => navigate({
								to: "/products",
								search: { q: term }
							})),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }),
								"See all results for “",
								term,
								"”"
							]
						})
					}) : null
				] })]
			})]
		})
	})] });
}
/** Ordered, toggleable home page content blocks. */
var HOME_SECTIONS = [
	{
		id: "promises",
		label: "Trust marquee"
	},
	{
		id: "featured",
		label: "Best sellers"
	},
	{
		id: "story",
		label: "Story band"
	},
	{
		id: "categories",
		label: "Editorial categories"
	},
	{
		id: "sourcing",
		label: "Sourcing & craft bands"
	},
	{
		id: "discovery",
		label: "New arrivals rail"
	},
	{
		id: "testimonials",
		label: "Reviews"
	},
	{
		id: "journal",
		label: "Journal & recipes"
	},
	{
		id: "banners",
		label: "CMS banners"
	},
	{
		id: "newsletter",
		label: "Newsletter"
	}
];
var DEFAULT_BRANDING = {
	name: "Mummy Rose",
	tagline: "Natural Nigerian Pantry",
	logo_url: "",
	favicon_url: "",
	announcement: "Free delivery on orders over ₦50,000",
	announcement_enabled: true
};
var DEFAULT_THEME = {
	primary: "",
	primary_foreground: "",
	accent: "",
	background: "",
	foreground: "",
	ink: "",
	gold: "",
	radius: "",
	heading_font: "Instrument Serif",
	body_font: "Work Sans"
};
var DEFAULT_SEO_META = {
	title: "Mummy Rose — Natural Nigerian Spices, Flours & Infusions",
	description: "Small-batch Nigerian spices, stone-milled flours and herbal infusions. Shop retail, or partner with us for wholesale, export and white-label supply.",
	keywords: "",
	og_image: "",
	twitter_handle: "",
	site_url: "https://mummyrose.com",
	ga4_id: "",
	gsc_verification: ""
};
var DEFAULT_HOME = {
	hero_eyebrow: "Natural Nigerian pantry",
	hero_title: "Real food ingredients, milled and blended in small batches",
	hero_body: "Spices, stone-milled flours, cereals and herbal infusions sourced directly from Nigerian farms — for home kitchens, restaurants and global distributors.",
	hero_image: "",
	hero_image_alt: "",
	hero_overlay: 18,
	primary_cta_label: "Shop the pantry",
	primary_cta_href: "/products",
	secondary_cta_label: "Wholesale & export",
	secondary_cta_href: "/wholesale",
	section_order: [
		"promises",
		"featured",
		"story",
		"categories",
		"sourcing",
		"discovery",
		"testimonials",
		"journal",
		"banners",
		"newsletter"
	],
	promises: [
		{
			icon: "leaf",
			title: "100% natural",
			body: "No preservatives, fillers or artificial colouring — ever."
		},
		{
			icon: "package",
			title: "Small batch",
			body: "Milled and blended weekly so nothing sits on a shelf."
		},
		{
			icon: "truck",
			title: "Nationwide delivery",
			body: "Fast dispatch across Nigeria, export worldwide."
		},
		{
			icon: "shield",
			title: "Traceable sourcing",
			body: "Direct farm partnerships across Nigeria's food belt."
		}
	],
	promises_enabled: true,
	categories_eyebrow: "Shop by category",
	categories_title: "Everything from the Nigerian pantry",
	categories_enabled: true,
	featured_eyebrow: "Best sellers",
	featured_title: "Loved in kitchens nationwide",
	featured_enabled: true,
	story_eyebrow: "Our story",
	story_title: "Started in a family kitchen in Lagos",
	story_body: "Mummy Rose began with one conviction: Nigerian food deserves ingredients that are clean, honest and consistent. We work directly with farming cooperatives, dry and mill in controlled batches, and pack without preservatives so every jar tastes the way it should.",
	story_image: "",
	story_image_alt: "",
	story_cta_label: "Read our story",
	story_cta_href: "/about",
	story_enabled: true,
	sourcing_enabled: true,
	discovery_enabled: true,
	journal_enabled: true,
	newsletter_enabled: true,
	testimonials_eyebrow: "What customers say",
	testimonials_enabled: true
};
var DEFAULT_FOOTER = {
	blurb: "Natural spices, stone-milled flours and herbal infusions, sourced from Nigerian farms and packed in small batches for kitchens around the world.",
	email: "hello@mummyrose.com",
	phone: "+234 800 000 0000",
	address: "Lagos, Nigeria",
	instagram: "https://instagram.com/mummyrose",
	facebook: "",
	twitter: "",
	tiktok: "",
	youtube: "",
	copyright: "",
	shop_heading: "Shop",
	business_heading: "Business",
	newsletter_heading: "Stay in the kitchen",
	newsletter_body: "Recipes, restocks and quiet offers. No noise."
};
function merge(defaults, saved) {
	const out = { ...defaults };
	const value = saved ?? {};
	for (const [key, raw] of Object.entries(value)) {
		if (raw === null || raw === void 0 || raw === "") continue;
		out[key] = raw;
	}
	return out;
}
function buildSiteConfig(map) {
	return {
		branding: merge(DEFAULT_BRANDING, map?.branding),
		theme: merge(DEFAULT_THEME, map?.theme),
		seo: merge(DEFAULT_SEO_META, map?.seo),
		home: merge(DEFAULT_HOME, map?.home),
		footer: merge(DEFAULT_FOOTER, map?.footer)
	};
}
/** Live storefront configuration; re-renders as soon as an admin saves. */
function useSiteConfig() {
	const { data } = useQuery({
		...settingsQuery,
		staleTime: 3e4
	});
	return buildSiteConfig(data);
}
/** Every storefront route whose meta tags can be centrally overridden. */
var SEO_PAGES = [
	{
		path: "/",
		label: "Home"
	},
	{
		path: "/products",
		label: "Products"
	},
	{
		path: "/recipes",
		label: "Recipes & journal"
	},
	{
		path: "/about",
		label: "About"
	},
	{
		path: "/contact",
		label: "Contact"
	},
	{
		path: "/faq",
		label: "FAQ"
	},
	{
		path: "/retail",
		label: "Retail & stockists"
	},
	{
		path: "/wholesale",
		label: "Wholesale"
	},
	{
		path: "/export",
		label: "Export"
	},
	{
		path: "/white-labelling",
		label: "White labelling"
	},
	{
		path: "/corporate-supply",
		label: "Corporate supply"
	},
	{
		path: "/custom-packaging",
		label: "Custom packaging"
	},
	{
		path: "/shipping",
		label: "Shipping & delivery"
	},
	{
		path: "/refunds",
		label: "Returns & refunds"
	},
	{
		path: "/track-order",
		label: "Track order"
	},
	{
		path: "/cart",
		label: "Cart"
	},
	{
		path: "/checkout",
		label: "Checkout"
	}
];
var EMPTY_PAGE_SEO = {
	title: "",
	description: "",
	keywords: "",
	og_image: ""
};
/** Longest-prefix match so /products/ogiri inherits the /products overrides. */
function resolvePageSeo(pages, pathname) {
	if (!pages) return {};
	if (pages[pathname]) return pages[pathname];
	const match = Object.keys(pages).filter((p) => p !== "/" && pathname.startsWith(p)).sort((a, b) => b.length - a.length)[0];
	return match ? pages[match] : {};
}
/** Meta overrides keyed by route path, edited in /admin/settings → SEO. */
function usePageSeoMap() {
	const { data } = useQuery({
		...settingsQuery,
		staleTime: 3e4
	});
	return data?.pages_seo ?? {};
}
var GOOGLE_FONTS = [
	"Fraunces",
	"Karla",
	"Playfair Display",
	"DM Serif Display",
	"Cormorant Garamond",
	"Lora",
	"Libre Baskerville",
	"Space Grotesk",
	"Inter",
	"Manrope",
	"Work Sans",
	"Outfit",
	"Sora",
	"Jost",
	"Nunito Sans"
];
function googleFontHref(fonts) {
	return `https://fonts.googleapis.com/css2?${Array.from(new Set(fonts.filter(Boolean))).map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@300;400;500;600;700`).join("&")}&display=swap`;
}
var shopCategories = [
	{
		to: "/products",
		label: "All Products",
		description: "Explore the full Mummy Rose pantry collection"
	},
	{
		to: "/category/$slug",
		params: { slug: "spices" },
		label: "Spices & Seasonings",
		description: "Spices the way Mummy made them"
	},
	{
		to: "/category/$slug",
		params: { slug: "flours" },
		label: "Flours & Cereals",
		description: "From Grain to Goodness"
	},
	{
		to: "/category/$slug",
		params: { slug: "tea-infusions" },
		label: "Tea Infusions",
		description: "Brew with love, sip with memory"
	},
	{
		to: "/category/$slug",
		params: { slug: "sweet-savory" },
		label: "Sweet & Savory",
		description: "Natural sweeteners & nut powders"
	}
];
var servicesList = [
	{
		to: "/services",
		label: "Overview of Solutions",
		description: "Complete B2B food manufacturing portal"
	},
	{
		to: "/white-labelling",
		label: "White Labelling",
		description: "Build your brand with Mummy Rose processing"
	},
	{
		to: "/wholesale",
		label: "Wholesale & Bulk",
		description: "Direct supply for distributors & retailers"
	},
	{
		to: "/custom-packaging",
		label: "Custom Packaging",
		description: "Tailored jars, sachets & retail cartons"
	},
	{
		to: "/export",
		label: "Global Export",
		description: "African food products delivered worldwide"
	},
	{
		to: "/corporate-supply",
		label: "Corporate & Events",
		description: "Custom gifting & wellness hampers"
	}
];
function SiteHeader() {
	const { count } = useCart();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const { branding } = useSiteConfig();
	(0, import_react.useEffect)(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 24);
		};
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: `sticky top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-border/80 bg-background/95 shadow-sm backdrop-blur-md py-1" : "border-b border-border/40 bg-background/75 backdrop-blur-sm py-2.5"}`,
		children: [branding.announcement_enabled && branding.announcement ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-primary text-primary-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page flex h-8 items-center justify-center gap-3 text-[11px] font-medium tracking-[0.2em] uppercase",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: branding.announcement })
			})
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page flex items-center justify-between gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
						open,
						onOpenChange: setOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "lg:hidden",
								"aria-label": "Open menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
							side: "left",
							className: "w-[88vw] max-w-md overflow-y-auto bg-background p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2 border-b pb-5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-2xl font-bold tracking-tight text-primary",
									children: branding.name
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								className: "mt-6 flex flex-col gap-6",
								onClick: () => setOpen(false),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "eyebrow text-muted-foreground",
										children: "Main Navigation"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-col gap-3 font-display text-xl",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/",
												className: "hover:text-primary transition-colors",
												children: "Home"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/about",
												className: "hover:text-primary transition-colors",
												children: "Our Story"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/recipes",
												className: "hover:text-primary transition-colors",
												children: "Recipes & Ideas"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/contact",
												className: "hover:text-primary transition-colors",
												children: "Contact"
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "eyebrow text-muted-foreground",
										children: "Shop Collections"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 flex flex-col gap-2.5",
										children: shopCategories.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: item.to,
											params: "params" in item ? item.params : void 0,
											className: "group flex flex-col text-sm font-medium hover:text-primary",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-normal text-muted-foreground",
												children: item.description
											})]
										}, item.label))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "eyebrow text-muted-foreground",
										children: "Business Solutions"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 flex flex-col gap-2.5",
										children: servicesList.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: item.to,
											className: "group flex flex-col text-sm font-medium hover:text-primary",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-normal text-muted-foreground",
												children: item.description
											})]
										}, item.to))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "border-t pt-5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											className: "w-full",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/products",
												children: ["Shop Now ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 size-4" })]
											})
										})
									})
								]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2.5",
						children: [branding.logo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: branding.logo_url,
							alt: branding.name,
							className: "h-10 w-auto max-w-40 object-contain"
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex flex-col",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-2xl font-bold tracking-tight text-primary sm:text-2xl",
								children: branding.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-[9px] font-semibold tracking-[0.3em] text-accent uppercase md:block",
								children: "Nature’s Goodness · Mummy’s Touch"
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-7 text-sm font-medium lg:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "transition-colors hover:text-primary",
							children: "Home"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/about",
							className: "transition-colors hover:text-primary",
							children: "Our Story"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavMegaMenu, {
							label: "Shop",
							items: shopCategories,
							mainTo: "/products"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavMegaMenu, {
							label: "Services",
							items: servicesList,
							mainTo: "/services"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/recipes",
							className: "transition-colors hover:text-primary",
							children: "Recipes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contact",
							className: "transition-colors hover:text-primary",
							children: "Contact"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 sm:gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchCommand, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							asChild: true,
							"aria-label": "Wishlist",
							className: "hover:text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/wishlist",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-5" })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							asChild: true,
							"aria-label": "Account",
							className: "hover:text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/account",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-5" })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							asChild: true,
							"aria-label": "Cart",
							className: "relative hover:text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/cart",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5" }), count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm",
									children: count
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							className: "hidden font-medium sm:inline-flex ml-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/products",
								children: "Shop Now"
							})
						})
					]
				})
			]
		})]
	});
}
function NavMegaMenu({ label, items, mainTo }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: mainTo,
			className: "inline-flex items-center gap-1 py-2 font-medium transition-colors hover:text-primary",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5 transition-transform group-hover:rotate-180 text-muted-foreground" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "invisible absolute top-full left-1/2 z-50 w-72 -translate-x-1/2 pt-2 opacity-0 transition-all duration-250 ease-out group-hover:visible group-hover:opacity-100",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card rounded-lg p-3 shadow-xl border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-1",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						params: item.params,
						className: "group/item flex flex-col rounded-md p-2.5 transition-colors hover:bg-secondary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-foreground group-hover/item:text-primary",
							children: item.label
						}), item.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: item.description
						}) : null]
					}, item.label))
				})
			})
		})]
	});
}
function NewsletterForm({ tone = "light" }) {
	const subscribe = useServerFn(subscribeNewsletter);
	const [email, setEmail] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		const parsed = newsletterSchema.safeParse({ email });
		if (!parsed.success) {
			toast.error(parsed.error.issues[0].message);
			return;
		}
		setPending(true);
		try {
			await subscribe({ data: parsed.data });
			setEmail("");
			toast.success("You're on the list. Welcome to the family.");
		} catch {
			toast.error("Could not subscribe right now. Please try again.");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "flex w-full max-w-md gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: "email",
			required: true,
			value: email,
			onChange: (e) => setEmail(e.target.value),
			placeholder: "you@email.com",
			"aria-label": "Email address",
			className: tone === "dark" ? "border-ink-foreground/25 bg-transparent text-ink-foreground placeholder:text-ink-foreground/40" : void 0
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "submit",
			disabled: pending,
			variant: tone === "dark" ? "clay" : "default",
			children: pending ? "…" : "Join"
		})]
	});
}
var socialFields = [
	{
		key: "instagram",
		icon: Instagram,
		label: "Instagram"
	},
	{
		key: "facebook",
		icon: Facebook,
		label: "Facebook"
	},
	{
		key: "twitter",
		icon: Twitter,
		label: "X / Twitter"
	},
	{
		key: "tiktok",
		icon: Music2,
		label: "TikTok"
	},
	{
		key: "youtube",
		icon: Youtube,
		label: "YouTube"
	}
];
function SiteFooter() {
	const { branding, footer } = useSiteConfig();
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const socials = socialFields.filter((s) => Boolean(footer[s.key]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "bg-ink text-ink-foreground border-t border-border/40 pt-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2",
					children: [
						branding.logo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: branding.logo_url,
							alt: branding.name,
							className: "h-10 w-auto max-w-40 object-contain"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-3xl font-bold tracking-tight text-white",
							children: branding.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm font-semibold tracking-widest text-accent uppercase",
							children: "Nature’s Goodness, Mummy’s Touch."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-sm text-xs leading-relaxed text-ink-foreground/75",
							children: footer.blurb || "Mummy Rose crafts natural spices, stone-milled flours, and herbal tea infusions inspired by generations of traditional home cooking — without preservatives or fillers."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-col gap-2.5 text-xs text-ink-foreground/80",
							children: [
								footer.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `mailto:${footer.email}`,
									className: "flex items-center gap-2 hover:text-gold transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4 text-accent" }),
										" ",
										footer.email
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "mailto:hello@mummyrose.com",
									className: "flex items-center gap-2 hover:text-gold transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4 text-accent" }), " hello@mummyrose.com"]
								}),
								footer.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `tel:${footer.phone.replace(/\s/g, "")}`,
									className: "flex items-center gap-2 hover:text-gold transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4 text-accent" }),
										" ",
										footer.phone
									]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2 text-ink-foreground/70",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 text-accent" }), " Lagos, Nigeria (Global Shipping)"]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg font-bold text-white tracking-wide",
					children: "Shop Pantry"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 flex flex-col gap-2 text-xs text-ink-foreground/80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/products",
							className: "hover:text-gold transition-colors",
							children: "All Products"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/category/$slug",
							params: { slug: "spices" },
							className: "hover:text-gold transition-colors",
							children: "Spices & Seasonings"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/category/$slug",
							params: { slug: "flours" },
							className: "hover:text-gold transition-colors",
							children: "Flours & Cereals"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/category/$slug",
							params: { slug: "tea-infusions" },
							className: "hover:text-gold transition-colors",
							children: "Herbal Tea Infusions"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/category/$slug",
							params: { slug: "sweet-savory" },
							className: "hover:text-gold transition-colors",
							children: "Sweeteners & Nut Powders"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/wishlist",
							className: "hover:text-gold transition-colors",
							children: "Saved Wishlist"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg font-bold text-white tracking-wide",
					children: "B2B & Solutions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 flex flex-col gap-2 text-xs text-ink-foreground/80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/services",
							className: "hover:text-gold transition-colors font-semibold text-white",
							children: "All B2B Solutions"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/white-labelling",
							className: "hover:text-gold transition-colors",
							children: "White Labelling"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/wholesale",
							className: "hover:text-gold transition-colors",
							children: "Wholesale & Bulk"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/retail",
							className: "hover:text-gold transition-colors",
							children: "Retail & Supermarkets"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/custom-packaging",
							className: "hover:text-gold transition-colors",
							children: "Custom Packaging"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/export",
							className: "hover:text-gold transition-colors",
							children: "Global Export"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/corporate-supply",
							className: "hover:text-gold transition-colors",
							children: "Corporate Gifting"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-bold text-white tracking-wide",
						children: "Stay Connected"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-ink-foreground/75 leading-relaxed",
						children: footer.newsletter_body || "Subscribe for seasonal African recipes, new blend arrivals, and quiet pantry restock offers."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsletterForm, { tone: "dark" })
					}),
					socials.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 flex items-center gap-3",
						children: socials.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: footer[s.key],
							target: "_blank",
							rel: "noreferrer noopener",
							"aria-label": s.label,
							className: "flex size-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-gold hover:text-ink transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "size-4" })
						}, s.key))
					})
				] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-white/10 bg-black/30",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page flex flex-col items-center justify-between gap-4 py-6 text-xs text-ink-foreground/60 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: footer.copyright || `© ${year} ${branding.name} Ltd. All rights reserved.` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-center gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/about",
							className: "hover:text-gold transition-colors",
							children: "Our Story"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/recipes",
							className: "hover:text-gold transition-colors",
							children: "Recipes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contact",
							className: "hover:text-gold transition-colors",
							children: "Contact"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/privacy",
							className: "hover:text-gold transition-colors",
							children: "Privacy Policy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/terms",
							className: "hover:text-gold transition-colors",
							children: "Terms of Use"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/track-order",
							className: "hover:text-gold transition-colors",
							children: "Track Order"
						})
					]
				})]
			})
		})]
	});
}
function setMeta(attr, key, content) {
	if (!content) return;
	let el = document.head.querySelector(`meta[${attr}="${key}"]`);
	if (!el) {
		el = document.createElement("meta");
		el.setAttribute(attr, key);
		document.head.appendChild(el);
	}
	el.setAttribute("content", content);
}
function setLink(rel, href, id) {
	if (!href) return;
	let el = document.head.querySelector(`link[data-cms="${id}"]`);
	if (!el) {
		el = document.createElement("link");
		el.rel = rel;
		el.dataset.cms = id;
		document.head.appendChild(el);
	}
	el.href = href;
}
/**
* Applies the CMS-managed brand identity to the live document: theme tokens,
* fonts, favicon and default meta tags. Rendered once from the root route.
*/
function SiteChrome() {
	const { branding, theme, seo } = useSiteConfig();
	const pageSeoMap = usePageSeoMap();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const page = resolvePageSeo(pageSeoMap, pathname);
	(0, import_react.useEffect)(() => {
		const rules = [];
		const push = (name, value) => {
			if (value?.trim()) rules.push(`${name}: ${value.trim()};`);
		};
		push("--primary", theme.primary);
		push("--primary-foreground", theme.primary_foreground);
		push("--accent", theme.accent);
		push("--background", theme.background);
		push("--foreground", theme.foreground);
		push("--ink", theme.ink);
		push("--gold", theme.gold);
		push("--radius", theme.radius);
		const heading = theme.heading_font?.trim();
		const body = theme.body_font?.trim();
		const css = [
			rules.length ? `:root{${rules.join("")}}` : "",
			heading ? `.font-display,h1,h2,h3,.eyebrow{font-family:"${heading}",ui-serif,Georgia,serif;}` : "",
			body ? `body{font-family:"${body}",ui-sans-serif,system-ui,sans-serif;}` : ""
		].filter(Boolean).join("\n");
		let style = document.getElementById("cms-theme");
		if (!style) {
			style = document.createElement("style");
			style.id = "cms-theme";
			document.head.appendChild(style);
		}
		style.textContent = css;
		if (heading || body) setLink("stylesheet", googleFontHref([heading, body].filter(Boolean)), "fonts");
	}, [theme]);
	(0, import_react.useEffect)(() => {
		if (branding.favicon_url) {
			setLink("icon", branding.favicon_url, "favicon");
			document.head.querySelectorAll("link[rel=\"icon\"]:not([data-cms])").forEach((el) => el.remove());
		}
	}, [branding.favicon_url]);
	(0, import_react.useEffect)(() => {
		const name = branding.name?.trim() || DEFAULT_BRANDING.name;
		if (name !== DEFAULT_BRANDING.name && document.title.includes(DEFAULT_BRANDING.name)) document.title = document.title.split(DEFAULT_BRANDING.name).join(name);
		setMeta("property", "og:site_name", name);
		const title = page.title?.trim();
		if (title) {
			document.title = title;
			setMeta("property", "og:title", title);
			setMeta("name", "twitter:title", title);
		}
		const description = page.description?.trim() || seo.description;
		if (description) {
			setMeta("name", "description", description);
			setMeta("property", "og:description", description);
			setMeta("name", "twitter:description", description);
		}
		const keywords = page.keywords?.trim() || seo.keywords;
		if (keywords) setMeta("name", "keywords", keywords);
		const ogImage = page.og_image?.trim() || seo.og_image;
		if (ogImage) {
			setMeta("property", "og:image", ogImage);
			setMeta("name", "twitter:image", ogImage);
		}
		if (seo.twitter_handle) setMeta("name", "twitter:site", seo.twitter_handle);
	}, [
		branding.name,
		seo,
		page,
		pathname
	]);
	(0, import_react.useEffect)(() => {
		const url = `${seo.site_url?.trim().replace(/\/$/, "") || window.location.origin}${pathname === "/" ? "/" : pathname}`;
		setLink("canonical", url, "canonical");
		setMeta("property", "og:url", url);
	}, [seo.site_url, pathname]);
	(0, import_react.useEffect)(() => {
		const token = seo.gsc_verification?.trim();
		if (token) setMeta("name", "google-site-verification", token);
	}, [seo.gsc_verification]);
	(0, import_react.useEffect)(() => {
		const id = seo.ga4_id?.trim();
		if (!id || document.getElementById("ga4-src")) return;
		const loader = document.createElement("script");
		loader.id = "ga4-src";
		loader.async = true;
		loader.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
		document.head.appendChild(loader);
		const inline = document.createElement("script");
		inline.id = "ga4-init";
		inline.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(id)});`;
		document.head.appendChild(inline);
	}, [seo.ga4_id]);
	(0, import_react.useEffect)(() => {
		const gtag = window.gtag;
		if (seo.ga4_id?.trim() && gtag) gtag("event", "page_view", { page_path: pathname });
	}, [pathname, seo.ga4_id]);
	return null;
}
var Conversation = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickToBottom, {
	className: cn("relative flex-1 overflow-y-hidden", className),
	initial: "smooth",
	resize: "smooth",
	role: "log",
	...props
});
var ConversationContent = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickToBottom.Content, {
	className: cn("flex flex-col gap-8 p-4", className),
	...props
});
var ConversationScrollButton = ({ className, ...props }) => {
	const { isAtBottom, scrollToBottom } = useStickToBottomContext();
	const handleScrollToBottom = (0, import_react.useCallback)(() => {
		scrollToBottom();
	}, [scrollToBottom]);
	return !isAtBottom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		className: cn("absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full dark:bg-background dark:hover:bg-muted", className),
		onClick: handleScrollToBottom,
		size: "icon",
		type: "button",
		variant: "outline",
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-4" })
	});
};
var Message = ({ className, from, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("group flex w-full max-w-[95%] flex-col gap-2", from === "user" ? "is-user ml-auto justify-end" : "is-assistant", className),
	...props
});
var MessageContent = ({ children, className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("is-user:dark flex w-fit min-w-0 max-w-full flex-col gap-2 overflow-hidden text-sm", "group-[.is-user]:ml-auto group-[.is-user]:rounded-lg group-[.is-user]:bg-secondary group-[.is-user]:px-4 group-[.is-user]:py-3 group-[.is-user]:text-foreground", "group-[.is-assistant]:text-foreground", className),
	...props,
	children
});
(0, import_react.createContext)(null);
var streamdownPlugins = {
	cjk: A,
	code: G,
	math: h,
	mermaid: f
};
var MessageResponse = (0, import_react.memo)(({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Qs, {
	className: cn("size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0", className),
	plugins: streamdownPlugins,
	...props
}), (prevProps, nextProps) => prevProps.children === nextProps.children && nextProps.isAnimating === prevProps.isAnimating);
MessageResponse.displayName = "MessageResponse";
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function InputGroup({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "input-group",
		role: "group",
		className: cn("group/input-group border-input dark:bg-input/30 shadow-xs relative flex w-full items-center rounded-md border outline-none transition-[color,box-shadow]", "h-9 has-[>textarea]:h-auto", "has-[>[data-align=inline-start]]:[&>input]:pl-2", "has-[>[data-align=inline-end]]:[&>input]:pr-2", "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3", "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3", "has-[[data-slot=input-group-control]:focus-visible]:ring-ring has-[[data-slot=input-group-control]:focus-visible]:ring-1", "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40", className),
		...props
	});
}
var inputGroupAddonVariants = cva("text-muted-foreground flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4", {
	variants: { align: {
		"inline-start": "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
		"inline-end": "order-last pr-3 has-[>button]:mr-[-0.4rem] has-[>kbd]:mr-[-0.35rem]",
		"block-start": "[.border-b]:pb-3 order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5",
		"block-end": "[.border-t]:pt-3 order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5"
	} },
	defaultVariants: { align: "inline-start" }
});
function InputGroupAddon({ className, align = "inline-start", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "group",
		"data-slot": "input-group-addon",
		"data-align": align,
		className: cn(inputGroupAddonVariants({ align }), className),
		onClick: (e) => {
			if (e.target.closest("button")) return;
			e.currentTarget.parentElement?.querySelector("input")?.focus();
		},
		...props
	});
}
var inputGroupButtonVariants = cva("flex items-center gap-2 text-sm shadow-none", {
	variants: { size: {
		xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
		sm: "h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5",
		"icon-xs": "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
		"icon-sm": "size-8 p-0 has-[>svg]:p-0"
	} },
	defaultVariants: { size: "xs" }
});
function InputGroupButton({ className, type = "button", variant = "ghost", size = "xs", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		type,
		"data-size": size,
		variant,
		className: cn(inputGroupButtonVariants({ size }), className),
		...props
	});
}
function InputGroupTextarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
		"data-slot": "input-group-control",
		className: cn("flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent", className),
		...props
	});
}
function Spinner({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
		role: "status",
		"aria-label": "Loading",
		className: cn("size-4 animate-spin", className),
		...props
	});
}
var convertBlobUrlToDataUrl = async (url) => {
	try {
		const blob = await (await fetch(url)).blob();
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = () => resolve(null);
			reader.readAsDataURL(blob);
		});
	} catch {
		return null;
	}
};
var PromptInputController = (0, import_react.createContext)(null);
var ProviderAttachmentsContext = (0, import_react.createContext)(null);
var useOptionalPromptInputController = () => (0, import_react.useContext)(PromptInputController);
var useOptionalProviderAttachments = () => (0, import_react.useContext)(ProviderAttachmentsContext);
var LocalAttachmentsContext = (0, import_react.createContext)(null);
var usePromptInputAttachments = () => {
	const provider = useOptionalProviderAttachments();
	const context = (0, import_react.useContext)(LocalAttachmentsContext) ?? provider;
	if (!context) throw new Error("usePromptInputAttachments must be used within a PromptInput or PromptInputProvider");
	return context;
};
var LocalReferencedSourcesContext = (0, import_react.createContext)(null);
var PromptInput = ({ className, accept, multiple, globalDrop, syncHiddenInput, maxFiles, maxFileSize, onError, onSubmit, children, ...props }) => {
	const controller = useOptionalPromptInputController();
	const usingProvider = !!controller;
	const inputRef = (0, import_react.useRef)(null);
	const formRef = (0, import_react.useRef)(null);
	const [items, setItems] = (0, import_react.useState)([]);
	const files = usingProvider ? controller.attachments.files : items;
	const [referencedSources, setReferencedSources] = (0, import_react.useState)([]);
	const filesRef = (0, import_react.useRef)(files);
	(0, import_react.useEffect)(() => {
		filesRef.current = files;
	}, [files]);
	const openFileDialogLocal = (0, import_react.useCallback)(() => {
		inputRef.current?.click();
	}, []);
	const matchesAccept = (0, import_react.useCallback)((f) => {
		if (!accept || accept.trim() === "") return true;
		return accept.split(",").map((s) => s.trim()).filter(Boolean).some((pattern) => {
			if (pattern.endsWith("/*")) {
				const prefix = pattern.slice(0, -1);
				return f.type.startsWith(prefix);
			}
			return f.type === pattern;
		});
	}, [accept]);
	const addLocal = (0, import_react.useCallback)((fileList) => {
		const incoming = [...fileList];
		const accepted = incoming.filter((f) => matchesAccept(f));
		if (incoming.length && accepted.length === 0) {
			onError?.({
				code: "accept",
				message: "No files match the accepted types."
			});
			return;
		}
		const withinSize = (f) => maxFileSize ? f.size <= maxFileSize : true;
		const sized = accepted.filter(withinSize);
		if (accepted.length > 0 && sized.length === 0) {
			onError?.({
				code: "max_file_size",
				message: "All files exceed the maximum size."
			});
			return;
		}
		setItems((prev) => {
			const capacity = typeof maxFiles === "number" ? Math.max(0, maxFiles - prev.length) : void 0;
			const capped = typeof capacity === "number" ? sized.slice(0, capacity) : sized;
			if (typeof capacity === "number" && sized.length > capacity) onError?.({
				code: "max_files",
				message: "Too many files. Some were not added."
			});
			const next = [];
			for (const file of capped) next.push({
				filename: file.name,
				id: nanoid(),
				mediaType: file.type,
				type: "file",
				url: URL.createObjectURL(file)
			});
			return [...prev, ...next];
		});
	}, [
		matchesAccept,
		maxFiles,
		maxFileSize,
		onError
	]);
	const removeLocal = (0, import_react.useCallback)((id) => setItems((prev) => {
		const found = prev.find((file) => file.id === id);
		if (found?.url) URL.revokeObjectURL(found.url);
		return prev.filter((file) => file.id !== id);
	}), []);
	const addWithProviderValidation = (0, import_react.useCallback)((fileList) => {
		const incoming = [...fileList];
		const accepted = incoming.filter((f) => matchesAccept(f));
		if (incoming.length && accepted.length === 0) {
			onError?.({
				code: "accept",
				message: "No files match the accepted types."
			});
			return;
		}
		const withinSize = (f) => maxFileSize ? f.size <= maxFileSize : true;
		const sized = accepted.filter(withinSize);
		if (accepted.length > 0 && sized.length === 0) {
			onError?.({
				code: "max_file_size",
				message: "All files exceed the maximum size."
			});
			return;
		}
		const currentCount = files.length;
		const capacity = typeof maxFiles === "number" ? Math.max(0, maxFiles - currentCount) : void 0;
		const capped = typeof capacity === "number" ? sized.slice(0, capacity) : sized;
		if (typeof capacity === "number" && sized.length > capacity) onError?.({
			code: "max_files",
			message: "Too many files. Some were not added."
		});
		if (capped.length > 0) controller?.attachments.add(capped);
	}, [
		matchesAccept,
		maxFileSize,
		maxFiles,
		onError,
		files.length,
		controller
	]);
	const clearAttachments = (0, import_react.useCallback)(() => usingProvider ? controller?.attachments.clear() : setItems((prev) => {
		for (const file of prev) if (file.url) URL.revokeObjectURL(file.url);
		return [];
	}), [usingProvider, controller]);
	const clearReferencedSources = (0, import_react.useCallback)(() => setReferencedSources([]), []);
	const add = usingProvider ? addWithProviderValidation : addLocal;
	const remove = usingProvider ? controller.attachments.remove : removeLocal;
	const openFileDialog = usingProvider ? controller.attachments.openFileDialog : openFileDialogLocal;
	const clear = (0, import_react.useCallback)(() => {
		clearAttachments();
		clearReferencedSources();
	}, [clearAttachments, clearReferencedSources]);
	(0, import_react.useEffect)(() => {
		if (!usingProvider) return;
		controller.__registerFileInput(inputRef, () => inputRef.current?.click());
	}, [usingProvider, controller]);
	(0, import_react.useEffect)(() => {
		if (syncHiddenInput && inputRef.current && files.length === 0) inputRef.current.value = "";
	}, [files, syncHiddenInput]);
	(0, import_react.useEffect)(() => {
		const form = formRef.current;
		if (!form) return;
		if (globalDrop) return;
		const onDragOver = (e) => {
			if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
		};
		const onDrop = (e) => {
			if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
			if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) add(e.dataTransfer.files);
		};
		form.addEventListener("dragover", onDragOver);
		form.addEventListener("drop", onDrop);
		return () => {
			form.removeEventListener("dragover", onDragOver);
			form.removeEventListener("drop", onDrop);
		};
	}, [add, globalDrop]);
	(0, import_react.useEffect)(() => {
		if (!globalDrop) return;
		const onDragOver = (e) => {
			if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
		};
		const onDrop = (e) => {
			if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
			if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) add(e.dataTransfer.files);
		};
		document.addEventListener("dragover", onDragOver);
		document.addEventListener("drop", onDrop);
		return () => {
			document.removeEventListener("dragover", onDragOver);
			document.removeEventListener("drop", onDrop);
		};
	}, [add, globalDrop]);
	(0, import_react.useEffect)(() => () => {
		if (!usingProvider) {
			for (const f of filesRef.current) if (f.url) URL.revokeObjectURL(f.url);
		}
	}, [usingProvider]);
	const handleChange = (0, import_react.useCallback)((event) => {
		if (event.currentTarget.files) add(event.currentTarget.files);
		event.currentTarget.value = "";
	}, [add]);
	const attachmentsCtx = (0, import_react.useMemo)(() => ({
		add,
		clear: clearAttachments,
		fileInputRef: inputRef,
		files: files.map((item) => ({
			...item,
			id: item.id
		})),
		openFileDialog,
		remove
	}), [
		files,
		add,
		remove,
		clearAttachments,
		openFileDialog
	]);
	const refsCtx = (0, import_react.useMemo)(() => ({
		add: (incoming) => {
			const array = Array.isArray(incoming) ? incoming : [incoming];
			setReferencedSources((prev) => [...prev, ...array.map((s) => ({
				...s,
				id: nanoid()
			}))]);
		},
		clear: clearReferencedSources,
		remove: (id) => {
			setReferencedSources((prev) => prev.filter((s) => s.id !== id));
		},
		sources: referencedSources
	}), [referencedSources, clearReferencedSources]);
	const handleSubmit = (0, import_react.useCallback)(async (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		const text = usingProvider ? controller.textInput.value : (() => {
			return new FormData(form).get("message") || "";
		})();
		if (!usingProvider) form.reset();
		try {
			const result = onSubmit({
				files: await Promise.all(files.map(async ({ id: _id, ...item }) => {
					if (item.url?.startsWith("blob:")) {
						const dataUrl = await convertBlobUrlToDataUrl(item.url);
						return {
							...item,
							url: dataUrl ?? item.url
						};
					}
					return item;
				})),
				text
			}, event);
			if (result instanceof Promise) try {
				await result;
				clear();
				if (usingProvider) controller.textInput.clear();
			} catch {}
			else {
				clear();
				if (usingProvider) controller.textInput.clear();
			}
		} catch {}
	}, [
		usingProvider,
		controller,
		files,
		onSubmit,
		clear
	]);
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		accept,
		"aria-label": "Upload files",
		className: "hidden",
		multiple,
		onChange: handleChange,
		ref: inputRef,
		title: "Upload files",
		type: "file"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
		className: cn("w-full", className),
		onSubmit: handleSubmit,
		ref: formRef,
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputGroup, {
			className: "overflow-hidden",
			children
		})
	})] });
	const withReferencedSources = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocalReferencedSourcesContext.Provider, {
		value: refsCtx,
		children: inner
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocalAttachmentsContext.Provider, {
		value: attachmentsCtx,
		children: withReferencedSources
	});
};
var PromptInputTextarea = ({ onChange, onKeyDown, className, placeholder = "What would you like to know?", ...props }) => {
	const controller = useOptionalPromptInputController();
	const attachments = usePromptInputAttachments();
	const [isComposing, setIsComposing] = (0, import_react.useState)(false);
	const handleKeyDown = (0, import_react.useCallback)((e) => {
		onKeyDown?.(e);
		if (e.defaultPrevented) return;
		if (e.key === "Enter") {
			if (isComposing || e.nativeEvent.isComposing) return;
			if (e.shiftKey) return;
			e.preventDefault();
			const { form } = e.currentTarget;
			if ((form?.querySelector("button[type=\"submit\"]"))?.disabled) return;
			form?.requestSubmit();
		}
		if (e.key === "Backspace" && e.currentTarget.value === "" && attachments.files.length > 0) {
			e.preventDefault();
			const lastAttachment = attachments.files.at(-1);
			if (lastAttachment) attachments.remove(lastAttachment.id);
		}
	}, [
		onKeyDown,
		isComposing,
		attachments
	]);
	const handlePaste = (0, import_react.useCallback)((event) => {
		const items = event.clipboardData?.items;
		if (!items) return;
		const files = [];
		for (const item of items) if (item.kind === "file") {
			const file = item.getAsFile();
			if (file) files.push(file);
		}
		if (files.length > 0) {
			event.preventDefault();
			attachments.add(files);
		}
	}, [attachments]);
	const handleCompositionEnd = (0, import_react.useCallback)(() => setIsComposing(false), []);
	const handleCompositionStart = (0, import_react.useCallback)(() => setIsComposing(true), []);
	const controlledProps = controller ? {
		onChange: (e) => {
			controller.textInput.setInput(e.currentTarget.value);
			onChange?.(e);
		},
		value: controller.textInput.value
	} : { onChange };
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputGroupTextarea, {
		className: cn("field-sizing-content max-h-48 min-h-16", className),
		name: "message",
		onCompositionEnd: handleCompositionEnd,
		onCompositionStart: handleCompositionStart,
		onKeyDown: handleKeyDown,
		onPaste: handlePaste,
		placeholder,
		...props,
		...controlledProps
	});
};
var PromptInputFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputGroupAddon, {
	align: "block-end",
	className: cn("justify-between gap-1", className),
	...props
});
var PromptInputSubmit = ({ className, variant = "default", size = "icon-sm", status, onStop, onClick, children, ...props }) => {
	const isGenerating = status === "submitted" || status === "streaming";
	let Icon = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerDownLeft, { className: "size-4" });
	if (status === "submitted") Icon = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, {});
	else if (status === "streaming") Icon = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-4" });
	else if (status === "error") Icon = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" });
	const handleClick = (0, import_react.useCallback)((e) => {
		if (isGenerating && onStop) {
			e.preventDefault();
			onStop();
			return;
		}
		onClick?.(e);
	}, [
		isGenerating,
		onStop,
		onClick
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputGroupButton, {
		"aria-label": isGenerating ? "Stop" : "Submit",
		className: cn(className),
		onClick: handleClick,
		size,
		type: isGenerating && onStop ? "button" : "submit",
		variant,
		...props,
		children: children ?? Icon
	});
};
var motionComponentCache = /* @__PURE__ */ new Map();
var getMotionComponent = (element) => {
	let component = motionComponentCache.get(element);
	if (!component) {
		component = motion.create(element);
		motionComponentCache.set(element, component);
	}
	return component;
};
var ShimmerComponent = ({ children, as: Component = "p", className, duration = 2, spread = 2 }) => {
	const MotionComponent = getMotionComponent(Component);
	const dynamicSpread = (0, import_react.useMemo)(() => (children?.length ?? 0) * spread, [children, spread]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionComponent, {
		animate: { backgroundPosition: "0% center" },
		className: cn("relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent", "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--color-background),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]", className),
		initial: { backgroundPosition: "100% center" },
		style: {
			"--spread": `${dynamicSpread}px`,
			backgroundImage: "var(--bg), linear-gradient(var(--color-muted-foreground), var(--color-muted-foreground))"
		},
		transition: {
			duration,
			ease: "linear",
			repeat: Number.POSITIVE_INFINITY
		},
		children
	});
};
var Shimmer = (0, import_react.memo)(ShimmerComponent);
var SUGGESTIONS = [
	"Which spice blend should I start with?",
	"Do you deliver outside Lagos?",
	"How do I order wholesale?"
];
function SupportAssistant() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [input, setInput] = (0, import_react.useState)("");
	const textareaRef = (0, import_react.useRef)(null);
	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({ api: "/api/chat" }),
		onError: () => toast.error("Rose couldn't reply just now. Please try again.")
	});
	const busy = status === "submitted" || status === "streaming";
	(0, import_react.useEffect)(() => {
		if (open) textareaRef.current?.focus();
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (open && status === "ready") textareaRef.current?.focus();
	}, [open, status]);
	const send = (text) => {
		const value = text.trim();
		if (!value || busy) return;
		setInput("");
		sendMessage({ text: value });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-x-3 bottom-3 z-[60] flex max-h-[80vh] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:h-[560px] sm:w-[400px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b border-border bg-secondary/60 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/assets/assistant-mark-5T__JAxd.png",
						alt: "",
						width: 512,
						height: 512,
						loading: "lazy",
						className: "size-9 rounded-full bg-background object-contain p-1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg leading-none",
							children: "Ask Rose"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[11px] text-muted-foreground",
							children: "Pantry help, orders & trade enquiries"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						"aria-label": "Close support assistant",
						onClick: () => setOpen(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Conversation, {
				className: "flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ConversationContent, {
					className: "gap-5 p-4",
					children: [messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Hello 👋 I'm Rose. Ask me about our spices, flours and infusions, delivery, or wholesale and export supply."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-2",
							children: SUGGESTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => send(s),
								className: "rounded-md border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-secondary",
								children: s
							}, s))
						})]
					}) : messages.map((message) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Message, {
						from: message.role,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageContent, { children: message.parts.map((part, i) => part.type === "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageResponse, { children: part.text }, i) : null) })
					}, message.id)), status === "submitted" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shimmer, {
						className: "text-sm",
						children: "Thinking..."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversationScrollButton, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PromptInput, {
					onSubmit: (_, event) => {
						event.preventDefault();
						send(input);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptInputTextarea, {
						ref: textareaRef,
						value: input,
						onChange: (e) => setInput(e.target.value),
						placeholder: "Ask about a product, order or wholesale…"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptInputFooter, {
						className: "justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptInputSubmit, {
							status,
							disabled: !input.trim() && !busy
						})
					})]
				})
			})
		]
	}), !open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setOpen(true),
		"aria-label": "Open support assistant",
		className: "fixed right-4 bottom-4 z-[60] flex items-center gap-2 rounded-full bg-ink py-3 pr-5 pl-3 text-ink-foreground shadow-xl transition-transform hover:scale-[1.03] sm:right-6 sm:bottom-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/assets/assistant-mark-5T__JAxd.png",
				alt: "",
				width: 512,
				height: 512,
				loading: "lazy",
				className: "size-8 rounded-full bg-background object-contain p-0.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: "Ask Rose"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4 opacity-70" })
		]
	})] });
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[60vh] items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow text-accent",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl",
					children: "This page has moved on"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "The page you are looking for doesn't exist. Try the shop instead."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground",
						children: "Go home"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/products",
						className: "inline-flex h-10 items-center rounded-md border border-input px-6 text-sm font-medium",
						children: "Shop products"
					})]
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[60vh] items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. Try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex h-10 items-center rounded-md border border-input px-6 text-sm font-medium",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$65 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Mummy Rose — Natural Nigerian Spices, Flours & Herbal Infusions" },
			{
				name: "description",
				content: "Small-batch Nigerian spices, stone-milled flours and herbal infusions. Shop retail or partner with us for wholesale, export and white-label supply."
			},
			{
				name: "author",
				content: "Mummy Rose Foods"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:site_name",
				content: "Mummy Rose"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "theme-color",
				content: "#f7f3ea"
			},
			{
				property: "og:title",
				content: "Mummy Rose — Natural Nigerian Spices, Flours & Herbal Infusions"
			},
			{
				name: "twitter:title",
				content: "Mummy Rose — Natural Nigerian Spices, Flours & Herbal Infusions"
			},
			{
				property: "og:description",
				content: "Small-batch Nigerian spices, stone-milled flours and herbal infusions. Shop retail or partner with us for wholesale, export and white-label supply."
			},
			{
				name: "twitter:description",
				content: "Small-batch Nigerian spices, stone-milled flours and herbal infusions. Shop retail or partner with us for wholesale, export and white-label supply."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0d7db737-33c6-4803-86cd-117ad7ea0e1b/id-preview-7cad1aed--935c44d0-4d08-4085-a95e-0c07086c39bb.lovable.app-1785814906930.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0d7db737-33c6-4803-86cd-117ad7ea0e1b/id-preview-7cad1aed--935c44d0-4d08-4085-a95e-0c07086c39bb.lovable.app-1785814906930.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@300;400;500;600&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$65.useRouteContext();
	const router = useRouter();
	const isAdmin = useRouterState({ select: (s) => s.location.pathname }).startsWith("/admin");
	(0, import_react.useEffect)(() => {
		const { data } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => data.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CartProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteChrome, {}),
			isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-screen flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportAssistant, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-center" })
		] })
	});
}
var $$splitComponentImporter$56 = () => import("./routes-NmGuu2qo.mjs");
var Route$64 = createFileRoute("/")({
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(productsQuery);
		context.queryClient.ensureQueryData(categoriesQuery);
		context.queryClient.ensureQueryData(testimonialsQuery);
		context.queryClient.ensureQueryData(postsQuery);
	},
	head: () => ({ meta: [
		{ title: "Mummy Rose — Premium Natural Spices, Flours & Infusions" },
		{
			name: "description",
			content: "Nature’s Goodness, Mummy’s Touch. Premium Nigerian spices, stone-milled flours, and herbal tea infusions. Just the way Mummy made them."
		},
		{
			property: "og:title",
			content: "Mummy Rose — Premium Natural Spices, Flours & Infusions"
		},
		{
			property: "og:description",
			content: "Spices, Flours & Infusions — just the way Mummy made them. Sourced from local farm cooperatives."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$56, "component")
});
var $$splitComponentImporter$55 = () => import("../_-DUY4D2rE.mjs");
/**
* Catch-all: serves any CMS page published from /admin/pages at its own top
* level URL, and falls back to a branded 404 when no page matches.
*/
var Route$63 = createFileRoute("/$")({
	head: () => ({ meta: [{
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$55, "component")
});
var $$splitComponentImporter$54 = () => import("./about-CwDSwxQD.mjs");
var Route$62 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "About Mummy Rose — Our Heritage, Vision & Kitchen Legacy" },
		{
			name: "description",
			content: "The story of Mummy Rose: a nurturer, home cook, and healer. Discover our journey in creating natural spices, stone-milled flours, and herbal infusions."
		},
		{
			property: "og:title",
			content: "About Mummy Rose — Legacy of Nature's Goodness"
		},
		{
			property: "og:description",
			content: "Spices, Flours & Infusions — just the way Mummy made them."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$54, "component")
});
var $$splitComponentImporter$53 = () => import("./account-CQ5xJnf-.mjs");
var Route$61 = createFileRoute("/account")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Your Account — Mummy Rose" },
		{
			name: "description",
			content: "Sign in to your Mummy Rose account to track orders and manage details."
		},
		{
			property: "og:title",
			content: "Your Account — Mummy Rose"
		},
		{
			property: "og:description",
			content: "Sign in to manage your Mummy Rose orders."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$53, "component")
});
var $$splitComponentImporter$52 = () => import("./admin-Dcw9PJ1t.mjs");
var Route$60 = createFileRoute("/admin")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Admin — Mummy Rose Commerce Console" },
		{
			name: "description",
			content: "Manage products, orders, content and settings for the Mummy Rose store."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$52, "component")
});
var $$splitComponentImporter$51 = () => import("./cart-DoP18Uap.mjs");
var Route$59 = createFileRoute("/cart")({
	head: () => ({ meta: [
		{ title: "Your Cart — Mummy Rose" },
		{
			name: "description",
			content: "Review the items in your Mummy Rose cart before checking out."
		},
		{
			property: "og:title",
			content: "Your Cart — Mummy Rose"
		},
		{
			property: "og:description",
			content: "Review your Mummy Rose order before checkout."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$51, "component")
});
var $$splitComponentImporter$50 = () => import("./checkout-DqHYAoqt.mjs");
var Route$58 = createFileRoute("/checkout")({
	head: () => ({ meta: [
		{ title: "Checkout — Mummy Rose" },
		{
			name: "description",
			content: "Complete your Mummy Rose order with secure delivery details."
		},
		{
			property: "og:title",
			content: "Checkout — Mummy Rose"
		},
		{
			property: "og:description",
			content: "Complete your Mummy Rose order."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$50, "component")
});
var $$splitComponentImporter$49 = () => import("./contact-CjQPFW-0.mjs");
var Route$57 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: "Contact Mummy Rose — Orders, Support & Partnerships" },
		{
			name: "description",
			content: "Reach the Mummy Rose team about orders, deliveries, stockist enquiries or partnerships. Call, WhatsApp or email us — we reply within one business day."
		},
		{
			property: "og:title",
			content: "Contact Mummy Rose"
		},
		{
			property: "og:description",
			content: "Talk to us about orders, deliveries or partnerships."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$49, "component")
});
var $$splitComponentImporter$48 = () => import("./corporate-supply-B7l8MJjX.mjs");
var Route$56 = createFileRoute("/corporate-supply")({
	head: () => ({ meta: [
		{ title: "Corporate Supply — Hotels, Restaurants & Gifting | Mummy Rose" },
		{
			name: "description",
			content: "Bulk supply of natural Nigerian spices, flours and teas for hotels, restaurants, caterers and corporate gifting programmes."
		},
		{
			property: "og:title",
			content: "Corporate Supply — Hotels, Restaurants & Gifting | Mummy Rose"
		},
		{
			property: "og:description",
			content: "Bulk supply of natural Nigerian spices, flours and teas for hotels, restaurants, caterers and corporate gifting programmes."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$48, "component")
});
var $$splitComponentImporter$47 = () => import("./custom-packaging-C5KRNX16.mjs");
var Route$55 = createFileRoute("/custom-packaging")({
	head: () => ({ meta: [
		{ title: "Custom Packaging — Branded Jars, Pouches & Gift Sets | Mummy Rose" },
		{
			name: "description",
			content: "Custom-packed Nigerian spices, flours and teas in branded jars, pouches, sachets and gift sets for retail or gifting."
		},
		{
			property: "og:title",
			content: "Custom Packaging — Branded Jars, Pouches & Gift Sets | Mummy Rose"
		},
		{
			property: "og:description",
			content: "Custom-packed Nigerian spices, flours and teas in branded jars, pouches, sachets and gift sets for retail or gifting."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$47, "component")
});
var $$splitComponentImporter$46 = () => import("./export-aVTWlEtd.mjs");
var Route$54 = createFileRoute("/export")({
	head: () => ({ meta: [
		{ title: "Export Supply — Nigerian Food Ingredients Worldwide | Mummy Rose" },
		{
			name: "description",
			content: "Export-grade Nigerian spices, flours and herbal infusions with documentation, compliant labelling and container logistics."
		},
		{
			property: "og:title",
			content: "Export Supply — Nigerian Food Ingredients Worldwide | Mummy Rose"
		},
		{
			property: "og:description",
			content: "Export-grade Nigerian spices, flours and herbal infusions with documentation, compliant labelling and container logistics."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$46, "component")
});
var $$splitComponentImporter$45 = () => import("./faq-B_Pau1UA.mjs");
var Route$53 = createFileRoute("/faq")({
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(faqsQuery);
	},
	head: () => ({ meta: [
		{ title: "FAQ — Delivery, Payment & Product Questions | Mummy Rose" },
		{
			name: "description",
			content: "Answers to common questions about Mummy Rose delivery times, payment methods, storage, returns and wholesale supply."
		},
		{
			property: "og:title",
			content: "Mummy Rose FAQ"
		},
		{
			property: "og:description",
			content: "Delivery, payment, storage and wholesale questions answered."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$45, "component")
});
function runtimeEnv(name) {
	const runtime = globalThis;
	return runtime.Deno?.env?.get?.(name) ?? runtime.process?.env?.[name];
}
function configuredEnv(names) {
	for (const name of names) {
		const value = runtimeEnv(name)?.trim();
		if (value) return value;
	}
}
function supabaseProjectUrl() {
	const url = configuredEnv(["SUPABASE_URL", "VITE_SUPABASE_URL"]);
	if (!url) throw new Error("SUPABASE_URL (or VITE_SUPABASE_URL) is required");
	return url;
}
function supabasePublishableKey() {
	const direct = configuredEnv(["SUPABASE_PUBLISHABLE_KEY", "VITE_SUPABASE_PUBLISHABLE_KEY"]);
	if (direct) return direct;
	const keyset = runtimeEnv("SUPABASE_PUBLISHABLE_KEYS");
	if (keyset) try {
		const parsed = JSON.parse(keyset);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
			const keys = parsed;
			const key = [keys.default, ...Object.values(keys)].find((v) => typeof v === "string" && v.trim().startsWith("sb_publishable_"))?.trim();
			if (key) return key;
		}
	} catch {}
	const legacy = configuredEnv(["SUPABASE_ANON_KEY", "VITE_SUPABASE_ANON_KEY"]);
	if (legacy) return legacy;
	throw new Error("A Supabase publishable/anon key is required");
}
/** Anonymous client — row-level security applies as `anon`. Public catalogue only. */
function supabaseAnon() {
	return createClient(supabaseProjectUrl(), supabasePublishableKey(), { auth: {
		persistSession: false,
		autoRefreshToken: false
	} });
}
/** Forwards the verified OAuth bearer token so RLS runs as the signed-in user. */
function supabaseForUser(ctx) {
	const token = ctx.getToken();
	if (!token) throw new Error("supabaseForUser requires a verified OAuth token");
	return createClient(supabaseProjectUrl(), supabasePublishableKey(), {
		global: { headers: { Authorization: `Bearer ${token}` } },
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});
}
var search_products_default = defineTool({
	name: "search_products",
	title: "Search products",
	description: "Search the public Mummy Rose catalogue (spices, flours, seasonings, tea infusions) by name or description. Returns name, slug, price and stock status.",
	inputSchema: {
		query: stringType().trim().describe("Free-text search term, e.g. 'ginger' or 'yam flour'."),
		limit: numberType().int().describe("Maximum number of products to return (1-25).")
	},
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async ({ query, limit }) => {
		const take = Math.min(Math.max(Number.isFinite(limit) ? limit : 10, 1), 25);
		let builder = supabaseAnon().from("products").select("name, slug, short_description, price, compare_at_price, stock_quantity, currency").eq("is_active", true).limit(take);
		if (query) builder = builder.or(`name.ilike.%${query}%,short_description.ilike.%${query}%`);
		const { data, error } = await builder;
		if (error) return {
			content: [{
				type: "text",
				text: error.message
			}],
			isError: true
		};
		return {
			content: [{
				type: "text",
				text: JSON.stringify(data ?? [])
			}],
			structuredContent: { products: data ?? [] }
		};
	}
});
var get_product_default = defineTool({
	name: "get_product",
	title: "Get product details",
	description: "Fetch one published Mummy Rose product by its URL slug, including description, pricing, stock and active variants.",
	inputSchema: { slug: stringType().trim().describe("Product slug, e.g. 'ginger-powder'.") },
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async ({ slug }) => {
		const { data, error } = await supabaseAnon().from("products").select("*, product_variants(name, sku, price, stock_quantity, is_active)").eq("slug", slug).eq("is_active", true).maybeSingle();
		if (error) throw new ToolError(error.message);
		if (!data) throw new ToolError(`No published product found for slug "${slug}".`);
		return {
			content: [{
				type: "text",
				text: JSON.stringify(data)
			}],
			structuredContent: { product: data }
		};
	}
});
var list_my_orders_default = defineTool({
	name: "list_my_orders",
	title: "List my orders",
	description: "List the signed-in customer's own Mummy Rose orders with status, payment status, totals and line items. Never returns other customers' orders.",
	inputSchema: { limit: numberType().int().describe("Maximum number of orders to return (1-25).") },
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async ({ limit }, ctx) => {
		if (!ctx.isAuthenticated()) return {
			content: [{
				type: "text",
				text: "Not authenticated"
			}],
			isError: true
		};
		const take = Math.min(Math.max(Number.isFinite(limit) ? limit : 10, 1), 25);
		const { data, error } = await supabaseForUser(ctx).from("orders").select("order_number, status, payment_status, subtotal, shipping_fee, discount, total, currency, created_at, order_items(product_name, quantity, unit_price)").order("created_at", { ascending: false }).limit(take);
		if (error) return {
			content: [{
				type: "text",
				text: error.message
			}],
			isError: true
		};
		return {
			content: [{
				type: "text",
				text: JSON.stringify(data ?? [])
			}],
			structuredContent: { orders: data ?? [] }
		};
	}
});
var track_order_default = defineTool({
	name: "track_order",
	title: "Track an order",
	description: "Look up the fulfilment and payment status of one of the signed-in customer's orders by its order number (e.g. MR-2026-0042).",
	inputSchema: { order_number: stringType().trim().describe("Mummy Rose order number.") },
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async ({ order_number }, ctx) => {
		if (!ctx.isAuthenticated()) return {
			content: [{
				type: "text",
				text: "Not authenticated"
			}],
			isError: true
		};
		const { data, error } = await supabaseForUser(ctx).from("orders").select("order_number, status, payment_status, total, currency, created_at, updated_at").eq("order_number", order_number).maybeSingle();
		if (error) throw new ToolError(error.message);
		if (!data) throw new ToolError(`No order visible to this account with number "${order_number}".`);
		return {
			content: [{
				type: "text",
				text: JSON.stringify(data)
			}],
			structuredContent: { order: data }
		};
	}
});
var create_inquiry_default = defineTool({
	name: "create_inquiry",
	title: "Send a business inquiry",
	description: "Submit a wholesale, export, white-labelling, corporate-supply or general inquiry to the Mummy Rose team on behalf of the signed-in user.",
	inputSchema: {
		type: enumType([
			"contact",
			"wholesale",
			"export",
			"white_label",
			"corporate",
			"custom_packaging"
		]).describe("Inquiry channel."),
		name: stringType().trim().describe("Contact name."),
		email: stringType().trim().describe("Contact email address."),
		phone: stringType().trim().describe("Contact phone number, or an empty string."),
		message: stringType().trim().describe("The inquiry body.")
	},
	annotations: {
		readOnlyHint: false,
		destructiveHint: false,
		openWorldHint: false
	},
	handler: async ({ type, name, email, phone, message }, ctx) => {
		if (!ctx.isAuthenticated()) return {
			content: [{
				type: "text",
				text: "Not authenticated"
			}],
			isError: true
		};
		const { data, error } = await supabaseForUser(ctx).from("inquiries").insert({
			type,
			name,
			email,
			phone: phone || null,
			message
		}).select("id, type, created_at").maybeSingle();
		if (error) return {
			content: [{
				type: "text",
				text: error.message
			}],
			isError: true
		};
		return {
			content: [{
				type: "text",
				text: `Inquiry received (${data?.id ?? "queued"}).`
			}],
			structuredContent: { inquiry: data }
		};
	}
});
var projectRef = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_SUPABASE_PROJECT_ID": "dezgbfewaprhxfhnbtqp",
	"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_ABDiKOfAfzJYEaf9MAPtgw_ux8asbLh",
	"VITE_SUPABASE_URL": "https://dezgbfewaprhxfhnbtqp.supabase.co"
}["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";
var mcp_default = defineMcp({
	name: "mummy-rose-e-commerce-hub",
	title: "Mummy Rose E-commerce Hub",
	version: "1.0.0",
	instructions: "Tools for the Mummy Rose store (Nigerian spices, flours and herbal infusions). Use `search_products` and `get_product` to browse the catalogue, `list_my_orders` and `track_order` for the signed-in customer's own orders, and `create_inquiry` to send a wholesale, export, white-label or corporate-supply enquiry to the team.",
	auth: auth.oauth.issuer({
		issuer: `https://${projectRef}.supabase.co/auth/v1`,
		acceptedAudiences: "authenticated"
	}),
	tools: [
		search_products_default,
		get_product_default,
		list_my_orders_default,
		track_order_default,
		create_inquiry_default
	]
});
var Route$52 = createFileRoute("/mcp")({ server: { handlers: { ANY: createTanStackMcpHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var $$splitComponentImporter$44 = () => import("./order-confirmed-CFnufeMN.mjs");
var Route$51 = createFileRoute("/order-confirmed")({
	validateSearch: objectType({ order: stringType().optional() }),
	head: () => ({ meta: [
		{ title: "Order Confirmed — Mummy Rose" },
		{
			name: "description",
			content: "Thank you for your Mummy Rose order."
		},
		{
			property: "og:title",
			content: "Order Confirmed — Mummy Rose"
		},
		{
			property: "og:description",
			content: "Thank you for your Mummy Rose order."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$44, "component")
});
var $$splitComponentImporter$43 = () => import("./payment-callback-BDtgFjG1.mjs");
var Route$50 = createFileRoute("/payment-callback")({
	validateSearch: (search) => ({
		provider: search.provider === "flutterwave" ? "flutterwave" : "paystack",
		reference: typeof search.reference === "string" ? search.reference : void 0,
		trxref: typeof search.trxref === "string" ? search.trxref : void 0,
		tx_ref: typeof search.tx_ref === "string" ? search.tx_ref : void 0,
		transaction_id: typeof search.transaction_id === "string" ? search.transaction_id : void 0,
		status: typeof search.status === "string" ? search.status : void 0
	}),
	head: () => ({ meta: [
		{ title: "Confirming payment — Mummy Rose" },
		{
			name: "description",
			content: "We are confirming your Mummy Rose payment."
		},
		{
			property: "og:title",
			content: "Confirming payment — Mummy Rose"
		},
		{
			property: "og:description",
			content: "We are confirming your Mummy Rose payment."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$43, "component")
});
var $$splitComponentImporter$42 = () => import("./privacy-Db7bGnSW.mjs");
var Route$49 = createFileRoute("/privacy")({
	head: () => ({ meta: [
		{ title: "Privacy Policy — Mummy Rose" },
		{
			name: "description",
			content: "How Mummy Rose collects, uses and protects your personal information when you shop or contact us."
		},
		{
			property: "og:title",
			content: "Privacy Policy — Mummy Rose"
		},
		{
			property: "og:description",
			content: "How Mummy Rose collects, uses and protects your personal information when you shop or contact us."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$42, "component")
});
var $$splitComponentImporter$41 = () => import("./refunds-BugSJCHL.mjs");
var TITLE$3 = "Returns & Refunds — Mummy Rose";
var DESCRIPTION$3 = "Our returns window, refund timelines and what to do if a Mummy Rose order arrives damaged, incomplete or not as described.";
var Route$48 = createFileRoute("/refunds")({
	head: () => ({ meta: [
		{ title: TITLE$3 },
		{
			name: "description",
			content: DESCRIPTION$3
		},
		{
			property: "og:title",
			content: TITLE$3
		},
		{
			property: "og:description",
			content: DESCRIPTION$3
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$41, "component")
});
var $$splitComponentImporter$40 = () => import("./retail-DHqXuiqn.mjs");
var Route$47 = createFileRoute("/retail")({
	head: () => ({ meta: [
		{ title: "Retail & Stockists — Sell Mummy Rose in Your Store" },
		{
			name: "description",
			content: "Stock Mummy Rose spices, flours and herbal infusions in your supermarket, food store or online shop. Retail pricing, shelf-ready packaging and reliable restocking across Nigeria."
		},
		{
			property: "og:title",
			content: "Retail & Stockists — Mummy Rose"
		},
		{
			property: "og:description",
			content: "Shelf-ready Nigerian spices, flours and infusions for supermarkets and food retailers."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$40, "component")
});
var $$splitComponentImporter$39 = () => import("./services-KX5c_f9h.mjs");
var Route$46 = createFileRoute("/services")({
	head: () => ({ meta: [
		{ title: "B2B Solutions & Food Manufacturing — Mummy Rose" },
		{
			name: "description",
			content: "White labelling, wholesale bulk supply, retail distribution, custom packaging, global export, and corporate supply for spices, flours, and herbal infusions."
		},
		{
			property: "og:title",
			content: "B2B Solutions & Food Manufacturing — Mummy Rose"
		},
		{
			property: "og:description",
			content: "Enterprise food processing, white labelling, and bulk supply from Mummy Rose."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$39, "component")
});
var $$splitComponentImporter$38 = () => import("./shipping-D8iIRDoI.mjs");
var TITLE$2 = "Shipping & Delivery — Mummy Rose";
var DESCRIPTION$2 = "Delivery timelines, zones and shipping fees for Mummy Rose orders across Nigeria, plus how international and export shipments are handled.";
var Route$45 = createFileRoute("/shipping")({
	head: () => ({ meta: [
		{ title: TITLE$2 },
		{
			name: "description",
			content: DESCRIPTION$2
		},
		{
			property: "og:title",
			content: TITLE$2
		},
		{
			property: "og:description",
			content: DESCRIPTION$2
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$38, "component")
});
var FALLBACK_BASE_URL = "https://mummyrose.com";
var STATIC_ENTRIES = [
	{
		path: "/",
		changefreq: "weekly",
		priority: "1.0"
	},
	{
		path: "/products",
		changefreq: "daily",
		priority: "0.9"
	},
	{
		path: "/services",
		changefreq: "monthly",
		priority: "0.8"
	},
	{
		path: "/retail",
		changefreq: "monthly",
		priority: "0.8"
	},
	{
		path: "/wholesale",
		changefreq: "monthly",
		priority: "0.8"
	},
	{
		path: "/export",
		changefreq: "monthly",
		priority: "0.8"
	},
	{
		path: "/white-labelling",
		changefreq: "monthly",
		priority: "0.8"
	},
	{
		path: "/corporate-supply",
		changefreq: "monthly",
		priority: "0.8"
	},
	{
		path: "/custom-packaging",
		changefreq: "monthly",
		priority: "0.8"
	},
	{
		path: "/recipes",
		changefreq: "weekly",
		priority: "0.7"
	},
	{
		path: "/blog",
		changefreq: "weekly",
		priority: "0.7"
	},
	{
		path: "/about",
		changefreq: "yearly",
		priority: "0.6"
	},
	{
		path: "/contact",
		changefreq: "yearly",
		priority: "0.6"
	},
	{
		path: "/faq",
		changefreq: "monthly",
		priority: "0.5"
	},
	{
		path: "/track-order",
		changefreq: "yearly",
		priority: "0.4"
	},
	{
		path: "/shipping",
		changefreq: "monthly",
		priority: "0.4"
	},
	{
		path: "/refunds",
		changefreq: "monthly",
		priority: "0.4"
	},
	{
		path: "/privacy",
		changefreq: "yearly",
		priority: "0.2"
	},
	{
		path: "/terms",
		changefreq: "yearly",
		priority: "0.2"
	}
];
var Route$44 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const supabaseUrl = (typeof process !== "undefined" ? process.env?.["SUPABASE_URL"] ?? process.env?.["VITE_SUPABASE_URL"] : void 0) ?? "https://dezgbfewaprhxfhnbtqp.supabase.co";
	const supabaseKey = (typeof process !== "undefined" ? process.env?.["SUPABASE_PUBLISHABLE_KEY"] ?? process.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"] : void 0) ?? "sb_publishable_ABDiKOfAfzJYEaf9MAPtgw_ux8asbLh";
	const entries = [...STATIC_ENTRIES];
	let baseUrl = FALLBACK_BASE_URL;
	if (supabaseUrl && supabaseKey) {
		const supabase = createClient(supabaseUrl, supabaseKey, { auth: {
			persistSession: false,
			autoRefreshToken: false
		} });
		const [products, categories, posts, pages, settings] = await Promise.all([
			supabase.from("products").select("slug").eq("is_active", true),
			supabase.from("categories").select("slug").eq("is_active", true),
			supabase.from("posts").select("slug,kind,updated_at").eq("is_published", true),
			supabase.from("pages").select("slug").eq("is_published", true),
			supabase.from("site_settings").select("value").eq("key", "seo").maybeSingle()
		]);
		const configured = (settings.data?.value)?.site_url?.trim();
		if (configured) baseUrl = configured.replace(/\/$/, "");
		for (const row of categories.data ?? []) entries.push({
			path: `/category/${row.slug}`,
			changefreq: "weekly",
			priority: "0.8"
		});
		for (const row of products.data ?? []) entries.push({
			path: `/products/${row.slug}`,
			changefreq: "weekly",
			priority: "0.8"
		});
		for (const row of posts.data ?? []) entries.push({
			path: row.kind === "recipe" ? `/recipes/${row.slug}` : `/blog/${row.slug}`,
			changefreq: "monthly",
			priority: "0.6"
		});
		const known = new Set(STATIC_ENTRIES.map((e) => e.path));
		for (const row of pages.data ?? []) {
			const path = `/${row.slug}`;
			if (known.has(path)) continue;
			entries.push({
				path,
				changefreq: "monthly",
				priority: "0.5"
			});
		}
	}
	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...entries.map((e) => [
			`  <url>`,
			`    <loc>${baseUrl}${e.path}</loc>`,
			e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
			e.priority ? `    <priority>${e.priority}</priority>` : null,
			`  </url>`
		].filter(Boolean).join("\n")),
		`</urlset>`
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$37 = () => import("./terms-DpDYzRwA.mjs");
var Route$43 = createFileRoute("/terms")({
	head: () => ({ meta: [
		{ title: "Terms of Service — Mummy Rose" },
		{
			name: "description",
			content: "The terms that apply when you order from Mummy Rose: pricing, delivery, returns and liability."
		},
		{
			property: "og:title",
			content: "Terms of Service — Mummy Rose"
		},
		{
			property: "og:description",
			content: "The terms that apply when you order from Mummy Rose: pricing, delivery, returns and liability."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$37, "component")
});
var $$splitComponentImporter$36 = () => import("./track-order-uquEk9tZ.mjs");
var Route$42 = createFileRoute("/track-order")({
	head: () => ({ meta: [
		{ title: "Track Your Order — Mummy Rose" },
		{
			name: "description",
			content: "Enter your order number and email to see the live status of your Mummy Rose delivery."
		},
		{
			property: "og:title",
			content: "Track Your Order — Mummy Rose"
		},
		{
			property: "og:description",
			content: "Check the live status of your Mummy Rose delivery."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$36, "component")
});
var $$splitComponentImporter$35 = () => import("./white-labelling-BaI0jX4l.mjs");
var Route$41 = createFileRoute("/white-labelling")({
	head: () => ({ meta: [
		{ title: "White Label Manufacturing — Your Brand, Our Kitchen | Mummy Rose" },
		{
			name: "description",
			content: "Launch your own spice, flour or tea line with Mummy Rose white-label production, formulation support and compliant packaging."
		},
		{
			property: "og:title",
			content: "White Label Manufacturing — Your Brand, Our Kitchen | Mummy Rose"
		},
		{
			property: "og:description",
			content: "Launch your own spice, flour or tea line with Mummy Rose white-label production, formulation support and compliant packaging."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
var $$splitComponentImporter$34 = () => import("./wishlist-Fq2WNI5c.mjs");
var Route$40 = createFileRoute("/wishlist")({
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(productsQuery);
	},
	head: () => ({ meta: [
		{ title: "Your Wishlist — Mummy Rose" },
		{
			name: "description",
			content: "Products you saved for later from the Mummy Rose natural pantry."
		},
		{
			property: "og:title",
			content: "Your Wishlist — Mummy Rose"
		},
		{
			property: "og:description",
			content: "Products you saved for later from Mummy Rose."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$34, "component")
});
var Route$39 = createFileRoute("/.mcp/list-tools")({ server: { handlers: { ANY: createTanStackListToolsHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var Route$38 = createFileRoute("/.well-known/oauth-protected-resource")({ server: { handlers: { ANY: createTanStackOAuthProtectedResourceMetadataHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var $$splitComponentImporter$33 = () => import("./admin.index-DeuWS4Vk.mjs");
var Route$37 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$33, "component") });
var $$splitComponentImporter$32 = () => import("./admin.analytics-BLEVfOXs.mjs");
var Route$36 = createFileRoute("/admin/analytics")({ component: lazyRouteComponent($$splitComponentImporter$32, "component") });
var $$splitComponentImporter$31 = () => import("./admin.banners-CUwhnyYB.mjs");
var Route$35 = createFileRoute("/admin/banners")({ component: lazyRouteComponent($$splitComponentImporter$31, "component") });
var $$splitComponentImporter$30 = () => import("./admin.categories-SDMpxi4-.mjs");
var Route$34 = createFileRoute("/admin/categories")({ component: lazyRouteComponent($$splitComponentImporter$30, "component") });
var $$splitComponentImporter$29 = () => import("./admin.coupons-DUCuHbTs.mjs");
var Route$33 = createFileRoute("/admin/coupons")({ component: lazyRouteComponent($$splitComponentImporter$29, "component") });
var $$splitComponentImporter$28 = () => import("./admin.customers-Cyhgw_rf.mjs");
var Route$32 = createFileRoute("/admin/customers")({ component: lazyRouteComponent($$splitComponentImporter$28, "component") });
var $$splitComponentImporter$27 = () => import("./admin.faqs-BVQAnRBW.mjs");
var Route$31 = createFileRoute("/admin/faqs")({ component: lazyRouteComponent($$splitComponentImporter$27, "component") });
var $$splitComponentImporter$26 = () => import("./admin.inquiries-BFOqqX2V.mjs");
var Route$30 = createFileRoute("/admin/inquiries")({ component: lazyRouteComponent($$splitComponentImporter$26, "component") });
var $$splitComponentImporter$25 = () => import("./admin.inventory-pKTebbu2.mjs");
var Route$29 = createFileRoute("/admin/inventory")({ component: lazyRouteComponent($$splitComponentImporter$25, "component") });
var $$splitComponentImporter$24 = () => import("./admin.media-CN5TYv_B.mjs");
var Route$28 = createFileRoute("/admin/media")({ component: lazyRouteComponent($$splitComponentImporter$24, "component") });
var $$splitComponentImporter$23 = () => import("./admin.navigation-Be6qNt3T.mjs");
var Route$27 = createFileRoute("/admin/navigation")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./admin.orders-D8_owzYT.mjs");
var Route$26 = createFileRoute("/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./admin.pages-3QJlSLqq.mjs");
var Route$25 = createFileRoute("/admin/pages")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./admin.posts-FRWRVTfv.mjs");
var Route$24 = createFileRoute("/admin/posts")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./admin.preview-BfOb4Psu.mjs");
var Route$23 = createFileRoute("/admin/preview")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./admin.products-MQElLUtu.mjs");
var Route$22 = createFileRoute("/admin/products")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./admin.redirects-DqU3_0ug.mjs");
var Route$21 = createFileRoute("/admin/redirects")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./admin.reviews-BWUabWj1.mjs");
var Route$20 = createFileRoute("/admin/reviews")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./admin.roles-D57FNLwC.mjs");
var Route$19 = createFileRoute("/admin/roles")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./admin.settings-7zUg1wEO.mjs");
var Route$18 = createFileRoute("/admin/settings")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./admin.testimonials-a4l70qyI.mjs");
var Route$17 = createFileRoute("/admin/testimonials")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./admin.variants-DwbPq5ok.mjs");
var Route$16 = createFileRoute("/admin/variants")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./admin.wholesale-DEiN269r.mjs");
var Route$15 = createFileRoute("/admin/wholesale")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
/**
* Lovable AI Gateway provider. Server-only — never import from client code.
*/
function createLovableAiGatewayProvider(apiKey) {
	return createOpenAICompatible({
		name: "lovable-ai-gateway",
		baseURL: "https://ai.gateway.lovable.dev/v1",
		apiKey
	});
}
var SYSTEM_PROMPT = `You are "Rose", the friendly customer support assistant for Mummy Rose — a premium Nigerian pantry brand selling small-batch spices & seasonings, stone-milled flours & cereals, and herbal tea infusions & sweet blends. Tagline: "Spices, Flours & Infusions — The Way Mummy Made Them".

How you help:
- Recommend products and categories, explain ingredients, sourcing and how things are milled/blended (stone-milled, no preservatives, no fillers, traceable to Nigerian farm cooperatives in Kaduna, Jos, Oyo and Benue).
- Guide shoppers through the site: /products (shop all), /category/spices, /category/flours, /category/seasonings, /category/tea-infusions, /category/cereals, /recipes, /about, /services, /contact, /cart, /track-order, /faq.
- Explain business services: retail & stockists (/retail), wholesale (/wholesale), export (/export), white labelling (/white-labelling), custom packaging (/custom-packaging), corporate supply (/corporate-supply).
- Help with orders: shoppers can pay online at checkout or place the order over WhatsApp; order status is at /track-order using the order number (format MR-XXXXX).

Rules:
- Be warm, concise and practical. Short paragraphs or tight bullet lists. Never invent prices, stock levels or delivery dates — if unsure, point to the relevant page or invite them to contact the team.
- Prices are in Nigerian Naira (₦) and delivery is nationwide across Nigeria.
- Link with plain markdown site paths, e.g. [Shop all products](/products).
- For complaints, refunds or anything needing a human, direct them to /contact.`;
var Route$14 = createFileRoute("/api/chat")({ server: { handlers: { POST: async ({ request }) => {
	const { messages } = await request.json();
	if (!Array.isArray(messages)) return new Response("Messages are required", { status: 400 });
	const key = process.env["LOVABLE_API_KEY"];
	if (!key) return new Response("Support assistant is not configured", { status: 500 });
	const gateway = createLovableAiGatewayProvider(key);
	return streamText({
		model: gateway("google/gemini-2.5-flash"),
		system: SYSTEM_PROMPT,
		messages: await convertToModelMessages(messages)
	}).toUIMessageStreamResponse({ originalMessages: messages });
} } } });
var $$splitComponentImporter$10 = () => import("./blog.index-CphUhr6z.mjs");
var TITLE$1 = "Journal — Spice, Flour & Infusion Guides | Mummy Rose";
var DESCRIPTION$1 = "Ingredient guides, cooking tips and food-culture stories from Mummy Rose: how to use Nigerian spices, choose the right flour and brew herbal infusions.";
var Route$13 = createFileRoute("/blog/")({
	loader: ({ context }) => context.queryClient.ensureQueryData(articlesQuery),
	head: () => ({ meta: [
		{ title: TITLE$1 },
		{
			name: "description",
			content: DESCRIPTION$1
		},
		{
			property: "og:title",
			content: TITLE$1
		},
		{
			property: "og:description",
			content: DESCRIPTION$1
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitErrorComponentImporter$4 = () => import("./blog._slug-CuUQtTkm.mjs");
var $$splitNotFoundComponentImporter$3 = () => import("./blog._slug-CVgNyCql.mjs");
var $$splitComponentImporter$9 = () => import("./blog._slug-mBoc-FCq.mjs");
var Route$12 = createFileRoute("/blog/$slug")({
	loader: async ({ context, params }) => {
		const post = await context.queryClient.ensureQueryData(postQuery(params.slug));
		if (!post) throw notFound();
		if (post.kind === "recipe") throw redirect({
			to: "/recipes/$slug",
			params: { slug: params.slug }
		});
		context.queryClient.ensureQueryData(articlesQuery);
		return {
			title: post.seo_title ?? post.title,
			description: post.seo_description ?? post.excerpt ?? "",
			keywords: post.seo_keywords ?? "",
			image: post.cover_image ?? ""
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Article unavailable — Mummy Rose" }, {
			name: "robots",
			content: "noindex"
		}] };
		const title = `${loaderData.title} — Mummy Rose`;
		const description = loaderData.description || "A guide from the Mummy Rose journal.";
		const image = loaderData.image?.startsWith("http") ? loaderData.image : "";
		return { meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			...loaderData.keywords ? [{
				name: "keywords",
				content: loaderData.keywords
			}] : [],
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			},
			{
				property: "og:type",
				content: "article"
			},
			...image ? [{
				property: "og:image",
				content: image
			}, {
				name: "twitter:image",
				content: image
			}] : []
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter$9, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$3, "notFoundComponent"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$4, "errorComponent")
});
var $$splitErrorComponentImporter$3 = () => import("./category._slug-CW5YtBb9.mjs");
var $$splitNotFoundComponentImporter$2 = () => import("./category._slug-COhYRj9I.mjs");
var $$splitComponentImporter$8 = () => import("./category._slug-CdYS9ch4.mjs");
var Route$11 = createFileRoute("/category/$slug")({
	loader: async ({ context, params }) => {
		const categories = await context.queryClient.ensureQueryData(categoriesQuery);
		context.queryClient.ensureQueryData(productsQuery);
		const category = categories.find((c) => c.slug === params.slug);
		if (!category) throw notFound();
		return {
			name: category.name,
			description: category.description
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Category not found — Mummy Rose" }, {
			name: "robots",
			content: "noindex"
		}] };
		const title = `${loaderData.name} — Mummy Rose Natural Nigerian Pantry`;
		const description = loaderData.description ?? `Shop natural, small-batch ${loaderData.name.toLowerCase()} from Mummy Rose.`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter$8, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$2, "notFoundComponent"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$3, "errorComponent")
});
var $$splitComponentImporter$7 = () => import("./products.index-fYarCLWQ.mjs");
var Route$10 = createFileRoute("/products/")({
	validateSearch: objectType({ q: stringType().optional() }),
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(productsQuery);
		context.queryClient.ensureQueryData(categoriesQuery);
	},
	head: () => ({ meta: [
		{ title: "Shop All Products — Mummy Rose Natural Nigerian Pantry" },
		{
			name: "description",
			content: "Browse every Mummy Rose product: natural spices, stone-milled flours, cereals and herbal infusions. Filter by category, price and availability."
		},
		{
			property: "og:title",
			content: "Shop All Products — Mummy Rose"
		},
		{
			property: "og:description",
			content: "Natural Nigerian spices, flours, cereals and herbal infusions, delivered nationwide."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitErrorComponentImporter$2 = () => import("./products._slug-xyLpxZSO.mjs");
var $$splitNotFoundComponentImporter$1 = () => import("./products._slug-D9l5kYL_.mjs");
var $$splitComponentImporter$6 = () => import("./products._slug-MU2S1oFy.mjs");
var Route$9 = createFileRoute("/products/$slug")({
	loader: async ({ context, params }) => {
		const product = await context.queryClient.ensureQueryData(productQuery(params.slug));
		context.queryClient.ensureQueryData(productsQuery);
		if (!product) throw notFound();
		return {
			name: product.name,
			description: product.seo_description ?? product.short_description ?? "",
			title: product.seo_title ?? product.name
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Product unavailable — Mummy Rose" }, {
			name: "robots",
			content: "noindex"
		}] };
		const title = `${loaderData.title} — Mummy Rose`;
		const description = loaderData.description || `Buy ${loaderData.name} from Mummy Rose.`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			},
			{
				property: "og:type",
				content: "product"
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter$6, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent")
});
var $$splitComponentImporter$5 = () => import("./recipes.index-BvF05v-3.mjs");
var TITLE = "Nigerian Recipes & Cooking Guides — Mummy Rose";
var DESCRIPTION = "Everyday Nigerian recipes and cooking guides from the Mummy Rose kitchen — how to cook with our spices, stone-milled flours and herbal infusions.";
var Route$8 = createFileRoute("/recipes/")({
	loader: ({ context }) => context.queryClient.ensureQueryData(recipesQuery),
	head: () => ({ meta: [
		{ title: TITLE },
		{
			name: "description",
			content: DESCRIPTION
		},
		{
			property: "og:title",
			content: TITLE
		},
		{
			property: "og:description",
			content: DESCRIPTION
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitErrorComponentImporter$1 = () => import("./recipes._slug-8Jtjtn7n.mjs");
var $$splitNotFoundComponentImporter = () => import("./recipes._slug-DTZ0iD1H.mjs");
var $$splitComponentImporter$4 = () => import("./recipes._slug-BVSAo68K.mjs");
var Route$7 = createFileRoute("/recipes/$slug")({
	loader: async ({ context, params }) => {
		const post = await context.queryClient.ensureQueryData(postQuery(params.slug));
		if (!post) throw notFound();
		if (post.kind !== "recipe") throw redirect({
			to: "/blog/$slug",
			params: { slug: params.slug }
		});
		context.queryClient.ensureQueryData(recipesQuery);
		return {
			title: post.seo_title ?? post.title,
			description: post.seo_description ?? post.excerpt ?? "",
			keywords: post.seo_keywords ?? "",
			image: post.cover_image ?? ""
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Recipe unavailable — Mummy Rose" }, {
			name: "robots",
			content: "noindex"
		}] };
		const title = `${loaderData.title} — Mummy Rose`;
		const description = loaderData.description || "A recipe from the Mummy Rose kitchen.";
		const image = loaderData.image?.startsWith("http") ? loaderData.image : "";
		return { meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			...loaderData.keywords ? [{
				name: "keywords",
				content: loaderData.keywords
			}] : [],
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			},
			{
				property: "og:type",
				content: "article"
			},
			...image ? [{
				property: "og:image",
				content: image
			}, {
				name: "twitter:image",
				content: image
			}] : []
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent")
});
var $$splitComponentImporter$3 = () => import("./wholesale.index-JonxmtLy.mjs");
var Route$6 = createFileRoute("/wholesale/")({
	head: () => ({ meta: [
		{ title: "Wholesale Supply — Bulk Nigerian Spices & Flours | Mummy Rose" },
		{
			name: "description",
			content: "Buy Mummy Rose spices, flours and infusions in bulk with trade pricing, consistent lots and nationwide delivery."
		},
		{
			property: "og:title",
			content: "Wholesale Supply — Bulk Nigerian Spices & Flours | Mummy Rose"
		},
		{
			property: "og:description",
			content: "Buy Mummy Rose spices, flours and infusions in bulk with trade pricing, consistent lots and nationwide delivery."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./wholesale.apply-BkGHoxII.mjs");
var Route$5 = createFileRoute("/wholesale/apply")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Apply for a Wholesale Account | Mummy Rose" },
		{
			name: "description",
			content: "Apply for Mummy Rose trade pricing. Submit your business details to unlock tiered wholesale discounts, standing orders and account management."
		},
		{
			property: "og:title",
			content: "Apply for a Wholesale Account | Mummy Rose"
		},
		{
			property: "og:description",
			content: "Unlock tiered trade pricing on Nigerian spices, flours and infusions."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./wholesale.portal-rTizN9Cy.mjs");
var Route$4 = createFileRoute("/wholesale/portal")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Wholesale Portal — Trade Orders & Tracking | Mummy Rose" },
		{
			name: "description",
			content: "Manage your Mummy Rose trade account: see your tier discount, place bulk orders at wholesale pricing and track every shipment."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
function oauth() {
	return supabase.auth.oauth;
}
var $$splitErrorComponentImporter = () => import("../_._lovable.oauth.consent-C3cz6mN8.mjs");
var $$splitComponentImporter = () => import("../_._lovable.oauth.consent-CtyuabOO.mjs");
var Route$3 = createFileRoute("/.lovable/oauth/consent")({
	ssr: false,
	validateSearch: (s) => ({ authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "" }),
	loader: async ({ location }) => {
		const authorizationId = new URLSearchParams(location.search).get("authorization_id");
		if (!authorizationId) throw new Error("Missing authorization_id");
		const { data: sessionData } = await supabase.auth.getSession();
		if (!sessionData.session) return {
			needsAuth: true,
			details: null
		};
		const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
		if (error) throw new Error(error.message);
		const immediate = data?.redirect_url ?? data?.redirect_to;
		if (immediate && !data?.client) throw redirect({ href: immediate });
		return {
			needsAuth: false,
			details: data ?? null,
			email: sessionData.session.user.email
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
var Route$2 = createFileRoute("/.mcp/invoke-tool/$tool")({ server: { handlers: { ANY: createTanStackInvokeToolHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var Route$1 = createFileRoute("/api/public/webhooks/flutterwave")({ server: { handlers: { POST: async ({ request }) => {
	const hash = process.env.FLUTTERWAVE_WEBHOOK_HASH;
	if (!hash) return new Response("Not configured", { status: 503 });
	const provided = request.headers.get("verif-hash") ?? "";
	const a = Buffer.from(provided);
	const b = Buffer.from(hash);
	if (a.length !== b.length || !timingSafeEqual(a, b)) return new Response("Invalid signature", { status: 401 });
	const event = await request.json();
	const reference = event.data?.tx_ref;
	if (!reference) return new Response("ok");
	const { verifyFlutterwave, markFailed } = await import("./payments.server-BrZGIjSv.mjs");
	if (event.data?.status === "successful") await verifyFlutterwave(reference, event.data.id ? String(event.data.id) : null);
	else await markFailed(reference);
	return new Response("ok");
} } } });
var Route = createFileRoute("/api/public/webhooks/paystack")({ server: { handlers: { POST: async ({ request }) => {
	const secret = process.env.PAYSTACK_SECRET_KEY;
	if (!secret) return new Response("Not configured", { status: 503 });
	const body = await request.text();
	const signature = request.headers.get("x-paystack-signature") ?? "";
	const expected = createHmac("sha512", secret).update(body).digest("hex");
	const a = Buffer.from(signature);
	const b = Buffer.from(expected);
	if (a.length !== b.length || !timingSafeEqual(a, b)) return new Response("Invalid signature", { status: 401 });
	const event = JSON.parse(body);
	const reference = event.data?.reference;
	if (!reference) return new Response("ok");
	const { markPaid, markFailed } = await import("./payments.server-BrZGIjSv.mjs");
	if (event.event === "charge.success" && event.data?.status === "success") await markPaid(reference, "paystack", event);
	else if (event.event === "charge.failed") await markFailed(reference);
	return new Response("ok");
} } } });
var IndexRoute = Route$64.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$65
});
var SplatRoute = Route$63.update({
	id: "/$",
	path: "/$",
	getParentRoute: () => Route$65
});
var AboutRoute = Route$62.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$65
});
var AccountRoute = Route$61.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => Route$65
});
var AdminRoute = Route$60.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$65
});
var CartRoute = Route$59.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$65
});
var CheckoutRoute = Route$58.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$65
});
var ContactRoute = Route$57.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$65
});
var CorporateSupplyRoute = Route$56.update({
	id: "/corporate-supply",
	path: "/corporate-supply",
	getParentRoute: () => Route$65
});
var CustomPackagingRoute = Route$55.update({
	id: "/custom-packaging",
	path: "/custom-packaging",
	getParentRoute: () => Route$65
});
var ExportRoute = Route$54.update({
	id: "/export",
	path: "/export",
	getParentRoute: () => Route$65
});
var FaqRoute = Route$53.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$65
});
var McpRoute = Route$52.update({
	id: "/mcp",
	path: "/mcp",
	getParentRoute: () => Route$65
});
var OrderConfirmedRoute = Route$51.update({
	id: "/order-confirmed",
	path: "/order-confirmed",
	getParentRoute: () => Route$65
});
var PaymentCallbackRoute = Route$50.update({
	id: "/payment-callback",
	path: "/payment-callback",
	getParentRoute: () => Route$65
});
var PrivacyRoute = Route$49.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$65
});
var RefundsRoute = Route$48.update({
	id: "/refunds",
	path: "/refunds",
	getParentRoute: () => Route$65
});
var RetailRoute = Route$47.update({
	id: "/retail",
	path: "/retail",
	getParentRoute: () => Route$65
});
var ServicesRoute = Route$46.update({
	id: "/services",
	path: "/services",
	getParentRoute: () => Route$65
});
var ShippingRoute = Route$45.update({
	id: "/shipping",
	path: "/shipping",
	getParentRoute: () => Route$65
});
var SitemapDotxmlRoute = Route$44.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$65
});
var TermsRoute = Route$43.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$65
});
var TrackOrderRoute = Route$42.update({
	id: "/track-order",
	path: "/track-order",
	getParentRoute: () => Route$65
});
var WhiteLabellingRoute = Route$41.update({
	id: "/white-labelling",
	path: "/white-labelling",
	getParentRoute: () => Route$65
});
var WishlistRoute = Route$40.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => Route$65
});
var Char91DotmcpChar93ListToolsRoute = Route$39.update({
	id: "/.mcp/list-tools",
	path: "/.mcp/list-tools",
	getParentRoute: () => Route$65
});
var Char91DotwellKnownChar93OauthProtectedResourceRoute = Route$38.update({
	id: "/.well-known/oauth-protected-resource",
	path: "/.well-known/oauth-protected-resource",
	getParentRoute: () => Route$65
});
var AdminIndexRoute = Route$37.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminAnalyticsRoute = Route$36.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AdminRoute
});
var AdminBannersRoute = Route$35.update({
	id: "/banners",
	path: "/banners",
	getParentRoute: () => AdminRoute
});
var AdminCategoriesRoute = Route$34.update({
	id: "/categories",
	path: "/categories",
	getParentRoute: () => AdminRoute
});
var AdminCouponsRoute = Route$33.update({
	id: "/coupons",
	path: "/coupons",
	getParentRoute: () => AdminRoute
});
var AdminCustomersRoute = Route$32.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => AdminRoute
});
var AdminFaqsRoute = Route$31.update({
	id: "/faqs",
	path: "/faqs",
	getParentRoute: () => AdminRoute
});
var AdminInquiriesRoute = Route$30.update({
	id: "/inquiries",
	path: "/inquiries",
	getParentRoute: () => AdminRoute
});
var AdminInventoryRoute = Route$29.update({
	id: "/inventory",
	path: "/inventory",
	getParentRoute: () => AdminRoute
});
var AdminMediaRoute = Route$28.update({
	id: "/media",
	path: "/media",
	getParentRoute: () => AdminRoute
});
var AdminNavigationRoute = Route$27.update({
	id: "/navigation",
	path: "/navigation",
	getParentRoute: () => AdminRoute
});
var AdminOrdersRoute = Route$26.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AdminRoute
});
var AdminPagesRoute = Route$25.update({
	id: "/pages",
	path: "/pages",
	getParentRoute: () => AdminRoute
});
var AdminPostsRoute = Route$24.update({
	id: "/posts",
	path: "/posts",
	getParentRoute: () => AdminRoute
});
var AdminPreviewRoute = Route$23.update({
	id: "/preview",
	path: "/preview",
	getParentRoute: () => AdminRoute
});
var AdminProductsRoute = Route$22.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AdminRoute
});
var AdminRedirectsRoute = Route$21.update({
	id: "/redirects",
	path: "/redirects",
	getParentRoute: () => AdminRoute
});
var AdminReviewsRoute = Route$20.update({
	id: "/reviews",
	path: "/reviews",
	getParentRoute: () => AdminRoute
});
var AdminRolesRoute = Route$19.update({
	id: "/roles",
	path: "/roles",
	getParentRoute: () => AdminRoute
});
var AdminSettingsRoute = Route$18.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRoute
});
var AdminTestimonialsRoute = Route$17.update({
	id: "/testimonials",
	path: "/testimonials",
	getParentRoute: () => AdminRoute
});
var AdminVariantsRoute = Route$16.update({
	id: "/variants",
	path: "/variants",
	getParentRoute: () => AdminRoute
});
var AdminWholesaleRoute = Route$15.update({
	id: "/wholesale",
	path: "/wholesale",
	getParentRoute: () => AdminRoute
});
var ApiChatRoute = Route$14.update({
	id: "/api/chat",
	path: "/api/chat",
	getParentRoute: () => Route$65
});
var BlogIndexRoute = Route$13.update({
	id: "/blog/",
	path: "/blog/",
	getParentRoute: () => Route$65
});
var BlogSlugRoute = Route$12.update({
	id: "/blog/$slug",
	path: "/blog/$slug",
	getParentRoute: () => Route$65
});
var CategorySlugRoute = Route$11.update({
	id: "/category/$slug",
	path: "/category/$slug",
	getParentRoute: () => Route$65
});
var ProductsIndexRoute = Route$10.update({
	id: "/products/",
	path: "/products/",
	getParentRoute: () => Route$65
});
var ProductsSlugRoute = Route$9.update({
	id: "/products/$slug",
	path: "/products/$slug",
	getParentRoute: () => Route$65
});
var RecipesIndexRoute = Route$8.update({
	id: "/recipes/",
	path: "/recipes/",
	getParentRoute: () => Route$65
});
var RecipesSlugRoute = Route$7.update({
	id: "/recipes/$slug",
	path: "/recipes/$slug",
	getParentRoute: () => Route$65
});
var WholesaleIndexRoute = Route$6.update({
	id: "/wholesale/",
	path: "/wholesale/",
	getParentRoute: () => Route$65
});
var WholesaleApplyRoute = Route$5.update({
	id: "/wholesale/apply",
	path: "/wholesale/apply",
	getParentRoute: () => Route$65
});
var WholesalePortalRoute = Route$4.update({
	id: "/wholesale/portal",
	path: "/wholesale/portal",
	getParentRoute: () => Route$65
});
var DotlovableOauthConsentRoute = Route$3.update({
	id: "/.lovable/oauth/consent",
	path: "/.lovable/oauth/consent",
	getParentRoute: () => Route$65
});
var Char91DotmcpChar93InvokeToolToolRoute = Route$2.update({
	id: "/.mcp/invoke-tool/$tool",
	path: "/.mcp/invoke-tool/$tool",
	getParentRoute: () => Route$65
});
var ApiPublicWebhooksFlutterwaveRoute = Route$1.update({
	id: "/api/public/webhooks/flutterwave",
	path: "/api/public/webhooks/flutterwave",
	getParentRoute: () => Route$65
});
var ApiPublicWebhooksPaystackRoute = Route.update({
	id: "/api/public/webhooks/paystack",
	path: "/api/public/webhooks/paystack",
	getParentRoute: () => Route$65
});
var AdminRouteChildren = {
	AdminAnalyticsRoute,
	AdminBannersRoute,
	AdminCategoriesRoute,
	AdminCouponsRoute,
	AdminCustomersRoute,
	AdminFaqsRoute,
	AdminInquiriesRoute,
	AdminInventoryRoute,
	AdminMediaRoute,
	AdminNavigationRoute,
	AdminOrdersRoute,
	AdminPagesRoute,
	AdminPostsRoute,
	AdminPreviewRoute,
	AdminProductsRoute,
	AdminRedirectsRoute,
	AdminReviewsRoute,
	AdminRolesRoute,
	AdminSettingsRoute,
	AdminTestimonialsRoute,
	AdminVariantsRoute,
	AdminWholesaleRoute,
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	SplatRoute,
	AboutRoute,
	AccountRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	CartRoute,
	CheckoutRoute,
	ContactRoute,
	CorporateSupplyRoute,
	CustomPackagingRoute,
	ExportRoute,
	FaqRoute,
	McpRoute,
	OrderConfirmedRoute,
	PaymentCallbackRoute,
	PrivacyRoute,
	RefundsRoute,
	RetailRoute,
	ServicesRoute,
	ShippingRoute,
	SitemapDotxmlRoute,
	TermsRoute,
	TrackOrderRoute,
	WhiteLabellingRoute,
	WishlistRoute,
	Char91DotmcpChar93ListToolsRoute,
	Char91DotwellKnownChar93OauthProtectedResourceRoute,
	ApiChatRoute,
	BlogSlugRoute,
	CategorySlugRoute,
	ProductsSlugRoute,
	RecipesSlugRoute,
	WholesaleApplyRoute,
	WholesalePortalRoute,
	BlogIndexRoute,
	ProductsIndexRoute,
	RecipesIndexRoute,
	WholesaleIndexRoute,
	DotlovableOauthConsentRoute,
	Char91DotmcpChar93InvokeToolToolRoute,
	ApiPublicWebhooksFlutterwaveRoute,
	ApiPublicWebhooksPaystackRoute
};
var routeTree = Route$65._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { formatDateTime as A, useSiteConfig as B, Route$7 as C, categoryImage as D, Textarea as E, resolvePageSeo as F, createSsrRpc as H, router_exports as I, slugify as L, getRouter as M, oauth as N, effectivePrice as O, productImage as P, useCart as R, Route$63 as S, SEO_PAGES as T, useServerFn as U, submitInquiry as V, Route$11 as _, DEFAULT_THEME as a, Route$50 as b, DialogDescription as c, DialogTitle as d, EMPTY_PAGE_SEO as f, Route$10 as g, NewsletterForm as h, DEFAULT_SEO_META as i, formatNaira as j, formatDate as k, DialogFooter as l, HOME_SECTIONS as m, DEFAULT_FOOTER as n, Dialog as o, GOOGLE_FONTS as p, DEFAULT_HOME as r, DialogContent as s, DEFAULT_BRANDING as t, DialogHeader as u, Route$12 as v, Route$9 as w, Route$51 as x, Route$3 as y, usePageSeoMap as z };
