import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { d as DialogTitle, o as Dialog, s as DialogContent, u as DialogHeader } from "./router-Bg0ak8An.mjs";
import { M as Save, Ot as Crop, jt as Copy, l as Upload, m as Trash2, nt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as cn, n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { v as adminSettingsQuery } from "./admin-queries-DArl0zvx.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./table-Bc3sudQz.mjs";
import { a as deleteMedia, c as uploadBlob, i as cropImageUrl, l as uploadMedia, o as listMedia, t as AdminHeader, u as upsertRow } from "./resource-manager-Atj0jfrY.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/radix-ui__react-slider.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.media-CN5TYv_B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
var mediaQueryKey = ["admin", "media"];
var ASPECTS = [
	{
		label: "Square 1:1",
		value: "1"
	},
	{
		label: "Landscape 4:3",
		value: "1.3333"
	},
	{
		label: "Wide 16:9",
		value: "1.7778"
	},
	{
		label: "Social card 1200×630",
		value: "1.9048"
	},
	{
		label: "Portrait 3:4",
		value: "0.75"
	}
];
function AdminMedia() {
	const queryClient = useQueryClient();
	const inputRef = (0, import_react.useRef)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [cropping, setCropping] = (0, import_react.useState)(null);
	const { data, isLoading, error } = useQuery({
		queryKey: mediaQueryKey,
		queryFn: () => listMedia("uploads")
	});
	const { data: settings } = useQuery(adminSettingsQuery);
	const [meta, setMeta] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		setMeta(settings?.media_meta ?? {});
	}, [settings]);
	const remove = useMutation({
		mutationFn: (path) => deleteMedia(path),
		onSuccess: async () => {
			toast.success("File deleted");
			await queryClient.invalidateQueries({ queryKey: mediaQueryKey });
		},
		onError: (err) => toast.error(err.message)
	});
	const saveMeta = useMutation({
		mutationFn: async (next) => await upsertRow("site_settings", {
			key: "media_meta",
			value: next,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}, "key"),
		onSuccess: async () => {
			toast.success("Image details saved");
			await queryClient.invalidateQueries({ queryKey: adminSettingsQuery.queryKey });
			await queryClient.invalidateQueries({ queryKey: ["site_settings"] });
		},
		onError: (err) => toast.error(err.message)
	});
	const patch = (path, value) => setMeta((prev) => {
		const base = prev[path] ?? {
			alt: "",
			seo_title: ""
		};
		return {
			...prev,
			[path]: {
				...base,
				...value
			}
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminHeader, {
				title: "Image manager",
				description: "Upload, crop and describe every image used on the storefront. Alt text and SEO titles are saved with the file and reused wherever it appears.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: inputRef,
						type: "file",
						accept: "image/*",
						multiple: true,
						className: "hidden",
						onChange: async (e) => {
							const files = Array.from(e.target.files ?? []);
							if (files.length === 0) return;
							setBusy(true);
							try {
								for (const file of files) await uploadMedia(file, "uploads");
								toast.success(`${files.length} file(s) uploaded`);
								await queryClient.invalidateQueries({ queryKey: mediaQueryKey });
							} catch (err) {
								toast.error(err instanceof Error ? err.message : "Upload failed");
							} finally {
								setBusy(false);
								if (inputRef.current) inputRef.current.value = "";
							}
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => saveMeta.mutate(meta),
						disabled: saveMeta.isPending,
						children: [saveMeta.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), " Save details"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						disabled: busy,
						onClick: () => inputRef.current?.click(),
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), " Upload"]
					})
				] })
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-muted-foreground" }) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: error.message
			}) : (data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No uploads yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: (data ?? []).map((file) => {
					const entry = meta[file.path] ?? {
						alt: "",
						seo_title: ""
					};
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-lg border bg-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: file.url,
							alt: entry.alt || file.name,
							className: "h-40 w-full object-cover",
							loading: "lazy"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: file.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs tracking-wide text-muted-foreground uppercase",
									children: "Alt text"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-1 h-8 text-sm",
									value: entry.alt,
									placeholder: "Describe the image",
									onChange: (e) => patch(file.path, { alt: e.target.value })
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs tracking-wide text-muted-foreground uppercase",
									children: "SEO title"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-1 h-8 text-sm",
									value: entry.seo_title,
									placeholder: "Optional title attribute",
									onChange: (e) => patch(file.path, { seo_title: e.target.value })
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-1.5 pt-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											className: "flex-1",
											onClick: async () => {
												await navigator.clipboard.writeText(file.url);
												toast.success("Link copied");
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), " Copy"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => setCropping(file),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crop, { className: "size-3.5" }), " Crop"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => remove.mutate(file.path),
											"aria-label": "Delete",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5 text-destructive" })
										})
									]
								})
							]
						})]
					}, file.path);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CropDialog, {
				file: cropping,
				onClose: () => setCropping(null),
				onDone: async () => {
					setCropping(null);
					await queryClient.invalidateQueries({ queryKey: mediaQueryKey });
				}
			})
		]
	});
}
function CropDialog({ file, onClose, onDone }) {
	const [aspect, setAspect] = (0, import_react.useState)(ASPECTS[0].value);
	const [zoom, setZoom] = (0, import_react.useState)(1);
	const [offsetX, setOffsetX] = (0, import_react.useState)(0);
	const [offsetY, setOffsetY] = (0, import_react.useState)(0);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const ratio = Number(aspect);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: Boolean(file),
		onOpenChange: (open) => open ? null : onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Crop image" }) }), file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative overflow-hidden rounded-md border bg-muted",
						style: { aspectRatio: String(ratio) },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: file.url,
							alt: "",
							className: "absolute inset-0 h-full w-full object-cover",
							style: { transform: `scale(${zoom}) translate(${-offsetX / 2}%, ${-offsetY / 2}%)` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs tracking-wide text-muted-foreground uppercase",
						children: "Aspect ratio"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: aspect,
						onValueChange: setAspect,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "mt-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ASPECTS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: a.value,
							children: a.label
						}, a.value)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Control, {
						label: `Zoom ${zoom.toFixed(2)}×`,
						value: zoom,
						min: 1,
						max: 3,
						step: .05,
						onChange: setZoom
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Control, {
						label: "Horizontal",
						value: offsetX,
						min: -50,
						max: 50,
						step: 1,
						onChange: setOffsetX
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Control, {
						label: "Vertical",
						value: offsetY,
						min: -50,
						max: 50,
						step: 1,
						onChange: setOffsetY
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						disabled: saving,
						onClick: async () => {
							setSaving(true);
							try {
								const blob = await cropImageUrl(file.url, {
									aspect: ratio,
									zoom,
									offsetX,
									offsetY
								});
								await uploadBlob(blob, `cropped-${file.name.replace(/\.[a-z]+$/i, "")}.jpg`);
								toast.success("Cropped copy added to the library");
								onDone();
							} catch (err) {
								toast.error(err instanceof Error ? err.message : "Crop failed");
							} finally {
								setSaving(false);
							}
						},
						children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crop, { className: "size-4" }), " Save cropped copy"]
					})
				]
			}) : null]
		})
	});
}
function Control({ label, value, min, max, step, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		className: "text-xs tracking-wide text-muted-foreground uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
		className: "mt-2",
		value: [value],
		min,
		max,
		step,
		onValueChange: (v) => onChange(v[0])
	})] });
}
//#endregion
export { AdminMedia as component };
