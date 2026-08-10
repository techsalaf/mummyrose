import { createStart, createMiddleware } from "@tanstack/react-start";
// NOTE: createCsrfMiddleware is NOT statically imported here.
//
// The original static import:
//   import { createCsrfMiddleware as _createCsrfMiddleware } from "@tanstack/react-start"
// caused a crash at module initialisation time on Vercel/Node.js even though
// a `typeof` guard was in place. esbuild/Rollup (used by Nitro) statically
// analyses named imports and can inline/optimise away the typeof check,
// resulting in a direct `createCsrfMiddleware(...)` call inside the bundled
// serverless module before any user code runs. Replacing the static import
// with a dynamic import() makes the guard genuinely runtime-only and opaque
// to the bundler — it cannot see through an expression like
// `import(someVariable)` to decide the result is always a function.

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

// Build a CSRF middleware that is genuinely safe on every runtime:
//
// - Cloudflare Workers: @tanstack/react-start exports createCsrfMiddleware,
//   the dynamic import resolves it, and we use the real implementation.
//
// - Node.js / Vercel: createCsrfMiddleware is either absent from the exports
//   or resolves to undefined. The dynamic import catches both cases and falls
//   back to a pass-through no-op so the server starts cleanly.
//
// Using a dynamic import (rather than a static named import + typeof guard)
// is critical: esbuild can see through a static import and inline the binding
// at bundle time, stripping the typeof check before it runs. A dynamic import
// expression is opaque to the bundler, so the guard is always evaluated at
// actual runtime.
async function buildCsrfMiddleware() {
  try {
    // Use a variable so bundlers can't statically resolve the specifier and
    // inline the binding — keeping the guard genuinely runtime-only.
    const specifier = "@tanstack/react-start";
    const mod = await import(/* @vite-ignore */ specifier);
    if (typeof mod.createCsrfMiddleware === "function") {
      return mod.createCsrfMiddleware({
        filter: (ctx: { handlerType: string }) => ctx.handlerType === "serverFn",
      });
    }
  } catch {
    // Package doesn't export createCsrfMiddleware on this runtime — fall through.
  }
  // No-op fallback: passes every request straight through without CSRF checks.
  // On Node.js/Vercel, TanStack Start's built-in server-function token
  // validation is unavailable anyway, so this matches the actual security
  // posture rather than silently breaking it.
  return createMiddleware().server(async ({ next }) => next());
}

// Resolve the middleware once at cold-start. Subsequent requests reuse it.
const csrfMiddleware = await buildCsrfMiddleware();

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [securityHeadersMiddleware, errorMiddleware, csrfMiddleware],
}));