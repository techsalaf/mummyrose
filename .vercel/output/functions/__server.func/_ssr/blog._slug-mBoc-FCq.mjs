import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as useSiteConfig, D as categoryImage, k as formatDate, v as Route$12 } from "./router-Bg0ak8An.mjs";
import { i as useQuery, r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { n as articlesQuery, o as postQuery } from "./queries-BOD52kvY.mjs";
import { t as RichText } from "./rich-text-LLOFDu3f.mjs";
import { t as JsonLd } from "./json-ld-2dnvi90N.mjs";
import { a as extractHeadings, c as readingMinutes, l as relatedContent, n as absoluteUrl, t as Breadcrumbs } from "./breadcrumbs-ByinkId4.mjs";
import { i as useCanonicalOverride, n as RelatedProducts, r as ShareButtons, t as RelatedContent } from "./canonical-BkT-Vm25.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog._slug-mBoc-FCq.js
var import_jsx_runtime = require_jsx_runtime();
function ArticleDetail() {
	const { slug } = Route$12.useParams();
	const { data: post } = useSuspenseQuery(postQuery(slug));
	const { data: allArticles = [] } = useQuery(articlesQuery);
	const { seo } = useSiteConfig();
	useCanonicalOverride(post?.canonical_url);
	if (!post) return null;
	const image = post.cover_image || categoryImage(post.category);
	const url = absoluteUrl(seo.site_url, `/blog/${post.slug}`);
	const headings = extractHeadings(post.content);
	const minutes = readingMinutes(post.content, post.reading_minutes);
	const related = relatedContent(allArticles, {
		id: post.id,
		category: post.category
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "container-page py-8 md:py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonLd, { data: {
				"@context": "https://schema.org",
				"@type": "Article",
				headline: post.title,
				url,
				description: post.excerpt ?? void 0,
				image: image?.startsWith("http") ? [image] : void 0,
				articleSection: post.category ?? void 0,
				keywords: post.seo_keywords ?? ((post.tags ?? []).join(", ") || void 0),
				author: {
					"@type": "Organization",
					name: post.author ?? "Mummy Rose"
				},
				publisher: {
					"@type": "Organization",
					name: "Mummy Rose"
				},
				datePublished: post.published_at ?? void 0,
				dateModified: post.updated_at ?? void 0
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { items: [{
				label: "Journal",
				href: "/blog"
			}, { label: post.title }] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mt-6 max-w-3xl",
				children: [
					post.category ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-accent",
						children: post.category
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-4xl leading-tight md:text-5xl",
						children: post.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						children: [
							"By ",
							post.author ?? "Mummy Rose",
							" · ",
							formatDate(post.published_at),
							" · ",
							minutes,
							" min read"
						]
					}),
					post.updated_at && post.published_at && post.updated_at.slice(0, 10) !== post.published_at.slice(0, 10) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: ["Updated ", formatDate(post.updated_at)]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 overflow-hidden rounded-sm bg-linen",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: image,
					alt: post.title,
					width: 1600,
					height: 900,
					className: "aspect-16/9 w-full object-cover"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl",
					children: [
						post.excerpt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl leading-relaxed text-foreground/90",
							children: post.excerpt
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, {
							content: post.content,
							className: "mt-6 leading-relaxed text-muted-foreground"
						}),
						(post.tags ?? []).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 flex flex-wrap gap-2",
							children: (post.tags ?? []).map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-linen px-3 py-1 text-xs text-muted-foreground",
								children: ["#", tag]
							}, tag))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 border-t border-border pt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareButtons, {
								title: post.title,
								url
							})
						})
					]
				}), headings.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					"aria-label": "On this page",
					className: "lg:sticky lg:top-28",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-muted-foreground",
						children: "On this page"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2.5 border-l border-border pl-4 text-sm",
						children: headings.map((heading) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `#${heading.id}`,
							className: "text-muted-foreground transition-colors hover:text-accent",
							children: heading.text
						}) }, heading.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelatedProducts, {
				ids: post.related_product_ids,
				heading: "Products mentioned",
				blurb: "Everything referenced in this guide, ready to shop."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelatedContent, {
				posts: related,
				heading: "Keep reading"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/blog",
					className: "text-sm underline underline-offset-4 hover:text-accent",
					children: "← All articles"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/recipes",
					className: "text-sm underline underline-offset-4 hover:text-accent",
					children: "Browse recipes →"
				})]
			})
		]
	});
}
//#endregion
export { ArticleDetail as component };
