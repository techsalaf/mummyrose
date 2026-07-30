import { createFileRoute, Link } from "@tanstack/react-router";
import story from "@/assets/story.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Mummy Rose — Our Story, Sourcing & Standards" },
      {
        name: "description",
        content:
          "How Mummy Rose grew from a Lagos family kitchen into a natural food brand: direct farm sourcing, small-batch milling and preservative-free packing.",
      },
      { property: "og:title", content: "About Mummy Rose" },
      {
        property: "og:description",
        content: "From a Lagos family kitchen to a natural Nigerian food brand trusted worldwide.",
      },
    ],
  }),
  component: AboutPage,
});

const values = [
  { title: "Natural, always", body: "No preservatives, anti-caking agents or artificial colouring." },
  { title: "Farm-direct", body: "We buy from cooperatives we visit, at prices farmers agree to." },
  { title: "Small batch", body: "Weekly milling and blending keeps aroma and nutrition intact." },
  { title: "Consistent quality", body: "Every batch is moisture tested, weighed and lot-coded." },
];

function AboutPage() {
  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="container-page py-20 md:py-28">
          <p className="eyebrow text-primary-foreground/60">Our story</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] md:text-6xl">
            Nigerian food deserves honest ingredients
          </h1>
          <p className="mt-6 max-w-2xl leading-relaxed text-primary-foreground/80">
            Mummy Rose started at a kitchen table in Lagos, grinding pepper blends for family and neighbours.
            Today we mill, blend and pack for homes, restaurants and distributors across Nigeria and abroad —
            with the same standard we started with.
          </p>
        </div>
      </section>

      <section className="container-page grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
        <img src={story} alt="Mummy Rose production" className="rounded-lg object-cover" loading="lazy" />
        <div>
          <h2 className="font-display text-3xl">From family recipe to food system</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            We work with farming cooperatives across Nigeria's food belt, drying and milling close to source so
            nothing loses its character in transit. Everything is packed without preservatives, in batch sizes
            small enough that our team tastes every run.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The result is a pantry you can cook with confidently — and a supply chain that commercial partners
            can build on.
          </p>
          <Button asChild variant="clay" className="mt-8">
            <Link to="/wholesale">Partner with us</Link>
          </Button>
        </div>
      </section>

      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container-page grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <div key={v.title} className="border-l-2 border-accent/40 pl-5">
              <p className="eyebrow text-accent">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-display text-xl">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
