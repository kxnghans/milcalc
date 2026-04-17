import { getSyncMetadata, SYNC_METADATA_QUERY_KEYS } from "@repo/utils";
import { useQueryClient } from "@tanstack/react-query";
import * as SQLite from "expo-sqlite";
import React, { useEffect } from "react";

const SYNC_METADATA_STORAGE_KEY = "last_synced_metadata";
const LAST_SYNC_TIMESTAMP_KEY = "last_sync_timestamp";
const SYNC_TTL_MS = 24 * 60 * 60 * 1000; // 24 Hours

const db = SQLite.openDatabaseSync("milcalc-cache.db");

// Initialize schema immediately to prevent "no such table" errors
db.execSync(
  "CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value TEXT)",
);

// Helper for metadata persistence in SQLite
const getStoredValue = (key: string): string | null => {
  try {
    const result = db.getFirstSync<{ value: string }>(
      "SELECT value FROM cache WHERE key = ?",
      [key],
    );
    return result ? result.value : null;
  } catch (e) {
    console.error(`Error reading ${key} from SQLite:`, e);
    return null;
  }
};

const setStoredValue = (key: string, value: string) => {
  try {
    db.runSync("INSERT OR REPLACE INTO cache (key, value) VALUES (?, ?)", [
      key,
      value,
    ]);
  } catch (e) {
    console.error(`Error saving ${key} to SQLite:`, e);
  }
};

export const SyncManager: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const lastSyncStr = getStoredValue(LAST_SYNC_TIMESTAMP_KEY);
        const lastSync = lastSyncStr ? parseInt(lastSyncStr) : 0;
        const now = Date.now();

        if (now - lastSync < SYNC_TTL_MS) {
          return;
        }

        const cloudMetadata = await getSyncMetadata();
        if (!cloudMetadata) return;

        const storedMetadataStr = getStoredValue(SYNC_METADATA_STORAGE_KEY);
        const storedMetadata: Record<string, string> = storedMetadataStr
          ? (JSON.parse(storedMetadataStr) as Record<string, string>)
          : {};
        let hasUpdates = false;
        const newStoredMetadata: Record<string, string> = { ...storedMetadata };

        for (const entry of cloudMetadata) {
          const tableName = entry.table_name;
          const cloudUpdatedAt = entry.last_updated_at;
          const storedUpdatedAt = storedMetadata[tableName];

          if (
            cloudUpdatedAt &&
            (!storedUpdatedAt ||
              new Date(cloudUpdatedAt) > new Date(storedUpdatedAt))
          ) {
            // Found an update!
            const queryKeys = SYNC_METADATA_QUERY_KEYS[tableName];
            if (queryKeys) {
              queryKeys.forEach((key) =>
                queryClient.invalidateQueries({ queryKey: [key] }),
              );
              hasUpdates = true;
            }
            newStoredMetadata[tableName] = cloudUpdatedAt;
          }
        }

        if (hasUpdates) {
          setStoredValue(
            SYNC_METADATA_STORAGE_KEY,
            JSON.stringify(newStoredMetadata),
          );
        }

        // Update the timestamp even if no data changed, to respect the TTL
        setStoredValue(LAST_SYNC_TIMESTAMP_KEY, now.toString());
      } catch (error) {
        console.error("Error during background sync check:", error);
      }
    };

    // Check for updates on mount
    checkForUpdates();
  }, [queryClient]);

  return <>{children}</>;
};

export default SyncManager;
