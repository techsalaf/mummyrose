/**
 * CmsPageSections — renders the `sections` JSON array stored in the `pages` table.
 *
 * Each section block can have:
 *   heading?: string
 *   body?: string        (supports \n as paragraph break)
 *   image?: string       (URL)
 *   image_alt?: string
 *   image_side?: "left" | "right"  (default: right)
 *   theme?: "light" | "dark" | "accent"
 */

import { Reveal } from "@/components/reveal";
import { RichText } from "@/components/rich-text";

export type CmsSection = {
  heading?: string;
  body?: string;
  image?: string;
  image_alt?: string;
  image_side?: "left" | "right";
  theme?: "light" | "dark" | "accent";
};

export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  hero_image?: string | null;
  sections: CmsSection[] | unknown;
  seo_title?: string | null;
  seo_description?: string | null;
  is_published: boolean;
};

function parseSections(raw: unknown): CmsSection[] {
  if (!raw) return [];
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as CmsSection[];
    } catch {
      return [];
    }
  }
  if (Array.isArray(raw)) return raw as CmsSection[];
  return [];
}

export function CmsPageSections({ page }: { page: CmsPage }) {
  const sections = parseSections(page.sections);

  if (sections.length === 0) {
    return (
      <p className="text-muted-foreground text-sm italic">
        No content sections yet — add them in Admin → Pages.
      </p>
    );
  }

  return (
    <div className="space-y-20">
      {sections.map((section, i) => {
        const hasImage = !!section.image;
        const imageLeft = section.image_side === "left";

        if (hasImage) {
          return (
            <Reveal key={i}>
              <div
                className={`grid gap-10 md:grid-cols-2 md:items-center ${
                  imageLeft ? "" : "md:[&>*:first-child]:order-2"
                }`}
              >
                {/* Image */}
                <div className="overflow-hidden rounded-2xl bg-muted aspect-[4/3]">
                  <img
                    src={section.image}
                    alt={section.image_alt ?? section.heading ?? ""}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Text */}
                <div>
                  {section.heading && (
                    <h2 className="font-display text-2xl md:text-3xl leading-snug mb-4">
                      {section.heading}
                    </h2>
                  )}
                  {section.body && (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                      <RichText content={section.body} />
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          );
        }

        // Text-only section
        return (
          <Reveal key={i}>
            <div className="max-w-3xl mx-auto text-center space-y-4">
              {section.heading && (
                <h2 className="font-display text-2xl md:text-3xl">{section.heading}</h2>
              )}
              {section.body && (
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                  <RichText content={section.body} />
                </div>
              )}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
