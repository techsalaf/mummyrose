import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Staff-settings.view: read the SMTP configuration (never returns the password). */
export const getSmtpConfig = createServerFn({ method: "GET" }).handler(async () => {
  const { requirePermission } = await import("./orders.server");
  await requirePermission("settings.view");
  const { readSmtpConfig } = await import("./smtp.server");
  return await readSmtpConfig();
});

/** Staff-settings.edit: persist the SMTP configuration (password encrypted at rest). */
export const saveSmtpConfig = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        enabled: z.boolean(),
        host: z.string().trim().max(200),
        port: z.number().int().min(1).max(65535),
        secure: z.boolean(),
        username: z.string().trim().max(200).optional().nullable(),
        password: z.string().trim().max(500).optional().nullable(),
        from_email: z.string().trim().email().max(255).optional().nullable(),
        from_name: z.string().trim().max(120).optional().nullable(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { requirePermission, logAudit } = await import("./orders.server");
    const actor = await requirePermission("settings.edit");
    const { saveSmtpConfig: saveServer } = await import("./smtp.server");
    const result = await saveServer(data);
    await logAudit(actor, "smtp_config_update", "settings", "smtp", {
      enabled: data.enabled,
      host: data.host,
      port: data.port,
      password_changed: Boolean(data.password),
    });
    return result;
  });

/** Staff-settings.edit: send a live test email through the configured SMTP server. */
export const testSmtpConnection = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ to: z.string().trim().email().max(255) }).parse(data))
  .handler(async ({ data }) => {
    const { requirePermission } = await import("./orders.server");
    await requirePermission("settings.edit");
    const { testSmtpConnection: testServer } = await import("./smtp.server");
    return await testServer(data.to);
  });