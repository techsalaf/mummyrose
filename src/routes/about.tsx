import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, ShieldCheck, Leaf, Sparkles, Award, Users } from "lucide-react";
import story from "@/assets/story.jpg";
import farmersImage from "@/assets/story-farmers.jpg";
import millingImage from "@/assets/process-milling.jpg";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Mummy Rose — Our Heritage, Vision & Kitchen Legacy" },
      {
        name: "description",
        content:
          "The story of Mummy Rose: a nurturer, home cook, and healer. Discover our journey in creating natural spices, stone-milled flours, and herbal infusions.",
      },
      { property: "og:title", content: "About Mummy Rose — Legacy of Nature's Goodness" },
      {
        property: "og:description",
        content: "Spices, Flours & Infusions — just the way Mummy made them.",
      },
    ],
  }),
  component: AboutPage,
});

const CORE_VALUES = [
  {
    title: "Authenticity",
    desc: "Staying true to traditional recipes and natural ingredients. From organic turmeric to sun-dried hibiscus, sourcing is guided by quality and traceability.",
    icon: Leaf,
  },
  {
    title: "Uncompromising Quality",
    desc: "Every product undergoes strict quality control, from raw material checks to microbial testing to ensure purity, safety, and shelf-life stability.",
    icon: ShieldCheck,
  },
  {
    title: "Wholesome Wellness",
    desc: "Promoting healthy eating and balanced living with traditional recipes and natural ingredients without chemical additives or fillers.",
    icon: Heart,
  },
  {
    title: "Eco-Friendly Innovation",
    desc: "Combining traditional milling wisdom with modern processing tech, packaged in eco-friendly sachets, jars, and cartons that preserve freshness.",
    icon: Award,
  },
];

function AboutPage() {
  return (
    <>
      {/* Editorial Hero */}
      <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground lg:py-32">
        <div className="container-wide relative z-10">
          <Reveal className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur">
              <Sparkles className="size-3.5 text-gold" />
              <span>Our Brand Legacy</span>
            </div>
            
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl mt-6 leading-[1.02]">
              More Than a Mother. <br />
              <span className="italic font-normal text-gold">The Heart Behind Every Meal.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl leading-relaxed text-primary-foreground/90 max-w-2xl">
              "Mummy Rose was a nurturer, a home cook, a healer, and the heart of every meal shared at our table."
            </p>
          </Reveal>
        </div>
        <div className="absolute -bottom-12 -right-12 size-96 rounded-full bg-accent/20 blur-3xl" />
      </section>

      {/* Main Story Narrative */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container-wide">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Reveal>
                <span className="eyebrow text-accent tracking-widest uppercase">The Story of Mummy Rose</span>
                <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl mt-3 leading-tight">
                  Inspired by Timeless Kitchen Wisdom
                </h2>
                
                <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Mummy Rose believed that the best food came from the simplest ingredients, lovingly selected, thoughtfully prepared, and shared with joy. Whether she was stirring a pot of spicy jollof rice, baking with freshly milled flours, or brewing her soothing herbal tea blends, Mummy Rose poured her heart into every bite and every sip.
                  </p>
                  <p>
                    Inspired by her kitchen wisdom, Mummy Rose is an exaltation to her legacy — a brand rooted in tradition and powered by purpose.
                  </p>
                  <p>
                    We craft flavour-rich spices, nutrient-dense flours, and wellness-driven herbal infusions using carefully sourced, minimally processed ingredients. Every jar, pouch, or teabag reflects the same care Mummy Rose brought to her kitchen: bold, wholesome, and made with love.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button asChild size="xl" className="font-semibold">
                    <Link to="/products">
                      Explore Our Products <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" size="xl">
                    <Link to="/services">
                      B2B &amp; Wholesale Services
                    </Link>
                  </Button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <div className="hover-zoom-img relative aspect-4/5 overflow-hidden rounded-2xl border border-border shadow-2xl bg-card">
                <img
                  src={story}
                  alt="Traditional Nigerian spice grinding and culinary process"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-xs font-semibold uppercase text-accent-foreground tracking-widest">
                    Heritage &amp; Innovation
                  </p>
                  <p className="font-display text-2xl font-bold text-white mt-1">
                    "Nature’s Goodness, Mummy’s Touch."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Statements */}
      <section className="py-20 bg-secondary/40 border-y border-border/60">
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal className="rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-sm">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="size-6" />
              </div>
              <h3 className="font-display text-3xl font-bold tracking-tight text-foreground mt-5">
                Vision Statement
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                To be Africa’s most trusted name in natural food products, nurturing well-being through authentic, high-quality spices, flours, and tea infusions made with care, tradition, and innovation.
              </p>
            </Reveal>

            <Reveal className="rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-sm">
              <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Heart className="size-6" />
              </div>
              <h3 className="font-display text-3xl font-bold tracking-tight text-foreground mt-5">
                Mission Statement
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                At Mummy Rose, our mission is to honour the wisdom of wholesome, natural living by crafting food products that are pure, flavourful, and ethically sourced. We are dedicated to empowering kitchens, supporting wellness, and partnering with brands to bring nourishing, beautifully packaged foods to life, from farm to shelf.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container-wide">
          <Reveal className="text-center max-w-2xl mx-auto">
            <span className="eyebrow text-accent tracking-widest uppercase">Our Commitment</span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl mt-3">
              The Principles That Guide Every Pack
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map((v, i) => {
              const Icon = v.icon;

              return (
                <Reveal key={v.title} delay={i * 100}>
                  <div className="flex flex-col h-full rounded-xl border border-border bg-card p-6 shadow-xs transition-all hover:shadow-md hover:border-primary/40">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mt-4">{v.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{v.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

