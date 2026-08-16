-- =============================================================================
-- Mummy Rose — Production hardening: inventory integrity + audit logging
-- =============================================================================
-- Ships with the code-level changes in:
--   - src/lib/orders.server.ts   (atomic stock decrement, idempotent restore)
--   - src/lib/payments.server.ts (markFailed restores reserved stock)
--
-- Adds an idempotency marker so reserved stock is restored exactly once, even
-- when a payment-failure webhook and a verification callback race each other.

-- 1) Idempotent stock-restoration marker on orders ----------------------------
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS stock_restored boolean NOT NULL DEFAULT false;

-- 2) Operational indexes used by admin filtering / reconciliation -------------
CREATE INDEX IF NOT EXISTS orders_payment_status_idx
  ON public.orders (payment_status, status);
CREATE INDEX IF NOT EXISTS orders_created_idx
  ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS order_items_product_idx
  ON public.order_items (product_id);
CREATE INDEX IF NOT EXISTS payment_transactions_order_idx
  ON public.payment_transactions (order_id);
CREATE INDEX IF NOT EXISTS inventory_logs_product_idx
  ON public.inventory_logs (product_id, created_at DESC);

-- 3) Administrative audit log -------------------------------------------------
-- Records sensitive admin actions (role changes, payment config, refunds,
-- manual inventory adjustments, order status changes). Never store secrets.
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text NOT NULL,
  entity_type text,
  entity_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_audit_logs_created_idx
  ON public.admin_audit_logs (created_at DESC);

-- Only the service role (server-side, RLS-bypassing) and authorized staff can
-- manage/reconcile audit logs. No anon/authenticated INSERT is granted, so a
-- normal customer cannot write fake audit entries.
GRANT SELECT, INSERT ON public.admin_audit_logs TO service_role;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit staff read"
  ON public.admin_audit_logs FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));

ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_audit_logs;

-- 4) Atomic, guarded stock adjustment ----------------------------------------
-- Decrements (negative delta) or restores (positive delta) stock under a row
-- lock and refuses to take stock negative, so concurrent orders can never
-- oversell. Every change is recorded in inventory_logs inside the same
-- transaction, giving a reliable audit trail.
-- Called only by the server (service role) via superset.rpc.
CREATE OR REPLACE FUNCTION public.adjust_product_stock(p_product uuid, p_delta integer, p_reason text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_stock integer;
  prod_name text;
BEGIN
  SELECT name INTO prod_name FROM public.products WHERE id = p_product;
  IF prod_name IS NULL THEN
    RAISE EXCEPTION 'product_not_found';
  END IF;

  SELECT stock_quantity INTO new_stock FROM public.products WHERE id = p_product FOR UPDATE;
  new_stock := new_stock + p_delta;
  IF new_stock < 0 THEN
    RAISE EXCEPTION 'insufficient_stock: % (%)', prod_name, p_product;
  END IF;

  UPDATE public.products
     SET stock_quantity = new_stock, updated_at = now()
   WHERE id = p_product;

  INSERT INTO public.inventory_logs (product_id, change, reason)
  VALUES (p_product, p_delta, p_reason);

  RETURN new_stock;
END;
$$;

REVOKE ALL ON FUNCTION public.adjust_product_stock(uuid, integer, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.adjust_product_stock(uuid, integer, text) TO service_role;