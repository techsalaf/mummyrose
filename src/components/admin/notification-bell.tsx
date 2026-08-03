import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { adminNotificationsQuery, useAdminRealtime } from "@/lib/admin-queries";

/** Bell in the admin header with live order / inquiry / review notifications. */
export function NotificationBell() {
  const queryClient = useQueryClient();
  const { data: items = [] } = useQuery(adminNotificationsQuery);
  useAdminRealtime(["admin_notifications"], [["admin", "notifications"]]);

  const unread = items.filter((item) => !item.is_read);

  const markAll = async () => {
    if (unread.length === 0) return;
    await supabase
      .from("admin_notifications")
      .update({ is_read: true })
      .in(
        "id",
        unread.map((item) => item.id),
      );
    await queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-4" />
          {unread.length > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
              {unread.length > 9 ? "9+" : unread.length}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <p className="text-sm font-medium">Notifications</p>
          <Button variant="ghost" size="sm" onClick={markAll} disabled={unread.length === 0}>
            <CheckCheck className="size-4" /> Mark all read
          </Button>
        </div>
        <ScrollArea className="max-h-80">
          {items.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">You're all caught up.</p>
          ) : (
            <ul className="divide-y">
              {items.map((item) => (
                <li key={item.id} className={item.is_read ? "opacity-60" : ""}>
                  <Link
                    to={item.href ?? "/admin"}
                    className="block px-3 py-2.5 transition-colors hover:bg-muted/60"
                  >
                    <p className="text-sm font-medium">{item.title}</p>
                    {item.body ? <p className="text-xs text-muted-foreground">{item.body}</p> : null}
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
