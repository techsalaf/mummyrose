import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "create_inquiry",
  title: "Send a business inquiry",
  description:
    "Submit a wholesale, export, white-labelling, corporate-supply or general inquiry to the Mummy Rose team on behalf of the signed-in user.",
  inputSchema: {
    type: z
      .enum(["contact", "wholesale", "export", "white_label", "corporate", "custom_packaging"])
      .describe("Inquiry channel."),
    name: z.string().trim().describe("Contact name."),
    email: z.string().trim().describe("Contact email address."),
    phone: z.string().trim().describe("Contact phone number, or an empty string."),
    message: z.string().trim().describe("The inquiry body."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ type, name, email, phone, message }, ctx) => {

    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("inquiries")
      .insert({ type, name, email, phone: phone || null, message })
      .select("id, type, created_at")
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Inquiry received (${data?.id ?? "queued"}).` }],
      structuredContent: { inquiry: data },
    };
  },
});
