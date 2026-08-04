import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "get_product",
  title: "Get product details",
  description:
    "Fetch one published Mummy Rose product by its URL slug, including description, pricing, stock and active variants.",
  inputSchema: { slug: z.string().trim().describe("Product slug, e.g. 'ginger-powder'.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const supabase = supabaseAnon();
    const { data, error } = await supabase
      .from("products")
      .select("*, product_variants(name, sku, price, stock_quantity, is_active)")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw new ToolError(error.message);
    if (!data) throw new ToolError(`No published product found for slug "${slug}".`);
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { product: data },
    };
  },
});
