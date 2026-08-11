import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderPathsNote, WhatsAppOrderButton } from "@/components/whatsapp-order-button";
import { useCart } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Mummy Rose" },
      { name: "description", content: "Review the items in your Mummy Rose cart before checking out." },
      { property: "og:title", content: "Your Cart — Mummy Rose" },
      { property: "og:description", content: "Review your Mummy Rose order before checkout." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const { formatPrice } = useCurrency();
  const shipping = items.length === 0 ? 0 : subtotal >= 50000 ? 0 : 2500;

  return (
    <div className="container-page py-12 md:py-16">
      <h1 className="font-display text-4xl">Your cart</h1>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Button asChild variant="clay" className="mt-6">
            <Link to="/products">Start shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col divide-y divide-border">
            {items.map((item) => (
              <div key={`${item.product_id}-${item.variant}`} className="flex gap-4 py-5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="size-24 shrink-0 rounded-md object-cover"
                  loading="lazy"
                />
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <div>
                      <Link
                        to="/products/$slug"
                        params={{ slug: item.slug }}
                        className="font-display text-lg"
                      >
                        {item.name}
                      </Link>
                      {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                    </div>
                    <p className="font-display">{formatPrice(item.unit_price * item.quantity)}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-3 pt-3">
                    <div className="flex items-center rounded-md border border-input">
                      <button
                        aria-label="Decrease quantity"
                        className="px-2.5 py-1.5"
                        onClick={() => updateQuantity(item.product_id, item.variant, item.quantity - 1)}
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        className="px-2.5 py-1.5"
                        onClick={() => updateQuantity(item.product_id, item.variant, item.quantity + 1)}
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <button
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.product_id, item.variant)}
                    >
                      <Trash2 className="size-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="surface-card h-fit rounded-lg p-6">
            <h2 className="font-display text-xl">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 font-display text-lg">
                <dt>Total</dt>
                <dd>{formatPrice(subtotal + shipping)}</dd>
              </div>
            </dl>
            <Button asChild variant="clay" size="lg" className="mt-6 w-full">
              <Link to="/checkout">Proceed to checkout</Link>
            </Button>
            <WhatsAppOrderButton
              className="mt-3 w-full"
              lines={items.map((item) => ({
                name: item.name,
                variant: item.variant,
                quantity: item.quantity,
                unit_price: item.unit_price,
              }))}
            />
            <OrderPathsNote className="mt-3 text-xs leading-relaxed text-muted-foreground" />

            <Link
              to="/products"
              className="mt-3 block text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
