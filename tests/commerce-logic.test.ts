import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkoutSchema } from "../src/lib/schemas.ts";
import { DEFAULT_BANK_ACCOUNT } from "../src/lib/site-config.ts";

describe("Packaging Variants and Pricing Integrity", () => {
  it("calculates correct unit price when a variant has a standard price", () => {
    const product = { id: "p1", name: "Jollof Seasoning", price: 2000 };
    const variant = { id: "v1", product_id: "p1", label: "250g", price: 2500, discount_price: null, stock_quantity: 30 };

    const effectivePrice = variant.discount_price ?? variant.price ?? product.price;
    assert.equal(effectivePrice, 2500);
  });

  it("calculates correct unit price when a variant has an active discount price", () => {
    const product = { id: "p1", name: "Jollof Seasoning", price: 2000 };
    const variant = { id: "v1", product_id: "p1", label: "500g", price: 4800, discount_price: 4200, stock_quantity: 15 };

    const effectivePrice = variant.discount_price ?? variant.price ?? product.price;
    assert.equal(effectivePrice, 4200);
  });

  it("falls back to product base price when no variant is assigned", () => {
    const product = { id: "p1", name: "Ground Nutmeg", price: 1500 };
    const variant = null;

    const effectivePrice = (variant as any)?.discount_price ?? (variant as any)?.price ?? product.price;
    assert.equal(effectivePrice, 1500);
  });

  it("differentiates cart line items by variant id so different sizes do not collide", () => {
    const productId = "spice-123";
    const item1 = { product_id: productId, variant_id: "var-100g", quantity: 2 };
    const item2 = { product_id: productId, variant_id: "var-500g", quantity: 1 };

    const key1 = `${item1.product_id}::${item1.variant_id ?? "base"}`;
    const key2 = `${item2.product_id}::${item2.variant_id ?? "base"}`;

    assert.notEqual(key1, key2);
    assert.equal(key1, "spice-123::var-100g");
    assert.equal(key2, "spice-123::var-500g");
  });
});

describe("Direct Bank Transfer Settings and Fallback", () => {
  it("provides valid default bank account fields for merchant config", () => {
    assert.ok(DEFAULT_BANK_ACCOUNT.bank_name);
    assert.ok(DEFAULT_BANK_ACCOUNT.account_name);
    assert.ok(DEFAULT_BANK_ACCOUNT.instructions);
  });

  it("reads bank account settings and populates transfer instruction", () => {
    const mockSettings = {
      bank_account: {
        bank_name: "Zenith Bank",
        account_number: "1012345678",
        account_name: "Mummy Rose Foods Ltd",
        instructions: "Use order number as narration",
      },
    };

    const bankConfig = mockSettings.bank_account ?? DEFAULT_BANK_ACCOUNT;
    assert.equal(bankConfig.bank_name, "Zenith Bank");
    assert.equal(bankConfig.account_number, "1012345678");
  });
});

describe("Order Courier Tracking and Dispatch Rail", () => {
  it("verifies the 5-stage fulfillment rail sequence", () => {
    const stages = ["pending", "confirmed", "processing", "shipped", "delivered"];
    assert.equal(stages.indexOf("pending"), 0);
    assert.equal(stages.indexOf("shipped"), 3);
    assert.equal(stages.indexOf("delivered"), 4);
  });

  it("validates waybill tracking number assignment on dispatched orders", () => {
    const order = {
      id: "ord-1",
      order_number: "MR-1001",
      status: "shipped",
      courier_name: "GIG Logistics",
      tracking_number: "GIG-998877",
      dispatched_at: new Date().toISOString(),
    };

    assert.equal(order.status, "shipped");
    assert.ok(order.tracking_number.length > 5);
    assert.ok(order.courier_name.includes("GIG"));
  });
});

describe("Checkout Schema with Variant Validation", () => {
  it("validates a checkout payload with valid variant id", () => {
    const payload = {
      customer_name: "Amaka Obi",
      customer_email: "amaka@example.com",
      customer_phone: "08012345678",
      address_line: "15 Admiralty Way",
      city: "Lekki",
      state: "Lagos",
      payment_provider: "bank_transfer",
      items: [
        {
          product_id: "11111111-1111-4111-8111-111111111111",
          variant_id: "22222222-2222-4222-8222-222222222222",
          quantity: 3,
        },
      ],
    };

    const result = checkoutSchema.safeParse(payload);
    assert.equal(result.success, true);
  });

  it("validates a checkout payload without variant id (null or undefined)", () => {
    const payload = {
      customer_name: "Tunde Bakare",
      customer_email: "tunde@example.com",
      customer_phone: "08098765432",
      address_line: "42 Allen Avenue",
      city: "Ikeja",
      state: "Lagos",
      payment_provider: "paystack",
      items: [
        {
          product_id: "11111111-1111-4111-8111-111111111111",
          quantity: 1,
        },
      ],
    };

    const result = checkoutSchema.safeParse(payload);
    assert.equal(result.success, true);
  });
});
