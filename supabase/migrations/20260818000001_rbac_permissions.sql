-- =============================================================================
-- Mummy Rose — Fine-grained RBAC: permissions + role builder
-- =============================================================================
-- Adds a permission catalog and a role -> permissions mapping, plus a
-- `has_permission(user, perm)` check. `has_permission` is called from server
-- functions (service role) and can be layered into RLS per-table later.
--
-- Seeded defaults keep every existing role working out of the box:
--   admin   -> every permission
--   manager -> commerce + operations
--   staff   -> day-to-day orders / inventory
--   customer-> none
--
-- Backward compatibility: server-side `requirePermission` falls back to the
-- coarse staff gate when this schema has not been applied yet.

CREATE TABLE IF NOT EXISTS public.permissions (
  id text PRIMARY KEY,
  "group" text NOT NULL,
  label text NOT NULL,
  description text
);
GRANT SELECT ON public.permissions TO authenticated;
GRANT ALL ON public.permissions TO service_role;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "permissions read"
  ON public.permissions FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role public.app_role NOT NULL,
  permission_id text NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role, permission_id)
);
GRANT SELECT ON public.role_permissions TO authenticated;
GRANT ALL ON public.role_permissions TO service_role;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "role_permissions staff read"
  ON public.role_permissions FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "role_permissions admin manage"
  ON public.role_permissions FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Permission catalog (human-readable; the admin UI never shows raw ids).
INSERT INTO public.permissions (id, "group", label, description) VALUES
  ('orders.view',       'Orders',    'View orders',       'See orders, payments and customer details'),
  ('orders.update',     'Orders',    'Update orders',     'Change fulfilment status and internal notes'),
  ('orders.cancel',     'Orders',    'Cancel orders',     'Cancel unpaid orders and release stock'),
  ('orders.refund',     'Orders',    'Refund orders',     'Refund paid Paystack orders'),
  ('inventory.view',    'Inventory', 'View inventory',    'See stock levels and movement'),
  ('inventory.adjust',  'Inventory', 'Adjust inventory',  'Manually change stock and log adjustments'),
  ('products.view',     'Products',  'View products',     'Browse the product catalogue'),
  ('products.manage',   'Products',  'Manage products',   'Create, edit, price and publish products'),
  ('customers.view',    'Customers', 'View customers',    'See customer accounts and orders'),
  ('customers.manage',  'Customers', 'Manage customers',  'Edit customer details and disable accounts'),
  ('payments.view',     'Payments',  'View payments',     'See the payment ledger and reconcile'),
  ('payments.refund',   'Payments',  'Refund payments',   'Process refunds for paid transactions'),
  ('payments.configure','Payments',  'Configure gateways','Change Paystack/Flutterwave credentials'),
  ('settings.view',     'Settings',  'View settings',     'Read store, delivery and SEO settings'),
  ('settings.edit',     'Settings',  'Edit settings',     'Change store, delivery and SEO settings'),
  ('staff.view',        'Staff',     'View staff',        'See team members and their roles'),
  ('staff.manage',      'Staff',     'Manage staff',      'Grant roles and edit role permissions')
ON CONFLICT (id) DO NOTHING;

-- Default grants.
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin', id FROM public.permissions
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role, permission_id) VALUES
  ('manager', 'orders.view'),
  ('manager', 'orders.update'),
  ('manager', 'orders.cancel'),
  ('manager', 'inventory.view'),
  ('manager', 'inventory.adjust'),
  ('manager', 'products.view'),
  ('manager', 'products.manage'),
  ('manager', 'customers.view'),
  ('manager', 'payments.view'),
  ('manager', 'settings.view'),
  ('manager', 'settings.edit'),
  ('manager', 'staff.view'),
  ('staff', 'orders.view'),
  ('staff', 'orders.update'),
  ('staff', 'inventory.view'),
  ('staff', 'products.view'),
  ('staff', 'customers.view'),
  ('staff', 'payments.view'),
  ('staff', 'settings.view'),
  ('staff', 'staff.view')
ON CONFLICT DO NOTHING;

-- Role check helper (admin implicitly has everything).
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role = ur.role
    WHERE ur.user_id = _user_id AND rp.permission_id = _permission
  ) OR EXISTS (
    SELECT 1 FROM public.user_roles ur2
    WHERE ur2.user_id = _user_id AND ur2.role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.has_permission(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission(uuid, text) TO service_role;

ALTER PUBLICATION supabase_realtime ADD TABLE public.permissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.role_permissions;