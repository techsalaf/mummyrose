import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { ProductGrid } from "@/components/product-grid";
import { RecentlyViewed } from "@/components/recently-viewed";
import { categoriesQuery, productsQuery } from "@/lib/queries";

export const Route = createFileRoute("/products")({
  validateSearch: z.object({ q: z.string().optional() }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQuery);
    context.queryClient.ensureQueryData(categoriesQuery);
  },
  head: () => ({
    meta: [
      { title: "Shop All Products — Mummy Rose Natural Nigerian Pantry" },
      {
        name: "description",
        content:
          "Browse every Mummy Rose product: natural spices, stone-milled flours, cereals and herbal infusions. Filter by category, price and availability.",
      },
      { property: "og:title", content: "Shop All Products — Mummy Rose" },
      {
        property: "og:description",
        content: "Natural Nigerian spices, flours, cereals and herbal infusions, delivered nationwide.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { q } = Route.useSearch();
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: categories } = useSuspenseQuery(categoriesQuery);

  return (
    <div className="container-page py-12 md:py-16">
      <p className="eyebrow text-accent">The pantry</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">All products</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Everything we mill, blend and pack — natural, small batch and preservative free.
      </p>

      <div className="mt-10">
        <ProductGrid products={products} categories={categories} initialQuery={q ?? ""} />
      </div>

      <RecentlyViewed products={products} />
    </div>
  );
}
