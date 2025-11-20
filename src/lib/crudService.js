import { supabase } from './supabaseClient';

export async function listRecords(table, { limit = 1000, orderBy, ascending = true } = {}) {
  let query = supabase.from(table).select('*').limit(limit);
  if (orderBy) {
    query = query.order(orderBy, { ascending });
  }
  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return data;
}

export async function createRecord(table, values) {
  const { data, error } = await supabase.from(table).insert(values).select().single();
  if (error) {
    throw error;
  }
  return data;
}

export async function updateRecord(table, primaryKey, id, values) {
  const { data, error } = await supabase
    .from(table)
    .update(values)
    .eq(primaryKey, id)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
}

export async function deleteRecord(table, primaryKey, id) {
  const { error } = await supabase.from(table).delete().eq(primaryKey, id);
  if (error) {
    throw error;
  }
}
