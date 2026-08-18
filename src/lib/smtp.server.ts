import nodemailer from "nodemailer";
import { decryptSecret, encryptSecret } from "./secrets.server";

export type SmtpConfig = {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password_cipher: string | null;
  from_email: string;
  from_name: string;
};

export type SmtpPublicConfig = {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  from_email: string;
  from_name: string;
  has_password: boolean;
};

export const SMTP_SETTING_KEY = "smtp";

async function readRaw(): Promise<Record<string, unknown>> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", SMTP_SETTING_KEY)
    .maybeSingle();
  return (data?.value ?? {}) as Record<string, unknown>;
}

/** Public shape — the password is never returned to the browser. */
export async function readSmtpConfig(): Promise<SmtpPublicConfig> {
  const raw = await readRaw();
  return {
    enabled: raw.enabled !== false,
    host: String(raw.host ?? ""),
    port: Number(raw.port ?? 587),
    secure: Boolean(raw.secure),
    username: String(raw.username ?? ""),
    from_email: String(raw.from_email ?? ""),
    from_name: String(raw.from_name ?? "Mummy Rose"),
    has_password: Boolean(raw.password_cipher),
  };
}

/** Fully resolved config (decrypted password) for the server to send with. */
export async function resolveSmtpConfig(): Promise<SmtpConfig | null> {
  const raw = await readRaw();
  const enabled = raw.enabled !== false;
  const host = String(raw.host ?? "").trim();
  if (!enabled || !host) return null;
  const cipher = typeof raw.password_cipher === "string" ? raw.password_cipher : null;
  let password = "";
  if (cipher) {
    try {
      password = decryptSecret(cipher);
    } catch {
      password = "";
    }
  }
  return {
    enabled: true,
    host,
    port: Number(raw.port ?? 587) || 587,
    secure: Boolean(raw.secure),
    username: String(raw.username ?? "").trim(),
    password_cipher: cipher,
    from_email: String(raw.from_email ?? "").trim(),
    from_name: String(raw.from_name ?? "Mummy Rose"),
  };
}

export async function saveSmtpConfig(input: {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  username?: string | null;
  password?: string | null;
  from_email?: string | null;
  from_name?: string | null;
}) {
  const current = await readRaw();
  let passwordCipher = typeof current.password_cipher === "string" ? current.password_cipher : null;
  if (input.password) {
    passwordCipher = encryptSecret(input.password);
    if (!passwordCipher) throw new Error("Could not encrypt the SMTP password.");
  }

  const next = {
    ...current,
    enabled: input.enabled,
    host: input.host.trim(),
    port: Number(input.port) || 587,
    secure: Boolean(input.secure),
    username: (input.username ?? "").trim(),
    password_cipher: passwordCipher,
    from_email: (input.from_email ?? "").trim(),
    from_name: (input.from_name ?? "Mummy Rose").trim(),
  };

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin
    .from("site_settings")
    .upsert({ key: SMTP_SETTING_KEY, value: next, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw new Error(error.message);
  return { ok: true as const, has_password: Boolean(passwordCipher) };
}
/** Sends an email via the configured SMTP server, or falls back to Resend/env. */
export async function sendMail(input: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ ok: boolean; provider: "smtp" | "resend" | "none" }> {
  const config = await resolveSmtpConfig();
  if (config) {
    try {
      const password = config.password_cipher ? decryptSecret(config.password_cipher) : "";
      const from = config.from_email
        ? config.from_name
          ? `"${config.from_name.replace(/"/g, "")}" <${config.from_email}>`
          : config.from_email
        : undefined;
      const transport = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: config.username ? { user: config.username, pass: password } : undefined,
      });
      await transport.sendMail({
        from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
      });
      return { ok: true, provider: "smtp" };
    } catch (err) {
      console.error("[SMTP Error]", err);
      // fall through to the Resend fallback below
    }
  }

  const apiKey = typeof process !== "undefined" ? process.env?.RESEND_API_KEY ?? "" : "";
  if (!apiKey) return { ok: false, provider: "none" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Mummy Rose <orders@mummyrose.com>",
        to: [input.to],
        subject: input.subject,
        html: input.html,
      }),
    });
    return { ok: res.ok, provider: "resend" };
  } catch (err) {
    console.error("[Resend Error]", err);
    return { ok: false, provider: "none" };
  }
}

/** Sends a live test email to prove the configured SMTP settings work. */
export async function testSmtpConnection(to: string): Promise<{ ok: boolean; message: string }> {
  const config = await resolveSmtpConfig();
  if (!config) return { ok: false, message: "SMTP is not configured or disabled." };
  const result = await sendMail({
    to,
    subject: "Mummy Rose — SMTP test",
    html: "<p>This is a test email from the Mummy Rose admin panel. If you can read this, your SMTP settings work.</p>",
    text: "This is a test email from the Mummy Rose admin panel. If you can read this, your SMTP settings work.",
  });
  return result.ok
    ? { ok: true, message: `Test email sent via ${result.provider}.` }
    : { ok: false, message: "Could not send — check your settings or the server logs." };
}