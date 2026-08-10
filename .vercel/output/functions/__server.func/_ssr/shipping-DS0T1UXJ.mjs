//#region node_modules/.nitro/vite/services/ssr/assets/shipping-DS0T1UXJ.js
var DEFAULT_SHIPPING = {
	flat_fee: 2500,
	free_over: 5e4,
	international_fee: 25e3
};
function normalise(value) {
	return value.trim().toLowerCase();
}
/** Resolves the delivery zone for a state/country pair. */
function resolveZone(config, state, country) {
	const zones = config.zones ?? [];
	if (normalise(country) !== "nigeria") return {
		name: "International",
		fee: Number(config.international_fee ?? DEFAULT_SHIPPING.international_fee)
	};
	const match = zones.find((z) => z.states.some((s) => normalise(s) === normalise(state)));
	if (match) return {
		name: match.name,
		fee: Number(match.fee)
	};
	return {
		name: "Nationwide",
		fee: Number(config.flat_fee ?? DEFAULT_SHIPPING.flat_fee)
	};
}
/** Zone-aware shipping quote. Free delivery kicks in above the configured threshold (Nigeria only). */
function quoteShipping(config, input) {
	const zone = resolveZone(config, input.state, input.country);
	const freeOver = Number(config.free_over ?? DEFAULT_SHIPPING.free_over);
	const free = normalise(input.country) === "nigeria" && input.subtotal >= freeOver;
	return {
		zone: zone.name,
		fee: free ? 0 : zone.fee,
		free,
		free_over: freeOver
	};
}
//#endregion
export { quoteShipping as n, DEFAULT_SHIPPING as t };
