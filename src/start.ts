import { createStart, createMiddleware } from "@tanstack/react-start";
// createCsrfMiddleware is only available in Cloudflare Workers builds of
// @tanstack/react-start — guard its usage so Node.js (Vercel) doesn't crash.
import { createCsrfMiddleware as _createCsrfMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

const isDev = import.meta.env.DEV;

/**
 * Content Security Policy for the storefront + admin console.
 * - Supabase (REST/auth/realtime/storage) and the payment providers' inline
 *   checkout scripts are the only third-party origins we allow.
 * - 'unsafe-inline' on style-src is required: the CMS injects a <style> element
 *   for merchant-managed theme tokens, and Tailwind/Radix use inline styles.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://js.paystack.co https://checkout.flutterwave.com https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' https://*.supabase.co https://*.lovable.cloud wss://*.supabase.co https://api.paystack.co https://api.flutterwave.com https://www.google-analytics.com${isDev ? " ws: http://localhost:*" : ""}`,
  "frame-src 'self' https://checkout.paystack.com https://checkout.flutterwave.com",
  "frame-ancestors 'self' https://*.lovable.app https://*.lovable.dev",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders: Record<string, string> = {
  "content-security-policy": csp,
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(self)",
  "cross-origin-opener-policy": "same-origin-allow-popups",
  // The editor preview renders the app in an iframe, so frame-ancestors above
  // carries the click-jacking protection and X-Frame-Options stays permissive
  // only for trusted Lovable origins.
  ...(isDev ? {} : { "strict-transport-security": "max-age=31536000; includeSubDomains; preload" }),
};

function applySecurityHeaders(response: Response) {
  for (const [key, value] of Object.entries(securityHeaders)) {
    if (!response.headers.has(key)) response.headers.set(key, value);
  }
}

const securityHeadersMiddleware = createMiddleware().server(async ({ next }) => {
  const result = await next();
  if (result instanceof Response) {
    applySecurityHeaders(result);
    return result;
  }
  const response = (result as { response?: Response })?.response;
  if (response instanceof Response) applySecurityHeaders(response);
  return result;
});

// Start installs CSRF protection automatically when src/start.ts is absent;
// defining the file opts out, so re-add it explicitly. Guard with typeof so
// the server doesn't crash on Node.js/Vercel where the export may be absent.
const csrfMiddleware =
  typeof _createCsrfMiddleware === "function"
    ? _createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" })
    : createMiddleware().server(async ({ next }) => next()); // no-op on Node.js

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [securityHeadersMiddleware, errorMiddleware, csrfMiddleware],
}));
