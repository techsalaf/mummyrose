import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { B as useSiteConfig, F as resolvePageSeo, T as SEO_PAGES, z as usePageSeoMap } from "./router-Bg0ak8An.mjs";
import { Et as ExternalLink, P as RefreshCw, q as Monitor, v as Tablet, w as Smartphone } from "../_libs/lucide-react.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./table-Bc3sudQz.mjs";
import { t as AdminHeader } from "./resource-manager-Atj0jfrY.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { s as SeoPreview } from "./settings-fields-lpRyeQhh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.preview-BfOb4Psu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEVICES = [
	{
		id: "mobile",
		label: "Mobile",
		width: 390,
		icon: Smartphone
	},
	{
		id: "tablet",
		label: "Tablet",
		width: 834,
		icon: Tablet
	},
	{
		id: "desktop",
		label: "Desktop",
		width: 1280,
		icon: Monitor
	}
];
function AdminPreview() {
	const [device, setDevice] = (0, import_react.useState)("desktop");
	const [path, setPath] = (0, import_react.useState)(SEO_PAGES[0].path);
	const [nonce, setNonce] = (0, import_react.useState)(0);
	const { branding, seo } = useSiteConfig();
	const pageSeoMap = usePageSeoMap();
	const page = resolvePageSeo(pageSeoMap, path);
	const title = page.title?.trim() || String(seo.title ?? "");
	const description = page.description?.trim() || seo.description;
	const keywords = page.keywords?.trim() || seo.keywords;
	const ogImage = page.og_image?.trim() || seo.og_image;
	const checks = [
		{
			label: "Meta title set",
			ok: Boolean(title),
			detail: `${title.length} chars`
		},
		{
			label: "Title ≤ 60 chars",
			ok: title.length > 0 && title.length <= 60,
			detail: `${title.length}/60`
		},
		{
			label: "Meta description set",
			ok: Boolean(description),
			detail: `${description.length} chars`
		},
		{
			label: "Description ≤ 160 chars",
			ok: description.length > 0 && description.length <= 160,
			detail: `${description.length}/160`
		},
		{
			label: "Social image set",
			ok: Boolean(ogImage),
			detail: ogImage ? "og:image ready" : "falls back to screenshot"
		},
		{
			label: "Keywords set",
			ok: Boolean(keywords),
			detail: keywords ? "custom" : "optional"
		},
		{
			label: "Favicon set",
			ok: Boolean(branding.favicon_url),
			detail: branding.favicon_url ? "custom" : "default"
		},
		{
			label: "Logo set",
			ok: Boolean(branding.logo_url),
			detail: branding.logo_url ? "custom" : "wordmark only"
		}
	];
	const width = DEVICES.find((d) => d.id === device).width;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminHeader, {
				title: "Storefront preview & test mode",
				description: "Check any page across devices and validate its meta tags, social card and branding before you publish changes.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => setNonce((n) => n + 1),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), " Reload"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: path,
						target: "_blank",
						rel: "noreferrer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }), " Open page"]
					})
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-56",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: path,
							onValueChange: setPath,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SEO_PAGES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
								value: p.path,
								children: [
									p.label,
									" — ",
									p.path
								]
							}, p.path)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1.5",
						children: DEVICES.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: device === d.id ? "default" : "outline",
							onClick: () => setDevice(d.id),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(d.icon, { className: "size-4" }),
								" ",
								d.label
							]
						}, d.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						children: [width, "px viewport"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "overflow-x-auto p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto",
					style: {
						width,
						maxWidth: "100%"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						src: path,
						title: `Preview of ${path}`,
						className: "h-[70vh] w-full rounded-md border border-border bg-background"
					}, `${path}-${device}-${nonce}`)
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Meta & SEO test"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
				"These are the exact tags the storefront applies for ",
				path,
				". Edit them in Settings → SEO & meta."
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2 sm:grid-cols-2",
					children: checks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-md border px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 text-xs text-muted-foreground",
							children: [c.detail, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: c.ok ? "secondary" : "destructive",
								children: c.ok ? "Pass" : "Fix"
							})]
						})]
					}, c.label))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoPreview, {
						url: path,
						title,
						description,
						image: ogImage || void 0,
						siteName: branding.name
					})
				})]
			})] })
		]
	});
}
//#endregion
export { AdminPreview as component };
