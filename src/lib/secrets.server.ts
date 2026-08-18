import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

/**
 * Shared secret encryption helpers (AES-256-GCM) used for credentials that the
 * admin configures from the panel (Paystack secret key, SMTP password, ...).
 * The plaintext only ever exists inside server modules — never in the browser,
 * never in HTML, never in audit logs.
 *
 * The encryption key derives from `PAYMENT_ENCRYPTION_KEY` with the
 * service-role env as a fallback so existing deployments keep working.
 */

function configKey(): Buffer {
  const source =
    process.env.PAYMENT_ENCRYPTION_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.PAYSTACK_SECRET_KEY ||
    "mummy-rose-local-dev-key";
  return createHash("sha256").update(source).digest();
}

export function encryptSecret(plain: string): string | null {
  if (!plain) return null;
  const iv = randomBytes(12);
  const key = configKey();
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString("base64");
}

export function decryptSecret(payload: string): string {
  const raw = Buffer.from(payload, "base64");
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const ct = raw.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", configKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
}