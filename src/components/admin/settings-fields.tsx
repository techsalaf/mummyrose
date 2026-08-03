import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, GripVertical, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uploadMedia } from "@/lib/media";
import {
  GOOGLE_FONTS,
  HOME_SECTIONS,
  SEO_PAGES,
  EMPTY_PAGE_SEO,
  type HomePromise,
  type HomeSectionId,
  type PageSeo,
} from "@/lib/site-config";


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

/* ------------------------------------------------- home section ordering (DnD) */

/**
 * Drag-and-drop ordering for the modular home page blocks. The saved array
 * drives the render order in src/routes/index.tsx.
 */
export function SectionOrderEditor({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: HomeSectionId[]) => void;
}) {
  const [dragging, setDragging] = useState<number | null>(null);
  const known = HOME_SECTIONS.map((s) => s.id);
  const saved = (Array.isArray(value) ? value : []).filter((id): id is HomeSectionId =>
    known.includes(id as HomeSectionId),
  );
  const order: HomeSectionId[] = [...saved, ...known.filter((id) => !saved.includes(id))];

  const move = (from: number, to: number) => {
    if (from === to) return;
    const next = [...order];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-2 sm:col-span-2">
      <SettingLabel>Section order</SettingLabel>
      <p className="text-xs text-muted-foreground">
        Drag to reorder the home page blocks, or use the arrows. The hero always stays first.
      </p>
      <ul className="space-y-1.5">
        {order.map((id, i) => (
          <li
            key={id}
            draggable
            onDragStart={() => setDragging(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragging !== null) move(dragging, i);
              setDragging(null);
            }}
            onDragEnd={() => setDragging(null)}
            className={`flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm ${
              dragging === i ? "opacity-50" : ""
            }`}
          >
            <GripVertical className="size-4 cursor-grab text-muted-foreground" />
            <span className="flex-1">{HOME_SECTIONS.find((s) => s.id === id)?.label ?? id}</span>
            <span className="text-xs text-muted-foreground">{i + 1}</span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Move up"
              disabled={i === 0}
              onClick={() => move(i, i - 1)}
            >
              <ArrowUp className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Move down"
              disabled={i === order.length - 1}
              onClick={() => move(i, i + 1)}
            >
              <ArrowDown className="size-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------- SEO previewing */

/** Google result + social card preview for a title/description/image trio. */
export function SeoPreview({
  url,
  title,
  description,
  image,
  siteName,
}: {
  url: string;
  title: string;
  description: string;
  image?: string;
  siteName: string;
}) {
  const t = title || `${siteName} — page title missing`;
  const d = description || "No meta description set — search engines will invent one.";
  return (
    <div className="grid gap-4 sm:col-span-2 lg:grid-cols-2">
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-2 text-xs tracking-wide text-muted-foreground uppercase">Google result</p>
        <p className="text-xs text-muted-foreground">mummyrose.com{url === "/" ? "" : url}</p>
        <p className="mt-1 line-clamp-1 text-lg text-primary">{t}</p>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{d}</p>
        <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
          <span className={t.length > 60 ? "text-destructive" : ""}>Title {t.length}/60</span>
          <span className={d.length > 160 ? "text-destructive" : ""}>Description {d.length}/160</span>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <p className="px-4 pt-4 text-xs tracking-wide text-muted-foreground uppercase">Social card</p>
        {image ? (
          <img src={image} alt="" className="mt-3 aspect-[1200/630] w-full object-cover" />
        ) : (
          <div className="mt-3 flex aspect-[1200/630] w-full items-center justify-center bg-muted text-xs text-muted-foreground">
            No og:image set
          </div>
        )}
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase">mummyrose.com</p>
          <p className="mt-1 line-clamp-1 text-sm font-medium">{t}</p>
          <p className="line-clamp-2 text-xs text-muted-foreground">{d}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ per-page SEO tab */

export function PageSeoEditor({
  value,
  onChange,
  siteName,
}: {
  value: Record<string, Partial<PageSeo>>;
  onChange: (next: Record<string, Partial<PageSeo>>) => void;
  siteName: string;
}) {
  const [path, setPath] = useState(SEO_PAGES[0].path);
  const current = { ...EMPTY_PAGE_SEO, ...(value[path] ?? {}) };
  const patch = (p: Partial<PageSeo>) => onChange({ ...value, [path]: { ...current, ...p } });

  return (
    <div className="grid gap-4 sm:col-span-2">
      <div>
        <SettingLabel>Page</SettingLabel>
        <Select value={path} onValueChange={setPath}>
          <SelectTrigger className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SEO_PAGES.map((p) => (
              <SelectItem key={p.path} value={p.path}>
                {p.label} — {p.path}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <SettingLabel>Meta title</SettingLabel>
        <Input className="mt-1.5" value={current.title} onChange={(e) => patch({ title: e.target.value })} />
      </div>
      <div>
        <SettingLabel>Meta description</SettingLabel>
        <Textarea
          className="mt-1.5"
          rows={3}
          value={current.description}
          onChange={(e) => patch({ description: e.target.value })}
        />
      </div>
      <div>
        <SettingLabel>Keywords</SettingLabel>
        <Input className="mt-1.5" value={current.keywords} onChange={(e) => patch({ keywords: e.target.value })} />
      </div>
      <ImageField
        label="Social share image (og:image)"
        value={current.og_image}
        onChange={(v) => patch({ og_image: v })}
        help="1200×630. Falls back to the sitewide image when empty."
      />
      <SeoPreview
        url={path}
        title={current.title}
        description={current.description}
        image={current.og_image}
        siteName={siteName}
      />
    </div>
  );
}
