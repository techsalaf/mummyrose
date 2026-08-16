import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, PlugZap } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getPaystackConfig,
  savePaystackConfig,
  testPaystackConnection,
} from "@/lib/payments.functions";
import { adminSettingsQuery } from "@/lib/admin-queries";

/**
 * Paystack configuration panel. The secret key is sent to a staff-only server
 * handler that encrypts it at rest; it is never returned to the browser, so the
 * input is always blank and the UI only reveals whether a secret is configured.
 */
export function PaystackConfigCard() {
  const queryClient = useQueryClient();
  const cfg = useQuery({ queryKey: ["paystack-config"], queryFn: getPaystackConfig });
  const [enabled, setEnabled] = useState(true);
  const [mode, setMode] = useState<"test" | "live">("test");
  const [publicKey, setPublicKey] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const save = useMutation({
    mutationFn: () =>
      savePaystackConfig({ data: { enabled, mode, public_key: publicKey || null, secret_key: secretKey || null } }),
    onSuccess: () => {
      toast.success("Paystack configuration saved and encrypted.");
      setSecretKey("");
      queryClient.invalidateQueries({ queryKey: ["paystack-config"] });
      queryClient.invalidateQueries({ queryKey: adminSettingsQuery.queryKey });
    },
    onError: (error: Error) => toast.error(error.message || "Could not save Paystack configuration."),
  });

  const test = useMutation({
    mutationFn: () => testPaystackConnection(),
    onSuccess: (result) => toast[result.ok ? "success" : "error"](result.message),
    onError: (error: Error) => toast.error(error.message),
  });

  const data = cfg.data;

  return (
    <div className="sm:col-span-2">
      <Card className="mt-4">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Paystack</CardTitle>
              <CardDescription>Accept cards, transfers and USSD with Nigeria&apos;s leading gateway.</CardDescription>
            </div>
            {data?.has_secret ? (
              <Badge variant="secondary">Secret key configured</Badge>
            ) : (
              <Badge variant="outline">Not configured</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-md border px-3 py-2.5 sm:col-span-2">
            <Label className="text-sm">Enable Paystack at checkout</Label>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <div className="sm:col-span-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Mode</Label>
            <Select
              value={mode}
              onValueChange={(v) => setMode(v === "live" ? "live" : "test")}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="test">Test mode</SelectItem>
                <SelectItem value="live">Live mode</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-muted-foreground">
              Use test keys for testing and live keys when you&apos;re ready to take real payments.
            </p>
          </div>

          <div className="sm:col-span-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Public key</Label>
            <Input
              className="mt-1.5"
              value={publicKey || data?.public_key || ""}
              placeholder="pk_live_…"
              onChange={(e) => setPublicKey(e.target.value)}
            />
            <p className="mt-1 text-xs text-muted-foreground">Used to open the Paystack payment popup. Safe to store.</p>
          </div>

          <div className="sm:col-span-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Secret key</Label>
            <Input
              className="mt-1.5"
              type="password"
              autoComplete="new-password"
              value={secretKey}
              placeholder={data?.has_secret ? "••••••••••••••••  (leave blank to keep current)" : "sk_live_…"}
              onChange={(e) => setSecretKey(e.target.value)}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Encrypted at rest and never shown again after saving. Only use a <em>secret</em> key here — never commit it
              to code.
            </p>
          </div>

          <div className="sm:col-span-2 flex flex-wrap gap-2">
            <Button type="button" onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending ? <Loader2 className="size-4 animate-spin" /> : null} Save configuration
            </Button>
            <Button type="button" variant="outline" onClick={() => test.mutate()} disabled={test.isPending}>
              {test.isPending ? <Loader2 className="size-4 animate-spin" /> : <PlugZap className="size-4" />}
              Test connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}