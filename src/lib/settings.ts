import type { ShippingConfig } from "./shipping";

export type StoreConfig = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  currency?: string;
};

export type PaymentsConfig = {
  paystack_enabled?: boolean;
  flutterwave_enabled?: boolean;
  bank_transfer_enabled?: boolean;
  pay_on_delivery_enabled?: boolean;
  bank_name?: string;
  account_name?: string;
  account_number?: string;
};

export type WhatsAppConfig = {
  enabled?: boolean;
  phone?: string;
};

export type SeoConfig = {
  title?: string;
  description?: string;
  keywords?: string;
};

export type SettingsMap = Record<string, Record<string, unknown>>;

export const SETTINGS_KEYS = ["store", "shipping", "payments", "whatsapp", "seo"] as const;
export type SettingsKey = (typeof SETTINGS_KEYS)[number];

export function pickStore(map: SettingsMap | undefined): StoreConfig {
  return (map?.store ?? {}) as StoreConfig;
}
export function pickShipping(map: SettingsMap | undefined): ShippingConfig {
  return (map?.shipping ?? {}) as ShippingConfig;
}
export function pickPayments(map: SettingsMap | undefined): PaymentsConfig {
  return (map?.payments ?? {}) as PaymentsConfig;
}
export function pickWhatsApp(map: SettingsMap | undefined): WhatsAppConfig {
  return (map?.whatsapp ?? {}) as WhatsAppConfig;
}
export function pickSeo(map: SettingsMap | undefined): SeoConfig {
  return (map?.seo ?? {}) as SeoConfig;
}
