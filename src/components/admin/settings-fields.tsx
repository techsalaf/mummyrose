import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uploadMedia } from "@/lib/media";
import { GOOGLE_FONTS, type HomePromise } from "@/lib/site-config";

export function SettingLabel({ children }: { children: React.ReactNode }) {
  return <Label className="text-xs tracking-wide text-muted-foreground uppercase">{children}</Label>;
}

/** Upload-or-paste image field used across every CMS setting. */
export function ImageField({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: unknown;
  onChange: (url: string) => void;
  help?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const url = value == null ? "" : String(value);

  return (
    <div className="sm:col-span-2">
      <SettingLabel>{label}</SettingLabel>
      <div className="mt-1.5 flex flex-wrap items-center gap-2">
        <Input
          value={url}
          placeholder="https://… or upload"
          onChange={(e) => onChange(e.target.value)}
          className="min-w-[12rem] flex-1"
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setBusy(true);
            try {
              onChange(await uploadMedia(file, "branding"));
              toast.success("Image uploaded");
            } catch (error) {
              toast.error((error as Error).message);
            } finally {
              setBusy(false);
              if (inputRef.current) inputRef.current.value = "";
            }
          }}
        />
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} Upload
        </Button>
        {url ? (
          <Button type="button" variant="ghost" size="icon" aria-label="Clear image" onClick={() => onChange("")}>
            <X className="size-4" />
          </Button>
        ) : null}
      </div>
      {url ? (
        <img src={url} alt="" className="mt-3 h-20 w-auto rounded-md border border-border object-contain" />
      ) : null}
      {help ? <p className="mt-1 text-xs text-muted-foreground">{help}</p> : null}
    </div>
  );
}

export function ColorField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: unknown;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const raw = value == null ? "" : String(value);
  const swatch = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw) ? raw : "#ffffff";
  return (
    <div>
      <SettingLabel>{label}</SettingLabel>
      <div className="mt-1.5 flex items-center gap-2">
        <input
          type="color"
          value={swatch}
          onChange={(e) => onChange(e.target.value)}
          className="size-9 shrink-0 cursor-pointer rounded-md border border-border bg-background"
          aria-label={`${label} colour picker`}
        />
        <Input value={raw} placeholder={placeholder ?? "theme default"} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

export function FontField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: unknown;
  onChange: (v: string) => void;
}) {
  const current = value == null ? "" : String(value);
  return (
    <div>
      <SettingLabel>{label}</SettingLabel>
      <Select value={current} onValueChange={onChange}>
        <SelectTrigger className="mt-1.5">
          <SelectValue placeholder="Choose a font" />
        </SelectTrigger>
        <SelectContent>
          {GOOGLE_FONTS.map((f) => (
            <SelectItem key={f} value={f}>
              {f}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const ICON_CHOICES = ["leaf", "package", "truck", "shield", "sparkles", "heart"];

/** Editor for the home page trust badges. */
export function PromisesEditor({
  value,
  onChange,
}: {
  value: HomePromise[];
  onChange: (next: HomePromise[]) => void;
}) {
  const items = Array.isArray(value) ? value : [];
  const update = (i: number, patch: Partial<HomePromise>) =>
    onChange(items.map((item, index) => (index === i ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3 sm:col-span-2">
      <SettingLabel>Trust badges</SettingLabel>
      {items.map((item, i) => (
        <div key={i} className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-[8rem_1fr_auto]">
          <Select value={item.icon ?? "leaf"} onValueChange={(v) => update(i, { icon: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ICON_CHOICES.map((icon) => (
                <SelectItem key={icon} value={icon}>
                  {icon}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="space-y-2">
            <Input value={item.title ?? ""} placeholder="Title" onChange={(e) => update(i, { title: e.target.value })} />
            <Textarea
              rows={2}
              value={item.body ?? ""}
              placeholder="Supporting line"
              onChange={(e) => update(i, { body: e.target.value })}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove badge"
            onClick={() => onChange(items.filter((_, index) => index !== i))}
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => onChange([...items, { icon: "leaf", title: "", body: "" }])}
      >
        Add badge
      </Button>
    </div>
  );
}
