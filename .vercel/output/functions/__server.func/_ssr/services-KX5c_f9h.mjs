import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Ship, Gt as Boxes, H as Package, Pt as CircleCheck, Qt as ArrowRight, Wt as Building2, _ as Tag, b as Store } from "../_libs/lucide-react.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Reveal } from "./reveal-B3BIN0jH.mjs";
import { t as process_milling_default } from "./process-milling-BEyUnkUh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services-KX5c_f9h.js
var import_jsx_runtime = require_jsx_runtime();
var B2B_SOLUTIONS = [
	{
		icon: Tag,
		to: "/white-labelling",
		title: "1. White Labelling",
		tagline: "Build your own food brand with ease",
		body: "Our white labelling services allow you to sell premium-quality spices, flours, or tea infusions under your own brand name. We take care of sourcing, processing, quality testing, and packaging — while you focus on building your brand identity."
	},
	{
		icon: Store,
		to: "/retail",
		title: "2. Retail Distribution",
		tagline: "Shelf-ready supply for supermarkets & stockists",
		body: "Supplying directly to supermarkets, neighborhood shops, delicatessens, and online retail platforms with high-impact packaging, barcodes, batch codes, and full ingredient transparency."
	},
	{
		icon: Boxes,
		to: "/wholesale",
		title: "3. Wholesale Supply",
		tagline: "Bulk quantities for foodservice & distributors",
		body: "Providing bulk quantities to food distributors, restaurants, bakeries, and commercial kitchens with trade pricing, lot-consistent batches, standing orders, and fast dispatch."
	},
	{
		icon: Package,
		to: "/custom-packaging",
		title: "4. Custom Packaging Solutions",
		tagline: "Bespoke jars, pouches & structural cartons",
		body: "Need something unique? We collaborate with clients to create customized packaging reflecting your brand values — from custom label designs to eco-friendly structural packaging innovations."
	},
	{
		icon: Ship,
		to: "/export",
		title: "5. Global Export",
		tagline: "African-inspired foods delivered worldwide",
		body: "Delivering premium Mummy Rose products beyond Nigeria. Moisture-tested lots, export-compliant packaging, and full shipping documentation for international buyers."
	},
	{
		icon: Building2,
		to: "/corporate-supply",
		title: "6. Corporate & Event Supply",
		tagline: "Custom hampers & event wellness packs",
		body: "Curating product packs for corporate gifting, employee wellness initiatives, traditional events, and luxury hampers packed with natural spice and tea blends."
	}
];
function ServicesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-background py-16 md:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary uppercase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Enterprise Food Manufacturing & Co-Packing" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl mt-4 leading-tight",
							children: "From Our Kitchen to Your Brand"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-base text-muted-foreground sm:text-lg leading-relaxed",
							children: "Mummy Rose partners with retailers, distributors, brand owners, and foodservice leaders. We combine traditional recipes with modern processing technology to deliver enterprise-grade food products."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3",
					children: B2B_SOLUTIONS.map((item, i) => {
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: i * 90,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex size-12 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-2xl font-bold tracking-tight text-foreground mt-5 group-hover:text-primary transition-colors",
										children: item.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 text-xs font-semibold text-accent uppercase tracking-wider",
										children: item.tagline
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-sm leading-relaxed text-muted-foreground",
										children: item.body
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-8 pt-4 border-t border-border/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "outline",
										size: "sm",
										className: "w-full font-semibold group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: item.to,
											children: ["Explore Solution ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 size-4" })]
										})
									})
								})]
							})
						}, item.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					className: "mt-16 overflow-hidden rounded-2xl border border-border bg-card shadow-lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid lg:grid-cols-12 items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 sm:p-12 lg:col-span-7",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "eyebrow text-accent uppercase tracking-widest",
									children: "Production Standards"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-2",
									children: "Small-Batch Milling & Large-Scale Capacity"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-sm leading-relaxed text-muted-foreground",
									children: "Our facility in Nigeria combines slow stone-milling with strict quality control. From raw material checks to final lot-coded sealing, every batch is guaranteed pure, safe, and flavor-consistent."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 grid sm:grid-cols-2 gap-3 text-xs font-semibold text-foreground uppercase",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Zero Fillers or Anti-Caking Agents" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Custom Batch Formulation" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Export Moisture Testing" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fast Turnaround Times" })]
										})
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg:col-span-5 h-full min-h-[300px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: process_milling_default,
								alt: "Mummy Rose food production line",
								className: "h-full w-full object-cover"
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					className: "mt-16 rounded-2xl bg-ink p-8 sm:p-12 text-ink-foreground shadow-2xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-3xl sm:text-4xl font-bold text-white",
								children: "Start Your Food Brand or Wholesale Partnership Today"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm text-ink-foreground/80 leading-relaxed",
								children: "Tell us your required product mix, estimated volumes, and custom branding needs. Our trade team will respond within 24 hours with pricing, lead times, and sample kits."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "xl",
									className: "font-semibold px-8",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/wholesale/apply",
										children: "Apply for a Trade Account"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "outline",
									size: "xl",
									className: "border-white/30 text-white hover:bg-white/10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/contact",
										children: "Contact B2B Sales Team"
									})
								})]
							})
						]
					})
				})
			]
		})
	});
}
//#endregion
export { ServicesPage as component };
