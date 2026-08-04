import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "search_products",
  title: "Search products",
  description:
    "Search the public Mummy Rose catalogue (spices, flours, seasonings, tea infusions) by name or description. Returns name, slug, price and stock status.",
  inputSchema: {
    query: z.string().trim().describe("Free-text search term, e.g. 'ginger' or 'yam flour'."),
    limit: z.number().int().describe("Maximum number of products to return (1-25)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }) => {
    const take = Math.min(Math.max(Number.isFinite(limit) ? limit : 10, 1), 25);
    const supabase = supabaseAnon();
    let builder = supabase
      .from("products")
      .select("name, slug, short_description, price, compare_at_price, stock_quantity, currency")
      .eq("is_active", true)
      .limit(take);
    if (query) builder = builder.or(`name.ilike.%${query}%,short_description.ilike.%${query}%`);

    const { data, error } = await builder;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { products: data ?? [] },
    };
  },
});
