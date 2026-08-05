import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * IntersectionObserver-driven scroll reveal. GPU-friendly (opacity + transform
 * only) and automatically neutralised under prefers-reduced-motion by the
 * `reveal` utility in styles.css.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setShown(false);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref as never}
      data-shown={shown}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}

/** Tracks vertical scroll offset for parallax / glass-nav treatments. */
export function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
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
