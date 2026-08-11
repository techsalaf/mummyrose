import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, Heart, User, ArrowRight, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchCommand } from "@/components/search-command";
import { CurrencySwitcher } from "@/lib/currency";
import { useCart } from "@/lib/cart";
import { useSiteConfig } from "@/lib/site-config";

const shopCategories = [
  { to: "/products", label: "All Products", description: "Explore the full Mummy Rose pantry collection" },
  { to: "/category/$slug", params: { slug: "spices" }, label: "Spices & Seasonings", description: "Spices the way Mummy made them" },
  { to: "/category/$slug", params: { slug: "flours" }, label: "Flours & Cereals", description: "From Grain to Goodness" },
  { to: "/category/$slug", params: { slug: "tea-infusions" }, label: "Tea Infusions", description: "Brew with love, sip with memory" },
  { to: "/category/$slug", params: { slug: "sweet-savory" }, label: "Sweet & Savory", description: "Natural sweeteners & nut powders" },
] as const;

const servicesList = [
  { to: "/services", label: "Overview of Solutions", description: "Complete B2B food manufacturing portal" },
  { to: "/white-labelling", label: "White Labelling", description: "Build your brand with Mummy Rose processing" },
  { to: "/wholesale", label: "Wholesale & Bulk", description: "Direct supply for distributors & retailers" },
  { to: "/custom-packaging", label: "Custom Packaging", description: "Tailored jars, sachets & retail cartons" },
  { to: "/export", label: "Global Export", description: "African food products delivered worldwide" },
  { to: "/corporate-supply", label: "Corporate & Events", description: "Custom gifting & wellness hampers" },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { branding } = useSiteConfig();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-background/95 shadow-sm backdrop-blur-md py-1"
          : "border-b border-border/40 bg-background/75 backdrop-blur-sm py-2.5"
      }`}
    >
      {branding.announcement_enabled && branding.announcement ? (
        <div className="bg-primary text-primary-foreground">
          <div className="container-page flex h-8 items-center justify-center gap-3 text-[11px] font-medium tracking-[0.2em] uppercase">
            <span>{branding.announcement}</span>
          </div>
        </div>
      ) : null}

      <div className="container-page flex items-center justify-between gap-4">
        {/* Mobile menu trigger & Logo */}
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88vw] max-w-md overflow-y-auto bg-background p-6">
              <div className="flex items-center gap-2 border-b pb-5">
                <span className="font-display text-2xl font-bold tracking-tight text-primary">
                  {branding.name}
                </span>
              </div>
              <nav className="mt-6 flex flex-col gap-6" onClick={() => setOpen(false)}>
                <div>
                  <p className="eyebrow text-muted-foreground">Main Navigation</p>
                  <div className="mt-3 flex flex-col gap-3 font-display text-xl">
                    <Link to="/" className="hover:text-primary transition-colors">
                      Home
                    </Link>
                    <Link to="/about" className="hover:text-primary transition-colors">
                      Our Story
                    </Link>
                    <Link to="/recipes" className="hover:text-primary transition-colors">
                      Recipes &amp; Ideas
                    </Link>
                    <Link to="/contact" className="hover:text-primary transition-colors">
                      Contact
                    </Link>
                  </div>
                </div>

                <div>
                  <p className="eyebrow text-muted-foreground">Shop Collections</p>
                  <div className="mt-3 flex flex-col gap-2.5">
                    {shopCategories.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        params={"params" in item ? item.params : undefined}
                        className="group flex flex-col text-sm font-medium hover:text-primary"
                      >
                        <span>{item.label}</span>
                        <span className="text-xs font-normal text-muted-foreground">{item.description}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="eyebrow text-muted-foreground">Business Solutions</p>
                  <div className="mt-3 flex flex-col gap-2.5">
                    {servicesList.map((item) => (
                      <Link key={item.to} to={item.to} className="group flex flex-col text-sm font-medium hover:text-primary">
                        <span>{item.label}</span>
                        <span className="text-xs font-normal text-muted-foreground">{item.description}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-5">
                  <Button asChild className="w-full">
                    <Link to="/products">
                      Shop Now <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            {branding.logo_url ? (
              <img src={branding.logo_url} alt={branding.name} className="h-10 w-auto max-w-40 object-contain" />
            ) : null}
            <span className="flex flex-col">
              <span className="font-display text-2xl font-bold tracking-tight text-primary sm:text-2xl">
                {branding.name}
              </span>
              <span className="hidden text-[9px] font-semibold tracking-[0.3em] text-accent uppercase md:block">
                Nature’s Goodness · Mummy’s Touch
              </span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
          <Link to="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/about" className="transition-colors hover:text-primary">
            Our Story
          </Link>

          <NavMegaMenu label="Shop" items={shopCategories} mainTo="/products" />
          <NavMegaMenu label="Services" items={servicesList} mainTo="/services" />

          <Link to="/recipes" className="transition-colors hover:text-primary">
            Recipes
          </Link>
          <Link to="/contact" className="transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <CurrencySwitcher />
          <SearchCommand />
          
          <Button variant="ghost" size="icon" asChild aria-label="Wishlist" className="hover:text-primary">
            <Link to="/wishlist">
              <Heart className="size-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild aria-label="Account" className="hover:text-primary">
            <Link to="/account">
              <User className="size-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild aria-label="Cart" className="relative hover:text-primary">
            <Link to="/cart">
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm">
                  {count}
                </span>
              )}
            </Link>
          </Button>

          <Button asChild size="sm" className="hidden font-medium sm:inline-flex ml-1">
            <Link to="/products">Shop Now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function NavMegaMenu({
  label,
  items,
  mainTo,
}: {
  label: string;
  items: readonly { to: string; label: string; description?: string; params?: Record<string, string> }[];
  mainTo: string;
}) {
  return (
    <div className="group relative">
      <Link to={mainTo} className="inline-flex items-center gap-1 py-2 font-medium transition-colors hover:text-primary">
        <span>{label}</span>
        <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180 text-muted-foreground" />
      </Link>
      
      <div className="invisible absolute top-full left-1/2 z-50 w-72 -translate-x-1/2 pt-2 opacity-0 transition-all duration-250 ease-out group-hover:visible group-hover:opacity-100">
        <div className="surface-card rounded-lg p-3 shadow-xl border border-border">
          <div className="grid gap-1">
            {items.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                params={item.params}
                className="group/item flex flex-col rounded-md p-2.5 transition-colors hover:bg-secondary"
              >
                <span className="text-sm font-semibold text-foreground group-hover/item:text-primary">
                  {item.label}
                </span>
                {item.description ? (
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

