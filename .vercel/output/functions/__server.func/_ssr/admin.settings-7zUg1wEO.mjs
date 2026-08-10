import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { E as Textarea, a as DEFAULT_THEME, i as DEFAULT_SEO_META, n as DEFAULT_FOOTER, r as DEFAULT_HOME, t as DEFAULT_BRANDING } from "./router-Bg0ak8An.mjs";
import { nt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { v as adminSettingsQuery } from "./admin-queries-DArl0zvx.mjs";
import { r as Switch, t as AdminHeader, u as upsertRow } from "./resource-manager-Atj0jfrY.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { a as PromisesEditor, i as PageSeoEditor, n as FontField, o as SectionOrderEditor, r as ImageField, s as SeoPreview, t as ColorField } from "./settings-fields-lpRyeQhh.mjs";
import { t as DEFAULT_SHIPPING } from "./shipping-DS0T1UXJ.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-7zUg1wEO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSettings() {
	const queryClient = useQueryClient();
	const { data, isLoading } = useQuery(adminSettingsQuery);
	const [store, setStore] = (0, import_react.useState)({});
	const [shipping, setShipping] = (0, import_react.useState)({});
	const [payments, setPayments] = (0, import_react.useState)({});
	const [whatsapp, setWhatsapp] = (0, import_react.useState)({});
	const [seo, setSeo] = (0, import_react.useState)({});
	const [branding, setBranding] = (0, import_react.useState)({});
	const [theme, setTheme] = (0, import_react.useState)({});
	const [home, setHome] = (0, import_react.useState)({});
	const [footer, setFooter] = (0, import_react.useState)({});
	const [pagesSeo, setPagesSeo] = (0, import_react.useState)({});
	const [zonesText, setZonesText] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!data) return;
		setStore(data.store ?? {});
		setShipping(data.shipping ?? {});
		setPayments(data.payments ?? {});
		setWhatsapp(data.whatsapp ?? {});
		setSeo({
			...DEFAULT_SEO_META,
			...data.seo ?? {}
		});
		setBranding({
			...DEFAULT_BRANDING,
			...data.branding ?? {}
		});
		setTheme({
			...DEFAULT_THEME,
			...data.theme ?? {}
		});
		setHome({
			...DEFAULT_HOME,
			...data.home ?? {}
		});
		setFooter({
			...DEFAULT_FOOTER,
			...data.footer ?? {}
		});
		setPagesSeo(data.pages_seo ?? {});
		setZonesText(JSON.stringify(data.shipping?.zones ?? [], null, 2));
	}, [data]);
	const save = useMutation({
		mutationFn: async ({ key, value }) => await upsertRow("site_settings", {
			key,
			value,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}, "key"),
		onSuccess: async () => {
			toast.success("Settings saved");
			await queryClient.invalidateQueries({ queryKey: adminSettingsQuery.queryKey });
			await queryClient.invalidateQueries({ queryKey: ["site_settings"] });
		},
		onError: (error) => toast.error(error.message)
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-muted-foreground" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminHeader, {
			title: "Settings",
			description: "Brand identity, colours, fonts, meta tags, home page content, footer, delivery, payments and WhatsApp — every change is live on the storefront the moment you save."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "brand",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "brand",
							children: "Brand"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "theme",
							children: "Colours & fonts"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "home",
							children: "Home page"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "footer",
							children: "Footer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "store",
							children: "Store"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "shipping",
							children: "Delivery"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "payments",
							children: "Payments"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "whatsapp",
							children: "WhatsApp"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "seo",
							children: "SEO & meta"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "brand",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "Brand identity",
						description: "App name, tagline, logo, favicon and the announcement bar at the very top of the storefront.",
						onSave: () => save.mutate({
							key: "branding",
							value: branding
						}),
						pending: save.isPending,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "App / brand name",
								value: branding.name,
								onChange: (v) => setBranding({
									...branding,
									name: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Tagline",
								value: branding.tagline,
								onChange: (v) => setBranding({
									...branding,
									tagline: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
								label: "Logo",
								value: branding.logo_url,
								onChange: (v) => setBranding({
									...branding,
									logo_url: v
								}),
								help: "Shown in the header and footer. Transparent PNG or SVG works best."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
								label: "Favicon",
								value: branding.favicon_url,
								onChange: (v) => setBranding({
									...branding,
									favicon_url: v
								}),
								help: "Square image, 32×32 or larger."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: "Show announcement bar",
								value: branding.announcement_enabled,
								onChange: (v) => setBranding({
									...branding,
									announcement_enabled: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Announcement text",
								value: branding.announcement,
								onChange: (v) => setBranding({
									...branding,
									announcement: v
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "theme",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "Colours & typography",
						description: "Leave a colour blank to keep the built-in spice palette. Hex values are supported and apply in light and dark mode.",
						onSave: () => save.mutate({
							key: "theme",
							value: theme
						}),
						pending: save.isPending,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
								label: "Primary",
								value: theme.primary,
								onChange: (v) => setTheme({
									...theme,
									primary: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
								label: "Text on primary",
								value: theme.primary_foreground,
								onChange: (v) => setTheme({
									...theme,
									primary_foreground: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
								label: "Accent",
								value: theme.accent,
								onChange: (v) => setTheme({
									...theme,
									accent: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
								label: "Gold / highlight",
								value: theme.gold,
								onChange: (v) => setTheme({
									...theme,
									gold: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
								label: "Page background",
								value: theme.background,
								onChange: (v) => setTheme({
									...theme,
									background: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
								label: "Body text",
								value: theme.foreground,
								onChange: (v) => setTheme({
									...theme,
									foreground: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
								label: "Dark panels (ink)",
								value: theme.ink,
								onChange: (v) => setTheme({
									...theme,
									ink: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Corner radius (e.g. 0.25rem)",
								value: theme.radius,
								onChange: (v) => setTheme({
									...theme,
									radius: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontField, {
								label: "Heading font",
								value: theme.heading_font,
								onChange: (v) => setTheme({
									...theme,
									heading_font: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontField, {
								label: "Body font",
								value: theme.body_font,
								onChange: (v) => setTheme({
									...theme,
									body_font: v
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "home",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "Home page content",
						description: "Hero, trust badges, section headings, story block and testimonials. Toggle any section off to hide it.",
						onSave: () => save.mutate({
							key: "home",
							value: home
						}),
						pending: save.isPending,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Hero eyebrow",
								value: home.hero_eyebrow,
								onChange: (v) => setHome({
									...home,
									hero_eyebrow: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Hero overlay opacity (0-100)",
								type: "number",
								value: home.hero_overlay,
								onChange: (v) => setHome({
									...home,
									hero_overlay: Number(v)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								label: "Hero headline",
								value: home.hero_title,
								onChange: (v) => setHome({
									...home,
									hero_title: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								label: "Hero paragraph",
								value: home.hero_body,
								onChange: (v) => setHome({
									...home,
									hero_body: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
								label: "Hero image",
								value: home.hero_image,
								onChange: (v) => setHome({
									...home,
									hero_image: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Hero image alt text (SEO)",
								value: home.hero_image_alt,
								onChange: (v) => setHome({
									...home,
									hero_image_alt: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionOrderEditor, {
								value: home.section_order,
								onChange: (next) => setHome({
									...home,
									section_order: next
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Primary button label",
								value: home.primary_cta_label,
								onChange: (v) => setHome({
									...home,
									primary_cta_label: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Primary button link",
								value: home.primary_cta_href,
								onChange: (v) => setHome({
									...home,
									primary_cta_href: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Secondary button label",
								value: home.secondary_cta_label,
								onChange: (v) => setHome({
									...home,
									secondary_cta_label: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Secondary button link",
								value: home.secondary_cta_href,
								onChange: (v) => setHome({
									...home,
									secondary_cta_href: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: "Show trust badges",
								value: home.promises_enabled,
								onChange: (v) => setHome({
									...home,
									promises_enabled: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromisesEditor, {
								value: home.promises ?? [],
								onChange: (next) => setHome({
									...home,
									promises: next
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: "Show categories section",
								value: home.categories_enabled,
								onChange: (v) => setHome({
									...home,
									categories_enabled: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Categories eyebrow",
								value: home.categories_eyebrow,
								onChange: (v) => setHome({
									...home,
									categories_eyebrow: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Categories heading",
								value: home.categories_title,
								onChange: (v) => setHome({
									...home,
									categories_title: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: "Show best sellers section",
								value: home.featured_enabled,
								onChange: (v) => setHome({
									...home,
									featured_enabled: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Best sellers eyebrow",
								value: home.featured_eyebrow,
								onChange: (v) => setHome({
									...home,
									featured_eyebrow: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Best sellers heading",
								value: home.featured_title,
								onChange: (v) => setHome({
									...home,
									featured_title: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: "Show story section",
								value: home.story_enabled,
								onChange: (v) => setHome({
									...home,
									story_enabled: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Story eyebrow",
								value: home.story_eyebrow,
								onChange: (v) => setHome({
									...home,
									story_eyebrow: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Story heading",
								value: home.story_title,
								onChange: (v) => setHome({
									...home,
									story_title: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								label: "Story paragraph",
								value: home.story_body,
								onChange: (v) => setHome({
									...home,
									story_body: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
								label: "Story image",
								value: home.story_image,
								onChange: (v) => setHome({
									...home,
									story_image: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Story image alt text (SEO)",
								value: home.story_image_alt,
								onChange: (v) => setHome({
									...home,
									story_image_alt: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Story button label",
								value: home.story_cta_label,
								onChange: (v) => setHome({
									...home,
									story_cta_label: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Story button link",
								value: home.story_cta_href,
								onChange: (v) => setHome({
									...home,
									story_cta_href: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: "Show testimonials",
								value: home.testimonials_enabled,
								onChange: (v) => setHome({
									...home,
									testimonials_enabled: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Testimonials eyebrow",
								value: home.testimonials_eyebrow,
								onChange: (v) => setHome({
									...home,
									testimonials_eyebrow: v
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "footer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "Footer & contact",
						description: "Contact details, social links, column headings and the copyright line.",
						onSave: () => save.mutate({
							key: "footer",
							value: footer
						}),
						pending: save.isPending,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								label: "About blurb",
								value: footer.blurb,
								onChange: (v) => setFooter({
									...footer,
									blurb: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Email",
								value: footer.email,
								onChange: (v) => setFooter({
									...footer,
									email: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Phone",
								value: footer.phone,
								onChange: (v) => setFooter({
									...footer,
									phone: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Address",
								value: footer.address,
								onChange: (v) => setFooter({
									...footer,
									address: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Instagram URL",
								value: footer.instagram,
								onChange: (v) => setFooter({
									...footer,
									instagram: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Facebook URL",
								value: footer.facebook,
								onChange: (v) => setFooter({
									...footer,
									facebook: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "X / Twitter URL",
								value: footer.twitter,
								onChange: (v) => setFooter({
									...footer,
									twitter: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "TikTok URL",
								value: footer.tiktok,
								onChange: (v) => setFooter({
									...footer,
									tiktok: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "YouTube URL",
								value: footer.youtube,
								onChange: (v) => setFooter({
									...footer,
									youtube: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Shop column heading",
								value: footer.shop_heading,
								onChange: (v) => setFooter({
									...footer,
									shop_heading: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Business column heading",
								value: footer.business_heading,
								onChange: (v) => setFooter({
									...footer,
									business_heading: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Newsletter heading",
								value: footer.newsletter_heading,
								onChange: (v) => setFooter({
									...footer,
									newsletter_heading: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Newsletter blurb",
								value: footer.newsletter_body,
								onChange: (v) => setFooter({
									...footer,
									newsletter_body: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Copyright line",
								value: footer.copyright,
								onChange: (v) => setFooter({
									...footer,
									copyright: v
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "store",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "Store details",
						description: "Shown in the footer, on invoices and in structured data.",
						onSave: () => save.mutate({
							key: "store",
							value: store
						}),
						pending: save.isPending,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Store name",
								value: store.name,
								onChange: (v) => setStore({
									...store,
									name: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Support email",
								value: store.email,
								onChange: (v) => setStore({
									...store,
									email: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Phone",
								value: store.phone,
								onChange: (v) => setStore({
									...store,
									phone: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Currency",
								value: store.currency,
								onChange: (v) => setStore({
									...store,
									currency: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								label: "Address",
								value: store.address,
								onChange: (v) => setStore({
									...store,
									address: v
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "shipping",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "Delivery & shipping",
						description: "Zone fees are applied automatically at checkout based on the delivery state.",
						onSave: () => {
							try {
								const zones = zonesText.trim() ? JSON.parse(zonesText) : [];
								save.mutate({
									key: "shipping",
									value: {
										...shipping,
										zones
									}
								});
							} catch {
								toast.error("Delivery zones must be valid JSON.");
							}
						},
						pending: save.isPending,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: `Default flat fee (₦) — fallback ${DEFAULT_SHIPPING.flat_fee}`,
								value: shipping.flat_fee,
								onChange: (v) => setShipping({
									...shipping,
									flat_fee: Number(v)
								}),
								type: "number"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Free delivery over (₦)",
								value: shipping.free_over,
								onChange: (v) => setShipping({
									...shipping,
									free_over: Number(v)
								}),
								type: "number"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "International fee (₦)",
								value: shipping.international_fee,
								onChange: (v) => setShipping({
									...shipping,
									international_fee: Number(v)
								}),
								type: "number"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs uppercase tracking-wide text-muted-foreground",
										children: "Delivery zones (JSON)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										className: "mt-1.5 font-mono text-xs",
										rows: 12,
										value: zonesText,
										onChange: (e) => setZonesText(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: ["Format: ", `[{ "name": "Lagos", "fee": 2000, "states": ["Lagos"] }]`]
									})
								]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "payments",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "Payment methods",
						description: "Toggle the methods buyers see at checkout. Card gateways require their API keys to be configured.",
						onSave: () => save.mutate({
							key: "payments",
							value: payments
						}),
						pending: save.isPending,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: "Paystack",
								value: payments.paystack_enabled,
								onChange: (v) => setPayments({
									...payments,
									paystack_enabled: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: "Flutterwave",
								value: payments.flutterwave_enabled,
								onChange: (v) => setPayments({
									...payments,
									flutterwave_enabled: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: "Manual bank transfer",
								value: payments.bank_transfer_enabled,
								onChange: (v) => setPayments({
									...payments,
									bank_transfer_enabled: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: "Pay on delivery",
								value: payments.pay_on_delivery_enabled,
								onChange: (v) => setPayments({
									...payments,
									pay_on_delivery_enabled: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Bank name",
								value: payments.bank_name,
								onChange: (v) => setPayments({
									...payments,
									bank_name: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Account name",
								value: payments.account_name,
								onChange: (v) => setPayments({
									...payments,
									account_name: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Account number",
								value: payments.account_number,
								onChange: (v) => setPayments({
									...payments,
									account_number: v
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "whatsapp",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "WhatsApp ordering",
						description: "When enabled, shoppers can send a complete order summary straight to this number instead of paying online.",
						onSave: () => save.mutate({
							key: "whatsapp",
							value: whatsapp
						}),
						pending: save.isPending,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Enable WhatsApp ordering",
							value: whatsapp.enabled,
							onChange: (v) => setWhatsapp({
								...whatsapp,
								enabled: v
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							label: "Seller WhatsApp number (international format)",
							value: whatsapp.phone,
							onChange: (v) => setWhatsapp({
								...whatsapp,
								phone: v
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "seo",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "Default SEO",
						description: "Used as the fallback title and description across the storefront.",
						onSave: () => save.mutate({
							key: "seo",
							value: seo
						}),
						pending: save.isPending,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Site title",
								value: seo.title,
								onChange: (v) => setSeo({
									...seo,
									title: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Keywords",
								value: seo.keywords,
								onChange: (v) => setSeo({
									...seo,
									keywords: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Twitter / X handle (@brand)",
								value: seo.twitter_handle,
								onChange: (v) => setSeo({
									...seo,
									twitter_handle: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Canonical site URL",
								value: seo.site_url,
								onChange: (v) => setSeo({
									...seo,
									site_url: v
								}),
								help: "e.g. https://mummyrose.com — used for canonical tags, social previews and sitemap.xml."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Google Analytics 4 measurement ID",
								value: seo.ga4_id,
								onChange: (v) => setSeo({
									...seo,
									ga4_id: v
								}),
								help: "Looks like G-XXXXXXXXXX. Leave empty to disable analytics tracking."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Google Search Console verification token",
								value: seo.gsc_verification,
								onChange: (v) => setSeo({
									...seo,
									gsc_verification: v
								}),
								help: "Paste only the content value from Google's HTML-tag verification method."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								label: "Meta description",
								value: seo.description,
								onChange: (v) => setSeo({
									...seo,
									description: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
								label: "Social share image (og:image)",
								value: seo.og_image,
								onChange: (v) => setSeo({
									...seo,
									og_image: v
								}),
								help: "1200×630 works best. Link previews may cache the old image for a while."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoPreview, {
								url: "/",
								title: String(seo.title ?? ""),
								description: String(seo.description ?? ""),
								image: seo.og_image ? String(seo.og_image) : void 0,
								siteName: String(branding.name ?? "Mummy Rose")
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Per-page meta",
						description: "Override the title, description, keywords and social image for any storefront page, with a live search and social preview.",
						onSave: () => save.mutate({
							key: "pages_seo",
							value: pagesSeo
						}),
						pending: save.isPending,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSeoEditor, {
							value: pagesSeo,
							onChange: setPagesSeo,
							siteName: String(branding.name ?? "Mummy Rose")
						})
					})]
				})
			]
		})]
	});
}
function Panel({ title, description, children, onSave, pending }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: description })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			className: "mt-6",
			onClick: onSave,
			disabled: pending,
			children: [pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, " Save changes"]
		})] })]
	});
}
function Text({ label, value, onChange, type = "text", help }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs uppercase tracking-wide text-muted-foreground",
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "mt-1.5",
			type,
			value: value == null ? "" : String(value),
			onChange: (e) => onChange(e.target.value)
		}),
		help && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted-foreground",
			children: help
		})
	] });
}
function Area({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sm:col-span-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
			className: "mt-1.5",
			rows: 3,
			value: value == null ? "" : String(value),
			onChange: (e) => onChange(e.target.value)
		})]
	});
}
function Toggle({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between rounded-md border px-3 py-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-sm",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked: Boolean(value),
			onCheckedChange: onChange
		})]
	});
}
//#endregion
export { AdminSettings as component };
