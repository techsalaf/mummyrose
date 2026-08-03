import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Crop, Loader2, Save, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/resource-manager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminSettingsQuery } from "@/lib/admin-queries";
import { upsertRow } from "@/lib/admin-mutations";
import { cropImageUrl, deleteMedia, listMedia, uploadBlob, uploadMedia, type MediaFile } from "@/lib/media";
import type { MediaMeta } from "@/lib/site-config";

export const Route = createFileRoute("/admin/media")({
  component: AdminMedia,
});

const mediaQueryKey = ["admin", "media"] as const;

const ASPECTS = [
  { label: "Square 1:1", value: "1" },
  { label: "Landscape 4:3", value: "1.3333" },
  { label: "Wide 16:9", value: "1.7778" },
  { label: "Social card 1200×630", value: "1.9048" },
  { label: "Portrait 3:4", value: "0.75" },
];

function AdminMedia() {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [cropping, setCropping] = useState<MediaFile | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: mediaQueryKey,
    queryFn: () => listMedia("uploads"),
  });
  const { data: settings } = useQuery(adminSettingsQuery);
  const [meta, setMeta] = useState<Record<string, MediaMeta>>({});

  useEffect(() => {
    setMeta((settings?.media_meta ?? {}) as Record<string, MediaMeta>);
  }, [settings]);

  const remove = useMutation({
    mutationFn: (path: string) => deleteMedia(path),
    onSuccess: async () => {
      toast.success("File deleted");
      await queryClient.invalidateQueries({ queryKey: mediaQueryKey });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const saveMeta = useMutation({
    mutationFn: async (next: Record<string, MediaMeta>) =>
      await upsertRow(
        "site_settings",
        { key: "media_meta", value: next, updated_at: new Date().toISOString() },
        "key",
      ),
    onSuccess: async () => {
      toast.success("Image details saved");
      await queryClient.invalidateQueries({ queryKey: adminSettingsQuery.queryKey });
      await queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const patch = (path: string, value: Partial<MediaMeta>) =>
    setMeta((prev) => {
      const base: MediaMeta = prev[path] ?? { alt: "", seo_title: "" };
      return { ...prev, [path]: { ...base, ...value } };
    });



  return (
    <div className="space-y-6">
      <AdminHeader
        title="Image manager"
        description="Upload, crop and describe every image used on the storefront. Alt text and SEO titles are saved with the file and reused wherever it appears."
        actions={
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={async (e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length === 0) return;
                setBusy(true);
                try {
                  for (const file of files) await uploadMedia(file, "uploads");
                  toast.success(`${files.length} file(s) uploaded`);
                  await queryClient.invalidateQueries({ queryKey: mediaQueryKey });
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Upload failed");
                } finally {
                  setBusy(false);
                  if (inputRef.current) inputRef.current.value = "";
                }
              }}
            />
            <Button variant="outline" onClick={() => saveMeta.mutate(meta)} disabled={saveMeta.isPending}>
              {saveMeta.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save
              details
            </Button>
            <Button disabled={busy} onClick={() => inputRef.current?.click()}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} Upload
            </Button>
          </>
        }
      />

      {isLoading ? (
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      ) : error ? (
        <p className="text-sm text-destructive">{(error as Error).message}</p>
      ) : (data ?? []).length === 0 ? (
        <p className="text-sm text-muted-foreground">No uploads yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).map((file) => {
            const entry = meta[file.path] ?? { alt: "", seo_title: "" };
            return (
              <div key={file.path} className="overflow-hidden rounded-lg border bg-card">
                <img
                  src={file.url}
                  alt={entry.alt || file.name}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
                <div className="space-y-2 p-3">
                  <p className="truncate text-xs text-muted-foreground">{file.name}</p>
                  <div>
                    <Label className="text-xs tracking-wide text-muted-foreground uppercase">Alt text</Label>
                    <Input
                      className="mt-1 h-8 text-sm"
                      value={entry.alt}
                      placeholder="Describe the image"
                      onChange={(e) => patch(file.path, { alt: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs tracking-wide text-muted-foreground uppercase">SEO title</Label>
                    <Input
                      className="mt-1 h-8 text-sm"
                      value={entry.seo_title}
                      placeholder="Optional title attribute"
                      onChange={(e) => patch(file.path, { seo_title: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={async () => {
                        await navigator.clipboard.writeText(file.url);
                        toast.success("Link copied");
                      }}
                    >
                      <Copy className="size-3.5" /> Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setCropping(file)}>
                      <Crop className="size-3.5" /> Crop
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => remove.mutate(file.path)} aria-label="Delete">
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CropDialog
        file={cropping}
        onClose={() => setCropping(null)}
        onDone={async () => {
          setCropping(null);
          await queryClient.invalidateQueries({ queryKey: mediaQueryKey });
        }}
      />
    </div>
  );
}

function CropDialog({
  file,
  onClose,
  onDone,
}: {
  file: MediaFile | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const [aspect, setAspect] = useState(ASPECTS[0].value);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [saving, setSaving] = useState(false);

  const ratio = Number(aspect);

  return (
    <Dialog open={Boolean(file)} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Crop image</DialogTitle>
        </DialogHeader>
        {file ? (
          <div className="space-y-4">
            <div
              className="relative overflow-hidden rounded-md border bg-muted"
              style={{ aspectRatio: String(ratio) }}
            >
              <img
                src={file.url}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  transform: `scale(${zoom}) translate(${-offsetX / 2}%, ${-offsetY / 2}%)`,
                }}
              />
            </div>
            <div>
              <Label className="text-xs tracking-wide text-muted-foreground uppercase">Aspect ratio</Label>
              <Select value={aspect} onValueChange={setAspect}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASPECTS.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Control label={`Zoom ${zoom.toFixed(2)}×`} value={zoom} min={1} max={3} step={0.05} onChange={setZoom} />
            <Control label="Horizontal" value={offsetX} min={-50} max={50} step={1} onChange={setOffsetX} />
            <Control label="Vertical" value={offsetY} min={-50} max={50} step={1} onChange={setOffsetY} />
            <Button
              className="w-full"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                try {
                  const blob = await cropImageUrl(file.url, { aspect: ratio, zoom, offsetX, offsetY });
                  await uploadBlob(blob, `cropped-${file.name.replace(/\.[a-z]+$/i, "")}.jpg`);
                  toast.success("Cropped copy added to the library");
                  onDone();
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Crop failed");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Crop className="size-4" />} Save cropped copy
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function Control({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <Label className="text-xs tracking-wide text-muted-foreground uppercase">{label}</Label>
      <Slider
        className="mt-2"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
      />
    </div>
  );
}
