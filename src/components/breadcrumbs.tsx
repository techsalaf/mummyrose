import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { useSiteConfig } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/content";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/**
 * Accessible breadcrumb trail plus matching BreadcrumbList structured data.
 * The final crumb is the current page and is never a link.
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const { seo } = useSiteConfig();
  const trail = [{ label: "Home", href: "/" }, ...items];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.label,
            ...(crumb.href ? { item: absoluteUrl(seo.site_url, crumb.href) } : {}),
          })),
        }}
      />
      <nav aria-label="Breadcrumb" className={cn("text-xs text-muted-foreground", className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {trail.map((crumb, index) => {
            const isLast = index === trail.length - 1;
            return (
              <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight aria-hidden className="size-3 opacity-50" />}
                {crumb.href && !isLast ? (
                  <Link to={crumb.href} className="transition-colors hover:text-accent">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-foreground" : undefined}>
                    {crumb.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
