import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { adminPostsQuery } from "@/lib/admin-queries";
import { formatDate, slugify } from "@/lib/format";

export const Route = createFileRoute("/admin/posts")({
  component: AdminPosts,
});

function AdminPosts() {
  return (
    <ResourceManager
      title="Journal &amp; recipes"
      description="Write, draft and schedule recipes, stories and guides. Drafts stay hidden from the storefront."
      table="posts"
      singular="Post"
      query={adminPostsQuery}
      searchKeys={["title", "slug", "category"]}
      defaults={{ kind: "recipe", is_published: false }}
      prepare={(payload) => ({
        ...payload,
        slug: payload.slug ? String(payload.slug) : slugify(String(payload.title ?? "")),
      })}
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "slug", label: "Slug", type: "text" },
        {
          name: "kind",
          label: "Type",
          type: "select",
          options: [
            { value: "recipe", label: "Recipe" },
            { value: "article", label: "Article" },
          ],
        },
        { name: "category", label: "Category", type: "text", placeholder: "Soups, Baking, Wellness" },
        { name: "author", label: "Author", type: "text" },
        { name: "published_at", label: "Publish date", type: "date" },
        { name: "cover_image", label: "Cover image", type: "image" },
        { name: "excerpt", label: "Excerpt", type: "textarea" },
        { name: "content", label: "Content", type: "richtext", placeholder: "Markdown-style body copy" },
        { name: "seo_title", label: "SEO title", type: "text" },
        { name: "seo_description", label: "SEO description", type: "textarea" },
        { name: "is_published", label: "Published", type: "switch" },
        { name: "is_featured", label: "Featured", type: "switch" },
      ]}
      columns={[
        { key: "title", label: "Title" },
        { key: "kind", label: "Type" },
        { key: "category", label: "Category" },
        { key: "published_at", label: "Publish date", render: (row) => formatDate(row.published_at as string) },
        {
          key: "is_published",
          label: "Status",
          render: (row) => (
            <Badge variant={row.is_published ? "default" : "secondary"}>{row.is_published ? "Live" : "Draft"}</Badge>
          ),
        },
      ]}
    />
  );
}
