import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { E as Textarea, c as DialogDescription, d as DialogTitle, l as DialogFooter, o as Dialog, s as DialogContent, u as DialogHeader } from "./router-Bg0ak8An.mjs";
import { B as Pencil, R as Plus, j as Search, l as Upload, m as Trash2, nt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { a as Overlay2, c as Title2, i as Description2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as supabase } from "./client-Cf-9GAe8.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as cn, n as Button, r as buttonVariants } from "./router-Bg0ak8An2.mjs";
import { n as RichTextEditor } from "./rich-text-LLOFDu3f.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { C as useAdminRealtime } from "./admin-queries-DArl0zvx.mjs";
import { a as SelectValue, c as TableCell, d as TableRow, i as SelectTrigger, l as TableHead, n as SelectContent, o as Table, r as SelectItem, s as TableBody, t as Select, u as TableHeader } from "./table-Bc3sudQz.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resource-manager-Atj0jfrY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
var BUCKET = "media";
var TEN_YEARS = 31536e4;
function safeName(name) {
	return name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "").slice(-80);
}
/** Uploads a file to the media bucket and returns a long-lived signed URL. */
async function uploadMedia(file, folder = "uploads") {
	if (file.size > 8388608) throw new Error("File is larger than 8MB.");
	const path = `${folder}/${Date.now()}-${safeName(file.name)}`;
	const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
		cacheControl: "31536000",
		upsert: false,
		contentType: file.type || void 0
	});
	if (error) throw new Error(error.message);
	const { data, error: signError } = await supabase.storage.from(BUCKET).createSignedUrl(path, TEN_YEARS);
	if (signError || !data?.signedUrl) throw new Error(signError?.message ?? "Could not create a public link.");
	return data.signedUrl;
}
/** Lists everything in the media library with shareable links. */
async function listMedia(folder = "uploads") {
	const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
		limit: 200,
		sortBy: {
			column: "created_at",
			order: "desc"
		}
	});
	if (error) throw new Error(error.message);
	const files = (data ?? []).filter((f) => f.id);
	if (files.length === 0) return [];
	const paths = files.map((f) => `${folder}/${f.name}`);
	const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrls(paths, TEN_YEARS);
	const urlByPath = new Map((signed ?? []).map((s) => [s.path ?? "", s.signedUrl]));
	return files.map((f, i) => ({
		name: f.name,
		path: paths[i],
		url: urlByPath.get(paths[i]) ?? "",
		size: f.metadata?.size ?? 0,
		updated_at: f.updated_at ?? null
	}));
}
async function deleteMedia(path) {
	const { error } = await supabase.storage.from(BUCKET).remove([path]);
	if (error) throw new Error(error.message);
}
/** Uploads a generated blob (e.g. a cropped canvas export) to the library. */
async function uploadBlob(blob, name, folder = "uploads") {
	return uploadMedia(new File([blob], name, { type: blob.type || "image/jpeg" }), folder);
}
/**
* Center-anchored crop of an image URL, returned as a JPEG blob. Offsets are
* -50..50 percentages of the slack left after zooming.
*/
async function cropImageUrl(url, spec, maxWidth = 1600) {
	const img = await new Promise((resolve, reject) => {
		const el = new Image();
		el.crossOrigin = "anonymous";
		el.onload = () => resolve(el);
		el.onerror = () => reject(/* @__PURE__ */ new Error("Could not load the image for cropping."));
		el.src = url;
	});
	const srcAspect = img.width / img.height;
	let sw = img.width;
	let sh = img.height;
	if (srcAspect > spec.aspect) sw = img.height * spec.aspect;
	else sh = img.width / spec.aspect;
	sw /= spec.zoom;
	sh /= spec.zoom;
	const sx = (img.width - sw) / 2 * (1 + spec.offsetX / 50);
	const sy = (img.height - sh) / 2 * (1 + spec.offsetY / 50);
	const outW = Math.min(maxWidth, Math.round(sw));
	const canvas = document.createElement("canvas");
	canvas.width = outW;
	canvas.height = Math.round(outW / spec.aspect);
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas is unavailable in this browser.");
	ctx.drawImage(img, Math.max(0, sx), Math.max(0, sy), sw, sh, 0, 0, canvas.width, canvas.height);
	return await new Promise((resolve, reject) => canvas.toBlob((b) => b ? resolve(b) : reject(/* @__PURE__ */ new Error("Crop failed.")), "image/jpeg", .9));
}
function toInput(value, type) {
	if (value == null) return "";
	if (type === "tags") return Array.isArray(value) ? value.join(", ") : String(value);
	if (type === "json") return typeof value === "string" ? value : JSON.stringify(value, null, 2);
	if (type === "date") return String(value).slice(0, 10);
	return String(value);
}
/** Converts raw form state into a database-ready payload. */
function serialise(fields, values) {
	const out = {};
	for (const field of fields) {
		const raw = values[field.name];
		switch (field.type) {
			case "number": {
				const text = String(raw ?? "").trim();
				out[field.name] = text === "" ? null : Number(text);
				break;
			}
			case "switch":
				out[field.name] = Boolean(raw);
				break;
			case "tags":
				out[field.name] = String(raw ?? "").split(",").map((s) => s.trim()).filter(Boolean);
				break;
			case "json": {
				const text = String(raw ?? "").trim();
				out[field.name] = text === "" ? {} : JSON.parse(text);
				break;
			}
			case "date": {
				const text = String(raw ?? "").trim();
				out[field.name] = text === "" ? null : new Date(text).toISOString();
				break;
			}
			default: {
				const text = String(raw ?? "").trim();
				out[field.name] = text === "" ? null : text;
			}
		}
	}
	return out;
}
function ImagePicker({ value, onChange, folder = "uploads" }) {
	const inputRef = (0, import_react.useRef)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value,
					onChange: (e) => onChange(e.target.value),
					placeholder: "https://… or upload"
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
							onChange(await uploadMedia(file, folder));
							toast.success("Image uploaded");
						} catch (error) {
							toast.error(error instanceof Error ? error.message : "Upload failed");
						} finally {
							setBusy(false);
							if (inputRef.current) inputRef.current.value = "";
						}
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					disabled: busy,
					onClick: () => inputRef.current?.click(),
					children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" })
				})
			]
		}), value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: value,
			alt: "Selected media",
			className: "h-24 w-24 rounded-md border object-cover",
			loading: "lazy"
		}) : null]
	});
}
function FieldRenderer({ field, value, onChange }) {
	const id = `field-${field.name}`;
	const text = toInput(value, field.type);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: field.full || field.type === "textarea" || field.type === "richtext" ? "sm:col-span-2" : "",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: id,
				className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
				children: field.label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1.5",
				children: field.type === "switch" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					id,
					checked: Boolean(value),
					onCheckedChange: onChange
				}) : field.type === "select" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: text || void 0,
					onValueChange: onChange,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						id,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: field.placeholder ?? "Select" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (field.options ?? []).map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: option.value,
						children: option.label
					}, option.value)) })]
				}) : field.type === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePicker, {
					value: text,
					onChange
				}) : field.type === "textarea" || field.type === "json" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id,
					value: text,
					rows: 4,
					placeholder: field.placeholder,
					onChange: (e) => onChange(e.target.value)
				}) : field.type === "richtext" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichTextEditor, {
					id,
					value: text,
					rows: 12,
					placeholder: field.placeholder,
					onChange
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id,
					type: field.type === "number" ? "number" : field.type === "date" ? "date" : "text",
					step: field.step,
					value: text,
					placeholder: field.placeholder,
					onChange: (e) => onChange(e.target.value)
				})
			}),
			field.help ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: field.help
			}) : null
		]
	});
}
function db() {
	return supabase;
}
/** Inserts or updates a single admin-managed row. */
async function saveRow(table, values, id) {
	const result = id ? await db().from(table).update(values).eq("id", id) : await db().from(table).insert(values);
	if (result.error) throw new Error(result.error.message);
}
async function deleteRow(table, id) {
	const { error } = await db().from(table).delete().eq("id", id);
	if (error) throw new Error(error.message);
}
async function upsertRow(table, values, onConflict) {
	const { error } = await db().from(table).upsert(values, { onConflict });
	if (error) throw new Error(error.message);
}
function AdminHeader({ title, description, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-semibold tracking-tight md:text-3xl",
			children: title
		}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 max-w-2xl text-sm text-muted-foreground",
			children: description
		}) : null] }), actions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: actions
		}) : null]
	});
}
function ResourceManager({ title, description, table, query, fields, columns, defaults = {}, searchKeys = ["name"], realtimeTables, singular, actions, prepare }) {
	const queryClient = useQueryClient();
	const { data, isLoading, error } = useQuery(query);
	const rows = data ?? [];
	useAdminRealtime(realtimeTables ?? [table], [query.queryKey]);
	const [term, setTerm] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [values, setValues] = (0, import_react.useState)({});
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => {
		const needle = term.trim().toLowerCase();
		if (!needle) return rows;
		return rows.filter((row) => searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(needle)));
	}, [
		rows,
		term,
		searchKeys
	]);
	const invalidate = () => queryClient.invalidateQueries({ queryKey: query.queryKey });
	const save = useMutation({
		mutationFn: async () => {
			let payload = serialise(fields, values);
			if (prepare) payload = prepare(payload, values);
			await saveRow(table, payload, editing?.id ?? null);
		},
		onSuccess: async () => {
			toast.success(editing ? `${singular} updated` : `${singular} created`);
			setOpen(false);
			await invalidate();
		},
		onError: (err) => toast.error(err.message)
	});
	const remove = useMutation({
		mutationFn: async (row) => await deleteRow(table, row.id),
		onSuccess: async () => {
			toast.success(`${singular} deleted`);
			setPendingDelete(null);
			await invalidate();
		},
		onError: (err) => toast.error(err.message)
	});
	function openForm(row) {
		setEditing(row);
		const next = {};
		for (const field of fields) next[field.name] = row ? field.type === "switch" ? Boolean(row[field.name]) : toInput(row[field.name], field.type) : defaults[field.name] ?? (field.type === "switch" ? false : "");
		setValues(next);
		setOpen(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminHeader, {
				title,
				description,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [actions, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => openForm(null),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }),
						" New ",
						singular.toLowerCase()
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: term,
					onChange: (e) => setTerm(e.target.value),
					placeholder: "Search…",
					className: "pl-9"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: column.className,
					children: column.label
				}, column.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "w-24 text-right",
					children: "Actions"
				})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: columns.length + 1,
					className: "py-10 text-center text-sm text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto size-4 animate-spin" })
				}) }) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: columns.length + 1,
					className: "py-10 text-center text-sm text-destructive",
					children: error.message
				}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: columns.length + 1,
					className: "py-10 text-center text-sm text-muted-foreground",
					children: "Nothing here yet."
				}) }) : filtered.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: column.className,
					children: column.render ? column.render(row) : String(row[column.key] ?? "—")
				}, column.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: () => openForm(row),
							"aria-label": "Edit",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: () => setPendingDelete(row),
							"aria-label": "Delete",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4 text-destructive" })
						})]
					})
				})] }, row.id)) })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[90vh] max-w-2xl overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? `Edit ${singular.toLowerCase()}` : `New ${singular.toLowerCase()}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Changes are saved straight to the live store." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: fields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRenderer, {
								field,
								value: values[field.name],
								onChange: (next) => setValues((prev) => ({
									...prev,
									[field.name]: next
								}))
							}, field.name))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => save.mutate(),
							disabled: save.isPending,
							children: [save.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, " Save"]
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: Boolean(pendingDelete),
				onOpenChange: (next) => !next && setPendingDelete(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
					"Delete this ",
					singular.toLowerCase(),
					"?"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "This cannot be undone." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: () => pendingDelete && remove.mutate(pendingDelete),
					disabled: remove.isPending,
					children: "Delete"
				})] })] })
			})
		]
	});
}
//#endregion
export { deleteMedia as a, uploadBlob as c, cropImageUrl as i, uploadMedia as l, ResourceManager as n, listMedia as o, Switch as r, saveRow as s, AdminHeader as t, upsertRow as u };
