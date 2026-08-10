import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { E as Textarea, T as SEO_PAGES, f as EMPTY_PAGE_SEO, m as HOME_SECTIONS, p as GOOGLE_FONTS } from "./router-Bg0ak8An.mjs";
import { Xt as ArrowUp, _t as GripVertical, en as ArrowDown, l as Upload, n as X, nt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./table-Bc3sudQz.mjs";
import { l as uploadMedia } from "./resource-manager-Atj0jfrY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-fields-lpRyeQhh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingLabel({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		className: "text-xs tracking-wide text-muted-foreground uppercase",
		children
	});
}
/** Upload-or-paste image field used across every CMS setting. */
function ImageField({ label, value, onChange, help }) {
	const inputRef = (0, import_react.useRef)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const url = value == null ? "" : String(value);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sm:col-span-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingLabel, { children: label }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1.5 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: url,
						placeholder: "https://… or upload",
						onChange: (e) => onChange(e.target.value),
						className: "min-w-[12rem] flex-1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: inputRef,
						type: "file",
						accept: "image/*",
						className: "hidden",
						onChange: async (e) => {
							const file = e.target.files?.[0];
							if (!file) return;
							setBusy(true);
							try {
								onChange(await uploadMedia(file, "branding"));
								toast.success("Image uploaded");
							} catch (error) {
								toast.error(error.message);
							} finally {
								setBusy(false);
								if (inputRef.current) inputRef.current.value = "";
							}
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => inputRef.current?.click(),
						disabled: busy,
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), " Upload"]
					}),
					url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						size: "icon",
						"aria-label": "Clear image",
						onClick: () => onChange(""),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					}) : null
				]
			}),
			url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: url,
				alt: "",
				className: "mt-3 h-20 w-auto rounded-md border border-border object-contain"
			}) : null,
			help ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: help
			}) : null
		]
	});
}
function ColorField({ label, value, onChange, placeholder }) {
	const raw = value == null ? "" : String(value);
	const swatch = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw) ? raw : "#ffffff";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingLabel, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-1.5 flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "color",
			value: swatch,
			onChange: (e) => onChange(e.target.value),
			className: "size-9 shrink-0 cursor-pointer rounded-md border border-border bg-background",
			"aria-label": `${label} colour picker`
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value: raw,
			placeholder: placeholder ?? "theme default",
			onChange: (e) => onChange(e.target.value)
		})]
	})] });
}
function FontField({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingLabel, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
		value: value == null ? "" : String(value),
		onValueChange: onChange,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
			className: "mt-1.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose a font" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: GOOGLE_FONTS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: f,
			children: f
		}, f)) })]
	})] });
}
var ICON_CHOICES = [
	"leaf",
	"package",
	"truck",
	"shield",
	"sparkles",
	"heart"
];
/** Editor for the home page trust badges. */
function PromisesEditor({ value, onChange }) {
	const items = Array.isArray(value) ? value : [];
	const update = (i, patch) => onChange(items.map((item, index) => index === i ? {
		...item,
		...patch
	} : item));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 sm:col-span-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingLabel, { children: "Trust badges" }),
			items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 rounded-md border border-border p-3 sm:grid-cols-[8rem_1fr_auto]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: item.icon ?? "leaf",
						onValueChange: (v) => update(i, { icon: v }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ICON_CHOICES.map((icon) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: icon,
							children: icon
						}, icon)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: item.title ?? "",
							placeholder: "Title",
							onChange: (e) => update(i, { title: e.target.value })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: item.body ?? "",
							placeholder: "Supporting line",
							onChange: (e) => update(i, { body: e.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						size: "icon",
						"aria-label": "Remove badge",
						onClick: () => onChange(items.filter((_, index) => index !== i)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})
				]
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				onClick: () => onChange([...items, {
					icon: "leaf",
					title: "",
					body: ""
				}]),
				children: "Add badge"
			})
		]
	});
}
/**
* Drag-and-drop ordering for the modular home page blocks. The saved array
* drives the render order in src/routes/index.tsx.
*/
function SectionOrderEditor({ value, onChange }) {
	const [dragging, setDragging] = (0, import_react.useState)(null);
	const known = HOME_SECTIONS.map((s) => s.id);
	const saved = (Array.isArray(value) ? value : []).filter((id) => known.includes(id));
	const order = [...saved, ...known.filter((id) => !saved.includes(id))];
	const move = (from, to) => {
		if (from === to) return;
		const next = [...order];
		const [item] = next.splice(from, 1);
		next.splice(to, 0, item);
		onChange(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 sm:col-span-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingLabel, { children: "Section order" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Drag to reorder the home page blocks, or use the arrows. The hero always stays first."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1.5",
				children: order.map((id, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					draggable: true,
					onDragStart: () => setDragging(i),
					onDragOver: (e) => e.preventDefault(),
					onDrop: () => {
						if (dragging !== null) move(dragging, i);
						setDragging(null);
					},
					onDragEnd: () => setDragging(null),
					className: `flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm ${dragging === i ? "opacity-50" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "size-4 cursor-grab text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1",
							children: HOME_SECTIONS.find((s) => s.id === id)?.label ?? id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "icon",
							variant: "ghost",
							"aria-label": "Move up",
							disabled: i === 0,
							onClick: () => move(i, i - 1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "icon",
							variant: "ghost",
							"aria-label": "Move down",
							disabled: i === order.length - 1,
							onClick: () => move(i, i + 1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-4" })
						})
					]
				}, id))
			})
		]
	});
}
/** Google result + social card preview for a title/description/image trio. */
function SeoPreview({ url, title, description, image, siteName }) {
	const t = title || `${siteName} — page title missing`;
	const d = description || "No meta description set — search engines will invent one.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 sm:col-span-2 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-border bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs tracking-wide text-muted-foreground uppercase",
					children: "Google result"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: ["mummyrose.com", url === "/" ? "" : url]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 line-clamp-1 text-lg text-primary",
					children: t
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 line-clamp-2 text-sm text-muted-foreground",
					children: d
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-3 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: t.length > 60 ? "text-destructive" : "",
						children: [
							"Title ",
							t.length,
							"/60"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: d.length > 160 ? "text-destructive" : "",
						children: [
							"Description ",
							d.length,
							"/160"
						]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overflow-hidden rounded-lg border border-border bg-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 pt-4 text-xs tracking-wide text-muted-foreground uppercase",
					children: "Social card"
				}),
				image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: image,
					alt: "",
					className: "mt-3 aspect-[1200/630] w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex aspect-[1200/630] w-full items-center justify-center bg-muted text-xs text-muted-foreground",
					children: "No og:image set"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground uppercase",
							children: "mummyrose.com"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 line-clamp-1 text-sm font-medium",
							children: t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "line-clamp-2 text-xs text-muted-foreground",
							children: d
						})
					]
				})
			]
		})]
	});
}
function PageSeoEditor({ value, onChange, siteName }) {
	const [path, setPath] = (0, import_react.useState)(SEO_PAGES[0].path);
	const current = {
		...EMPTY_PAGE_SEO,
		...value[path] ?? {}
	};
	const patch = (p) => onChange({
		...value,
		[path]: {
			...current,
			...p
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 sm:col-span-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingLabel, { children: "Page" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: path,
				onValueChange: setPath,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					className: "mt-1.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SEO_PAGES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
					value: p.path,
					children: [
						p.label,
						" — ",
						p.path
					]
				}, p.path)) })]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingLabel, { children: "Meta title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "mt-1.5",
				value: current.title,
				onChange: (e) => patch({ title: e.target.value })
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingLabel, { children: "Meta description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				className: "mt-1.5",
				rows: 3,
				value: current.description,
				onChange: (e) => patch({ description: e.target.value })
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingLabel, { children: "Keywords" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "mt-1.5",
				value: current.keywords,
				onChange: (e) => patch({ keywords: e.target.value })
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
				label: "Social share image (og:image)",
				value: current.og_image,
				onChange: (v) => patch({ og_image: v }),
				help: "1200×630. Falls back to the sitewide image when empty."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoPreview, {
				url: path,
				title: current.title,
				description: current.description,
				image: current.og_image,
				siteName
			})
		]
	});
}
//#endregion
export { PromisesEditor as a, PageSeoEditor as i, FontField as n, SectionOrderEditor as o, ImageField as r, SeoPreview as s, ColorField as t };
