import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { i as cn } from "./router-Bg0ak8An2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reveal-B3BIN0jH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* IntersectionObserver-driven scroll reveal. GPU-friendly (opacity + transform
* only) and automatically neutralised under prefers-reduced-motion by the
* `reveal` utility in styles.css.
*/
function Reveal({ children, className, delay = 0, as: Tag = "div", once = true }) {
	const ref = (0, import_react.useRef)(null);
	const [shown, setShown] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		if (typeof IntersectionObserver === "undefined") {
			setShown(true);
			return;
		}
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) if (entry.isIntersecting) {
				setShown(true);
				if (once) observer.disconnect();
			} else if (!once) setShown(false);
		}, {
			threshold: .12,
			rootMargin: "0px 0px -8% 0px"
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, [once]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		ref,
		"data-shown": shown,
		style: { "--reveal-delay": `${delay}ms` },
		className: cn("reveal", className),
		children
	});
}
/** Tracks vertical scroll offset for parallax / glass-nav treatments. */
function useScrollY() {
	const [y, setY] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let frame = 0;
		const onScroll = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => setY(window.scrollY));
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("scroll", onScroll);
		};
	}, []);
	return y;
}
//#endregion
export { useScrollY as n, Reveal as t };
