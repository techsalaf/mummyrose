import { Link } from "@tanstack/react-router";
import { Home, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

/** Dedicated staff sign-in screen shown at /admin when nobody is signed in. */
export function AdminLogin() {
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
          options: { emailRedirectTo: window.location.origin, data: { full_name: "Store administrator" } },
        });
        if (error) throw error;
        const signIn = await supabase.auth.signInWithPassword({ email, password });
        if (signIn.error) throw signIn.error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      // First account in a fresh store automatically becomes the admin.
      await supabase.rpc("claim_admin");
      toast.success("Signed in to the commerce console");
      window.location.replace("/admin");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-muted/30 px-6 py-12">
      <div className="w-full max-w-sm rounded-lg border bg-card p-7 shadow-sm">
        <p className="font-display text-xl font-semibold">Mummy Rose</p>
        <p className="text-xs text-muted-foreground">Commerce console</p>
        <h1 className="mt-6 font-display text-2xl font-semibold">
          {mode === "signin" ? "Staff sign in" : "Create the first admin"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Use your staff email and password to manage the store."
            : "No admin exists yet? Create the owner account — it is granted admin automatically."}
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              minLength={6}
              required
              className="mt-1.5"
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            {mode === "signin" ? "Sign in" : "Create admin account"}
          </Button>
        </form>
        <button
          className="mt-5 text-sm text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "First time? Create the owner account" : "Already have staff access? Sign in"}
        </button>
        <div className="mt-6 border-t pt-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <Home className="size-4" /> Back to storefront
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AdminGate({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{body}</p>
        <div className="mt-6 flex justify-center gap-2">{children}</div>
      </div>
    </div>
  );
}
