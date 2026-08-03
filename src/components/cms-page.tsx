import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { pageQuery, type PageSection } from "@/lib/cms-queries";
import { RichText } from "@/components/rich-text";

/**
 * Renders a CMS-managed page (title, subtitle, hero, body sections) from the
 * `pages` table so staff can edit legal and brand copy without a deploy.
 */
export function CmsPage({
  slug,
  eyebrow,
  heroImage,
  fallbackTitle,
}: {
  slug: string;
  eyebrow?: string;
  heroImage?: string;
  fallbackTitle?: string;
}) {
  const { data, isLoading } = useQuery(pageQuery(slug));

  if (isLoading) {
    return (
      <div className="container-page grid min-h-[50vh] place-items-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const sections: PageSection[] = Array.isArray(data?.sections) ? data.sections : [];
  const image = data?.hero_image || heroImage;

  return (
    <div className="container-page max-w-3xl py-12 md:py-16">
      {eyebrow ? <p className="eyebrow text-accent">{eyebrow}</p> : null}
      <h1 className="mt-3 font-display text-4xl">{data?.title ?? fallbackTitle ?? "Page"}</h1>
      {data?.subtitle ? (
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{data.subtitle}</p>
      ) : null}

      {image ? (
        <img
          src={image}
          alt={data?.title ?? fallbackTitle ?? ""}
          className="mt-10 w-full rounded-lg object-cover"
          loading="lazy"
        />
      ) : null}

      <div className="mt-10 space-y-8">
        {sections.length === 0 ? (
          <p className="text-sm text-muted-foreground">This page has no content yet.</p>
        ) : (
          sections.map((section, index) => (
            <section key={`${section.heading ?? "section"}-${index}`}>
              {section.heading ? <h2 className="font-display text-xl">{section.heading}</h2> : null}
              {section.image ? (
                <img
                  src={section.image}
                  alt={section.heading ?? ""}
                  className="mt-3 w-full rounded-lg object-cover"
                  loading="lazy"
                />
              ) : null}
              <RichText content={section.body} className="mt-2 space-y-2 leading-relaxed text-muted-foreground" />
            </section>
          ))
        )}
      </div>
    </div>
  );
}
