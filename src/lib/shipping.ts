export type ShippingZone = { name: string; fee: number; states: string[] };

export type ShippingConfig = {
  flat_fee?: number;
  free_over?: number;
  international_fee?: number;
  zones?: ShippingZone[];
};

export const DEFAULT_SHIPPING: Required<Pick<ShippingConfig, "flat_fee" | "free_over" | "international_fee">> = {
  flat_fee: 2500,
  free_over: 50000,
  international_fee: 25000,
};

function normalise(value: string) {
  return value.trim().toLowerCase();
}

/** Resolves the delivery zone for a state/country pair. */
export function resolveZone(config: ShippingConfig, state: string, country: string) {
  const zones = config.zones ?? [];
  if (normalise(country) !== "nigeria") {
    return {
      name: "International",
      fee: Number(config.international_fee ?? DEFAULT_SHIPPING.international_fee),
    };
  }
  const match = zones.find((z) => z.states.some((s) => normalise(s) === normalise(state)));
  if (match) return { name: match.name, fee: Number(match.fee) };
  return { name: "Nationwide", fee: Number(config.flat_fee ?? DEFAULT_SHIPPING.flat_fee) };
}

/** Zone-aware shipping quote. Free delivery kicks in above the configured threshold (Nigeria only). */
export function quoteShipping(
  config: ShippingConfig,
  input: { subtotal: number; state: string; country: string },
) {
  const zone = resolveZone(config, input.state, input.country);
  const freeOver = Number(config.free_over ?? DEFAULT_SHIPPING.free_over);
  const isDomestic = normalise(input.country) === "nigeria";
  const free = isDomestic && input.subtotal >= freeOver;
  return { zone: zone.name, fee: free ? 0 : zone.fee, free, free_over: freeOver };
}
