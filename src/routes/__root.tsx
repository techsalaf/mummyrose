import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "@/lib/cart";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteChrome } from "@/components/site-chrome";
import { SupportAssistant } from "@/components/support-assistant";

import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow text-accent">404</p>
        <h1 className="mt-3 font-display text-4xl">This page has moved on</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you are looking for doesn't exist. Try the shop instead.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground"
          >
            Go home
          </Link>
          <Link
            to="/products"
            className="inline-flex h-10 items-center rounded-md border border-input px-6 text-sm font-medium"
          >
            Shop products
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex h-10 items-center rounded-md border border-input px-6 text-sm font-medium"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mummy Rose — Natural Nigerian Spices, Flours & Herbal Infusions" },
      {
        name: "description",
        content:
          "Small-batch Nigerian spices, stone-milled flours and herbal infusions. Shop retail or partner with us for wholesale, export and white-label supply.",
      },
      { name: "author", content: "Mummy Rose Foods" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Mummy Rose" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#f7f3ea" },
      { property: "og:title", content: "Mummy Rose — Natural Nigerian Spices, Flours & Herbal Infusions" },
      { name: "twitter:title", content: "Mummy Rose — Natural Nigerian Spices, Flours & Herbal Infusions" },
      { property: "og:description", content: "Small-batch Nigerian spices, stone-milled flours and herbal infusions. Shop retail or partner with us for wholesale, export and white-label supply." },
      { name: "twitter:description", content: "Small-batch Nigerian spices, stone-milled flours and herbal infusions. Shop retail or partner with us for wholesale, export and white-label supply." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0d7db737-33c6-4803-86cd-117ad7ea0e1b/id-preview-7cad1aed--935c44d0-4d08-4085-a95e-0c07086c39bb.lovable.app-1785814906930.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0d7db737-33c6-4803-86cd-117ad7ea0e1b/id-preview-7cad1aed--935c44d0-4d08-4085-a95e-0c07086c39bb.lovable.app-1785814906930.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@300;400;500;600&display=swap",
      },

    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <SiteChrome />
        {isAdmin ? (

          <Outlet />
        ) : (
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
              <Outlet />
            </main>
            <SiteFooter />
            <SupportAssistant />
          </div>
        )}
        <Toaster position="top-center" />
      </CartProvider>
    </QueryClientProvider>
  );
}
