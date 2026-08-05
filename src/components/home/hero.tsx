import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import heroFallback from "@/assets/hero-editorial.jpg";
import { Button } from "@/components/ui/button";
import { useScrollY } from "@/components/reveal";
import type { HomeConfig } from "@/lib/site-config";

const BADGES = ["100% Natural", "Made in Nigeria", "Ships Worldwide"];

/**
 * Immersive editorial hero: ivory type panel offset against a full-bleed
 * lifestyle frame, soft parallax and drifting ingredient motes.
 */
export function HomeHero({ home }: { home: HomeConfig }) {
  const y = useScrollY();
  const shift = Math.min(y, 700) * 0.12;

  return (
    <section className="relative overflow-hidden bg-background pt-6 pb-10 md:pt-10 md:pb-20">
      <div className="container-wide">
        <div className="relative grid items-center gap-8 lg:grid-cols-12 lg:gap-0">
          {/* Type panel — 60 */}
          <div className="relative z-20 order-2 lg:order-1 lg:col-span-7 lg:pr-16">
            <div className="rise-in">
              <p className="eyebrow flex items-center gap-3 text-muted-foreground">
                <span className="h-px w-10 bg-primary" />
                {home.hero_eyebrow || "Natural Nigerian pantry"}
              </p>
              <h1 className="display-hero mt-6 max-w-[16ch] text-balance">
                {home.hero_title}
              </h1>
              <p className="lead mt-7 max-w-lg">{home.hero_body}</p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                {home.primary_cta_label ? (
                  <Button asChild size="xl" className="rounded-sm tracking-[0.18em] uppercase">
                    <Link to="/products">{home.primary_cta_label}</Link>
                  </Button>
                ) : null}
                {home.secondary_cta_label ? (
                  <Button
                    asChild
                    size="xl"
                    variant="outline"
                    className="rounded-sm border-foreground/20 bg-transparent tracking-[0.18em] uppercase hover:bg-foreground hover:text-background"
                  >
                    <Link to="/wholesale">
                      {home.secondary_cta_label} <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                ) : null}
              </div>

              <ul className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-6">
                {BADGES.map((badge) => (
                  <li
                    key={badge}
                    className="flex items-center gap-2 text-[10px] tracking-[0.24em] text-muted-foreground uppercase"
                  >
                    <span className="size-1.5 rounded-full bg-accent" />
                    {badge}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Image — 40, overlapping into the type column */}
          <div className="relative order-1 lg:order-2 lg:col-span-5">
            <div
              className="grain relative overflow-hidden rounded-sm shadow-editorial lg:-ml-24 lg:aspect-3/4"
              style={{ transform: `translate3d(0, ${-shift}px, 0)` }}
            >
              <img
                src={home.hero_image || heroFallback}
                alt={home.hero_image_alt || "Nigerian spices in ceramic bowls on warm linen"}
                width={1600}
                height={1200}
                className="aspect-4/3 h-full w-full object-cover lg:aspect-auto"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "var(--gradient-ink)",
                  opacity: Math.min(Math.max(Number(home.hero_overlay) || 18, 0), 100) / 100,
                }}
              />
            </div>

            {/* Floating ingredient motes */}
            <span className="float-slow pointer-events-none absolute -top-4 -left-6 hidden size-2.5 rounded-full bg-accent/70 lg:block" />
            <span
              className="float-slow pointer-events-none absolute top-1/3 -right-4 hidden size-1.5 rounded-full bg-primary/60 lg:block"
              style={{ animationDelay: "2.5s" }}
            />
            <span
              className="float-slow pointer-events-none absolute bottom-10 -left-10 hidden size-2 rounded-full bg-olive/50 lg:block"
              style={{ animationDelay: "5s" }}
            />

            <div className="absolute -bottom-6 -left-4 z-20 hidden max-w-56 bg-background/95 p-5 shadow-soft backdrop-blur lg:block">
              <p className="font-display text-4xl leading-none">14</p>
              <p className="mt-2 text-[10px] leading-relaxed tracking-[0.2em] text-muted-foreground uppercase">
                Farm partners across Nigeria's food belt
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
