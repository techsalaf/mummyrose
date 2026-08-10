import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Store, Boxes, Ship, Tag, Package, Building2, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { CmsPageSections } from "@/components/cms-page-sections";
import { cmsPageQuery } from "@/lib/queries";
import millingImage from "@/assets/process-milling.jpg";

export const Route = createFileRoute("/services")({
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(cmsPageQuery("services"));
  },
  head: () => ({
    meta: [
      { title: "B2B Solutions & Food Manufacturing — Mummy Rose" },
      {
        name: "description",
        content:
          "White labelling, wholesale bulk supply, retail distribution, custom packaging, global export, and corporate supply for spices, flours, and herbal infusions.",
      },
      { property: "og:title", content: "B2B Solutions & Food Manufacturing — Mummy Rose" },
      {
        property: "og:description",
        content: "Enterprise food processing, white labelling, and bulk supply from Mummy Rose.",
      },
    ],
  }),
  component: ServicesPage,
});

const B2B_SOLUTIONS = [
  {
    icon: Tag,
    to: "/white-labelling",
    title: "1. White Labelling",
    tagline: "Build your own food brand with ease",
    body: "Our white labelling services allow you to sell premium-quality spices, flours, or tea infusions under your own brand name. We take care of sourcing, processing, quality testing, and packaging — while you focus on building your brand identity.",
  },
  {
    icon: Store,
    to: "/retail",
    title: "2. Retail Distribution",
    tagline: "Shelf-ready supply for supermarkets & stockists",
    body: "Supplying directly to supermarkets, neighborhood shops, delicatessens, and online retail platforms with high-impact packaging, barcodes, batch codes, and full ingredient transparency.",
  },
  {
    icon: Boxes,
    to: "/wholesale",
    title: "3. Wholesale Supply",
    tagline: "Bulk quantities for foodservice & distributors",
    body: "Providing bulk quantities to food distributors, restaurants, bakeries, and commercial kitchens with trade pricing, lot-consistent batches, standing orders, and fast dispatch.",
  },
  {
    icon: Package,
    to: "/custom-packaging",
    title: "4. Custom Packaging Solutions",
    tagline: "Bespoke jars, pouches & structural cartons",
    body: "Need something unique? We collaborate with clients to create customized packaging reflecting your brand values — from custom label designs to eco-friendly structural packaging innovations.",
  },
  {
    icon: Ship,
    to: "/export",
    title: "5. Global Export",
    tagline: "African-inspired foods delivered worldwide",
    body: "Delivering premium Mummy Rose products beyond Nigeria. Moisture-tested lots, export-compliant packaging, and full shipping documentation for international buyers.",
  },
  {
    icon: Building2,
    to: "/corporate-supply",
    title: "6. Corporate & Event Supply",
    tagline: "Custom hampers & event wellness packs",
    body: "Curating product packs for corporate gifting, employee wellness initiatives, traditional events, and luxury hampers packed with natural spice and tea blends.",
  },
] as const;

function ServicesPage() {
  const { data: cmsPage } = useQuery(cmsPageQuery("services"));

  return (
    <>
      <div className="bg-background py-16 md:py-24">
        <div className="container-page">

          {/* Page Header */}
          <Reveal className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary uppercase">
              <span>Enterprise Food Manufacturing &amp; Co-Packing</span>
            </div>

            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl mt-4 leading-tight">
              From Our Kitchen to Your Brand
            </h1>

            <p className="mt-4 text-base text-muted-foreground sm:text-lg leading-relaxed">
              Mummy Rose partners with retailers, distributors, brand owners, and foodservice leaders. We combine traditional recipes with modern processing technology to deliver enterprise-grade food products.
            </p>
          </Reveal>

          {/* 6 Solutions Grid */}
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {B2B_SOLUTIONS.map((item, i) => {
              const Icon = item.icon;

              return (
                <Reveal key={item.to} delay={i * 90}>
                  <div className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                    <div>
                      <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="size-6" />
                      </div>

                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mt-5 group-hover:text-primary transition-colors">
                        {item.title}
                      </h2>

                      <p className="mt-1.5 text-xs font-semibold text-accent uppercase tracking-wider">
                        {item.tagline}
                      </p>

                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {item.body}
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-border/60">
                      <Button asChild variant="outline" size="sm" className="w-full font-semibold group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                        <Link to={item.to}>
                          Explore Solution <ArrowRight className="ml-1.5 size-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Manufacturing Capabilities Banner */}
          <Reveal className="mt-16 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            <div className="grid lg:grid-cols-12 items-center">
              <div className="p-8 sm:p-12 lg:col-span-7">
                <span className="eyebrow text-accent uppercase tracking-widest">
                  Production Standards
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-2">
                  Small-Batch Milling &amp; Large-Scale Capacity
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Our facility in Nigeria combines slow stone-milling with strict quality control. From raw material checks to final lot-coded sealing, every batch is guaranteed pure, safe, and flavor-consistent.
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-3 text-xs font-semibold text-foreground uppercase">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-accent" />
                    <span>Zero Fillers or Anti-Caking Agents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-accent" />
                    <span>Custom Batch Formulation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-accent" />
                    <span>Export Moisture Testing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-accent" />
                    <span>Fast Turnaround Times</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 h-full min-h-[300px]">
                <img
                  src={millingImage}
                  alt="Mummy Rose food production line"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </Reveal>

          {/* Inquiry Call to Action */}
          <Reveal className="mt-16 rounded-2xl bg-ink p-8 sm:p-12 text-ink-foreground shadow-2xl">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Start Your Food Brand or Wholesale Partnership Today
              </h2>
              <p className="mt-4 text-sm text-ink-foreground/80 leading-relaxed">
                Tell us your required product mix, estimated volumes, and custom branding needs. Our trade team will respond within 24 hours with pricing, lead times, and sample kits.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="xl" className="font-semibold px-8">
                  <Link to="/wholesale/apply">Apply for a Trade Account</Link>
                </Button>
                <Button asChild variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10">
                  <Link to="/contact">Contact B2B Sales Team</Link>
                </Button>
              </div>
            </div>
          </Reveal>

        </div>
      </div>

      {/* CMS extra sections — added via Admin → Pages → services */}
      {cmsPage && Array.isArray(cmsPage.sections) && (cmsPage.sections as unknown[]).length > 0 && (
        <div className="py-20 bg-secondary/30 border-t border-border">
          <div className="container-wide">
            <CmsPageSections page={cmsPage} />
          </div>
        </div>
      )}
    </>
  );
}
