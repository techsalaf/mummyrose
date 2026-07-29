import type { InquiryInput } from "./schemas";

export async function saveInquiry(input: InquiryInput) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("inquiries").insert({
    type: input.type,
    name: input.name,
    company: input.company ?? null,
    email: input.email,
    phone: input.phone ?? null,
    country: input.country ?? null,
    requirements: input.requirements ?? null,
    message: input.message ?? null,
  });
  if (error) throw new Error(error.message);
  return { ok: true as const };
}

export async function saveSubscriber(email: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin
    .from("newsletter_subscribers")
    .upsert({ email: email.toLowerCase() }, { onConflict: "email" });
  if (error) throw new Error(error.message);
  return { ok: true as const };
}
