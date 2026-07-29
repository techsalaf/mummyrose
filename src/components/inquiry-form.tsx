import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { submitInquiry } from "@/lib/leads.functions";
import { inquirySchema, type InquiryInput } from "@/lib/schemas";

type Props = {
  type: InquiryInput["type"];
  requirementsLabel?: string;
  submitLabel?: string;
};

const empty = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  requirements: "",
  message: "",
};

export function InquiryForm({ type, requirementsLabel = "Requirements", submitLabel = "Send enquiry" }: Props) {
  const send = useServerFn(submitInquiry);
  const [form, setForm] = useState(empty);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = inquirySchema.safeParse({ ...form, type });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setPending(true);
    try {
      await send({ data: parsed.data });
      setForm(empty);
      setDone(true);
      toast.success("Enquiry received. Our team replies within one business day.");
    } catch {
      toast.error("Could not send your enquiry. Please try again or email hello@mummyrose.com.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="surface-card rounded-lg p-8 text-center">
        <h3 className="font-display text-2xl">Thank you</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your enquiry is with our commercial team. We reply within one business day.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setDone(false)}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="surface-card grid gap-5 rounded-lg p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" required>
          <Input value={form.name} onChange={set("name")} required maxLength={120} />
        </Field>
        <Field label="Company">
          <Input value={form.company} onChange={set("company")} maxLength={160} />
        </Field>
        <Field label="Email" required>
          <Input type="email" value={form.email} onChange={set("email")} required maxLength={255} />
        </Field>
        <Field label="Phone">
          <Input value={form.phone} onChange={set("phone")} maxLength={40} />
        </Field>
      </div>
      <Field label="Country">
        <Input value={form.country} onChange={set("country")} maxLength={80} />
      </Field>
      <Field label={requirementsLabel}>
        <Textarea
          value={form.requirements}
          onChange={set("requirements")}
          rows={3}
          maxLength={2000}
          placeholder="Products, volumes, packaging format, target markets…"
        />
      </Field>
      <Field label="Message">
        <Textarea value={form.message} onChange={set("message")} rows={4} maxLength={4000} />
      </Field>
      <Button type="submit" size="lg" disabled={pending} className="justify-self-start">
        {pending ? "Sending…" : submitLabel}
      </Button>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
        {required && <span className="text-accent"> *</span>}
      </Label>
      {children}
    </div>
  );
}
