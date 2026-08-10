import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck, Leaf, Heart } from "lucide-react";
import heroFallback from "@/assets/hero-editorial.jpg";
import lifestyleTable from "@/assets/lifestyle-table.jpg";
import { Button } from "@/components/ui/button";
import { useScrollY } from "@/components/reveal";
import type { HomeConfig } from "@/lib/site-config";

const TRUST_BADGES = [
  { icon: Leaf, label: "100% Natural Ingredients" },
  { icon: ShieldCheck, label: "Strict Quality Control" },
  { icon: Heart, label: "Generational Recipes" },
];

export function HomeHero({ home }: { home: HomeConfig }) {
  const y = useScrollY();
  const shift = Math.min(y, 700) * 0.1;

  const headline = home.hero_title || "Nature’s Goodness. Mummy’s Touch.";
  const bodyCopy =
    home.hero_body ||
    "Spices, flours and herbal infusions inspired by generations of home cooking — crafted without preservatives or artificial fillers.";

  return (
    <section className="relative overflow-hidden bg-background pt-8 pb-16 md:pt-14 md:pb-24 lg:pt-16 lg:pb-28">
      {/* Soft background ambient gradient */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-secondary/60 blur-3xl opacity-60" />

      <div className="container-wide">
        <div className="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Type Column */}
          <div className="relative z-20 order-2 lg:order-1 lg:col-span-7 lg:pr-6">
            <div className="rise-in">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/80 px-3.5 py-1.5 border border-border/60 text-xs font-semibold tracking-wider text-primary uppercase">
                <Sparkles className="size-3.5 text-accent" />
                <span>{home.hero_eyebrow || "Heritage Food Brand & FMCG Solutions"}</span>
              </div>

              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl mt-6 leading-[0.98] text-balance">
                {headline}
              </h1>

              <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg lg:text-xl leading-relaxed">
                {bodyCopy}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button asChild size="xl" className="font-semibold px-8 py-6 text-base tracking-wide shadow-md hover:shadow-lg transition-all">
                  <Link to="/products">
                    Shop the Collection <ArrowRight className="ml-2.5 size-5" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="xl"
                  variant="outline"
                  className="font-semibold px-7 py-6 text-base border-primary/30 hover:border-primary hover:bg-secondary transition-all"
                >
                  <Link to="/about">
                    Discover Our Story
                  </Link>
                </Button>
              </div>

              {/* Trust badging footer */}
              <div className="mt-12 grid grid-cols-1 gap-4 border-t border-border/80 pt-7 sm:grid-cols-3">
                {TRUST_BADGES.map((b) => (
                  <div key={b.label} className="flex items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <b.icon className="size-4" />
                    </div>
                    <span className="text-xs font-semibold tracking-wide text-foreground/90 uppercase">
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="relative order-1 lg:order-2 lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card Image */}
              <div
                className="hover-zoom-img relative overflow-hidden rounded-2xl border border-border/80 shadow-editorial bg-card"
                style={{ transform: `translate3d(0, ${-shift}px, 0)` }}
              >
                <img
                  src={home.hero_image || heroFallback}
                  alt={home.hero_image_alt || "Mummy Rose natural spices, flours, and herbal infusions"}
                  width={1200}
                  height={1400}
                  className="h-[420px] w-full object-cover sm:h-[500px] lg:h-[580px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="eyebrow text-accent-foreground/90 tracking-widest uppercase">
                    Pure &amp; Authentically Sourced
                  </span>
                  <p className="font-display text-2xl font-semibold mt-1 text-white">
                    "Spices, Flours &amp; Infusions — just the way Mummy made them."
                  </p>
                </div>
              </div>

              {/* Secondary Floating Image Card */}
              <div
                className="absolute -bottom-8 -left-8 hidden size-40 overflow-hidden rounded-xl border-2 border-background shadow-xl lg:block"
                style={{ transform: `translate3d(0, ${shift * 0.5}px, 0)` }}
              >
                <img
                  src={lifestyleTable}
                  alt="Traditional Nigerian meal table"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute -top-6 -right-4 z-20 rounded-xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur sm:-top-8 sm:-right-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display text-xl font-bold">
                    100%
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Natural &amp; Pure</p>
                    <p className="text-[11px] text-muted-foreground">Zero Preservatives</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

