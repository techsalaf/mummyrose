import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Boxes,
  FileText,
  Folder,
  Home,
  Image as ImageIcon,
  Inbox,
  Layers,
  LayoutDashboard,
  Loader2,
  MessageSquareQuote,
  Navigation,
  Package,
  Quote,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Mummy Rose Commerce Console" },
      { name: "description", content: "Manage products, orders, content and settings for the Mummy Rose store." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Folder },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/wholesale", label: "Wholesale", icon: Layers },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/posts", label: "Journal & recipes", icon: FileText },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { to: "/admin/faqs", label: "FAQs", icon: MessageSquareQuote },
  { to: "/admin/navigation", label: "Navigation", icon: Navigation },
  { to: "/admin/media", label: "Media", icon: ImageIcon },
  { to: "/admin/analytics", label: "Analytics & SEO", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminLayout() {
  const { user, isStaff, loading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [claiming, setClaiming] = useState(false);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <Gate title="Staff sign-in required" body="Sign in with your staff account to open the commerce console.">
        <Button asChild>
          <Link to="/account">Go to sign in</Link>
        </Button>
      </Gate>
    );
  }

  if (!isStaff) {
    return (
      <Gate
        title="No staff access on this account"
        body="This account is signed in but has no admin or staff role yet. If this is a brand-new store, you can claim the first admin role."
      >
        <Button
          disabled={claiming}
          onClick={async () => {
            setClaiming(true);
            const { data, error } = await supabase.rpc("claim_admin");
            setClaiming(false);
            if (error) return toast.error(error.message);
            if (data) {
              toast.success("Admin role granted — reloading");
              window.location.reload();
            } else {
              toast.error("An admin already exists. Ask them to grant you access.");
            }
          }}
        >
          {claiming ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />} Claim admin role
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">Back to store</Link>
        </Button>
      </Gate>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-card lg:flex">
          <div className="border-b px-5 py-4">
            <p className="font-display text-lg font-semibold">Mummy Rose</p>
            <p className="text-xs text-muted-foreground">Commerce console</p>
          </div>
          <nav className="flex-1 overflow-y-auto p-3">
            {nav.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "mb-0.5 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                    active ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-muted",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t p-3">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/">
                <Home className="size-4" /> View storefront
              </Link>
            </Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex items-center justify-between gap-3 border-b bg-card px-4 py-3 lg:hidden">
            <p className="font-display font-semibold">Console</p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/">Storefront</Link>
            </Button>
          </header>
          <div className="overflow-x-auto border-b bg-card px-3 py-2 lg:hidden">
            <div className="flex gap-1">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs text-foreground/70 hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function Gate({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{body}</p>
        <div className="mt-6 flex justify-center gap-2">{children}</div>
      </div>
    </div>
  );
}
