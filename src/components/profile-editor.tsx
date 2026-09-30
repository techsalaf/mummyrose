import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Mail, Phone, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  full_name: z.string().trim().max(100, "Name is too long"),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long")
    .regex(/^[+\d\s()-]*$/, "Use digits, spaces, + or - only"),
  email: z.string().trim().email("Enter a valid email").max(255),
});

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

function initials(name: string, email: string) {
  const src = name || email;
  return src
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/** Editable profile card: photo, name, phone, email. Shared by customers and admins. */
export function ProfileEditor({ user, roleLabel }: { user: User; roleLabel?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [form, setForm] = useState({ full_name: "", phone: "", email: user.email ?? "" });

  useEffect(() => {
    let active = true;
    supabase
      .from("profiles")
      .select("full_name, phone, email, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setForm({
          full_name: data?.full_name ?? (user.user_metadata?.full_name as string) ?? "",
          phone: data?.phone ?? "",
          email: user.email ?? data?.email ?? "",
        });
        setAvatar(data?.avatar_url ?? "");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5 MB");
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data, error: signErr } = await supabase.storage.from("avatars").createSignedUrl(path, TEN_YEARS);
      if (signErr || !data) throw signErr ?? new Error("Could not create image link");
      const { error: saveErr } = await supabase
        .from("profiles")
        .upsert({ id: user.id, avatar_url: data.signedUrl }, { onConflict: "id" });
      if (saveErr) throw saveErr;
      setAvatar(data.signedUrl);
      toast.success("Photo updated");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setSaving(true);
    try {
      const { full_name, phone, email } = parsed.data;
      const emailChanged = email.toLowerCase() !== (user.email ?? "").toLowerCase();
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, full_name, phone: phone || null }, { onConflict: "id" });
      if (error) throw error;
      const { error: authErr } = await supabase.auth.updateUser({
        data: { full_name },
        ...(emailChanged ? { email } : {}),
      });
      if (authErr) throw authErr;
      toast.success(
        emailChanged ? "Saved — check both inboxes to confirm your new email." : "Profile saved",
      );
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-border bg-card p-12 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={save} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-primary/15 via-secondary/40 to-accent/15 px-6 pt-8 pb-14" />
      <div className="-mt-12 px-6 pb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="relative">
            <Avatar className="size-24 border-4 border-card shadow-md">
              <AvatarImage src={avatar || undefined} alt={form.full_name || "Profile photo"} className="object-cover" />
              <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                {initials(form.full_name, form.email)}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              aria-label="Change profile photo"
              className="absolute -right-1 -bottom-1 flex size-9 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow transition hover:scale-105"
            >
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
            />
          </div>
          <div className="pb-1">
            <p className="font-display text-2xl">{form.full_name || "Your profile"}</p>
            <p className="text-sm text-muted-foreground">
              {roleLabel ? `${roleLabel} · ` : ""}
              {user.email}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="pf-name">Full name</Label>
            <div className="relative mt-1.5">
              <UserIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="pf-name"
                className="pl-9"
                value={form.full_name}
                maxLength={100}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="pf-phone">Phone number</Label>
            <div className="relative mt-1.5">
              <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="pf-phone"
                type="tel"
                className="pl-9"
                placeholder="+234 800 000 0000"
                value={form.phone}
                maxLength={20}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="pf-email">Email</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="pf-email"
                type="email"
                className="pl-9"
                value={form.email}
                maxLength={255}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Changing it sends a confirmation link.</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" variant="clay" disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : null} Save changes
          </Button>
        </div>
      </div>
    </form>
  );
}
