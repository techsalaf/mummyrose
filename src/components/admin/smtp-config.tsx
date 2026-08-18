import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { getSmtpConfig, saveSmtpConfig, testSmtpConnection } from "@/lib/smtp.functions";
import { adminSettingsQuery } from "@/lib/admin-queries";

/**
 * SMTP configuration panel. The password is encrypted at rest and never returned
 * to the browser; the input is always blank with a "keep current" placeholder.
 */
export function SmtpConfigCard() {
  const queryClient = useQueryClient();
  const cfg = useQuery({ queryKey: ["smtp-config"], queryFn: getSmtpConfig });
  const [enabled, setEnabled] = useState(true);
  const [host, setHost] = useState("");
  const [port, setPort] = useState("587");
  const [secure, setSecure] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [fromName, setFromName] = useState("");
  const [testTo, setTestTo] = useState("");

  const data = cfg.data;

  const save = useMutation({
    mutationFn: () =>
      saveSmtpConfig({
        data: {
          enabled,
          host,
          port: Number(port) || 587,
          secure,
          username: username || null,
          password: password || null,
          from_email: fromEmail || null,
          from_name: fromName || null,
        },
      }),
    onSuccess: () => {
      toast.success("SMTP settings saved and password encrypted.");
      setPassword("");
      queryClient.invalidateQueries({ queryKey: ["smtp-config"] });
      queryClient.invalidateQueries({ queryKey: adminSettingsQuery.queryKey });
    },
    onError: (error: Error) => toast.error(error.message || "Could not save SMTP settings."),
  });

  const test = useMutation({
    mutationFn: () => {
      const to = testTo.trim();
      if (!to) throw new Error("Enter an email address to send the test to.");
      return testSmtpConnection({ data: { to } });
    },
    onSuccess: (result) => toast[result.ok ? "success" : "error"](result.message),
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">SMTP (email delivery)</CardTitle>
            <CardDescription>
              Send order receipts and admin alerts through your own mail server (Gmail, Zoho, Hostinger, etc.).
            </CardDescription>
          </div>
          {data?.has_password ? (
            <Badge variant="secondary">Password set</Badge>
          ) : (
            <Badge variant="outline">Not configured</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-md border px-3 py-2.5 sm:col-span-2">
          <Label className="text-sm">Send emails with this SMTP server</Label>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        <div className="sm:col-span-2">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">SMTP host</Label>
          <Input
            className="mt-1.5"
            value={host || data?.host || ""}
            placeholder="smtp.gmail.com"
            onChange={(e) => setHost(e.target.value)}
          />
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Port</Label>
          <Input
            className="mt-1.5"
            type="number"
            value={port || String(data?.port ?? "")}
            placeholder="587"
            onChange={(e) => setPort(e.target.value)}
          />
        </div>
        <div className="flex items-end pb-2">
          <div className="flex items-center gap-2 rounded-md border px-3 py-2.5">
            <Switch id="smtp-secure" checked={secure} onCheckedChange={setSecure} />
            <Label htmlFor="smtp-secure" className="text-sm">
              Use TLS (secure connection)
            </Label>
          </div>
        </div>

                <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Username</Label>
          <Input
            className="mt-1.5"
            value={username || data?.username || ""}
            placeholder="you@yourstore.com"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Password</Label>
          <Input
            className="mt-1.5"
            type="password"
            autoComplete="new-password"
            value={password}
            placeholder={data?.has_password ? "••••••••••••  (leave blank to keep current)" : "App password"}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="mt-1 text-xs text-muted-foreground">Encrypted at rest and never shown again after saving.</p>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">From email</Label>
          <Input
            className="mt-1.5"
            value={fromEmail || data?.from_email || ""}
            placeholder="orders@mummyrose.com"
            onChange={(e) => setFromEmail(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">From name</Label>
          <Input
            className="mt-1.5"
            value={fromName || data?.from_name || ""}
            placeholder="Mummy Rose"
            onChange={(e) => setFromName(e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <Button type="button" onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending ? <Loader2 className="size-4 animate-spin" /> : null} Save configuration
          </Button>
        </div>

        <div className="sm:col-span-2 border-t pt-4">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Test delivery</Label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            <Input
              className="max-w-sm"
              type="email"
              value={testTo}
              placeholder="you@example.com"
              onChange={(e) => setTestTo(e.target.value)}
            />
            <Button type="button" variant="outline" onClick={() => test.mutate()} disabled={test.isPending}>
              {test.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Send test email
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}