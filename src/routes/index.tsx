import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import heroFallback from "@/assets/hero-editorial.jpg";
import farmersImage from "@/assets/story-farmers.jpg";
import { JsonLd } from "@/components/json-ld";
import { BannerSections } from "@/components/banner-sections";
import { HomeHero } from "@/components/home/hero";
import { TrustMarquee } from "@/components/home/trust-marquee";
import { EditorialBand } from "@/components/home/editorial-band";
import { CategoryEditorial } from "@/components/home/category-editorial";
import { ProductRail } from "@/components/home/product-rail";
import { ReviewCarousel } from "@/components/home/review-carousel";
import { JournalStrip } from "@/components/home/journal-strip";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { ProcessStepper } from "@/components/home/process-stepper";
import { InteractiveValues } from "@/components/home/interactive-values";
import { B2BSpotlight } from "@/components/home/b2b-spotlight";
import { categoriesQuery, postsQuery, productsQuery, testimonialsQuery } from "@/lib/queries";
import { useSiteConfig, HOME_SECTIONS } from "@/lib/site-config";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQuery);
    context.queryClient.ensureQueryData(categoriesQuery);
    context.queryClient.ensureQueryData(testimonialsQuery);
    context.queryClient.ensureQueryData(postsQuery);
  },
  head: () => ({
    meta: [
      { title: "Mummy Rose — Premium Natural Spices, Flours & Infusions" },
      {
        name: "description",
        content:
          "Nature’s Goodness, Mummy’s Touch. Premium Nigerian spices, stone-milled flours, and herbal tea infusions. Just the way Mummy made them.",
      },
      { property: "og:title", content: "Mummy Rose — Premium Natural Spices, Flours & Infusions" },
      {
        property: "og:description",
        content:
          "Spices, Flours & Infusions — just the way Mummy made them. Sourced from local farm cooperatives.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: testimonials } = useSuspenseQuery(testimonialsQuery);
  const { data: posts } = useSuspenseQuery(postsQuery);
  const { branding, home, seo } = useSiteConfig();

  const featured = products.filter((p) => p.is_featured);
  const bestSellers = (featured.length ? featured : products).slice(0, 6);
  const newArrivals = products.slice(0, 8);
  const promises = Array.isArray(home.promises) ? home.promises : [];

  const sections: Record<string, React.ReactNode> = {
    banners: <BannerSections placement="home_section" />,

    promises: home.promises_enabled ? <TrustMarquee promises={promises} /> : null,

    categories: home.categories_enabled ? (
      <CategoryEditorial
        categories={categories}
        eyebrow={home.categories_eyebrow}
        title={home.categories_title}
      />
    ) : null,

    featured: home.featured_enabled ? (
      <ProductRail
        eyebrow={home.featured_eyebrow || "Shop Bestsellers"}
        title={home.featured_title || "Our Most Beloved Blends"}
        description="Milled and blended weekly in small batches — the natural pantry items our customers reorder most."
        products={bestSellers}
        linkLabel="Shop all products"
      />
    ) : null,

    story: home.story_enabled ? (
      <EditorialBand
        index="01"
        eyebrow={home.story_eyebrow || "More Than a Mother"}
        title={home.story_title || "The Heart Behind Every Meal"}
        body={
          home.story_body ||
          "Mummy Rose was more than a mother. She was a nurturer, home cook, healer, and the heart of every meal shared at our table. Inspired by her timeless kitchen wisdom, Mummy Rose is an exaltation to her legacy — crafting flavor-rich spices, nutrient-dense flours, and wellness-driven tea infusions with love."
        }
        image={home.story_image || farmersImage}
        imageAlt={home.story_image_alt || "Nigerian farmers sorting dried peppers and herbs at golden hour"}
        ctaLabel={home.story_cta_label || "Discover Our Full Story"}
        ctaHref={home.story_cta_href || "/about"}
        align="right"
        tone="ivory"
        stat={{ value: "100%", label: "Pure, natural ingredients inspired by Mummy's kitchen" }}
      />
    ) : null,

    sourcing: home.sourcing_enabled ? (
      <>
        <ProcessStepper />
        <InteractiveValues />
      </>
    ) : null,

    b2b: <B2BSpotlight />,

    discovery: home.discovery_enabled ? (
      <ProductRail
        eyebrow="Freshly Milled"
        title="Just Landed in the Pantry"
        description="Fresh from this week's batch — restocks, seasonal picks, and traditional blends."
        products={newArrivals}
        linkLabel="Explore everything"
      />
    ) : null,

    testimonials:
      home.testimonials_enabled && testimonials.length > 0 ? (
        <ReviewCarousel testimonials={testimonials} eyebrow={home.testimonials_eyebrow} />
      ) : null,

    journal: home.journal_enabled ? <JournalStrip posts={posts} /> : null,

    newsletter: home.newsletter_enabled ? (
      <NewsletterCta
        heading="Bring a Little More Mummy into Your Kitchen"
        body="Join the Mummy Rose family letter for seasonal cooking notes, authentic African recipes, early access to new spice restocks, and wellness tips."
      />
    ) : null,
  };

  const order = (Array.isArray(home.section_order) && home.section_order.length
    ? home.section_order
    : HOME_SECTIONS.map((s) => s.id)) as string[];
  
  // Ensure custom B2B section is included in flow
  const fullOrder = [...order];
  if (!fullOrder.includes("b2b")) {
    const sourcingIdx = fullOrder.indexOf("sourcing");
    if (sourcingIdx !== -1) {
      fullOrder.splice(sourcingIdx + 1, 0, "b2b");
    } else {
      fullOrder.push("b2b");
    }
  }

  const ordered = [...fullOrder, ...HOME_SECTIONS.map((s) => s.id).filter((id) => !fullOrder.includes(id))];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: branding.name,
          description: seo.description,
          image: home.hero_image || heroFallback,
          address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
        }}
      />

      <HomeHero home={home} />

      {ordered.map((id) => (
        <div key={id}>{sections[id] ?? null}</div>
      ))}
    </>
  );
}

