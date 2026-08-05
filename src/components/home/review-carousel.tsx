import { useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

type Testimonial = { id: string; author: string; role: string | null; quote: string; rating: number | null };

/**
 * Single-quote review carousel on warm linen — a slow, confident rotation
 * instead of a three-column testimonial grid.
 */
export function ReviewCarousel({ testimonials, eyebrow }: { testimonials: Testimonial[]; eyebrow: string }) {
  const [i, setI] = useState(0);
  if (!testimonials.length) return null;
  const active = testimonials[i % testimonials.length];
  const move = (d: number) => setI((v) => (v + d + testimonials.length) % testimonials.length);

  return (
    <section className="bg-secondary/60 py-20 md:py-32">
      <div className="container-page">
        <Reveal className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow flex items-center gap-3 text-muted-foreground">
              <span className="h-px w-8 bg-primary" />
              {eyebrow}
            </p>
            <p className="mt-6 font-display text-6xl leading-none">
              {testimonials.length}
              <span className="text-primary">+</span>
            </p>
            <p className="mt-3 max-w-56 text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
              Kitchens, chefs and stockists cooking with Mummy Rose
            </p>
          </div>

          <figure className="lg:col-span-8">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star
                  key={s}
                  className={cn(
                    "size-3.5",
                    s < (active.rating ?? 5) ? "fill-accent text-accent" : "text-muted-foreground/40",
                  )}
                />
              ))}
            </div>
            <blockquote
              key={active.id}
              className="rise-in mt-7 font-display text-[1.75rem] leading-[1.2] text-balance md:text-[2.5rem]"
            >
              “{active.quote}”
            </blockquote>
            <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-6">
              <span className="text-[11px] tracking-[0.22em] uppercase">
                {active.author}
                {active.role ? <span className="text-muted-foreground"> · {active.role}</span> : null}
              </span>
              <span className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous review"
                  onClick={() => move(-1)}
                  className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:bg-background"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next review"
                  onClick={() => move(1)}
                  className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:bg-background"
                >
                  <ArrowRight className="size-4" />
                </button>
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
