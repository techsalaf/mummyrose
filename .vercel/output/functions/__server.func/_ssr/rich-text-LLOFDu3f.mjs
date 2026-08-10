import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { E as Textarea, L as slugify } from "./router-Bg0ak8An.mjs";
import { I as Quote, Kt as Bold, gt as Heading2, it as Link2, lt as Italic, rt as List } from "../_libs/lucide-react.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rich-text-LLOFDu3f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TOOLS = [
	{
		icon: Heading2,
		label: "Heading",
		wrap: {
			before: "## ",
			block: true
		}
	},
	{
		icon: Bold,
		label: "Bold",
		wrap: {
			before: "**",
			after: "**"
		}
	},
	{
		icon: Italic,
		label: "Italic",
		wrap: {
			before: "_",
			after: "_"
		}
	},
	{
		icon: List,
		label: "Bullet list",
		wrap: {
			before: "- ",
			block: true
		}
	},
	{
		icon: Quote,
		label: "Quote",
		wrap: {
			before: "> ",
			block: true
		}
	},
	{
		icon: Link2,
		label: "Link",
		wrap: {
			before: "[",
			after: "](https://)"
		}
	}
];
function RichTextEditor({ value, onChange, rows = 12, placeholder, id }) {
	const ref = (0, import_react.useRef)(null);
	const apply = (wrap) => {
		const el = ref.current;
		if (!el) return;
		const start = el.selectionStart ?? value.length;
		const end = el.selectionEnd ?? start;
		const selected = value.slice(start, end);
		const insert = wrap.block ? `${start > 0 && value[start - 1] !== "\n" ? "\n" : ""}${wrap.before}${selected || "Text"}` : `${wrap.before}${selected || "text"}${wrap.after ?? ""}`;
		onChange(value.slice(0, start) + insert + value.slice(end));
		requestAnimationFrame(() => {
			el.focus();
			const caret = start + insert.length;
			el.setSelectionRange(caret, caret);
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-1 border-b px-1.5 py-1.5",
			children: [TOOLS.map((tool) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "icon",
				variant: "ghost",
				className: "size-8",
				"aria-label": tool.label,
				title: tool.label,
				onClick: () => apply(tool.wrap),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(tool.icon, { className: "size-4" })
			}, tool.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-auto pr-2 text-[11px] text-muted-foreground",
				children: "Markdown supported"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
			id,
			ref,
			value,
			rows,
			placeholder,
			onChange: (event) => onChange(event.target.value),
			className: "rounded-none border-0 focus-visible:ring-0"
		})]
	});
}
function inline(text) {
	const nodes = [];
	const pattern = /(\*\*[^*]+\*\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;
	let last = 0;
	let match;
	let key = 0;
	while ((match = pattern.exec(text)) !== null) {
		if (match.index > last) nodes.push(text.slice(last, match.index));
		const token = match[0];
		if (token.startsWith("**")) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: token.slice(2, -2) }, key++));
		else if (token.startsWith("_")) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: token.slice(1, -1) }, key++));
		else {
			const parts = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
			nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: parts?.[2],
				className: "text-accent underline underline-offset-4",
				children: parts?.[1]
			}, key++));
		}
		last = match.index + token.length;
	}
	if (last < text.length) nodes.push(text.slice(last));
	return nodes;
}
/** Renders markdown-lite content produced by RichTextEditor. */
function RichText({ content, className }) {
	if (!content?.trim()) return null;
	const blocks = content.replace(/\r\n/g, "\n").split(/\n{2,}/);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className,
		children: blocks.map((block, index) => {
			const lines = block.split("\n").filter(Boolean);
			if (lines.every((line) => line.startsWith("- "))) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "my-3 list-disc space-y-1 pl-5",
				children: lines.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: inline(line.slice(2)) }, i))
			}, index);
			if (block.startsWith("> ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
				className: "my-4 border-l-2 border-accent pl-4 italic",
				children: inline(block.replace(/^> /gm, ""))
			}, index);
			if (block.startsWith("### ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				id: slugify(block.slice(4)),
				className: "mt-6 scroll-mt-28 font-display text-lg",
				children: inline(block.slice(4))
			}, index);
			if (block.startsWith("## ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: slugify(block.slice(3)),
				className: "mt-8 scroll-mt-28 font-display text-xl",
				children: inline(block.slice(3))
			}, index);
			if (block.startsWith("# ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: slugify(block.slice(2)),
				className: "mt-8 scroll-mt-28 font-display text-2xl",
				children: inline(block.slice(2))
			}, index);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "my-3 leading-relaxed",
				children: inline(block)
			}, index);
		})
	});
}
//#endregion
export { RichTextEditor as n, RichText as t };
