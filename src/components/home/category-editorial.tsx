import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Flame, Wheat, Coffee } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { categoryImage } from "@/lib/catalog-images";

type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
};

const CATEGORY_META: Record<string, { tagline: string; icon: typeof Flame; ingredients: string }> = {
  spices: {
    tagline: "Spices the way Mummy made them",
    icon: Flame,
    ingredients: "Curry, Thyme, Suya, Pepper Soup, Cameroon Pepper & Herbs",
  },
  seasonings: {
    tagline: "Spices the way Mummy made them",
    icon: Flame,
    ingredients: "Suya Blend, Jollof Rice Seasoning, Chicken & All-Purpose",
  },
  flours: {
    tagline: "From Grain to Goodness",
    icon: Wheat,
    ingredients: "Unripe Plantain, Cassava, Fonio, Beans, Oat & Coconut Flours",
  },
  cereals: {
    tagline: "From Grain to Goodness",
    icon: Wheat,
    ingredients: "Traditional Pap Powder, Ijebu Garri & Whole Grains",
  },
  "tea-infusions": {
    tagline: "Brew with love, sip with memory",
    icon: Coffee,
    ingredients: "Hibiscus with Cloves & Dates, Ginger-Turmeric & Moringa",
  },
  "sweet-savory": {
    tagline: "Wholesome Sweetness & Nut Powders",
    icon: Sparkles,
    ingredients: "Dates Powder, Nutmeg, Cinnamon & Natural Sweeteners",
  },
};

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
    <section className="py-20 md:py-32 bg-secondary/30 border-y border-border/50">
      <div className="container-wide">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase border border-border/80">
              <Sparkles className="size-3.5 text-accent" />
              <span>{eyebrow || "The Mummy Rose Collection"}</span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mt-4">
              {title || "Crafted for Every Kitchen Table"}
            </h2>
          </div>
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary hover:text-primary/80 transition-colors"
          >
            <span>Explore All Products</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 6).map((cat, i) => {
            const meta = CATEGORY_META[cat.slug] || {
              tagline: "Nature's Goodness, Mummy's Touch",
              icon: Sparkles,
              ingredients: "100% Pure & Minimally Processed",
            };
            const Icon = meta.icon;

            return (
              <Reveal key={cat.id} delay={i * 100}>
                <Link
                  to="/category/$slug"
                  params={{ slug: cat.slug }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  {/* Category Image Header */}
                  <div className="hover-zoom-img relative aspect-4/3 w-full bg-muted">
                    <img
                      src={cat.image_url || categoryImage(cat.slug)}
                      alt={cat.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Top Icon Badge */}
                    <div className="absolute top-4 left-4 flex size-10 items-center justify-center rounded-full bg-background/90 text-primary shadow-md backdrop-blur">
                      <Icon className="size-5" />
                    </div>

                    {/* Bottom Tagline Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-xs font-semibold tracking-widest text-accent-foreground/90 uppercase">
                        {meta.tagline}
                      </p>
                      <h3 className="font-display text-2xl font-bold tracking-tight text-white mt-0.5">
                        {cat.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {cat.description || "Authentic ingredients crafted with traditional knowledge."}
                      </p>
                      <div className="mt-4 rounded-lg bg-secondary/60 p-3 text-xs">
                        <span className="font-semibold text-foreground">Featured Blends: </span>
                        <span className="text-muted-foreground">{meta.ingredients}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                      <span className="text-xs font-bold tracking-wider text-primary uppercase group-hover:underline">
                        Shop {cat.name}
                      </span>
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

