import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/resource-manager";
import { Button } from "@/components/ui/button";
import { deleteMedia, listMedia, uploadMedia } from "@/lib/media";

export const Route = createFileRoute("/admin/media")({
  component: AdminMedia,
});

const mediaQueryKey = ["admin", "media"] as const;

function AdminMedia() {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: mediaQueryKey,
    queryFn: () => listMedia("uploads"),
  });

  const remove = useMutation({
    mutationFn: (path: string) => deleteMedia(path),
    onSuccess: async () => {
      toast.success("File deleted");
      await queryClient.invalidateQueries({ queryKey: mediaQueryKey });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Media library"
        description="Upload product and editorial imagery once, then paste the link into any product, category or post."
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
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(data ?? []).map((file) => (
            <div key={file.path} className="overflow-hidden rounded-lg border bg-card">
              <img src={file.url} alt={file.name} className="h-36 w-full object-cover" loading="lazy" />
              <div className="space-y-2 p-3">
                <p className="truncate text-xs text-muted-foreground">{file.name}</p>
                <div className="flex gap-1.5">
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
                  <Button size="sm" variant="ghost" onClick={() => remove.mutate(file.path)} aria-label="Delete">
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
