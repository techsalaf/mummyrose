import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as categoryImage, h as NewsletterForm, k as formatDate } from "./router-Bg0ak8An.mjs";
import { Nt as Clock, j as Search, o as UtensilsCrossed } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { i as cn, n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Reveal } from "./reveal-B3BIN0jH.mjs";
import { c as readingMinutes, i as contentPath, o as formatMinutes, r as contentCategories, t as Breadcrumbs, u as totalMinutes } from "./breadcrumbs-ByinkId4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/content-index-CudDaaYO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAGE_SIZE = 9;
function PostMeta({ post, kind }) {
	const cookTime = formatMinutes(totalMinutes(post.prep_minutes, post.cook_minutes));
	const read = `${readingMinutes(null, post.reading_minutes)} min read`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(post.published_at) }),
			kind === "recipe" && cookTime ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
						"aria-hidden": true,
						className: "size-3"
					}),
					" ",
					cookTime
				]
			}) : null,
			kind === "recipe" && post.servings ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, {
						"aria-hidden": true,
						className: "size-3"
					}),
					" Serves ",
					post.servings
				]
			}) : null,
			kind === "article" && post.reading_minutes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: read }) : null
		]
	});
}
function PostCard({ post, kind }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "group h-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: contentPath(post.kind, post.slug),
			className: "flex h-full flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-sm bg-linen",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: post.cover_image || categoryImage(post.category),
						alt: post.title,
						width: 800,
						height: 600,
						loading: "lazy",
						className: "aspect-4/3 w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.05]"
					})
				}),
				post.category ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow mt-4 text-accent",
					children: post.category
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-2 font-display text-xl leading-snug group-hover:text-accent",
					children: post.title
				}),
				post.excerpt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 line-clamp-2 text-sm text-muted-foreground",
					children: post.excerpt
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostMeta, {
					post,
					kind
				})
			]
		})
	});
}
/**
* Shared index experience for /recipes and /blog: featured lead, keyword
* search, category filtering and load-more paging over one content table.
*/
function ContentIndex({ kind, posts, eyebrow, title, intro, emptyMessage, crumbLabel }) {
	const [term, setTerm] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)(null);
	const [visible, setVisible] = (0, import_react.useState)(PAGE_SIZE);
	const categories = (0, import_react.useMemo)(() => contentCategories(posts), [posts]);
	const filtered = (0, import_react.useMemo)(() => {
		const needle = term.trim().toLowerCase();
		return posts.filter((post) => {
			if (category && post.category !== category) return false;
			if (!needle) return true;
			return [
				post.title,
				post.excerpt,
				post.category,
				...post.tags ?? []
			].filter(Boolean).some((value) => String(value).toLowerCase().includes(needle));
		});
	}, [
		posts,
		term,
		category
	]);
	const isFiltering = Boolean(term.trim() || category);
	const featured = !isFiltering ? filtered.find((p) => p.is_featured) ?? filtered[0] : void 0;
	const rest = filtered.filter((p) => p.id !== featured?.id);
	const shown = rest.slice(0, visible);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-10 md:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { items: [{ label: crumbLabel }] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mt-6 max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-accent",
						children: eyebrow
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-4xl leading-tight md:text-5xl",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 leading-relaxed text-muted-foreground",
						children: intro
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-sm flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						"aria-hidden": true,
						className: "absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: term,
						onChange: (event) => {
							setTerm(event.target.value);
							setVisible(PAGE_SIZE);
						},
						placeholder: kind === "recipe" ? "Search recipes, ingredients…" : "Search articles, guides…",
						"aria-label": kind === "recipe" ? "Search recipes" : "Search articles",
						className: "pl-9"
					})]
				}), categories.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					role: "group",
					"aria-label": "Filter by category",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setCategory(null);
							setVisible(PAGE_SIZE);
						},
						"aria-pressed": category === null,
						className: cn("rounded-full border px-3.5 py-1.5 text-xs tracking-wide uppercase transition-colors", category === null ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"),
						children: "All"
					}), categories.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setCategory(item === category ? null : item);
							setVisible(PAGE_SIZE);
						},
						"aria-pressed": category === item,
						className: cn("rounded-full border px-3.5 py-1.5 text-xs tracking-wide uppercase transition-colors", category === item ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"),
						children: item
					}, item))]
				})]
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-20 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl",
					children: isFiltering ? "Nothing matched that search" : emptyMessage
				}), isFiltering && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "mt-5",
					onClick: () => {
						setTerm("");
						setCategory(null);
					},
					children: "Clear filters"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				featured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: contentPath(featured.kind, featured.slug),
					className: "group mt-10 grid items-center gap-8 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-sm bg-linen",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: featured.cover_image || categoryImage(featured.category),
							alt: featured.title,
							width: 1200,
							height: 900,
							className: "aspect-4/3 w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.04]"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow text-accent",
							children: featured.category ?? "Featured"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-3xl leading-tight md:text-4xl group-hover:text-accent",
							children: featured.title
						}),
						featured.excerpt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 leading-relaxed text-muted-foreground",
							children: featured.excerpt
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostMeta, {
							post: featured,
							kind
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-5 inline-block text-sm underline underline-offset-4",
							children: kind === "recipe" ? "Read the recipe" : "Read the article"
						})
					] })]
				}) }),
				shown.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3",
					children: shown.map((post, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: Math.min(index, 3) * 60,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCard, {
							post,
							kind
						})
					}, post.id))
				}),
				rest.length > visible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setVisible((v) => v + PAGE_SIZE),
						children: "Load more"
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-20 rounded-sm bg-linen px-6 py-12 text-center md:px-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-accent",
						children: "The pantry letter"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-2xl md:text-3xl",
						children: "New recipes and guides, straight to your inbox"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-3 max-w-md text-sm text-muted-foreground",
						children: "Cooking notes, ingredient guides and restocks. No noise."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mt-6 max-w-md",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsletterForm, {})
					})
				]
			})
		]
	});
}
//#endregion
export { ContentIndex as t };
