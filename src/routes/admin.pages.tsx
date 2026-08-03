import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { adminPagesQuery } from "@/lib/admin-queries";
import { slugify } from "@/lib/format";

export const Route = createFileRoute("/admin/pages")({
  component: AdminPages,
});

function AdminPages() {
  return (
    <ResourceManager
      title="Pages"
      description="Edit About, Terms, Privacy and any other standalone page. Sections are a JSON list of { heading, body, image } blocks and go live the moment you save."
      table="pages"
      singular="Page"
      query={adminPagesQuery}
      searchKeys={["title", "slug"]}
      defaults={{ is_published: true, sections: "[]", sort_order: "0" }}
      prepare={(payload) => ({
        ...payload,
        slug: payload.slug ? slugify(String(payload.slug)) : slugify(String(payload.title ?? "")),
        sort_order: Number(payload.sort_order ?? 0),
      })}
      fields={[
        { name: "title", label: "Page title", type: "text", placeholder: "About Mummy Rose" },
        { name: "slug", label: "Slug", type: "text", help: "Used in the URL, e.g. about" },
        { name: "subtitle", label: "Subtitle", type: "textarea", full: true },
        { name: "hero_image", label: "Hero image", type: "image" },
        { name: "sort_order", label: "Order", type: "number" },
        {
          name: "sections",
          label: "Sections (JSON)",
          type: "json",
          full: true,
          placeholder: '[{"heading":"Our story","body":"Paragraph one.\\n\\nParagraph two."}]',
          help: "A list of blocks. Each block accepts heading, body and image.",
        },
        { name: "seo_title", label: "SEO title", type: "text" },
        { name: "seo_description", label: "SEO description", type: "textarea" },
        { name: "is_published", label: "Published", type: "switch" },
      ]}
      columns={[
        { key: "title", label: "Page" },
        { key: "slug", label: "Slug" },
        {
          key: "sections",
          label: "Blocks",
          render: (row) => String(Array.isArray(row.sections) ? row.sections.length : 0),
        },
        {
          key: "is_published",
          label: "Status",
          render: (row) => (
            <Badge variant={row.is_published ? "default" : "secondary"}>
              {row.is_published ? "Live" : "Draft"}
            </Badge>
          ),
        },
      ]}
    />
  );
}
