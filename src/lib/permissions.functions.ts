import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ALL_PERMISSIONS } from "./permissions";

const roleSchema = z.enum(["admin", "manager", "staff", "customer"]);

type RolePermRow = { permission_id: string };
type LooseDb = {
  from: (table: string) => {
    select: (cols: string) => {
      eq: (col: string, val: unknown) => PromiseLike<{
        data: RolePermRow[] | null;
        error: { message: string } | null;
      }>;
    };
    delete: () => { eq: (col: string, val: unknown) => PromiseLike<{ error: { message: string } | null }> };
    insert: (values: unknown) => PromiseLike<{ error: { message: string } | null }>;
  };
};

/** Staff-only: returns the permission ids currently granted to a role. */
export const getRolePermissions = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ role: roleSchema }).parse(data))
  .handler(async ({ data }) => {
    const { requirePermission } = await import("./orders.server");
    await requirePermission("staff.view");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as unknown as LooseDb;
    const { data: rows, error } = await db.from("role_permissions").select("permission_id").eq("role", data.role);
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r) => r.permission_id);
  });

/** Staff-manage only: replaces the permission set for a role. */
export const updateRolePermissions = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        role: roleSchema,
        permission_ids: z.array(z.string().min(3).max(80)).max(60),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { requirePermission, logAudit } = await import("./orders.server");
    const actor = await requirePermission("staff.manage");

    // Only accept ids that exist in the catalog.
    const valid = new Set(ALL_PERMISSIONS.map((p) => p.id));
    const ids = [...new Set(data.permission_ids)].filter((id) => valid.has(id));
    if (ids.length !== data.permission_ids.length) throw new Error("One or more permissions are unknown.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as unknown as LooseDb;
    const { error: delError } = await db.from("role_permissions").delete().eq("role", data.role);
    if (delError) throw new Error(delError.message);
    if (ids.length > 0) {
      const { error: insError } = await db
        .from("role_permissions")
        .insert(ids.map((permission_id) => ({ role: data.role, permission_id })));
      if (insError) throw new Error(insError.message);
    }

    await logAudit(actor, "role_permissions_update", "roles", data.role, {
      role: data.role,
      permissions: ids,
    });
    return { ok: true as const, count: ids.length };
  });