import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressBook } from "@/components/address-book";
import { ChangePasswordCard } from "@/components/profile-security-card";
import { ProfileEditor } from "@/components/profile-editor";

export const Route = createFileRoute("/account")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Your Account - Mummy Rose" },
      { name: "description", content: "Sign in to your Mummy Rose account to track orders and manage details." },
      { property: "og:title", content: "Your Account - Mummy Rose" },
      { property: "og:description", content: "Sign in to manage your Mummy Rose orders." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, isStaff, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: String(form.get("full_name") ?? "").trim() },
          },
        });
        if (error) throw error;
        toast.success("Account created: check your inbox to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="container-page py-24 text-center text-muted-foreground">Loading…</div>;
  }

  if (user) {
    return (
      <div className="container-page max-w-4xl py-16">
        <p className="eyebrow text-accent">Account &amp; Security</p>
        <h1 className="mt-3 font-display text-4xl">Hello{user.email ? `, ${user.email}` : ""}</h1>
        <p className="mt-4 text-muted-foreground">
          Manage your personal details, change your account password, and manage your delivery addresses.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {isStaff ? (
            <Button asChild variant="default" className="gap-2">
              <Link to="/admin">
                <ShieldCheck className="size-4" /> Admin Console
              </Link>
            </Button>
          ) : null}
          <Button asChild variant="clay">
            <Link to="/track-order">Track an order</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/products">Shop products</Link>
          </Button>
          <Button
            variant="ghost"
            onClick={async () => {
              await supabase.auth.signOut();
              toast.success("Signed out");
            }}
          >
            Sign out
          </Button>
        </div>

        <div className="mt-10 space-y-8">
          <ProfileEditor user={user} roleLabel={isStaff ? "Administrator / Staff" : "Customer"} />
          <ChangePasswordCard user={user} />
        </div>

        <div className="mt-14">
          <AddressBook userId={user.id} />
        </div>
      </div>
    );
  }

  return (
    <div className="container-page max-w-md py-16">
      <p className="eyebrow text-accent">Account</p>
      <h1 className="mt-3 font-display text-4xl">{mode === "signin" ? "Sign in" : "Create an account"}</h1>
      <form onSubmit={submit} className="mt-8 space-y-4">
        {mode === "signup" && (
          <div>
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" name="full_name" className="mt-1.5" />
          </div>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={6} className="mt-1.5" />
        </div>
        <Button type="submit" variant="clay" className="w-full" disabled={busy}>
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </Button>
      </form>
      <button
        className="mt-6 text-sm text-muted-foreground underline-offset-4 hover:underline"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
      >
        {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
