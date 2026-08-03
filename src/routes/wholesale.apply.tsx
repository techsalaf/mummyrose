import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { wholesaleApplicationSchema } from "@/lib/schemas";
import { myWholesaleAccountQuery } from "@/lib/wholesale";

export const Route = createFileRoute("/wholesale/apply")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Apply for a Wholesale Account | Mummy Rose" },
      {
        name: "description",
        content:
          "Apply for Mummy Rose trade pricing. Submit your business details to unlock tiered wholesale discounts, standing orders and account management.",
      },
      { property: "og:title", content: "Apply for a Wholesale Account | Mummy Rose" },
      { property: "og:description", content: "Unlock tiered trade pricing on Nigerian spices, flours and infusions." },
    ],
  }),
  component: WholesaleApply,
});

const FIELDS = [
  { name: "company", label: "Company / business name" },
  { name: "contact_name", label: "Contact name" },
  { name: "email", label: "Business email", type: "email" },
  { name: "phone", label: "Phone number" },
  { name: "country", label: "Country" },
  { name: "monthly_volume", label: "Estimated monthly volume" },
] as const;

function WholesaleApply() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const existing = useQuery(myWholesaleAccountQuery(user?.id));
  const [values, setValues] = useState<Record<string, string>>({ country: "Nigeria" });

  useEffect(() => {
    if (user?.email) setValues((prev) => ({ ...prev, email: prev.email ?? user.email ?? "" }));
  }, [user?.email]);

  const apply = useMutation({
    mutationFn: async () => {
      const parsed = wholesaleApplicationSchema.parse({
        company: values.company ?? "",
        contact_name: values.contact_name ?? "",
        email: values.email ?? "",
        phone: values.phone ?? "",
        country: values.country ?? null,
        monthly_volume: values.monthly_volume ?? null,
        notes: values.notes ?? null,
      });
      const { error } = await supabase.from("wholesale_accounts").insert({
        ...parsed,
        user_id: user?.id ?? null,
        status: "pending",
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Application submitted — we review trade accounts within one business day.");
      void navigate({ to: "/wholesale/portal" });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (loading) {
    return (
      <div className="container-page py-24 text-center">
        <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-page max-w-lg py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Create an account to apply</h1>
        <p className="mt-3 text-muted-foreground">
          Trade accounts are tied to a login so you can reorder at your tier price and track shipments.
        </p>
        <Button className="mt-6" asChild>
          <Link to="/account">Sign in or create an account</Link>
        </Button>
      </div>
    );
  }

  if (existing.data) {
    return (
      <div className="container-page max-w-lg py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">You already have an application</h1>
        <p className="mt-3 text-muted-foreground">
          Your trade account for {existing.data.company} is currently <strong>{existing.data.status}</strong>.
        </p>
        <Button className="mt-6" asChild>
          <Link to="/wholesale/portal">Open your wholesale portal</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page max-w-2xl py-12 md:py-16">
      <p className="eyebrow text-muted-foreground">Wholesale</p>
      <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Apply for trade pricing</h1>
      <p className="mt-3 text-muted-foreground">
        Tell us about your business. Once approved, your discount is applied automatically at checkout.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Business details</CardTitle>
          <CardDescription>All fields except volume and notes are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map((field) => (
              <div key={field.name}>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  className="mt-1.5"
                  type={"type" in field ? field.type : "text"}
                  value={values[field.name] ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <Label htmlFor="notes">Product mix &amp; requirements</Label>
              <Textarea
                id="notes"
                className="mt-1.5"
                rows={4}
                value={values.notes ?? ""}
                onChange={(e) => setValues((prev) => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <Button className="mt-6" size="lg" disabled={apply.isPending} onClick={() => apply.mutate()}>
            {apply.isPending ? <Loader2 className="size-4 animate-spin" /> : null} Submit application
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
