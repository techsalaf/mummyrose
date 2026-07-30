import { ProductCard } from "@/components/product-card";
import { useCart } from "@/lib/cart";
import type { ProductRow } from "@/lib/queries";

export function RecentlyViewed({ products, excludeSlug }: { products: ProductRow[]; excludeSlug?: string }) {
  const { recentlyViewed } = useCart();
  const list = recentlyViewed
    .filter((slug) => slug !== excludeSlug)
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is ProductRow => Boolean(p))
    .slice(0, 4);

  if (list.length === 0) return null;

  return (
    <section className="mt-20">
      <p className="eyebrow text-accent">Recently viewed</p>
      <h2 className="mt-2 font-display text-2xl">Pick up where you left off</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
