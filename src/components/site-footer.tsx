import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-semibold">Mummy Rose</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-foreground/70">
            Natural spices, stone-milled flours and herbal infusions, sourced from Nigerian farms and
            packed in small batches for kitchens around the world.
          </p>
          <div className="mt-6 flex flex-col gap-2 text-sm text-ink-foreground/70">
            <span className="flex items-center gap-2">
              <Mail className="size-4" /> hello@mummyrose.com
            </span>
            <span className="flex items-center gap-2">
              <Phone className="size-4" /> +234 800 000 0000
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4" /> Lagos, Nigeria
            </span>
          </div>
        </div>

        <div>
          <p className="eyebrow text-ink-foreground/50">Shop</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-ink-foreground/80">
            <li>
              <Link to="/products" className="hover:text-gold">
                All products
              </Link>
            </li>
            {[
              ["flours", "Flours"],
              ["seasonings", "Seasonings"],
              ["spices", "Spices"],
              ["tea-infusions", "Tea Infusions"],
              ["cereals", "Cereals"],
            ].map(([slug, label]) => (
              <li key={slug}>
                <Link to="/category/$slug" params={{ slug }} className="hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-ink-foreground/50">Business</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-ink-foreground/80">
            {[
              ["/wholesale", "Wholesale"],
              ["/export", "Export"],
              ["/white-labelling", "White labelling"],
              ["/custom-packaging", "Custom packaging"],
              ["/corporate-supply", "Corporate supply"],
              ["/about", "About us"],
              ["/recipes", "Recipes & Journal"],
              ["/faq", "FAQ"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-ink-foreground/50">Stay in the kitchen</p>
          <p className="mt-4 text-sm text-ink-foreground/70">
            Recipes, restocks and quiet offers. No noise.
          </p>
          <div className="mt-4">
            <NewsletterForm tone="dark" />
          </div>
          <a
            href="https://instagram.com/mummyrose"
            target="_blank"
            rel="noreferrer noopener"
            className="mt-6 inline-flex items-center gap-2 text-sm text-ink-foreground/80 hover:text-gold"
          >
            <Instagram className="size-4" /> @mummyrose
          </a>
        </div>
      </div>

      <div className="border-t border-ink-foreground/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink-foreground/60 sm:flex-row">
          <p>© {year} Mummy Rose Foods. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-gold">
              Privacy policy
            </Link>
            <Link to="/terms" className="hover:text-gold">
              Terms
            </Link>
            <Link to="/track-order" className="hover:text-gold">
              Track order
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
