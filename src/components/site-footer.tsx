import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone, MapPin, Facebook, Twitter, Youtube, Music2 } from "lucide-react";
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
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          {branding.logo_url ? (
            <img src={branding.logo_url} alt={branding.name} className="h-10 w-auto max-w-40 object-contain" />
          ) : (
            <p className="font-display text-2xl font-semibold">{branding.name}</p>
          )}
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-foreground/70">{footer.blurb}</p>
          <div className="mt-6 flex flex-col gap-2 text-sm text-ink-foreground/70">
            {footer.email ? (
              <a href={`mailto:${footer.email}`} className="flex items-center gap-2 hover:text-gold">
                <Mail className="size-4" /> {footer.email}
              </a>
            ) : null}
            {footer.phone ? (
              <a href={`tel:${footer.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-gold">
                <Phone className="size-4" /> {footer.phone}
              </a>
            ) : null}
            {footer.address ? (
              <span className="flex items-center gap-2">
                <MapPin className="size-4" /> {footer.address}
              </span>
            ) : null}
          </div>
        </div>

        <div>
          <p className="eyebrow text-ink-foreground/50">{footer.shop_heading}</p>
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
          <p className="eyebrow text-ink-foreground/50">{footer.business_heading}</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-ink-foreground/80">
            {[
              ["/services", "All services"],
              ["/retail", "Retail & stockists"],
              ["/wholesale", "Wholesale"],


              ["/export", "Export"],
              ["/white-labelling", "White labelling"],
              ["/custom-packaging", "Custom packaging"],
              ["/corporate-supply", "Corporate supply"],
              ["/about", "About us"],
              ["/recipes", "Recipes"],
              ["/blog", "Journal & guides"],
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
          <p className="eyebrow text-ink-foreground/50">{footer.newsletter_heading}</p>
          <p className="mt-4 text-sm text-ink-foreground/70">{footer.newsletter_body}</p>
          <div className="mt-4">
            <NewsletterForm tone="dark" />
          </div>
          {socials.length > 0 && (
            <div className="mt-6 flex items-center gap-4">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={footer[s.key]}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="text-ink-foreground/80 hover:text-gold"
                >
                  <s.icon className="size-4.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-ink-foreground/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink-foreground/60 sm:flex-row">
          <p>{footer.copyright || `© ${year} ${branding.name}. All rights reserved.`}</p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link to="/shipping" className="hover:text-gold">
              Shipping
            </Link>
            <Link to="/refunds" className="hover:text-gold">
              Returns
            </Link>
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
