import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Loader2, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminGate, AdminLogin } from "@/components/admin/admin-shell";
import { AdminSidebar, adminNavGroups } from "@/components/admin/admin-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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

function AdminLayout() {
  const { user, isStaff, loading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [claiming, setClaiming] = useState(false);
  const pageTitle =
    adminNavGroups
      .flatMap((g) => g.items)
      .filter((i) => (i.exact ? pathname === i.to : pathname.startsWith(i.to)))
      .sort((a, b) => b.to.length - a.to.length)[0]?.label ?? "Dashboard";

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }


  if (!isStaff) {
    return (
      <AdminGate
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
      </AdminGate>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b bg-card/90 px-3 py-2.5 backdrop-blur-md md:px-6">
            <SidebarTrigger />
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold sm:text-base">{pageTitle}</p>
              <p className="hidden truncate text-xs text-muted-foreground sm:block">{user.email}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <ThemeToggle />
              <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
                <Link to="/">Storefront</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Sign out"
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.assign("/admin");
                }}
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </header>
          <main className="min-w-0 flex-1 p-4 md:p-8">
            <div className="rise-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
