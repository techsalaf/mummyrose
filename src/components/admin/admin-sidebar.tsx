import { Link, useRouterState } from "@tanstack/react-router";
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
  Link2,
  MessageSquareQuote,
  Navigation,
  Package,
  Quote,
  Settings,
  ShoppingCart,
  Tag,
  Ticket,
  CreditCard,
  Users,
  GalleryHorizontal,
  ShieldCheck,
  Star,
  MonitorSmartphone,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type Item = { to: string; label: string; icon: typeof Home; exact?: boolean };

export const adminNavGroups: { group: string; items: Item[] }[] = [
  {
    group: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    group: "Commerce",
    items: [
      { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { to: "/admin/payments", label: "Payments & reconciliation", icon: CreditCard },
      { to: "/admin/products", label: "Products", icon: Package },
      { to: "/admin/variants", label: "Variants", icon: Tag },
      { to: "/admin/categories", label: "Categories", icon: Folder },
      { to: "/admin/inventory", label: "Inventory", icon: Boxes },
      { to: "/admin/coupons", label: "Coupons", icon: Ticket },
    ],
  },
  {
    group: "People",
    items: [
      { to: "/admin/customers", label: "Customers", icon: Users },
      { to: "/admin/wholesale", label: "Wholesale", icon: Layers },
      { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
      { to: "/admin/roles", label: "Team & roles", icon: ShieldCheck },
    ],
  },
  {
    group: "Content & CMS",
    items: [
      { to: "/admin/pages", label: "Pages", icon: FileText },
      { to: "/admin/posts", label: "Journal & recipes", icon: FileText },
      { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
      { to: "/admin/faqs", label: "FAQs", icon: MessageSquareQuote },
      { to: "/admin/navigation", label: "Navigation", icon: Navigation },
      { to: "/admin/banners", label: "Banners", icon: GalleryHorizontal },
      { to: "/admin/reviews", label: "Reviews", icon: Star },
      { to: "/admin/media", label: "Image manager", icon: ImageIcon },
      { to: "/admin/preview", label: "Preview & test", icon: MonitorSmartphone },
    ],
  },
  {
    group: "Growth",
    items: [
      { to: "/admin/analytics", label: "Analytics & SEO", icon: BarChart3 },
      { to: "/admin/redirects", label: "Redirects", icon: Link2 },
      { to: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (item: Item) => (item.exact ? pathname === item.to : pathname.startsWith(item.to));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex min-w-0 items-center gap-2 px-1 py-1.5">
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-display text-sm font-semibold">
            MR
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate font-display text-sm font-semibold">Mummy Rose</p>
            <p className="truncate text-[11px] text-sidebar-foreground/60">Commerce console</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {adminNavGroups.map(({ group, items }) => (
          <SidebarGroup key={group}>
            <SidebarGroupLabel>{group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={isActive(item)} tooltip={item.label}>
                      <Link to={item.to}>
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="View storefront">
              <Link to="/">
                <Home className="size-4" />
                <span>View storefront</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
