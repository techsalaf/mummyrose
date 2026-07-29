import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter } from "@/lib/leads.functions";
import { newsletterSchema } from "@/lib/schemas";

export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const subscribe = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setPending(true);
    try {
      await subscribe({ data: parsed.data });
      setEmail("");
      toast.success("You're on the list. Welcome to the family.");
    } catch {
      toast.error("Could not subscribe right now. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md gap-2">
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        aria-label="Email address"
        className={
          tone === "dark"
            ? "border-ink-foreground/25 bg-transparent text-ink-foreground placeholder:text-ink-foreground/40"
            : undefined
        }
      />
      <Button type="submit" disabled={pending} variant={tone === "dark" ? "clay" : "default"}>
        {pending ? "…" : "Join"}
      </Button>
    </form>
  );
}
