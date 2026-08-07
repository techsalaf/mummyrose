import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { ProductCard } from "@/components/product-card";
import { relatedProductsQuery } from "@/lib/queries";

/** "Shop this recipe" block — only rendered when an editor linked products. */
export function RelatedProducts({
  ids,
  heading = "Shop the ingredients",
  blurb,
}: {
  ids: string[] | null | undefined;
  heading?: string;
  blurb?: string;
}) {
  const { data: products = [] } = useQuery(relatedProductsQuery(ids));
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="related-products" className="mt-16 border-t border-border pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-accent">From the pantry</p>
          <h2 id="related-products" className="mt-2 font-display text-2xl md:text-3xl">
            {heading}
          </h2>
          {blurb ? <p className="mt-2 max-w-md text-sm text-muted-foreground">{blurb}</p> : null}
        </div>
        <Link to="/products" className="text-sm underline underline-offset-4 hover:text-accent">
          Shop all products
        </Link>
      </div>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.slice(0, 3).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
