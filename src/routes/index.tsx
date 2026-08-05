import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import heroFallback from "@/assets/hero-editorial.jpg";
import farmersImage from "@/assets/story-farmers.jpg";
import millingImage from "@/assets/process-milling.jpg";
import tableImage from "@/assets/lifestyle-table.jpg";
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
      { title: "Mummy Rose — Premium Natural Nigerian Pantry" },
      {
        name: "description",
        content:
          "Small-batch Nigerian spices, stone-milled flours, cereals and herbal infusions — sourced directly from farm cooperatives and packed without preservatives.",
      },
      { property: "og:title", content: "Mummy Rose — Premium Natural Nigerian Pantry" },
      {
        property: "og:description",
        content:
          "Small-batch Nigerian spices, stone-milled flours and herbal infusions, sourced directly from Nigerian farms.",
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

    featured: home.featured_enabled ? (
      <ProductRail
        eyebrow={home.featured_eyebrow}
        title={home.featured_title}
        description="Milled and blended weekly in small batches — the jars our customers reorder most."
        products={bestSellers}
        linkLabel="Shop all products"
      />
    ) : null,

    story: home.story_enabled ? (
      <EditorialBand
        index="01"
        eyebrow={home.story_eyebrow}
        title={home.story_title}
        body={home.story_body}
        image={home.story_image || farmersImage}
        imageAlt={home.story_image_alt || "Nigerian farmers sorting dried peppers and herbs at golden hour"}
        ctaLabel={home.story_cta_label}
        ctaHref={home.story_cta_href || "/about"}
        align="right"
        tone="ivory"
        stat={{ value: "14", label: "Farm cooperatives we buy from directly" }}
      />
    ) : null,

    categories: home.categories_enabled ? (
      <CategoryEditorial
        categories={categories}
        eyebrow={home.categories_eyebrow}
        title={home.categories_title}
      />
    ) : null,

    sourcing: home.sourcing_enabled ? (
      <>
        <EditorialBand
          index="02"
          eyebrow="Traditional milling"
          title="Stone-milled slowly, so flavour survives the process"
          body={
            "Heat is the enemy of aroma. We mill on stone at low speed, sieve by hand and pack the same week — which is why our flours smell like the grain they came from and our pepper still bites.\n\nNothing is bulked out with fillers. Nothing sits in a warehouse for a season."
          }
          image={millingImage}
          imageAlt="Golden flour falling from a traditional stone mill"
          align="left"
          tone="cocoa"
          stat={{ value: "0", label: "Preservatives, fillers or artificial colour" }}
          ctaLabel="How we source"
          ctaHref="/about"
        />
        <EditorialBand
          index="03"
          eyebrow="From Nigerian farms to your kitchen"
          title="Ingredients with an address, not a barcode"
          body={
            "Every batch is traceable to the cooperative that grew it — in Kaduna, Jos, Oyo and Benue. We pay above market, buy at harvest and dry with the farmers rather than after the fact.\n\nThat relationship is the reason the taste is consistent, jar after jar."
          }
          image={tableImage}
          imageAlt="Overhead Nigerian meal in progress with spices and fresh herbs on linen"
          align="right"
          tone="linen"
          ctaLabel="Meet our farmers"
          ctaHref="/about"
        />
      </>
    ) : null,

    discovery: home.discovery_enabled ? (
      <ProductRail
        eyebrow="New arrivals"
        title="Just milled, just landed"
        description="Fresh from this week's batch — restocks, seasonal picks and the blends people keep asking for."
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
        heading="Recipes, restocks and quiet offers"
        body="Join the pantry letter for seasonal cooking notes from our kitchen, early access to new blends and the occasional quiet discount. No noise."
      />
    ) : null,
  };

  const order = (Array.isArray(home.section_order) && home.section_order.length
    ? home.section_order
    : HOME_SECTIONS.map((s) => s.id)) as string[];
  const ordered = [...order, ...HOME_SECTIONS.map((s) => s.id).filter((id) => !order.includes(id))];

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
