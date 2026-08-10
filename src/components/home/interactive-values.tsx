import { useState } from "react";
import { ShieldCheck, Award, HeartHandshake, Recycle, Lightbulb, Users, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/reveal";
import storyFarmers from "@/assets/story-farmers.jpg";
import lifestyleTable from "@/assets/lifestyle-table.jpg";

const VALUES = [
  {
    id: "authenticity",
    title: "AUTHENTICITY",
    tagline: "Staying true to traditional recipes & raw natural ingredients.",
    description:
      "Guided by quality, sustainability, and traceability. From organic turmeric to sun-dried hibiscus petals, we source directly from trusted farmers without synthetic substitutes.",
    icon: ShieldCheck,
    image: storyFarmers,
  },
  {
    id: "quality",
    title: "QUALITY",
    tagline: "Rigorous quality control from farm checks to batch stability.",
    description:
      "Every batch that bears the Mummy Rose seal undergoes strict quality protocols, from raw material inspection to microbial testing for purity, safety, and extended shelf-life stability.",
    icon: Award,
    image: lifestyleTable,
  },
  {
    id: "wellness",
    title: "WELLNESS",
    tagline: "Promoting healthy eating & balanced living through nature.",
    description:
      "Our traditional recipes celebrate nutrient-dense flours, digestive herbal teas, and preservative-free seasonings that nourish body and soul.",
    icon: HeartHandshake,
    image: storyFarmers,
  },
  {
    id: "eco-friendly",
    title: "ECO-FRIENDLY PACKAGING",
    tagline: "Functional, sustainable packaging that preserves freshness.",
    description:
      "Whether sachets, glass jars, stand-up pouches, or retail cartons, we engineer packaging that protects botanical freshness while reducing environmental impact.",
    icon: Recycle,
    image: lifestyleTable,
  },
  {
    id: "innovation",
    title: "INNOVATION",
    tagline: "Bridging kitchen heritage with modern processing technology.",
    description:
      "Our facility combines traditional milling knowledge with modern food tech for small-batch and large-scale runs, ensuring consistency and safety in every gram.",
    icon: Lightbulb,
    image: storyFarmers,
  },
  {
    id: "community",
    title: "COMMUNITY",
    tagline: "Empowering local farmers, families, and food creators.",
    description:
      "We support local agricultural cooperatives, fair trade pricing, and community nutrition initiatives across Nigeria.",
    icon: Users,
    image: lifestyleTable,
  },
];

export function InteractiveValues() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = VALUES[selectedIndex];

  return (
    <section className="py-20 md:py-32 bg-secondary/40 border-b border-border/60">
      <div className="container-wide">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="eyebrow text-accent tracking-widest uppercase">
            Our Guiding Pillars
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mt-3">
            Built on Trust, Crafted with Purpose
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Explore the core values that define every product, recipe, and business partnership at Mummy Rose.
          </p>
        </Reveal>

        {/* 6 Core Value Cards Grid */}
        <div className="mt-14 grid gap-8 lg:grid-cols-12 items-center">
          
          {/* Value Selectors List (Left 7 Columns) */}
          <div className="lg:col-span-7 grid gap-3 sm:grid-cols-2">
            {VALUES.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`group relative flex flex-col text-left p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "border-primary bg-card shadow-lg ring-1 ring-primary/30"
                      : "border-border/80 bg-card/60 hover:bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex size-10 items-center justify-center rounded-lg transition-colors ${
                        isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                      }`}
                    >
                      <Icon className="size-5" />
                    </div>
                    {isSelected && <CheckCircle2 className="size-5 text-accent" />}
                  </div>

                  <h3 className={`font-display text-lg font-bold tracking-tight mt-4 ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.tagline}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Featured Value Preview Card (Right 5 Columns) */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl">
              <div className="hover-zoom-img relative aspect-16/10 w-full overflow-hidden rounded-xl bg-muted">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="eyebrow text-accent-foreground uppercase tracking-widest">
                    Core Promise
                  </span>
                  <h4 className="font-display text-2xl font-bold text-white mt-0.5">
                    {selected.title}
                  </h4>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-primary">
                  "{selected.tagline}"
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {selected.description}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
