import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type OAuthResult = {
  data?: {
    client?: { name?: string; client_id?: string; redirect_uri?: string } | null;
    scope?: string | null;
    redirect_url?: string | null;
    redirect_to?: string | null;
  } | null;
  error?: { message: string } | null;
};

type OAuthNamespace = {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
};

function oauth(): OAuthNamespace {
  return (supabase.auth as unknown as { oauth: OAuthNamespace }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  // Browser-only: the session lives in localStorage, absent during SSR.
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id");
    if (!authorizationId) throw new Error("Missing authorization_id");
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return { needsAuth: true as const, details: null };

    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return { needsAuth: false as const, details: data ?? null, email: sessionData.session.user.email };
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center px-6">
      <h1 className="font-display text-2xl">This connection request can't be loaded</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {String((error as Error)?.message ?? error)}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        Close this window and start the connection again from your AI client.
      </p>
    </div>
  ),
});

function SignInCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Same-origin absolute URL so the user returns to this exact consent request.
  const returnTo = typeof window !== "undefined" ? window.location.href : "/";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: authError } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: returnTo } });
    setBusy(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    window.location.href = returnTo;
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="consent-email">Email</Label>
        <Input
          id="consent-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="consent-password">Password</Label>
        <Input
          id="consent-password"
          type="password"
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy} className="w-full">
        {busy && <Loader2 className="size-4 animate-spin" />}
        {mode === "signin" ? "Sign in to continue" : "Create account & continue"}
      </Button>
      <button
        type="button"
        className="w-full text-center text-sm text-muted-foreground underline"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
      >
        {mode === "signin" ? "I don't have an account yet" : "I already have an account"}
      </button>
    </form>
  );
}

function Consent() {
  const loaderData = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error: decisionError } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (decisionError) {
      setBusy(false);
      setError(decisionError.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect was returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  const clientName = loaderData.details?.client?.name ?? "an app";

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <ShieldCheck className="size-6 text-accent" aria-hidden="true" />
        <h1 className="mt-4 font-display text-2xl">
          {loaderData.needsAuth ? "Sign in to Mummy Rose" : `Connect ${clientName} to your account`}
        </h1>

        {loaderData.needsAuth ? (
          <>
            <p className="mt-2 mb-6 text-sm text-muted-foreground">
              Sign in so we can confirm which account this app should act as.
            </p>
            <SignInCard />
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              This lets {clientName} use Mummy Rose as you — browsing the catalogue, reading your own
              orders and sending enquiries on your behalf.
            </p>
            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Signed in as</dt>
                <dd className="truncate font-medium">{loaderData.email}</dd>
              </div>
              {loaderData.details?.client?.redirect_uri && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Returns to</dt>
                  <dd className="truncate">{loaderData.details.client.redirect_uri}</dd>
                </div>
              )}
              {loaderData.details?.scope && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Shares</dt>
                  <dd className="truncate">Your basic profile and email address</dd>
                </div>
              )}
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              This does not bypass Mummy Rose permissions — it can only reach data your account can
              already see.
            </p>
            {error && (
              <p role="alert" className="mt-4 text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="mt-6 flex gap-3">
              <Button disabled={busy} onClick={() => decide(true)} className="flex-1">
                {busy && <Loader2 className="size-4 animate-spin" />} Approve
              </Button>
              <Button
                variant="outline"
                disabled={busy}
                onClick={() => decide(false)}
                className="flex-1"
              >
                Cancel connection
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
