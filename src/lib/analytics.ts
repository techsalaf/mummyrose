import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "mr.sid.v1";

export type AnalyticsEventName =
  | "page_view"
  | "product_view"
  | "add_to_cart"
  | "begin_checkout"
  | "order_placed"
  | "whatsapp_order"
  | "search"
  | "newsletter_signup"
  | "inquiry";

function sessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    let id = window.localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      window.localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

/** Fire-and-forget store analytics. Never throws, never blocks the UI. */
export function track(
  name: AnalyticsEventName,
  options: { path?: string; productId?: string | null; value?: number | null; meta?: Record<string, unknown> } = {},
) {
  if (typeof window === "undefined") return;
  const payload = {
    name,
    path: (options.path ?? window.location.pathname).slice(0, 300),
    referrer: (document.referrer || null)?.slice(0, 300) ?? null,
    session_id: sessionId(),
    product_id: options.productId ?? null,
    value: options.value ?? null,
    meta: options.meta ?? {},
  };
  void supabase
    .from("analytics_events")
    .insert(payload)
    .then(() => undefined);
}
