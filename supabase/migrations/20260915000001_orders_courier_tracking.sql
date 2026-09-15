-- =============================================================================
-- Mummy Rose: Order Fulfilment, Courier & Waybill Tracking Migration
-- =============================================================================
-- Adds courier name, waybill / tracking number, and dispatch timestamp to orders.
-- Allows Mummy Rose and kitchen staff to record dispatch logistics and provide
-- live tracking details to customers via the tracking page and WhatsApp.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS courier_name text,
  ADD COLUMN IF NOT EXISTS tracking_number text,
  ADD COLUMN IF NOT EXISTS dispatched_at timestamptz;

CREATE INDEX IF NOT EXISTS orders_tracking_idx
  ON public.orders (tracking_number)
  WHERE tracking_number IS NOT NULL;
