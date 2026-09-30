import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2, ShieldCheck, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export function ChangePasswordCard({ user }: { user: User }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      return toast.error("Please enter a new password");
    }

    if (newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("New password and confirm password do not match");
    }

    if (currentPassword && newPassword === currentPassword) {
      return toast.error("New password must be different from current password");
    }

    setSaving(true);
    try {
      // If current password provided, verify it first for security
      if (currentPassword && user.email) {
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });

        if (verifyError) {
          throw new Error("Current password is incorrect. Please check and try again.");
        }
      }

      // Update password in Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <KeyRound className="size-5 text-primary" />
          <CardTitle className="text-lg">Change Password</CardTitle>
        </div>
        <CardDescription>
          Keep your account secure by using a strong password with at least 6 characters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNew ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
            Save New Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function ProfileDetailsCard({
  user,
  roleLabel,
}: {
  user: User;
  roleLabel?: string;
}) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchProfile() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (active && data) {
          setFullName(data.full_name ?? "");
          setPhone(data.phone ?? "");
        } else if (active) {
          // Fall back to auth user metadata if profile row not yet populated
          const metaName = (user.user_metadata?.full_name as string) ?? "";
          const metaPhone = (user.phone as string) ?? "";
          setFullName(metaName);
          setPhone(metaPhone);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    void fetchProfile();

    return () => {
      active = false;
    };
  }, [user.id, user.user_metadata, user.phone]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        id: user.id,
        email: user.email,
        full_name: fullName.trim() || null,
        phone: phone.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(payload);

      if (error) throw error;

      // Also update auth user metadata for consistency
      await supabase.auth.updateUser({
        data: { full_name: fullName.trim() },
      });

      toast.success("Profile details updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserIcon className="size-5 text-primary" />
            <CardTitle className="text-lg">Profile Information</CardTitle>
          </div>
          {roleLabel ? (
            <Badge variant="secondary" className="capitalize">
              {roleLabel}
            </Badge>
          ) : null}
        </div>
        <CardDescription>Update your personal details and contact number.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Email address</Label>
              <Input value={user.email ?? ""} disabled className="bg-muted text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Primary login email (cannot be modified directly).</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-fullname">Full name</Label>
              <Input
                id="profile-fullname"
                placeholder="e.g. Mummy Rose"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-phone">Phone number</Label>
              <Input
                id="profile-phone"
                placeholder="e.g. +234 801 234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : null} Save Details
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
