import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as categoryImage, k as formatDate } from "./router-Bg0ak8An.mjs";
import { L as Printer, Vt as Check, it as Link2, k as Share2, u as Twitter, wt as Facebook } from "../_libs/lucide-react.mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
import { f as relatedProductsQuery } from "./queries-BOD52kvY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { i as contentPath } from "./breadcrumbs-ByinkId4.mjs";
import { t as ProductCard } from "./product-card-nmIB4KSC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/canonical-BkT-Vm25.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Social sharing + print. Uses the native share sheet on mobile where
* available and falls back to copy-to-clipboard everywhere else.
*/
function ShareButtons({ title, url, showPrint = false }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
	const encoded = encodeURIComponent(shareUrl);
	const encodedTitle = encodeURIComponent(title);
	async function copy() {
		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			toast.success("Link copied");
			setTimeout(() => setCopied(false), 2e3);
		} catch {
			toast.error("Could not copy the link");
		}
	}
	async function nativeShare() {
		if (typeof navigator !== "undefined" && "share" in navigator) try {
			await navigator.share({
				title,
				url: shareUrl
			});
			return;
		} catch {}
		copy();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs tracking-wide text-muted-foreground uppercase",
				children: "Share"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "icon-sm",
				onClick: nativeShare,
				"aria-label": "Share this page",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "icon-sm",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encoded}`,
					target: "_blank",
					rel: "noreferrer noopener",
					"aria-label": "Share on WhatsApp",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						viewBox: "0 0 24 24",
						"aria-hidden": true,
						className: "size-4 fill-current",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12.04 2a9.9 9.9 0 0 0-8.4 15.16L2 22l4.98-1.6A9.9 9.9 0 1 0 12.04 2Zm5.8 14.06c-.25.7-1.45 1.35-2 1.4-.55.05-1.02.2-3.5-.9s-3.86-3.7-4-3.9c-.14-.2-.9-1.3-.9-2.5s.63-1.77.86-2c.22-.25.48-.3.65-.3h.47c.15 0 .35-.03.54.42.2.47.68 1.68.74 1.8.06.12.1.26.02.42-.09.16-.35.5-.5.66-.15.16-.24.24-.1.5.15.24.65 1.04 1.39 1.7.95.85 1.4 1 1.65 1.12.24.11.38.1.53-.06.14-.16.6-.7.76-.94.16-.24.32-.2.53-.12.22.08 1.38.65 1.62.77.24.12.4.18.46.28.06.1.06.6-.19 1.3Z" })
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "icon-sm",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
					target: "_blank",
					rel: "noreferrer noopener",
					"aria-label": "Share on Facebook",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "size-4" })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "icon-sm",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`,
					target: "_blank",
					rel: "noreferrer noopener",
					"aria-label": "Share on X",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { className: "size-4" })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "icon-sm",
				onClick: copy,
				"aria-label": "Copy link",
				children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-4" })
			}),
			showPrint && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => window.print(),
				className: "gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), " Print"]
			})
		]
	});
}
/** "Shop this recipe" block — only rendered when an editor linked products. */
function RelatedProducts({ ids, heading = "Shop the ingredients", blurb }) {
	const { data: products = [] } = useQuery(relatedProductsQuery(ids));
	if (products.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-labelledby": "related-products",
		className: "mt-16 border-t border-border pt-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow text-accent",
					children: "From the pantry"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "related-products",
					className: "mt-2 font-display text-2xl md:text-3xl",
					children: heading
				}),
				blurb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-md text-sm text-muted-foreground",
					children: blurb
				}) : null
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/products",
				className: "text-sm underline underline-offset-4 hover:text-accent",
				children: "Shop all products"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3",
			children: products.slice(0, 3).map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product }, product.id))
		})]
	});
}
/** Compact "keep reading" rail used at the foot of recipe and article pages. */
function RelatedContent({ posts, heading }) {
	if (posts.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-labelledby": "related-content",
		className: "mt-16 border-t border-border pt-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			id: "related-content",
			className: "font-display text-2xl md:text-3xl",
			children: heading
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid gap-8 sm:grid-cols-3",
			children: posts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: contentPath(post.kind, post.slug),
				className: "group",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-sm bg-linen",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: post.cover_image || categoryImage(post.category),
							alt: post.title,
							width: 600,
							height: 450,
							loading: "lazy",
							className: "aspect-4/3 w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.05]"
						})
					}),
					post.category ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow mt-3 text-accent",
						children: post.category
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-1.5 font-display text-lg leading-snug group-hover:text-accent",
						children: post.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-xs text-muted-foreground",
						children: formatDate(post.published_at)
					})
				]
			}, post.id))
		})]
	});
}
/**
* Lets a leaf route override the self-referencing canonical URL that
* SiteChrome writes (used when an editor sets a canonical URL on a post).
*/
function useCanonicalOverride(url) {
	(0, import_react.useEffect)(() => {
		const href = url?.trim();
		if (!href) return;
		const el = document.head.querySelector("link[data-cms=\"canonical\"]");
		if (el) el.href = href;
	}, [url]);
}
//#endregion
export { useCanonicalOverride as i, RelatedProducts as n, ShareButtons as r, RelatedContent as t };
