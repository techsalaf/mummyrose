import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { productsQuery } from "@/lib/queries";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/wishlist")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQuery);
  },
  head: () => ({
    meta: [
      { title: "Your Wishlist — Mummy Rose" },
      { name: "description", content: "Products you saved for later from the Mummy Rose natural pantry." },
      { property: "og:title", content: "Your Wishlist — Mummy Rose" },
      { property: "og:description", content: "Products you saved for later from Mummy Rose." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const { wishlist } = useCart();
  const saved = products.filter((p) => wishlist.includes(p.slug));

  return (
    <div className="container-page py-12 md:py-16">
      <p className="eyebrow text-accent">Saved</p>
      <h1 className="mt-3 font-display text-4xl">Your wishlist</h1>

      {saved.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">You haven't saved anything yet.</p>
          <Button asChild variant="clay" className="mt-6">
            <Link to="/products">Browse the pantry</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {saved.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
