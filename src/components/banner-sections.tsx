import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RichText } from "@/components/rich-text";
import { bannersQuery } from "@/lib/queries";

/**
 * Renders CMS-managed banners / landing sections for a placement so staff can
 * publish promos and campaign blocks without a deploy.
 */
export function BannerSections({ placement }: { placement: string }) {
  const { data: banners = [] } = useQuery(bannersQuery(placement));
  if (banners.length === 0) return null;

  return (
    <>
      {banners.map((banner) => (
        <section key={banner.id} className="container-page py-12 md:py-16">
          <div className="grid items-center gap-8 md:grid-cols-2">
            {banner.image_url ? (
              <img
                src={banner.image_url}
                alt={banner.title ?? ""}
                className="w-full rounded-lg object-cover"
                loading="lazy"
              />
            ) : null}
            <div className={banner.image_url ? "" : "md:col-span-2 max-w-3xl"}>
              <h2 className="font-display text-3xl">{banner.title}</h2>
              {banner.subtitle ? (
                <p className="mt-3 leading-relaxed text-muted-foreground">{banner.subtitle}</p>
              ) : null}
              <RichText content={banner.body} className="mt-4 space-y-3 text-muted-foreground" />
              {banner.cta_label && banner.cta_href ? (
                <Button asChild variant="clay" className="mt-6">
                  <Link to={banner.cta_href}>
                    {banner.cta_label} <ArrowRight className="size-4" />
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
