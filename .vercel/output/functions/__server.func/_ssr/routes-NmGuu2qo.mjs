import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as useSiteConfig, D as categoryImage, h as NewsletterForm, k as formatDate, m as HOME_SECTIONS } from "./router-Bg0ak8An.mjs";
import { $t as ArrowLeft, C as Sparkles, E as ShoppingBag, F as Recycle, Ft as CircleCheckBig, H as Package, Mt as Coffee, Nt as Clock, O as ShieldCheck, Pt as CircleCheck, Qt as ArrowRight, St as Flame, U as PackageCheck, Wt as Building2, Yt as Award, Zt as ArrowUpRight, a as Utensils, at as Lightbulb, b as Store, d as Truck, ht as HeartHandshake, j as Search, kt as Cpu, mt as Heart, ot as Leaf, r as Wheat, s as Users, vt as Globe, x as Star, yt as Gift } from "../_libs/lucide-react.mjs";
import { i as useQuery, r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { i as categoriesQuery, m as testimonialsQuery, r as bannersQuery, s as postsQuery, u as productsQuery } from "./queries-BOD52kvY.mjs";
import { i as cn, n as Button } from "./router-Bg0ak8An2.mjs";
import { t as RichText } from "./rich-text-LLOFDu3f.mjs";
import { n as useScrollY, t as Reveal } from "./reveal-B3BIN0jH.mjs";
import { t as JsonLd } from "./json-ld-2dnvi90N.mjs";
import { t as ProductCard } from "./product-card-nmIB4KSC.mjs";
import { t as process_milling_default } from "./process-milling-BEyUnkUh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-NmGuu2qo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var story_farmers_default = "/assets/story-farmers-CcP0uHFY.jpg";
/**
* Renders CMS-managed banners / landing sections for a placement so staff can
* publish promos and campaign blocks without a deploy.
*/
function BannerSections({ placement }) {
	const { data: banners = [] } = useQuery(bannersQuery(placement));
	if (banners.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: banners.map((banner) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "container-page py-12 md:py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid items-center gap-8 md:grid-cols-2",
			children: [banner.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: banner.image_url,
				alt: banner.title ?? "",
				className: "w-full rounded-lg object-cover",
				loading: "lazy"
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: banner.image_url ? "" : "md:col-span-2 max-w-3xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl",
						children: banner.title
					}),
					banner.subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 leading-relaxed text-muted-foreground",
						children: banner.subtitle
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, {
						content: banner.body,
						className: "mt-4 space-y-3 text-muted-foreground"
					}),
					banner.cta_label && banner.cta_href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "clay",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: banner.cta_href,
							children: [
								banner.cta_label,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
							]
						})
					}) : null
				]
			})]
		})
	}, banner.id)) });
}
var lifestyle_table_default = "/assets/lifestyle-table-f9_pJVcN.jpg";
var TRUST_BADGES = [
	{
		icon: Leaf,
		label: "100% Natural Ingredients"
	},
	{
		icon: ShieldCheck,
		label: "Strict Quality Control"
	},
	{
		icon: Heart,
		label: "Generational Recipes"
	}
];
function HomeHero({ home }) {
	const y = useScrollY();
	const shift = Math.min(y, 700) * .1;
	const headline = home.hero_title || "Nature’s Goodness. Mummy’s Touch.";
	const bodyCopy = home.hero_body || "Spices, flours and herbal infusions inspired by generations of home cooking — crafted without preservatives or artificial fillers.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden bg-background pt-8 pb-16 md:pt-14 md:pb-24 lg:pt-16 lg:pb-28",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-secondary/60 blur-3xl opacity-60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-wide",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative grid items-center gap-12 lg:grid-cols-12 lg:gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative z-20 order-2 lg:order-1 lg:col-span-7 lg:pr-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rise-in",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 rounded-full bg-secondary/80 px-3.5 py-1.5 border border-border/60 text-xs font-semibold tracking-wider text-primary uppercase",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: home.hero_eyebrow || "Heritage Food Brand & FMCG Solutions" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl mt-6 leading-[0.98] text-balance",
								children: headline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 max-w-xl text-base text-muted-foreground sm:text-lg lg:text-xl leading-relaxed",
								children: bodyCopy
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-9 flex flex-wrap items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "xl",
									className: "font-semibold px-8 py-6 text-base tracking-wide shadow-md hover:shadow-lg transition-all",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/products",
										children: ["Shop the Collection ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2.5 size-5" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "xl",
									variant: "outline",
									className: "font-semibold px-7 py-6 text-base border-primary/30 hover:border-primary hover:bg-secondary transition-all",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/about",
										children: "Discover Our Story"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-12 grid grid-cols-1 gap-4 border-t border-border/80 pt-7 sm:grid-cols-3",
								children: TRUST_BADGES.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(b.icon, { className: "size-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold tracking-wide text-foreground/90 uppercase",
										children: b.label
									})]
								}, b.label))
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative order-1 lg:order-2 lg:col-span-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto max-w-md lg:max-w-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hover-zoom-img relative overflow-hidden rounded-2xl border border-border/80 shadow-editorial bg-card",
								style: { transform: `translate3d(0, ${-shift}px, 0)` },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: home.hero_image || "/assets/hero-editorial-Bg0zrssd.jpg",
										alt: home.hero_image_alt || "Mummy Rose natural spices, flours, and herbal infusions",
										width: 1200,
										height: 1400,
										className: "h-[420px] w-full object-cover sm:h-[500px] lg:h-[580px]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute bottom-6 left-6 right-6 text-white",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "eyebrow text-accent-foreground/90 tracking-widest uppercase",
											children: "Pure & Authentically Sourced"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-2xl font-semibold mt-1 text-white",
											children: "\"Spices, Flours & Infusions — just the way Mummy made them.\""
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute -bottom-8 -left-8 hidden size-40 overflow-hidden rounded-xl border-2 border-background shadow-xl lg:block",
								style: { transform: `translate3d(0, ${shift * .5}px, 0)` },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: lifestyle_table_default,
									alt: "Traditional Nigerian meal table",
									className: "h-full w-full object-cover"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute -top-6 -right-4 z-20 rounded-xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur sm:-top-8 sm:-right-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display text-xl font-bold",
										children: "100%"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-bold text-foreground",
										children: "Natural & Pure"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Zero Preservatives"
									})] })]
								})
							})
						]
					})
				})]
			})
		})]
	});
}
var ICONS = {
	leaf: Leaf,
	package: Package,
	truck: Truck,
	shield: ShieldCheck,
	sparkles: Sparkles,
	heart: HeartHandshake
};
/**
* Infinite trust marquee — replaces the old four-up icon row with a slow,
* continuous band that reads as brand texture rather than a feature grid.
*/
function TrustMarquee({ promises }) {
	const items = promises.length ? promises : [];
	if (!items.length) return null;
	const loop = [
		...items,
		...items,
		...items,
		...items
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		"aria-label": "Why Mummy Rose",
		className: "border-y border-border bg-secondary/60",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "group relative overflow-hidden py-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "marquee-track flex w-max items-center gap-14 group-hover:[animation-play-state:paused]",
					children: loop.map((p, i) => {
						const Icon = ICONS[(p.icon ?? "leaf").toLowerCase()] ?? Leaf;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-olive" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] tracking-[0.26em] uppercase",
									children: p.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: p.body
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-6 size-1 rounded-full bg-accent" })
							]
						}, `${p.title}-${i}`);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-secondary to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-secondary to-transparent" })
			]
		})
	});
}
/**
* Offset 60/40 storytelling band with an overlapping image plate and an
* alternating reading direction. The spine of the homepage narrative.
*/
function EditorialBand({ eyebrow, title, body, image, imageAlt, ctaLabel, ctaHref, align = "right", tone = "ivory", stat, index }) {
	const imageRight = align === "right";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cn("relative overflow-hidden py-20 md:py-32", tone === "linen" && "bg-secondary/50", tone === "cocoa" && "bg-ink text-ink-foreground"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-wide",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid items-center gap-12 lg:grid-cols-12 lg:gap-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: cn("relative z-20 lg:col-span-6", imageRight ? "lg:order-1 lg:pr-20" : "lg:order-2 lg:pl-20"),
					children: [
						index ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("font-display text-sm tracking-[0.3em]", tone === "cocoa" ? "text-gold" : "text-primary"),
							children: index
						}) : null,
						eyebrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: cn("eyebrow mt-3 flex items-center gap-3", tone === "cocoa" ? "text-ink-foreground/60" : "text-muted-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-px w-8", tone === "cocoa" ? "bg-gold" : "bg-primary") }), eyebrow]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "display-xl mt-6 max-w-[18ch] text-balance",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("mt-7 max-w-xl leading-relaxed whitespace-pre-line", tone === "cocoa" ? "text-ink-foreground/75" : "text-muted-foreground"),
							children: body
						}),
						stat ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("mt-10 flex items-baseline gap-4 border-t pt-6", tone === "cocoa" ? "border-ink-foreground/15" : "border-border"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-5xl leading-none",
								children: stat.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("max-w-40 text-[10px] tracking-[0.22em] uppercase", tone === "cocoa" ? "text-ink-foreground/60" : "text-muted-foreground"),
								children: stat.label
							})]
						}) : null,
						ctaLabel && ctaHref ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: ctaHref,
							className: cn("link-underline mt-10 inline-flex items-center gap-2 text-[11px] tracking-[0.24em] uppercase", tone === "cocoa" ? "text-gold" : "text-primary"),
							children: [
								ctaLabel,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5" })
							]
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					delay: 120,
					className: cn("relative lg:col-span-6", imageRight ? "lg:order-2 lg:-ml-16" : "lg:order-1 lg:-mr-16"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grain relative overflow-hidden rounded-sm shadow-editorial",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: image,
							alt: imageAlt,
							loading: "lazy",
							width: 1200,
							height: 1500,
							className: "aspect-4/5 w-full object-cover transition-transform duration-[1400ms] ease-editorial hover:scale-[1.04] md:aspect-3/4"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("pointer-events-none absolute -z-10 hidden h-40 w-40 rounded-sm lg:block", imageRight ? "-right-8 -bottom-8" : "-bottom-8 -left-8", tone === "cocoa" ? "bg-gold/20" : "bg-accent/25") })]
				})]
			})
		})
	});
}
var CATEGORY_META = {
	spices: {
		tagline: "Spices the way Mummy made them",
		icon: Flame,
		ingredients: "Curry, Thyme, Suya, Pepper Soup, Cameroon Pepper & Herbs"
	},
	seasonings: {
		tagline: "Spices the way Mummy made them",
		icon: Flame,
		ingredients: "Suya Blend, Jollof Rice Seasoning, Chicken & All-Purpose"
	},
	flours: {
		tagline: "From Grain to Goodness",
		icon: Wheat,
		ingredients: "Unripe Plantain, Cassava, Fonio, Beans, Oat & Coconut Flours"
	},
	cereals: {
		tagline: "From Grain to Goodness",
		icon: Wheat,
		ingredients: "Traditional Pap Powder, Ijebu Garri & Whole Grains"
	},
	"tea-infusions": {
		tagline: "Brew with love, sip with memory",
		icon: Coffee,
		ingredients: "Hibiscus with Cloves & Dates, Ginger-Turmeric & Moringa"
	},
	"sweet-savory": {
		tagline: "Wholesome Sweetness & Nut Powders",
		icon: Sparkles,
		ingredients: "Dates Powder, Nutmeg, Cinnamon & Natural Sweeteners"
	}
};
function CategoryEditorial({ categories, eyebrow, title }) {
	if (!categories.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 md:py-32 bg-secondary/30 border-y border-border/50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-wide",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase border border-border/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: eyebrow || "The Mummy Rose Collection" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mt-4",
					children: title || "Crafted for Every Kitchen Table"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/products",
					className: "group inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary hover:text-primary/80 transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Explore All Products" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 transition-transform group-hover:translate-x-1" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3",
				children: categories.slice(0, 6).map((cat, i) => {
					const meta = CATEGORY_META[cat.slug] || {
						tagline: "Nature's Goodness, Mummy's Touch",
						icon: Sparkles,
						ingredients: "100% Pure & Minimally Processed"
					};
					const Icon = meta.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i * 100,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/category/$slug",
							params: { slug: cat.slug },
							className: "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hover-zoom-img relative aspect-4/3 w-full bg-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: cat.image_url || categoryImage(cat.slug),
										alt: cat.name,
										loading: "lazy",
										className: "h-full w-full object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute top-4 left-4 flex size-10 items-center justify-center rounded-full bg-background/90 text-primary shadow-md backdrop-blur",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute bottom-4 left-4 right-4 text-white",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold tracking-widest text-accent-foreground/90 uppercase",
											children: meta.tagline
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-2xl font-bold tracking-tight text-white mt-0.5",
											children: cat.name
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 flex-col justify-between p-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground line-clamp-2 leading-relaxed",
									children: cat.description || "Authentic ingredients crafted with traditional knowledge."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 rounded-lg bg-secondary/60 p-3 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: "Featured Blends: "
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: meta.ingredients
									})]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex items-center justify-between border-t border-border/60 pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold tracking-wider text-primary uppercase group-hover:underline",
										children: ["Shop ", cat.name]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 transition-transform group-hover:translate-x-0.5" })
									})]
								})]
							})]
						})
					}, cat.id);
				})
			})]
		})
	});
}
/**
* Horizontal snap rail for discovery collections (new arrivals, trending).
* Scrolls on touch, reveals as a wide editorial strip on desktop.
*/
function ProductRail({ eyebrow, title, description, products, href = "/products", linkLabel = "View all" }) {
	if (!products.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "overflow-hidden py-20 md:py-28",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-wide",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "eyebrow flex items-center gap-3 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-8 bg-accent" }), eyebrow]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "display-lg mt-5 text-balance",
							children: title
						}),
						description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "lead mt-4",
							children: description
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: href === "/products" ? "/products" : "/products",
					className: "link-underline shrink-0 text-[11px] tracking-[0.24em] text-primary uppercase",
					children: linkLabel
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[1.375rem] pb-4 [scrollbar-width:none] md:px-10 [&::-webkit-scrollbar]:hidden",
			children: products.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i * 70,
				className: "w-[74%] shrink-0 snap-start sm:w-[46%] lg:w-[27%] xl:w-[22%]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p })
			}, p.id))
		})]
	});
}
/**
* Single-quote review carousel on warm linen — a slow, confident rotation
* instead of a three-column testimonial grid.
*/
function ReviewCarousel({ testimonials, eyebrow }) {
	const [i, setI] = (0, import_react.useState)(0);
	if (!testimonials.length) return null;
	const active = testimonials[i % testimonials.length];
	const move = (d) => setI((v) => (v + d + testimonials.length) % testimonials.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-secondary/60 py-20 md:py-32",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-page",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "grid gap-12 lg:grid-cols-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "eyebrow flex items-center gap-3 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-8 bg-primary" }), eyebrow]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-6 font-display text-6xl leading-none",
							children: [testimonials.length, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "+"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-56 text-[10px] tracking-[0.22em] text-muted-foreground uppercase",
							children: "Kitchens, chefs and stockists cooking with Mummy Rose"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "lg:col-span-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1",
							children: Array.from({ length: 5 }).map((_, s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-3.5", s < (active.rating ?? 5) ? "fill-accent text-accent" : "text-muted-foreground/40") }, s))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
							className: "rise-in mt-7 font-display text-[1.75rem] leading-[1.2] text-balance md:text-[2.5rem]",
							children: [
								"“",
								active.quote,
								"”"
							]
						}, active.id),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
							className: "mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] tracking-[0.22em] uppercase",
								children: [active.author, active.role ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [" · ", active.role]
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Previous review",
									onClick: () => move(-1),
									className: "grid size-10 place-items-center rounded-full border border-border transition-colors hover:bg-background",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Next review",
									onClick: () => move(1),
									className: "grid size-10 place-items-center rounded-full border border-border transition-colors hover:bg-background",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
								})]
							})]
						})
					]
				})]
			})
		})
	});
}
function JournalStrip({ posts }) {
	if (!posts.length) return null;
	const [lead, ...rest] = posts.slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 md:py-32 bg-secondary/30 border-b border-border/60",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-wide",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary uppercase border border-border/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "size-3.5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recipes & Kitchen Ideas" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mt-3",
					children: "Cook Something Memorable"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/recipes",
					className: "group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Explore All Recipes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 transition-transform group-hover:translate-x-1" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 grid gap-8 lg:grid-cols-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					className: "lg:col-span-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all duration-400 hover:shadow-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/recipes/$slug",
							params: { slug: lead.slug },
							className: "block hover-zoom-img relative aspect-16/10 w-full bg-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: lead.cover_image || "/assets/lifestyle-table-f9_pJVcN.jpg",
									alt: lead.title,
									loading: "lazy",
									className: "h-full w-full object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute bottom-6 left-6 right-6 text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "eyebrow text-accent-foreground uppercase tracking-widest",
										children: lead.category || "Featured Recipe"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-2xl sm:text-4xl font-bold text-white mt-1 leading-snug",
										children: lead.title
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground leading-relaxed line-clamp-2",
								children: lead.excerpt
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-wrap items-center justify-between border-t border-border/60 pt-4 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(lead.published_at) })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/products",
									className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shop Featured Ingredient" })]
								})]
							})]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-4 lg:col-span-5",
					children: rest.map((post, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i * 90,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-xs transition-all hover:shadow-md hover:border-primary/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/recipes/$slug",
								params: { slug: post.slug },
								className: "hover-zoom-img size-24 shrink-0 overflow-hidden rounded-lg bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: post.cover_image || "/assets/lifestyle-table-f9_pJVcN.jpg",
									alt: post.title,
									loading: "lazy",
									className: "h-full w-full object-cover"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold tracking-widest text-accent uppercase",
										children: post.category || "Recipe"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/recipes/$slug",
										params: { slug: post.slug },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-display text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2 mt-0.5",
											children: post.title
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/products",
										className: "mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shop Spice" }),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3" })
										]
									})
								]
							})]
						})
					}, post.id))
				})]
			})]
		})
	});
}
var lifestyle_tea_default = "/assets/lifestyle-tea-bVzWfQuh.jpg";
/** Closing invitation — cocoa band with an overlapping linen still life. */
function NewsletterCta({ heading, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative overflow-hidden bg-ink text-ink-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-wide grid items-center gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "lg:col-span-7 lg:pr-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "eyebrow flex items-center gap-3 text-gold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-8 bg-gold" }), "The pantry letter"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "display-xl mt-6 max-w-[18ch] text-balance",
						children: heading
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-lg leading-relaxed text-ink-foreground/70",
						children: body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsletterForm, { tone: "dark" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-[10px] tracking-[0.2em] text-ink-foreground/45 uppercase",
						children: "One letter a month · Unsubscribe anytime"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: 120,
				className: "lg:col-span-5 lg:-ml-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grain overflow-hidden rounded-sm shadow-editorial",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: lifestyle_tea_default,
						alt: "Amber Nigerian herbal infusion beside dried hibiscus on warm linen",
						loading: "lazy",
						width: 1200,
						height: 1200,
						className: "aspect-square w-full object-cover"
					})
				})
			})]
		})
	});
}
var PROCESS_STEPS = [
	{
		id: "source",
		number: "01",
		title: "SOURCE",
		headline: "Ethical Sourcing from Farm Cooperatives",
		description: "We partner directly with trusted farm cooperatives across Nigeria's food belt (Kaduna, Jos, Oyo, Benue). Raw hibiscus, turmeric, ginger, and peppers are harvested at peak ripeness.",
		icon: Leaf,
		image: story_farmers_default
	},
	{
		id: "select",
		number: "02",
		title: "SELECT",
		headline: "Meticulous Hand Sorting & Inspection",
		description: "Every raw crop undergoes careful manual sorting to eliminate impurities, ensuring only the finest, sun-dried botanical specimens enter production.",
		icon: Search,
		image: story_farmers_default
	},
	{
		id: "process",
		number: "03",
		title: "PROCESS",
		headline: "Slow Stone-Milling & Traditional Blending",
		description: "Heat destroys flavor. We mill on traditional stone at low speeds to preserve natural essential oils, vibrant color, and rich kitchen aromas without fillers or additives.",
		icon: Cpu,
		image: process_milling_default
	},
	{
		id: "package",
		number: "04",
		title: "PACKAGE",
		headline: "Eco-Friendly Freshness Preservation",
		description: "Packed immediately into UV-protective glass jars, airtight pouches, and sustainable retail cartons designed to lock in shelf-life stability and freshness.",
		icon: PackageCheck,
		image: process_milling_default
	},
	{
		id: "deliver",
		number: "05",
		title: "DELIVER",
		headline: "Direct to Kitchens & Global Stockists",
		description: "Distributed directly to homes, supermarkets, and B2B partners across Nigeria and exported internationally with complete batch traceability.",
		icon: Truck,
		image: story_farmers_default
	}
];
function ProcessStepper() {
	const [activeStep, setActiveStep] = (0, import_react.useState)(0);
	const current = PROCESS_STEPS[activeStep];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 md:py-32 bg-background border-b border-border/60 overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-wide",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow text-accent tracking-widest uppercase",
							children: "From Nature to Your Kitchen"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mt-3",
							children: "Traditional Wisdom Meets Modern Quality Control"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-base text-muted-foreground sm:text-lg",
							children: "We preserve the integrity of every grain, root, and leaf through a transparent 5-step production process."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 overflow-x-auto pb-4 scrollbar-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex min-w-[680px] items-center justify-between border-b border-border/80 pb-6",
						children: PROCESS_STEPS.map((step, idx) => {
							const isActive = idx === activeStep;
							const Icon = step.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveStep(idx),
								className: `group relative flex items-center gap-3 transition-all cursor-pointer ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `flex size-11 items-center justify-center rounded-full border text-sm font-bold transition-all ${isActive ? "border-primary bg-primary text-primary-foreground shadow-md" : "border-border bg-card group-hover:border-primary/50"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block text-[10px] font-bold tracking-widest uppercase text-muted-foreground",
											children: ["Step ", step.number]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-sm font-bold tracking-wider uppercase ${isActive ? "text-primary font-extrabold" : ""}`,
											children: step.title
										})]
									}),
									idx < PROCESS_STEPS.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "hidden sm:block size-4 text-border ml-4" }),
									isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -bottom-6 left-0 right-0 h-0.5 bg-primary rounded-full" })
								]
							}, step.id);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 grid items-center gap-8 lg:grid-cols-12 rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-7",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-block rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary uppercase",
								children: [
									"Step ",
									current.number,
									" of 05 — ",
									current.title
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-2xl font-bold tracking-tight text-foreground sm:text-4xl mt-4",
								children: current.headline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-base leading-relaxed text-muted-foreground",
								children: current.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap items-center gap-3 border-t border-border/60 pt-6 text-xs font-semibold text-muted-foreground uppercase",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-accent" }), " 100% Traceable Sourcing"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-accent" }), " Zero Preservatives or Additives"]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hover-zoom-img relative aspect-4/3 overflow-hidden rounded-xl border border-border shadow-md",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: current.image,
									alt: current.headline,
									className: "h-full w-full object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute bottom-4 left-4 right-4 text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase text-accent-foreground/90 tracking-wider",
										children: "Mummy Rose Quality Standard"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-lg font-bold text-white",
										children: "Preserving Nature's Purest Flavors"
									})]
								})
							]
						})
					})]
				})
			]
		})
	});
}
var VALUES = [
	{
		id: "authenticity",
		title: "AUTHENTICITY",
		tagline: "Staying true to traditional recipes & raw natural ingredients.",
		description: "Guided by quality, sustainability, and traceability. From organic turmeric to sun-dried hibiscus petals, we source directly from trusted farmers without synthetic substitutes.",
		icon: ShieldCheck,
		image: story_farmers_default
	},
	{
		id: "quality",
		title: "QUALITY",
		tagline: "Rigorous quality control from farm checks to batch stability.",
		description: "Every batch that bears the Mummy Rose seal undergoes strict quality protocols, from raw material inspection to microbial testing for purity, safety, and extended shelf-life stability.",
		icon: Award,
		image: lifestyle_table_default
	},
	{
		id: "wellness",
		title: "WELLNESS",
		tagline: "Promoting healthy eating & balanced living through nature.",
		description: "Our traditional recipes celebrate nutrient-dense flours, digestive herbal teas, and preservative-free seasonings that nourish body and soul.",
		icon: HeartHandshake,
		image: story_farmers_default
	},
	{
		id: "eco-friendly",
		title: "ECO-FRIENDLY PACKAGING",
		tagline: "Functional, sustainable packaging that preserves freshness.",
		description: "Whether sachets, glass jars, stand-up pouches, or retail cartons, we engineer packaging that protects botanical freshness while reducing environmental impact.",
		icon: Recycle,
		image: lifestyle_table_default
	},
	{
		id: "innovation",
		title: "INNOVATION",
		tagline: "Bridging kitchen heritage with modern processing technology.",
		description: "Our facility combines traditional milling knowledge with modern food tech for small-batch and large-scale runs, ensuring consistency and safety in every gram.",
		icon: Lightbulb,
		image: story_farmers_default
	},
	{
		id: "community",
		title: "COMMUNITY",
		tagline: "Empowering local farmers, families, and food creators.",
		description: "We support local agricultural cooperatives, fair trade pricing, and community nutrition initiatives across Nigeria.",
		icon: Users,
		image: lifestyle_table_default
	}
];
function InteractiveValues() {
	const [selectedIndex, setSelectedIndex] = (0, import_react.useState)(0);
	const selected = VALUES[selectedIndex];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 md:py-32 bg-secondary/40 border-b border-border/60",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-wide",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "text-center max-w-2xl mx-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "eyebrow text-accent tracking-widest uppercase",
						children: "Our Guiding Pillars"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mt-3",
						children: "Built on Trust, Crafted with Purpose"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-base text-muted-foreground",
						children: "Explore the core values that define every product, recipe, and business partnership at Mummy Rose."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-14 grid gap-8 lg:grid-cols-12 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-7 grid gap-3 sm:grid-cols-2",
					children: VALUES.map((item, idx) => {
						const isSelected = idx === selectedIndex;
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSelectedIndex(idx),
							className: `group relative flex flex-col text-left p-5 rounded-xl border transition-all duration-300 cursor-pointer ${isSelected ? "border-primary bg-card shadow-lg ring-1 ring-primary/30" : "border-border/80 bg-card/60 hover:bg-card hover:border-primary/40"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `flex size-10 items-center justify-center rounded-lg transition-colors ${isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
									}), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5 text-accent" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: `font-display text-lg font-bold tracking-tight mt-4 ${isSelected ? "text-primary" : "text-foreground"}`,
									children: item.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed",
									children: item.tagline
								})
							]
						}, item.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hover-zoom-img relative aspect-16/10 w-full overflow-hidden rounded-xl bg-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: selected.image,
									alt: selected.title,
									className: "h-full w-full object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute bottom-4 left-4 right-4 text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "eyebrow text-accent-foreground uppercase tracking-widest",
										children: "Core Promise"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-display text-2xl font-bold text-white mt-0.5",
										children: selected.title
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-semibold text-primary",
								children: [
									"\"",
									selected.tagline,
									"\""
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed text-muted-foreground",
								children: selected.description
							})]
						})]
					})
				})]
			})]
		})
	});
}
var B2B_SERVICES = [
	{
		icon: Building2,
		title: "White Labelling",
		description: "Sell premium spices, flours, or tea infusions under your own brand name. We handle sourcing, milling, quality control, and custom packaging.",
		href: "/white-labelling"
	},
	{
		icon: Store,
		title: "Retail Distribution",
		description: "Direct supply to supermarkets, grocery chains, and online platforms with retail-ready barcode packaging and high shelf appeal.",
		href: "/retail"
	},
	{
		icon: Package,
		title: "Wholesale Supply",
		description: "Bulk quantity supply for distributors, restaurants, bakeries, and foodservice providers with consistent batch specs.",
		href: "/wholesale"
	},
	{
		icon: Award,
		title: "Custom Packaging Solutions",
		description: "Collaborative packaging innovation — label design, custom sachets, jars, and structural carton designs tailored to your market.",
		href: "/custom-packaging"
	},
	{
		icon: Globe,
		title: "Global Export",
		description: "Delivering premium African spices, flours, and herbal teas worldwide with compliant export documentation.",
		href: "/export"
	},
	{
		icon: Gift,
		title: "Corporate & Event Supply",
		description: "Curated spice and wellness hampers for corporate gifting, events, retreats, and holiday celebrations.",
		href: "/corporate-supply"
	}
];
function B2BSpotlight() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 md:py-32 bg-background border-b border-border/60",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-wide",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-12 lg:grid-cols-12 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary uppercase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Enterprise & Manufacturing Solutions" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl mt-4 leading-[1.02]",
							children: "From Our Kitchen to Your Brand"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-base text-muted-foreground sm:text-lg leading-relaxed",
							children: "Mummy Rose partners with distributors, supermarkets, foodservice leaders, and emerging food startups to deliver premium spices, wholesome flours, and herbal infusions — sourced, processed, and packaged to international standards."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "xl",
								className: "font-semibold px-8 py-6 text-base",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/services",
									children: ["Explore Business Solutions ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2.5 size-5" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								size: "xl",
								className: "font-semibold px-7 py-6 text-base",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contact",
									children: "Talk to Our Team"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 grid grid-cols-2 gap-4 border-t border-border/70 pt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 text-xs font-semibold text-foreground uppercase",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Small & Large Scale Batch Runs" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 text-xs font-semibold text-foreground uppercase",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Strict Quality & Microbial Checks" })]
							})]
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hover-zoom-img relative aspect-4/3 overflow-hidden rounded-2xl border border-border shadow-2xl bg-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: process_milling_default,
								alt: "Mummy Rose food manufacturing and milling facility",
								className: "h-full w-full object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute bottom-6 left-6 right-6 text-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "eyebrow text-accent-foreground uppercase tracking-widest",
									children: "White Label & Co-Packing"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-2xl font-bold text-white mt-1",
									children: "\"Build your food brand with Mummy Rose manufacturing excellence.\""
								})]
							})
						]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
				children: B2B_SERVICES.map((service, i) => {
					const Icon = service.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i * 80,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: service.href,
							className: "group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex size-12 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-6" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-xl font-bold tracking-tight text-foreground mt-5 group-hover:text-primary transition-colors",
									children: service.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2.5 text-xs leading-relaxed text-muted-foreground",
									children: service.description
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex items-center gap-1.5 text-xs font-bold text-primary uppercase group-hover:underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Learn More" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5 transition-transform group-hover:translate-x-1" })]
							})]
						})
					}, service.title);
				})
			})]
		})
	});
}
function Home() {
	const { data: products } = useSuspenseQuery(productsQuery);
	const { data: categories } = useSuspenseQuery(categoriesQuery);
	const { data: testimonials } = useSuspenseQuery(testimonialsQuery);
	const { data: posts } = useSuspenseQuery(postsQuery);
	const { branding, home, seo } = useSiteConfig();
	const featured = products.filter((p) => p.is_featured);
	const bestSellers = (featured.length ? featured : products).slice(0, 6);
	const newArrivals = products.slice(0, 8);
	const promises = Array.isArray(home.promises) ? home.promises : [];
	const sections = {
		banners: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BannerSections, { placement: "home_section" }),
		promises: home.promises_enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustMarquee, { promises }) : null,
		categories: home.categories_enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryEditorial, {
			categories,
			eyebrow: home.categories_eyebrow,
			title: home.categories_title
		}) : null,
		featured: home.featured_enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductRail, {
			eyebrow: home.featured_eyebrow || "Shop Bestsellers",
			title: home.featured_title || "Our Most Beloved Blends",
			description: "Milled and blended weekly in small batches — the natural pantry items our customers reorder most.",
			products: bestSellers,
			linkLabel: "Shop all products"
		}) : null,
		story: home.story_enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorialBand, {
			index: "01",
			eyebrow: home.story_eyebrow || "More Than a Mother",
			title: home.story_title || "The Heart Behind Every Meal",
			body: home.story_body || "Mummy Rose was more than a mother. She was a nurturer, home cook, healer, and the heart of every meal shared at our table. Inspired by her timeless kitchen wisdom, Mummy Rose is an exaltation to her legacy — crafting flavor-rich spices, nutrient-dense flours, and wellness-driven tea infusions with love.",
			image: home.story_image || "/assets/story-farmers-CcP0uHFY.jpg",
			imageAlt: home.story_image_alt || "Nigerian farmers sorting dried peppers and herbs at golden hour",
			ctaLabel: home.story_cta_label || "Discover Our Full Story",
			ctaHref: home.story_cta_href || "/about",
			align: "right",
			tone: "ivory",
			stat: {
				value: "100%",
				label: "Pure, natural ingredients inspired by Mummy's kitchen"
			}
		}) : null,
		sourcing: home.sourcing_enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProcessStepper, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InteractiveValues, {})] }) : null,
		b2b: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(B2BSpotlight, {}),
		discovery: home.discovery_enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductRail, {
			eyebrow: "Freshly Milled",
			title: "Just Landed in the Pantry",
			description: "Fresh from this week's batch — restocks, seasonal picks, and traditional blends.",
			products: newArrivals,
			linkLabel: "Explore everything"
		}) : null,
		testimonials: home.testimonials_enabled && testimonials.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewCarousel, {
			testimonials,
			eyebrow: home.testimonials_eyebrow
		}) : null,
		journal: home.journal_enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JournalStrip, { posts }) : null,
		newsletter: home.newsletter_enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsletterCta, {
			heading: "Bring a Little More Mummy into Your Kitchen",
			body: "Join the Mummy Rose family letter for seasonal cooking notes, authentic African recipes, early access to new spice restocks, and wellness tips."
		}) : null
	};
	const fullOrder = [...Array.isArray(home.section_order) && home.section_order.length ? home.section_order : HOME_SECTIONS.map((s) => s.id)];
	if (!fullOrder.includes("b2b")) {
		const sourcingIdx = fullOrder.indexOf("sourcing");
		if (sourcingIdx !== -1) fullOrder.splice(sourcingIdx + 1, 0, "b2b");
		else fullOrder.push("b2b");
	}
	const ordered = [...fullOrder, ...HOME_SECTIONS.map((s) => s.id).filter((id) => !fullOrder.includes(id))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonLd, { data: {
			"@context": "https://schema.org",
			"@type": "Organization",
			name: branding.name,
			description: seo.description,
			image: home.hero_image || "/assets/hero-editorial-Bg0zrssd.jpg",
			address: {
				"@type": "PostalAddress",
				addressLocality: "Lagos",
				addressCountry: "NG"
			}
		} }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeHero, { home }),
		ordered.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: sections[id] ?? null }, id))
	] });
}
//#endregion
export { Home as component };
