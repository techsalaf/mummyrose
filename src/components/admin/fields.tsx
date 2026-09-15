import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uploadMedia } from "@/lib/media";
import { RichTextEditor } from "@/components/rich-text";

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "switch"
  | "select"
  | "multiselect"
  | "image"
  | "tags"
  | "json"
  | "date";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  placeholder?: string;
  help?: string;
  full?: boolean;
  step?: string;
};

export type FormValues = Record<string, unknown>;

export function toInput(value: unknown, type: FieldType): string {
  if (value == null) return "";
  if (type === "tags") return Array.isArray(value) ? value.join(", ") : String(value);
  if (type === "json") return typeof value === "string" ? value : JSON.stringify(value, null, 2);
  if (type === "date") return String(value).slice(0, 10);
  return String(value);
}

/** Converts raw form state into a database-ready payload. */
export function serialise(fields: FieldDef[], values: FormValues): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    const raw = values[field.name];
    switch (field.type) {
      case "number": {
        const text = String(raw ?? "").trim();
        out[field.name] = text === "" ? null : Number(text);
        break;
      }
      case "switch":
        out[field.name] = Boolean(raw);
        break;
      case "multiselect":
        out[field.name] = Array.isArray(raw) ? raw : [];
        break;
      case "tags":
        out[field.name] = String(raw ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      case "json": {
        const text = String(raw ?? "").trim();
        out[field.name] = text === "" ? {} : JSON.parse(text);
        break;
      }
      case "date": {
        const text = String(raw ?? "").trim();
        out[field.name] = text === "" ? null : new Date(text).toISOString();
        break;
      }
      default: {
        const text = String(raw ?? "").trim();
        out[field.name] = text === "" ? null : text;
      }
    }
  }
  return out;
}

export function ImagePicker({
  value,
  onChange,
  folder = "uploads",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… or upload" />
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
              onChange(await uploadMedia(file, folder));
              toast.success("Image uploaded");
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Upload failed");
            } finally {
              setBusy(false);
              if (inputRef.current) inputRef.current.value = "";
            }
          }}
        />
        <Button type="button" variant="outline" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
        </Button>
      </div>
      {value ? (
        <img src={value} alt="Selected media" className="h-24 w-24 rounded-md border object-cover" loading="lazy" />
      ) : null}
    </div>
  );
}

export function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const id = `field-${field.name}`;
  const text = toInput(value, field.type);

  return (
    <div className={field.full || field.type === "textarea" || field.type === "richtext" ? "sm:col-span-2" : ""}>
      <Label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {field.label}
      </Label>
      <div className="mt-1.5">
        {field.type === "switch" ? (
          <Switch id={id} checked={Boolean(value)} onCheckedChange={onChange} />
        ) : field.type === "select" ? (
          <Select value={text || undefined} onValueChange={onChange}>
            <SelectTrigger id={id}>
              <SelectValue placeholder={field.placeholder ?? "Select"} />
            </SelectTrigger>
            <SelectContent>
              {(field.options ?? []).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : field.type === "multiselect" ? (
          (() => {
            const selected = Array.isArray(value) ? (value as string[]) : [];
            const remainingOptions = (field.options ?? []).filter((opt) => !selected.includes(opt.value));
            return (
              <div className="space-y-2">
                <div className="flex min-h-[38px] flex-wrap items-center gap-1.5 rounded-md border bg-background p-1.5">
                  {selected.length === 0 ? (
                    <span className="text-xs text-muted-foreground px-1">None selected</span>
                  ) : (
                    selected.map((val) => {
                      const opt = field.options?.find((o) => o.value === val);
                      return (
                        <Badge key={val} variant="secondary" className="gap-1 text-xs py-0.5">
                          <span>{opt?.label ?? val}</span>
                          <button
                            type="button"
                            className="rounded-full hover:bg-muted p-0.5"
                            onClick={() => onChange(selected.filter((item) => item !== val))}
                          >
                            <X className="size-3 text-muted-foreground hover:text-foreground" />
                          </button>
                        </Badge>
                      );
                    })
                  )}
                </div>
                {remainingOptions.length > 0 ? (
                  <Select
                    value=""
                    onValueChange={(chosen) => {
                      if (chosen && !selected.includes(chosen)) {
                        onChange([...selected, chosen]);
                      }
                    }}
                  >
                    <SelectTrigger id={id} className="h-9">
                      <SelectValue placeholder={field.placeholder ?? "Add spice/product..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {remainingOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : null}
              </div>
            );
          })()
        ) : field.type === "image" ? (
          <ImagePicker value={text} onChange={onChange} />
        ) : field.type === "textarea" || field.type === "json" ? (
          <Textarea id={id} value={text} rows={4} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
        ) : field.type === "richtext" ? (
          <RichTextEditor id={id} value={text} rows={12} placeholder={field.placeholder} onChange={onChange} />
        ) : (
          <Input
            id={id}
            type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
            step={field.step}
            value={text}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
      {field.help ? <p className="mt-1 text-xs text-muted-foreground">{field.help}</p> : null}
    </div>
  );
}
