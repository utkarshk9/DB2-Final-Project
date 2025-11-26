/**
 * CRUD Service Module
 * Centralized wrappers for Create, Read, Update, and Delete operations
 * against the Supabase backend. 
 */

//Importing necessary modules
import { supabase } from "./supabaseClient";

/**
 * Retrieve records from a table with optional ordering and limits.
 * @param {string} table - Table or view name.
 * @param {Object} [options={}] - Optional query configuration.
 * @param {number} [options.limit=1000] - Maximum number of rows to return, defaulted to 1000.
 * @param {string} [options.orderBy] - Column name to sort by.
 * @param {boolean} [options.ascending=true] - Controls sort direction, defaulted to true (ascending).
 */
export async function listRecords(
  table,
  { limit = 1000, orderBy, ascending = true } = {}
) {
  // Constructing the query
  let query = supabase.from(table).select("*").limit(limit);
  // If orderBy is specified, add ordering to the query
  if (orderBy) {
    query = query.order(orderBy, { ascending });
  }
  // Executing the query
  const { data, error } = await query;
  // Handling errors
  if (error) {
    throw error;
  }
  // Returning the fetched data
  return data;
}

/**
 * Create a new record in a specified table.
 * @param {string} table - The name of the table to insert the record into.
 * @param {Object} values - The values to insert as the new record.
 * @returns {Promise<Object>} - A promise that resolves to the created record.
 */
export async function createRecord(table, values) {
  // Validating input and attempting to insert the new record
  const { data, error } = await supabase
    .from(table)
    .insert(values)
    .select()
    .single();

  // Handling errors
  if (error) {
    throw error;
  }
  // Returning the created record
  return data;
}

 
/**
 * Update a single record by primary key
 * @param {string} table - The name of the table to query.
 * @param {string} primaryKey - The name of the primary key column.
 * @param {string|number} id - The value of the primary key to match.
 * @param {Object} values - The new values to update the record with.
 * @returns {Promise<Object>} - A promise that resolves to the updated record, or null if not found.
 */
export async function updateRecord(table, primaryKey, id, values) {
  // Validating input and attempting to update the record
  const { data, error } = await supabase
    .from(table)
    .update(values)
    // Matching the record by primary key of X id
    .eq(primaryKey, id)
    .select()
    // Returning a single record
    .single();
  if (error) {
    throw error;
  }
  // Returning the updated record
  return data;
}

/**
 * Delete a single record by primary key
 * @param {string} table - The name of the table to query.
 * @param {string} primaryKey - The name of the primary key column.
 * @param {string|number} id - The value of the primary key to match.
 */
export async function deleteRecord(table, primaryKey, id) {
  // Attempting to delete the record with the primary key of X id
  const { error } = await supabase.from(table).delete().eq(primaryKey, id);
  // Handling errors
  if (error) {
    throw error;
  }
}
