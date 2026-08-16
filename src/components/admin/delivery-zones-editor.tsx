import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ShippingZone } from "@/lib/shipping";

/**
 * Visual delivery-zone editor. Administrators configure zones with structured
 * fields instead of raw JSON, satisfying the "never touch JSON" requirement.
 */
export function DeliveryZonesEditor({
  value,
  onChange,
}: {
  value: ShippingZone[];
  onChange: (zones: ShippingZone[]) => void;
}) {
  const [name, setName] = useState("");
  const [fee, setFee] = useState("");
  const [freeOver, setFreeOver] = useState("");
  const [states, setStates] = useState("");
  const [enabled, setEnabled] = useState(true);

  const add = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const zone: ShippingZone = {
      name: trimmedName,
      fee: Number(fee) || 0,
      states: states
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      enabled,
    };
    const parsedFree = Number(freeOver);
    if (freeOver.trim() !== "" && !Number.isNaN(parsedFree)) zone.free_over = parsedFree;
    onChange([...value, zone]);
    setName("");
    setFee("");
    setFreeOver("");
    setStates("");
    setEnabled(true);
  };

  const patch = (index: number, partial: Partial<ShippingZone>) =>
    onChange(value.map((z, i) => (i === index ? { ...z, ...partial } : z)));

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="sm:col-span-2 space-y-4">
      <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Delivery zones</Label>

      {value.length === 0 ? (
        <p className="rounded-md border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
          No zones yet — everyone pays the default flat fee. Add your first zone below.
        </p>
      ) : null}

      {value.length > 0 ? (
        <div className="space-y-3">
          {value.map((zone, index) => (
            <div key={`${zone.name}-${index}`} className="rounded-md border bg-card p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{zone.name || "Untitled zone"}</span>
                  {zone.enabled === false ? (
                    <Badge variant="outline">Inactive</Badge>
                  ) : (
                    <Badge variant="secondary">Active</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Active</span>
                  <Switch
                    aria-label={`${zone.name} active`}
                    checked={zone.enabled !== false}
                    onCheckedChange={(checked) => patch(index, { enabled: checked })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${zone.name}`}
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Zone name</Label>
                  <Input
                    className="mt-1"
                    value={zone.name}
                    onChange={(e) => patch(index, { name: e.target.value })}
                    placeholder="e.g. Lagos Mainland"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Delivery fee (₦)</Label>
                  <Input
                    className="mt-1"
                    type="number"
                    min={0}
                    value={zone.fee}
                    onChange={(e) => patch(index, { fee: Number(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Free delivery over (₦) <span className="font-normal opacity-70">— optional</span>
                  </Label>
                  <Input
                    className="mt-1"
                    type="number"
                    min={0}
                    value={zone.free_over ?? ""}
                    onChange={(e) =>
                      patch(index, { free_over: e.target.value === "" ? undefined : Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="mt-2">
                <Label className="text-xs text-muted-foreground">
                  States / areas covered <span className="font-normal opacity-70">(comma separated)</span>
                </Label>
                <Input
                  className="mt-1"
                  value={zone.states.join(", ")}
                  onChange={(e) =>
                    patch(index, {
                      states: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="rounded-md border border-dashed p-3">
        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Add a zone</Label>
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Zone name (e.g. Abuja)" />
          </div>
          <div>
            <Input value={fee} onChange={(e) => setFee(e.target.value)} type="number" placeholder="Delivery fee (₦)" />
          </div>
          <div>
            <Input
              value={freeOver}
              onChange={(e) => setFreeOver(e.target.value)}
              type="number"
              placeholder="Free over (₦, optional)"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <Input
              value={states}
              onChange={(e) => setStates(e.target.value)}
              placeholder="States/areas covered, e.g. Lagos, Ikeja, Yaba"
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch id="new-zone-active" checked={enabled} onCheckedChange={setEnabled} />
            <Label htmlFor="new-zone-active" className="text-sm">
              Active
            </Label>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={add} disabled={!name.trim()}>
            <Plus className="size-4" /> Add zone
          </Button>
        </div>
      </div>
    </div>
  );
}