import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, Heart, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchCommand } from "@/components/search-command";
import { useCart } from "@/lib/cart";

const shop = [
  { to: "/products", label: "All products" },
  { to: "/category/$slug", params: { slug: "flours" }, label: "Flours" },
  { to: "/category/$slug", params: { slug: "seasonings" }, label: "Seasonings" },
  { to: "/category/$slug", params: { slug: "spices" }, label: "Spices" },
  { to: "/category/$slug", params: { slug: "sweet-savory" }, label: "Sweet & Savory" },
  { to: "/category/$slug", params: { slug: "tea-infusions" }, label: "Tea Infusions" },
  { to: "/category/$slug", params: { slug: "cereals" }, label: "Cereals" },
] as const;

const business = [
  { to: "/wholesale", label: "Wholesale" },
  { to: "/wholesale/portal", label: "Trade portal" },
  { to: "/export", label: "Export" },
  { to: "/white-labelling", label: "White labelling" },
  { to: "/custom-packaging", label: "Custom packaging" },
  { to: "/corporate-supply", label: "Corporate supply" },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="bg-ink text-ink-foreground">
        <div className="container-page flex h-9 items-center justify-center gap-3 text-[11px] tracking-[0.18em] uppercase">
          <span>Free delivery on orders over ₦50,000</span>
        </div>
      </div>

      <div className="container-page flex h-18 items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[86vw] max-w-sm overflow-y-auto">
              <nav className="mt-8 flex flex-col gap-6" onClick={() => setOpen(false)}>
                <div>
                  <p className="eyebrow text-muted-foreground">Shop</p>
                  <div className="mt-3 flex flex-col gap-2.5">
                    {shop.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        params={"params" in item ? item.params : undefined}
                        className="font-display text-lg"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="eyebrow text-muted-foreground">Business</p>
                  <div className="mt-3 flex flex-col gap-2.5">
                    {business.map((item) => (
                      <Link key={item.to} to={item.to} className="font-display text-lg">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 border-t border-border pt-6">
                  <Link to="/recipes" className="font-display text-lg">
                    Recipes &amp; Journal
                  </Link>
                  <Link to="/about" className="font-display text-lg">
                    About us
                  </Link>
                  <Link to="/faq" className="font-display text-lg">
                    FAQ
                  </Link>
                  <Link to="/contact" className="font-display text-lg">
                    Contact
                  </Link>
                  <Link to="/account" className="font-display text-lg">
                    Account
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex flex-col leading-none">
            <span className="font-display text-2xl font-semibold tracking-tight text-primary">
              Mummy Rose
            </span>
            <span className="hidden text-[10px] tracking-[0.3em] text-muted-foreground uppercase sm:block">
              Natural Nigerian Pantry
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-7 text-sm lg:flex">
          <NavDropdown label="Shop" items={shop} />
          <Link to="/recipes" className="transition-colors hover:text-accent">
            Recipes
          </Link>
          <NavDropdown label="Business" items={business} />
          <Link to="/about" className="transition-colors hover:text-accent">
            About
          </Link>
          <Link to="/contact" className="transition-colors hover:text-accent">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-0.5">
          <ThemeToggle />
          <SearchCommand />
          <Button variant="ghost" size="icon" asChild aria-label="Wishlist">
            <Link to="/wishlist">
              <Heart />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="Account">
            <Link to="/account">
              <User />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="Cart" className="relative">
            <Link to="/cart">
              <ShoppingBag />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                  {count}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: readonly { to: string; label: string; params?: Record<string, string> }[];
}) {
  return (
    <div className="group relative">
      <button className="cursor-pointer py-2 transition-colors group-hover:text-accent">{label}</button>
      <div className="invisible absolute top-full left-1/2 z-50 w-56 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
        <div className="surface-card rounded-md p-2">
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              params={item.params}
              className="block rounded-sm px-3 py-2 text-sm transition-colors hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
