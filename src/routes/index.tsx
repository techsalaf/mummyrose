import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Leaf, Package, ShieldCheck, Truck, Sparkles, HeartHandshake } from "lucide-react";
import heroFallback from "@/assets/hero.jpg";
import storyFallback from "@/assets/story.jpg";
import { ProductCard } from "@/components/product-card";
import { JsonLd } from "@/components/json-ld";
import { BannerSections } from "@/components/banner-sections";
import { Button } from "@/components/ui/button";
import { categoriesQuery, productsQuery, testimonialsQuery } from "@/lib/queries";
import { categoryImage } from "@/lib/catalog-images";
import { useSiteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQuery);
    context.queryClient.ensureQueryData(categoriesQuery);
    context.queryClient.ensureQueryData(testimonialsQuery);
  },
  head: () => ({
    meta: [
      { title: "Mummy Rose — Natural Nigerian Spices, Flours & Herbal Infusions" },
      {
        name: "description",
        content:
          "Small-batch Nigerian spices, stone-milled flours and herbal infusions. Shop retail or partner with us for wholesale, export and white-label supply.",
      },
      { property: "og:title", content: "Mummy Rose — Natural Nigerian Pantry" },
      {
        property: "og:description",
        content: "Small-batch Nigerian spices, stone-milled flours and herbal infusions, delivered nationwide.",
      },
    ],
  }),
  component: Home,
});

const ICONS: Record<string, typeof Leaf> = {
  leaf: Leaf,
  package: Package,
  truck: Truck,
  shield: ShieldCheck,
  sparkles: Sparkles,
  heart: HeartHandshake,
};

function Home() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: testimonials } = useSuspenseQuery(testimonialsQuery);
  const { branding, home, seo } = useSiteConfig();

  const featured = products.filter((p) => p.is_featured).slice(0, 8);
  const grid = (featured.length ? featured : products).slice(0, 8);
  const promises = Array.isArray(home.promises) ? home.promises : [];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: branding.name,
          description: seo.description,
          address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
        }}
      />

      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <img
          src={home.hero_image || heroFallback}
          alt={home.hero_title}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: Math.min(Math.max(Number(home.hero_overlay) || 35, 0), 100) / 100 }}
        />
        <div className="relative container-page py-24 md:py-36">
          {home.hero_eyebrow ? <p className="eyebrow text-primary-foreground/70">{home.hero_eyebrow}</p> : null}
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.03] md:text-7xl">{home.hero_title}</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/85">{home.hero_body}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            {home.primary_cta_label ? (
              <Button asChild size="lg" variant="clay">
                <a href={home.primary_cta_href || "/products"}>
                  {home.primary_cta_label} <ArrowRight />
                </a>
              </Button>
            ) : null}
            {home.secondary_cta_label ? (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <a href={home.secondary_cta_href || "/wholesale"}>{home.secondary_cta_label}</a>
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <BannerSections placement="home_section" />

      {home.promises_enabled && promises.length > 0 && (
        <section className="border-b border-border bg-sand">
          <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((p) => {
              const Icon = ICONS[(p.icon ?? "leaf").toLowerCase()] ?? Leaf;
              return (
                <div key={p.title} className="flex gap-3">
                  <Icon className="mt-0.5 size-5 shrink-0 text-accent" />
                  <div>
                    <p className="font-display text-base">{p.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {home.categories_enabled && (
        <section className="container-page py-16 md:py-24">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-accent">{home.categories_eyebrow}</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">{home.categories_title}</h2>
            </div>
            <Link to="/products" className="hidden text-sm underline-offset-4 hover:underline sm:block">
              View all products
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/category/$slug"
                params={{ slug: cat.slug }}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg"
              >
                <img
                  src={cat.image_url || categoryImage(cat.slug)}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="absolute right-5 bottom-5 left-5 text-ink-foreground">
                  <p className="font-display text-2xl">{cat.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-foreground/75">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {home.featured_enabled && (
        <section className="bg-secondary/40 py-16 md:py-24">
          <div className="container-page">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-accent">{home.featured_eyebrow}</p>
                <h2 className="mt-3 font-display text-3xl md:text-4xl">{home.featured_title}</h2>
              </div>
              <Link to="/products" className="hidden text-sm underline-offset-4 hover:underline sm:block">
                Shop all
              </Link>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {grid.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {home.story_enabled && (
        <section className="container-page grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          <img
            src={home.story_image || storyFallback}
            alt={home.story_title}
            className="rounded-lg object-cover"
            loading="lazy"
          />
          <div>
            <p className="eyebrow text-accent">{home.story_eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">{home.story_title}</h2>
            <p className="mt-5 leading-relaxed whitespace-pre-line text-muted-foreground">{home.story_body}</p>
            {home.story_cta_label ? (
              <Button asChild variant="clay" className="mt-8">
                <a href={home.story_cta_href || "/about"}>{home.story_cta_label}</a>
              </Button>
            ) : null}
          </div>
        </section>
      )}

      {home.testimonials_enabled && testimonials.length > 0 && (
        <section className="bg-ink py-16 text-ink-foreground md:py-24">
          <div className="container-page">
            <p className="eyebrow text-gold">{home.testimonials_eyebrow}</p>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {testimonials.slice(0, 3).map((t) => (
                <figure key={t.id} className="border-l-2 border-gold/50 pl-5">
                  <blockquote className="font-display text-lg leading-snug">“{t.quote}”</blockquote>
                  <figcaption className="mt-4 text-sm text-ink-foreground/60">
                    {t.author}
                    {t.role ? ` · ${t.role}` : ""}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
