import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { categoryImage } from "@/lib/catalog-images";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
};

/** Mixed-ratio editorial tiles — no two cards the same shape. */
const RATIOS = ["aspect-4/5", "aspect-square", "aspect-3/4", "aspect-4/3", "aspect-square", "aspect-4/5"];
const SPANS = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-6",
];

export function CategoryEditorial({
  categories,
  eyebrow,
  title,
}: {
  categories: Category[];
  eyebrow: string;
  title: string;
}) {
  if (!categories.length) return null;

  return (
    <section className="py-20 md:py-32">
      <div className="container-wide">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow flex items-center gap-3 text-muted-foreground">
              <span className="h-px w-8 bg-primary" />
              {eyebrow}
            </p>
            <h2 className="display-xl mt-5 max-w-[20ch] text-balance">{title}</h2>
          </div>
          <Link
            to="/products"
            className="link-underline shrink-0 text-[11px] tracking-[0.24em] text-primary uppercase"
          >
            Browse the full pantry
          </Link>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
          {categories.map((cat, i) => (
            <Reveal
              key={cat.id}
              delay={i * 90}
              className={cn(SPANS[i % SPANS.length], i === 0 && "sm:col-span-2")}
            >
              <Link
                to="/category/$slug"
                params={{ slug: cat.slug }}
                className="group relative block h-full overflow-hidden rounded-sm bg-linen"
              >
                <div className={cn("overflow-hidden", RATIOS[i % RATIOS.length])}>
                  <img
                    src={cat.image_url || categoryImage(cat.slug)}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.07]"
                  />
                </div>
                <div
                  className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-90"
                  style={{ background: "var(--gradient-ink)" }}
                />
                <div className="absolute inset-x-6 bottom-6 text-ink-foreground">
                  <h3 className="font-display text-[1.75rem] leading-tight md:text-[2.25rem]">{cat.name}</h3>
                  <p className="mt-1.5 line-clamp-2 max-w-sm text-sm text-ink-foreground/75">
                    {cat.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.24em] text-gold uppercase">
                    Shop {cat.name}
                    <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
