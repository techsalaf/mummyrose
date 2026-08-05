import { Leaf, Package, Truck, ShieldCheck, Sparkles, HeartHandshake } from "lucide-react";
import type { HomePromise } from "@/lib/site-config";

const ICONS: Record<string, typeof Leaf> = {
  leaf: Leaf,
  package: Package,
  truck: Truck,
  shield: ShieldCheck,
  sparkles: Sparkles,
  heart: HeartHandshake,
};

/**
 * Infinite trust marquee — replaces the old four-up icon row with a slow,
 * continuous band that reads as brand texture rather than a feature grid.
 */
export function TrustMarquee({ promises }: { promises: HomePromise[] }) {
  const items = promises.length ? promises : [];
  if (!items.length) return null;
  const loop = [...items, ...items, ...items, ...items];

  return (
    <section aria-label="Why Mummy Rose" className="border-y border-border bg-secondary/60">
      <div className="group relative overflow-hidden py-5">
        <div className="marquee-track flex w-max items-center gap-14 group-hover:[animation-play-state:paused]">
          {loop.map((p, i) => {
            const Icon = ICONS[(p.icon ?? "leaf").toLowerCase()] ?? Leaf;
            return (
              <div key={`${p.title}-${i}`} className="flex shrink-0 items-center gap-3">
                <Icon className="size-4 text-olive" />
                <span className="text-[11px] tracking-[0.26em] uppercase">{p.title}</span>
                <span className="text-[11px] text-muted-foreground">{p.body}</span>
                <span className="ml-6 size-1 rounded-full bg-accent" />
              </div>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-secondary to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-secondary to-transparent" />
      </div>
    </section>
  );
}
