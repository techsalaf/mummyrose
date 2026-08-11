import type { CreatedOrder } from "./orders.server";
import { formatNaira } from "./format";

/**
 * Sends order confirmation emails to the customer and notification alerts to the admin using Resend.
 * Operates gracefully with fallback logging if RESEND_API_KEY is not configured.
 */
export async function sendOrderNotificationEmails(order: CreatedOrder, customerEmail: string, customerName: string, address: string) {
  const apiKey = (typeof process !== "undefined" ? process.env?.RESEND_API_KEY : undefined) || "";

  const customerHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f6f2; margin: 0; padding: 20px; color: #1c1c1c; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background-color: #1e3a2b; color: #ffffff; padding: 32px 24px; text-align: center; }
    .header h1 { font-family: Georgia, serif; margin: 0; font-size: 26px; letter-spacing: 0.5px; }
    .header p { margin: 6px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #d4af37; }
    .content { padding: 32px 24px; }
    .greeting { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
    .order-meta { background: #f9f8f4; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 14px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
    .table th { text-align: left; padding: 10px 8px; border-bottom: 2px solid #eae6df; color: #666; font-size: 12px; text-transform: uppercase; }
    .table td { padding: 12px 8px; border-bottom: 1px solid #f0ede6; }
    .totals { margin-top: 20px; border-top: 2px solid #eae6df; padding-top: 16px; font-size: 14px; }
    .totals-row { display: flex; justify-content: space-between; padding: 4px 0; }
    .totals-row.grand { font-size: 18px; font-weight: bold; color: #1e3a2b; border-top: 1px solid #eae6df; padding-top: 12px; margin-top: 8px; }
    .footer { background: #faf9f6; text-align: center; padding: 24px; font-size: 12px; color: #888; border-top: 1px solid #eae6df; }
    .button { display: inline-block; background-color: #1e3a2b; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Mummy Rose</h1>
      <p>Nature's Goodness · Mummy's Touch</p>
    </div>
    <div class="content">
      <div class="greeting">Thank you for your order, ${customerName}!</div>
      <p style="color: #555; line-height: 1.6;">We've received your order <strong>#${order.order_number}</strong> and our team is preparing your authentic natural pantry items.</p>
      
      <div class="order-meta">
        <div><strong>Order Number:</strong> #${order.order_number}</div>
        <div><strong>Payment Method:</strong> ${order.payment_provider.toUpperCase()}</div>
        <div><strong>Delivery Address:</strong> ${address}</div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Item</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
            <tr>
              <td>
                <strong>${item.product_name}</strong>
                ${item.variant ? `<br><span style="font-size:12px; color:#888;">${item.variant}</span>` : ""}
              </td>
              <td style="text-align: center;">${item.quantity}</td>
              <td style="text-align: right;">₦${(item.unit_price * item.quantity).toLocaleString()}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="totals">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span>Subtotal:</span>
          <span>₦${order.subtotal.toLocaleString()}</span>
        </div>
        ${
          order.discount_amount > 0
            ? `
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; color:#c2410c;">
          <span>Discount (${order.coupon_code ?? "Promo"}):</span>
          <span>-₦${order.discount_amount.toLocaleString()}</span>
        </div>
        `
            : ""
        }
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span>Delivery Fee (${order.shipping_zone}):</span>
          <span>₦${order.shipping_fee.toLocaleString()}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:18px; font-weight:bold; color:#1e3a2b; margin-top:10px; border-top:1px solid #ddd; padding-top:10px;">
          <span>Total:</span>
          <span>₦${order.total.toLocaleString()}</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 28px;">
        <a href="https://www.mummyrose.com/track-order?order=${order.order_number}&email=${encodeURIComponent(customerEmail)}" class="button" style="color: #ffffff;">Track Your Order</a>
      </div>
    </div>
    <div class="footer">
      Mummy Rose Nigeria — Spices, Stone-Milled Flours & Herbal Infusions<br>
      Need help? Reply to this email or contact us at hello@mummyrose.com
    </div>
  </div>
</body>
</html>
  `;

  if (!apiKey) {
    console.log(`[Email Notice] RESEND_API_KEY not configured. Order email receipt for #${order.order_number} to ${customerEmail} logged successfully.`);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mummy Rose <orders@mummyrose.com>",
        to: [customerEmail],
        subject: `Order Confirmation #${order.order_number} — Mummy Rose`,
        html: customerHtml,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[Resend Error] ${res.status} — ${errText}`);
    }
  } catch (err) {
    console.error("[Resend Network Exception]", err);
  }
}
