import { useState } from "react";
import { Leaf, Search, Cpu, PackageCheck, Truck, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import millingImage from "@/assets/process-milling.jpg";
import storyFarmers from "@/assets/story-farmers.jpg";

const PROCESS_STEPS = [
  {
    id: "source",
    number: "01",
    title: "SOURCE",
    headline: "Ethical Sourcing from Farm Cooperatives",
    description:
      "We partner directly with trusted farm cooperatives across Nigeria's food belt (Kaduna, Jos, Oyo, Benue). Raw hibiscus, turmeric, ginger, and peppers are harvested at peak ripeness.",
    icon: Leaf,
    image: storyFarmers,
  },
  {
    id: "select",
    number: "02",
    title: "SELECT",
    headline: "Meticulous Hand Sorting & Inspection",
    description:
      "Every raw crop undergoes careful manual sorting to eliminate impurities, ensuring only the finest, sun-dried botanical specimens enter production.",
    icon: Search,
    image: storyFarmers,
  },
  {
    id: "process",
    number: "03",
    title: "PROCESS",
    headline: "Slow Stone-Milling & Traditional Blending",
    description:
      "Heat destroys flavor. We mill on traditional stone at low speeds to preserve natural essential oils, vibrant color, and rich kitchen aromas without fillers or additives.",
    icon: Cpu,
    image: millingImage,
  },
  {
    id: "package",
    number: "04",
    title: "PACKAGE",
    headline: "Eco-Friendly Freshness Preservation",
    description:
      "Packed immediately into UV-protective glass jars, airtight pouches, and sustainable retail cartons designed to lock in shelf-life stability and freshness.",
    icon: PackageCheck,
    image: millingImage,
  },
  {
    id: "deliver",
    number: "05",
    title: "DELIVER",
    headline: "Direct to Kitchens & Global Stockists",
    description:
      "Distributed directly to homes, supermarkets, and B2B partners across Nigeria and exported internationally with complete batch traceability.",
    icon: Truck,
    image: storyFarmers,
  },
];

export function ProcessStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const current = PROCESS_STEPS[activeStep];

  return (
    <section className="py-20 md:py-32 bg-background border-b border-border/60 overflow-hidden">
      <div className="container-wide">
        <Reveal className="max-w-3xl">
          <span className="eyebrow text-accent tracking-widest uppercase">
            From Nature to Your Kitchen
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mt-3">
            Traditional Wisdom Meets Modern Quality Control
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            We preserve the integrity of every grain, root, and leaf through a transparent 5-step production process.
          </p>
        </Reveal>

        {/* Horizontal Step Selector Bar */}
        <div className="mt-12 overflow-x-auto pb-4 scrollbar-none">
          <div className="flex min-w-[680px] items-center justify-between border-b border-border/80 pb-6">
            {PROCESS_STEPS.map((step, idx) => {
              const isActive = idx === activeStep;
              const Icon = step.icon;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`group relative flex items-center gap-3 transition-all cursor-pointer ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div
                    className={`flex size-11 items-center justify-center rounded-full border text-sm font-bold transition-all ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-border bg-card group-hover:border-primary/50"
                    }`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                      Step {step.number}
                    </span>
                    <span className={`text-sm font-bold tracking-wider uppercase ${isActive ? "text-primary font-extrabold" : ""}`}>
                      {step.title}
                    </span>
                  </div>

                  {idx < PROCESS_STEPS.length - 1 && (
                    <ArrowRight className="hidden sm:block size-4 text-border ml-4" />
                  )}

                  {isActive && (
                    <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Step Content Display */}
        <div className="mt-10 grid items-center gap-8 lg:grid-cols-12 rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-lg">
          <div className="lg:col-span-7">
            <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary uppercase">
              Step {current.number} of 05 — {current.title}
            </span>
            <h3 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-4xl mt-4">
              {current.headline}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {current.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border/60 pt-6 text-xs font-semibold text-muted-foreground uppercase">
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="size-2 rounded-full bg-accent" /> 100% Traceable Sourcing
              </span>
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="size-2 rounded-full bg-accent" /> Zero Preservatives or Additives
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="hover-zoom-img relative aspect-4/3 overflow-hidden rounded-xl border border-border shadow-md">
              <img
                src={current.image}
                alt={current.headline}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-semibold uppercase text-accent-foreground/90 tracking-wider">
                  Mummy Rose Quality Standard
                </p>
                <p className="font-display text-lg font-bold text-white">
                  Preserving Nature's Purest Flavors
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
