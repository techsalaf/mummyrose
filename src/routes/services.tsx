import { createFileRoute, Link } from "@tanstack/react-router";
import { Store, Boxes, Ship, Tag, Package, Building2 } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Wholesale, Retail & Export | Mummy Rose" },
      {
        name: "description",
        content:
          "Partner with Mummy Rose for retail stocking, bulk wholesale supply, export documentation, white labelling, custom packaging and corporate gifting.",
      },
      { property: "og:title", content: "Services — Wholesale, Retail & Export | Mummy Rose" },
      {
        property: "og:description",
        content:
          "Retail stocking, wholesale trade pricing, export supply, white labelling and custom packaging from a Nigerian pantry brand.",
      },
    ],
  }),
  component: ServicesPage,
});

const CORE = [
  {
    icon: Store,
    to: "/retail",
    title: "Retail",
    body: "Stock Mummy Rose in your shop, deli or grocery. Shelf-ready jars and pouches with barcodes, batch codes and clear ingredient decks.",
  },
  {
    icon: Boxes,
    to: "/wholesale",
    title: "Wholesale",
    body: "Trade pricing from one pallet upwards, lot-consistent batches, standing orders and dispatch within 72 hours nationwide.",
  },
  {
    icon: Ship,
    to: "/export",
    title: "Export",
    body: "Export-grade packing, moisture-tested lots and full documentation for buyers and distributors outside Nigeria.",
  },
] as const;

const MORE = [
  {
    icon: Tag,
    to: "/white-labelling",
    title: "White labelling",
    body: "Our blends, your brand — from recipe to finished label.",
  },
  {
    icon: Package,
    to: "/custom-packaging",
    title: "Custom packaging",
    body: "Bespoke jars, pouches and gift formats in your sizes.",
  },
  {
    icon: Building2,
    to: "/corporate-supply",
    title: "Corporate supply",
    body: "Hampers, staff gifting and kitchen supply on contract.",
  },
] as const;

function ServicesPage() {
  return (
    <div className="container-page py-12 md:py-16">
      <Reveal>
        <p className="eyebrow text-accent">Services</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl md:text-5xl">
          Retail, wholesale and export — supplied the way Mummy made them
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Whether you are stocking a single shelf or shipping a container, we mill, blend and pack
          to the same standard: small batch, traceable and preservative free.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {CORE.map((item, i) => (
          <Reveal key={item.to} delay={i * 90}>
            <div className="surface-card flex h-full flex-col rounded-lg p-7">
              <item.icon className="size-6 text-accent" />
              <h2 className="mt-5 font-display text-2xl">{item.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              <Button asChild variant="outline" className="mt-6 self-start">
                <Link to={item.to}>Learn more</Link>
              </Button>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16">
        <h2 className="font-display text-3xl">Also available</h2>
      </Reveal>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MORE.map((item, i) => (
          <Reveal key={item.to} delay={i * 80}>
            <Link
              to={item.to}
              className="surface-card flex h-full flex-col rounded-lg p-6 transition-colors hover:bg-secondary/50"
            >
              <item.icon className="size-5 text-accent" />
              <p className="mt-4 font-display text-xl">{item.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 rounded-lg bg-ink px-8 py-12 text-ink-foreground">
        <h2 className="font-display text-3xl">Tell us what you need supplied</h2>
        <p className="mt-3 max-w-lg text-sm text-ink-foreground/75">
          Share your volumes and product mix and we'll come back with pricing, lead times and
          samples.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild variant="onDark">
            <Link to="/wholesale/apply">Apply for a trade account</Link>
          </Button>
          <Button asChild variant="outline" className="border-ink-foreground/30 bg-transparent text-ink-foreground hover:bg-ink-foreground/10">
            <Link to="/contact">Contact the team</Link>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
