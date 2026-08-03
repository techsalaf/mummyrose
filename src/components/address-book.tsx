import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { addressesQuery } from "@/lib/queries";

export type AddressRow = {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
  postal_code: string | null;
  is_default: boolean;
};

const EMPTY = {
  label: "Home",
  full_name: "",
  phone: "",
  address_line: "",
  city: "",
  state: "",
  country: "Nigeria",
  postal_code: "",
  is_default: false,
};

/** Saved delivery addresses for a signed-in shopper. */
export function AddressBook({
  userId,
  onUse,
}: {
  userId: string;
  onUse?: (address: AddressRow) => void;
}) {
  const queryClient = useQueryClient();
  const { data: addresses = [], isLoading } = useQuery(addressesQuery(userId));
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AddressRow | null>(null);
  const [form, setForm] = useState({ ...EMPTY });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["customer_addresses", userId] });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, postal_code: form.postal_code || null, user_id: userId };
      const { error } = editing
        ? await supabase.from("customer_addresses").update(payload).eq("id", editing.id)
        : await supabase.from("customer_addresses").insert(payload);
      if (error) throw new Error(error.message);
      if (payload.is_default) {
        await supabase
          .from("customer_addresses")
          .update({ is_default: false })
          .eq("user_id", userId)
          .neq("id", editing?.id ?? "00000000-0000-0000-0000-000000000000");
      }
    },
    onSuccess: async () => {
      toast.success(editing ? "Address updated" : "Address saved");
      setOpen(false);
      await invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("customer_addresses").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      toast.success("Address removed");
      await invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const openForm = (address: AddressRow | null) => {
    setEditing(address);
    setForm(
      address
        ? {
            label: address.label,
            full_name: address.full_name,
            phone: address.phone,
            address_line: address.address_line,
            city: address.city,
            state: address.state,
            country: address.country,
            postal_code: address.postal_code ?? "",
            is_default: address.is_default,
          }
        : { ...EMPTY },
    );
    setOpen(true);
  };

  const field = (name: keyof typeof EMPTY, label: string, props: Record<string, unknown> = {}) => (
    <div>
      <Label htmlFor={`addr-${name}`}>{label}</Label>
      <Input
        id={`addr-${name}`}
        value={String(form[name] ?? "")}
        onChange={(event) => setForm((prev) => ({ ...prev, [name]: event.target.value }))}
        className="mt-1.5"
        {...props}
      />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl">Address book</h2>
        <Button size="sm" variant="outline" onClick={() => openForm(null)}>
          <Plus className="size-4" /> Add address
        </Button>
      </div>

      {isLoading ? (
        <Loader2 className="mt-6 size-4 animate-spin text-muted-foreground" />
      ) : addresses.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Save an address once and checkout fills itself in next time.
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(addresses as AddressRow[]).map((address) => (
            <div key={address.id} className="surface-card rounded-lg p-4">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-accent" />
                <span className="text-sm font-medium">{address.label}</span>
                {address.is_default ? <Badge variant="secondary">Default</Badge> : null}
              </div>
              <p className="mt-2 text-sm">{address.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {address.address_line}, {address.city}, {address.state}, {address.country}
              </p>
              <p className="text-sm text-muted-foreground">{address.phone}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {onUse ? (
                  <Button size="sm" variant="clay" onClick={() => onUse(address)}>
                    Use this address
                  </Button>
                ) : null}
                <Button size="sm" variant="ghost" onClick={() => openForm(address)} aria-label="Edit address">
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => remove.mutate(address.id)}
                  aria-label="Delete address"
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit address" : "New address"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("label", "Label")}
            {field("full_name", "Full name")}
            {field("phone", "Phone")}
            {field("address_line", "Street address")}
            {field("city", "City")}
            {field("state", "State")}
            {field("country", "Country")}
            {field("postal_code", "Postal code")}
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={form.is_default}
                onChange={(event) => setForm((prev) => ({ ...prev, is_default: event.target.checked }))}
              />
              Use as my default delivery address
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending ? <Loader2 className="size-4 animate-spin" /> : null} Save address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
