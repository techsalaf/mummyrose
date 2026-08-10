import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone, MapPin, Facebook, Twitter, Youtube, Music2, ArrowUpRight } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";
import { useSiteConfig } from "@/lib/site-config";

const socialFields = [
  { key: "instagram", icon: Instagram, label: "Instagram" },
  { key: "facebook", icon: Facebook, label: "Facebook" },
  { key: "twitter", icon: Twitter, label: "X / Twitter" },
  { key: "tiktok", icon: Music2, label: "TikTok" },
  { key: "youtube", icon: Youtube, label: "YouTube" },
] as const;

export function SiteFooter() {
  const { branding, footer } = useSiteConfig();
  const year = new Date().getFullYear();
  const socials = socialFields.filter((s) => Boolean(footer[s.key]));

  return (
    <footer className="bg-ink text-ink-foreground border-t border-border/40 pt-16">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-5">
        
        {/* Brand Column (2 cols) */}
        <div className="lg:col-span-2">
          {branding.logo_url ? (
            <img src={branding.logo_url} alt={branding.name} className="h-10 w-auto max-w-40 object-contain" />
          ) : (
            <span className="font-display text-3xl font-bold tracking-tight text-white">{branding.name}</span>
          )}
          <p className="mt-4 text-sm font-semibold tracking-widest text-accent uppercase">
            Nature’s Goodness, Mummy’s Touch.
          </p>
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-ink-foreground/75">
            {footer.blurb ||
              "Mummy Rose crafts natural spices, stone-milled flours, and herbal tea infusions inspired by generations of traditional home cooking — without preservatives or fillers."}
          </p>

          <div className="mt-6 flex flex-col gap-2.5 text-xs text-ink-foreground/80">
            {footer.email ? (
              <a href={`mailto:${footer.email}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                <Mail className="size-4 text-accent" /> {footer.email}
              </a>
            ) : (
              <a href="mailto:hello@mummyrose.com" className="flex items-center gap-2 hover:text-gold transition-colors">
                <Mail className="size-4 text-accent" /> hello@mummyrose.com
              </a>
            )}
            {footer.phone ? (
              <a href={`tel:${footer.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                <Phone className="size-4 text-accent" /> {footer.phone}
              </a>
            ) : null}
            <span className="flex items-center gap-2 text-ink-foreground/70">
              <MapPin className="size-4 text-accent" /> Lagos, Nigeria (Global Shipping)
            </span>
          </div>
        </div>

        {/* Shop Collections Column */}
        <div>
          <p className="font-display text-lg font-bold text-white tracking-wide">Shop Pantry</p>
          <ul className="mt-4 flex flex-col gap-2 text-xs text-ink-foreground/80">
            <li>
              <Link to="/products" className="hover:text-gold transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/category/$slug" params={{ slug: "spices" }} className="hover:text-gold transition-colors">
                Spices &amp; Seasonings
              </Link>
            </li>
            <li>
              <Link to="/category/$slug" params={{ slug: "flours" }} className="hover:text-gold transition-colors">
                Flours &amp; Cereals
              </Link>
            </li>
            <li>
              <Link to="/category/$slug" params={{ slug: "tea-infusions" }} className="hover:text-gold transition-colors">
                Herbal Tea Infusions
              </Link>
            </li>
            <li>
              <Link to="/category/$slug" params={{ slug: "sweet-savory" }} className="hover:text-gold transition-colors">
                Sweeteners &amp; Nut Powders
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-gold transition-colors">
                Saved Wishlist
              </Link>
            </li>
          </ul>
        </div>

        {/* B2B Services Column */}
        <div>
          <p className="font-display text-lg font-bold text-white tracking-wide">B2B &amp; Solutions</p>
          <ul className="mt-4 flex flex-col gap-2 text-xs text-ink-foreground/80">
            <li>
              <Link to="/services" className="hover:text-gold transition-colors font-semibold text-white">
                All B2B Solutions
              </Link>
            </li>
            <li>
              <Link to="/white-labelling" className="hover:text-gold transition-colors">
                White Labelling
              </Link>
            </li>
            <li>
              <Link to="/wholesale" className="hover:text-gold transition-colors">
                Wholesale &amp; Bulk
              </Link>
            </li>
            <li>
              <Link to="/retail" className="hover:text-gold transition-colors">
                Retail &amp; Supermarkets
              </Link>
            </li>
            <li>
              <Link to="/custom-packaging" className="hover:text-gold transition-colors">
                Custom Packaging
              </Link>
            </li>
            <li>
              <Link to="/export" className="hover:text-gold transition-colors">
                Global Export
              </Link>
            </li>
            <li>
              <Link to="/corporate-supply" className="hover:text-gold transition-colors">
                Corporate Gifting
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter & Community Column */}
        <div>
          <p className="font-display text-lg font-bold text-white tracking-wide">Stay Connected</p>
          <p className="mt-3 text-xs text-ink-foreground/75 leading-relaxed">
            {footer.newsletter_body || "Subscribe for seasonal African recipes, new blend arrivals, and quiet pantry restock offers."}
          </p>
          <div className="mt-4">
            <NewsletterForm tone="dark" />
          </div>

          {socials.length > 0 && (
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={footer[s.key]}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-gold hover:text-ink transition-colors"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/30">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-xs text-ink-foreground/60 sm:flex-row">
          <p>{footer.copyright || `© ${year} ${branding.name} Ltd. All rights reserved.`}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/about" className="hover:text-gold transition-colors">
              Our Story
            </Link>
            <Link to="/recipes" className="hover:text-gold transition-colors">
              Recipes
            </Link>
            <Link to="/contact" className="hover:text-gold transition-colors">
              Contact
            </Link>
            <Link to="/privacy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-gold transition-colors">
              Terms of Use
            </Link>
            <Link to="/track-order" className="hover:text-gold transition-colors">
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

