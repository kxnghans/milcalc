import { supabase } from "./supabaseClient";
import { Database } from "./types";

export type SyncMetadata = Database["public"]["Tables"]["sync_metadata"]["Row"];

/**
 * Fetches the sync metadata from Supabase to check for data updates.
 * @returns An array of sync metadata objects or null if an error occurs.
 */
export const getSyncMetadata = async (): Promise<SyncMetadata[] | null> => {
  const { data, error } = await supabase
    .from("sync_metadata")
    .select("table_name, last_updated_at");

  if (error) {
    console.error("Error fetching sync metadata:", error);
    return null;
  }

  return data;
};
