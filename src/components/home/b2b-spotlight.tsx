import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Package, Globe, Store, Gift, Award, CheckCircle } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import millingImage from "@/assets/process-milling.jpg";

const B2B_SERVICES = [
  {
    icon: Building2,
    title: "White Labelling",
    description:
      "Sell premium spices, flours, or tea infusions under your own brand name. We handle sourcing, milling, quality control, and custom packaging.",
    href: "/white-labelling",
  },
  {
    icon: Store,
    title: "Retail Distribution",
    description:
      "Direct supply to supermarkets, grocery chains, and online platforms with retail-ready barcode packaging and high shelf appeal.",
    href: "/retail",
  },
  {
    icon: Package,
    title: "Wholesale Supply",
    description:
      "Bulk quantity supply for distributors, restaurants, bakeries, and foodservice providers with consistent batch specs.",
    href: "/wholesale",
  },
  {
    icon: Award,
    title: "Custom Packaging Solutions",
    description:
      "Collaborative packaging innovation — label design, custom sachets, jars, and structural carton designs tailored to your market.",
    href: "/custom-packaging",
  },
  {
    icon: Globe,
    title: "Global Export",
    description:
      "Delivering premium African spices, flours, and herbal teas worldwide with compliant export documentation.",
    href: "/export",
  },
  {
    icon: Gift,
    title: "Corporate & Event Supply",
    description:
      "Curated spice and wellness hampers for corporate gifting, events, retreats, and holiday celebrations.",
    href: "/corporate-supply",
  },
];

export function B2BSpotlight() {
  return (
    <section className="py-20 md:py-32 bg-background border-b border-border/60">
      <div className="container-wide">
        {/* Banner Hero Split */}
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          
          <div className="lg:col-span-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary uppercase">
                <span>Enterprise &amp; Manufacturing Solutions</span>
              </div>
              
              <h2 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl mt-4 leading-[1.02]">
                From Our Kitchen to Your Brand
              </h2>

              <p className="mt-5 text-base text-muted-foreground sm:text-lg leading-relaxed">
                Mummy Rose partners with distributors, supermarkets, foodservice leaders, and emerging food startups to deliver premium spices, wholesome flours, and herbal infusions — sourced, processed, and packaged to international standards.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="xl" className="font-semibold px-8 py-6 text-base">
                  <Link to="/services">
                    Explore Business Solutions <ArrowRight className="ml-2.5 size-5" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="xl" className="font-semibold px-7 py-6 text-base">
                  <Link to="/contact">
                    Talk to Our Team
                  </Link>
                </Button>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 border-t border-border/70 pt-6">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-foreground uppercase">
                  <CheckCircle className="size-4 text-accent" />
                  <span>Small &amp; Large Scale Batch Runs</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-foreground uppercase">
                  <CheckCircle className="size-4 text-accent" />
                  <span>Strict Quality &amp; Microbial Checks</span>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <div className="hover-zoom-img relative aspect-4/3 overflow-hidden rounded-2xl border border-border shadow-2xl bg-card">
              <img
                src={millingImage}
                alt="Mummy Rose food manufacturing and milling facility"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="eyebrow text-accent-foreground uppercase tracking-widest">
                  White Label &amp; Co-Packing
                </span>
                <h3 className="font-display text-2xl font-bold text-white mt-1">
                  "Build your food brand with Mummy Rose manufacturing excellence."
                </h3>
              </div>
            </div>
          </div>

        </div>

        {/* 6 Services Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {B2B_SERVICES.map((service, i) => {
            const Icon = service.icon;

            return (
              <Reveal key={service.title} delay={i * 80}>
                <Link
                  to={service.href}
                  className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex size-12 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold tracking-tight text-foreground mt-5 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-primary uppercase group-hover:underline">
                    <span>Learn More</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
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
