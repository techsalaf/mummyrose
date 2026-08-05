import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

export type EditorialBandProps = {
  eyebrow?: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** "right" puts the image on the right (top-right offset), "left" mirrors it. */
  align?: "left" | "right";
  tone?: "ivory" | "linen" | "cocoa";
  stat?: { value: string; label: string };
  index?: string;
};

/**
 * Offset 60/40 storytelling band with an overlapping image plate and an
 * alternating reading direction. The spine of the homepage narrative.
 */
export function EditorialBand({
  eyebrow,
  title,
  body,
  image,
  imageAlt,
  ctaLabel,
  ctaHref,
  align = "right",
  tone = "ivory",
  stat,
  index,
}: EditorialBandProps) {
  const imageRight = align === "right";

  return (
    <section
      className={cn(
        "relative overflow-hidden py-20 md:py-32",
        tone === "linen" && "bg-secondary/50",
        tone === "cocoa" && "bg-ink text-ink-foreground",
      )}
    >
      <div className="container-wide">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-0">
          <Reveal
            className={cn(
              "relative z-20 lg:col-span-6",
              imageRight ? "lg:order-1 lg:pr-20" : "lg:order-2 lg:pl-20",
            )}
          >
            {index ? (
              <span
                className={cn(
                  "font-display text-sm tracking-[0.3em]",
                  tone === "cocoa" ? "text-gold" : "text-primary",
                )}
              >
                {index}
              </span>
            ) : null}
            {eyebrow ? (
              <p
                className={cn(
                  "eyebrow mt-3 flex items-center gap-3",
                  tone === "cocoa" ? "text-ink-foreground/60" : "text-muted-foreground",
                )}
              >
                <span className={cn("h-px w-8", tone === "cocoa" ? "bg-gold" : "bg-primary")} />
                {eyebrow}
              </p>
            ) : null}
            <h2 className="display-xl mt-6 max-w-[18ch] text-balance">{title}</h2>
            <p
              className={cn(
                "mt-7 max-w-xl leading-relaxed whitespace-pre-line",
                tone === "cocoa" ? "text-ink-foreground/75" : "text-muted-foreground",
              )}
            >
              {body}
            </p>

            {stat ? (
              <div
                className={cn(
                  "mt-10 flex items-baseline gap-4 border-t pt-6",
                  tone === "cocoa" ? "border-ink-foreground/15" : "border-border",
                )}
              >
                <span className="font-display text-5xl leading-none">{stat.value}</span>
                <span
                  className={cn(
                    "max-w-40 text-[10px] tracking-[0.22em] uppercase",
                    tone === "cocoa" ? "text-ink-foreground/60" : "text-muted-foreground",
                  )}
                >
                  {stat.label}
                </span>
              </div>
            ) : null}

            {ctaLabel && ctaHref ? (
              <Link
                to={ctaHref}
                className={cn(
                  "link-underline mt-10 inline-flex items-center gap-2 text-[11px] tracking-[0.24em] uppercase",
                  tone === "cocoa" ? "text-gold" : "text-primary",
                )}
              >
                {ctaLabel} <ArrowUpRight className="size-3.5" />
              </Link>
            ) : null}
          </Reveal>

          <Reveal
            delay={120}
            className={cn(
              "relative lg:col-span-6",
              imageRight ? "lg:order-2 lg:-ml-16" : "lg:order-1 lg:-mr-16",
            )}
          >
            <div className="grain relative overflow-hidden rounded-sm shadow-editorial">
              <img
                src={image}
                alt={imageAlt}
                loading="lazy"
                width={1200}
                height={1500}
                className="aspect-4/5 w-full object-cover transition-transform duration-[1400ms] ease-editorial hover:scale-[1.04] md:aspect-3/4"
              />
            </div>
            <span
              className={cn(
                "pointer-events-none absolute -z-10 hidden h-40 w-40 rounded-sm lg:block",
                imageRight ? "-right-8 -bottom-8" : "-bottom-8 -left-8",
                tone === "cocoa" ? "bg-gold/20" : "bg-accent/25",
              )}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
