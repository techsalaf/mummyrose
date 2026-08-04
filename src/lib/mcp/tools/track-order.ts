import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "track_order",
  title: "Track an order",
  description:
    "Look up the fulfilment and payment status of one of the signed-in customer's orders by its order number (e.g. MR-2026-0042).",
  inputSchema: { order_number: z.string().trim().describe("Mummy Rose order number.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ order_number }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("orders")
      .select("order_number, status, payment_status, total, currency, created_at, updated_at")
      .eq("order_number", order_number)
      .maybeSingle();
    if (error) throw new ToolError(error.message);
    if (!data) throw new ToolError(`No order visible to this account with number "${order_number}".`);
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { order: data },
    };
  },
});
