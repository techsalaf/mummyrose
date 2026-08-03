import { supabase } from "@/integrations/supabase/client";

type Row = Record<string, unknown>;
type Result = { error: { message: string } | null };

type LooseClient = {
  from: (table: string) => {
    insert: (values: Row) => PromiseLike<Result>;
    update: (values: Row) => { eq: (column: string, value: string) => PromiseLike<Result> };
    delete: () => { eq: (column: string, value: string) => PromiseLike<Result> };
    upsert: (values: Row, options?: { onConflict: string }) => PromiseLike<Result>;
  };
};

function db(): LooseClient {
  return supabase as unknown as LooseClient;
}

/** Inserts or updates a single admin-managed row. */
export async function saveRow(table: string, values: Row, id?: string | null) {
  const result = id ? await db().from(table).update(values).eq("id", id) : await db().from(table).insert(values);
  if (result.error) throw new Error(result.error.message);
}

export async function deleteRow(table: string, id: string) {
  const { error } = await db().from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function upsertRow(table: string, values: Row, onConflict: string) {
  const { error } = await db().from(table).upsert(values, { onConflict });
  if (error) throw new Error(error.message);
}
