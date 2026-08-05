import { Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import type { ProductRow } from "@/lib/queries";

/**
 * Horizontal snap rail for discovery collections (new arrivals, trending).
 * Scrolls on touch, reveals as a wide editorial strip on desktop.
 */
export function ProductRail({
  eyebrow,
  title,
  description,
  products,
  href = "/products",
  linkLabel = "View all",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  products: ProductRow[];
  href?: string;
  linkLabel?: string;
}) {
  if (!products.length) return null;

  return (
    <section className="overflow-hidden py-20 md:py-28">
      <div className="container-wide">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow flex items-center gap-3 text-muted-foreground">
              <span className="h-px w-8 bg-accent" />
              {eyebrow}
            </p>
            <h2 className="display-lg mt-5 text-balance">{title}</h2>
            {description ? <p className="lead mt-4">{description}</p> : null}
          </div>
          <Link
            to={href === "/products" ? "/products" : "/products"}
            className="link-underline shrink-0 text-[11px] tracking-[0.24em] text-primary uppercase"
          >
            {linkLabel}
          </Link>
        </Reveal>
      </div>

      <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[1.375rem] pb-4 [scrollbar-width:none] md:px-10 [&::-webkit-scrollbar]:hidden">
        {products.map((p, i) => (
          <Reveal
            key={p.id}
            delay={i * 70}
            className="w-[74%] shrink-0 snap-start sm:w-[46%] lg:w-[27%] xl:w-[22%]"
          >
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
