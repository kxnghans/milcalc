import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as SQLite from 'expo-sqlite';
import { getSyncMetadata, SYNC_METADATA_QUERY_KEYS } from '@repo/utils';

const SYNC_METADATA_STORAGE_KEY = 'last_synced_metadata';
const db = SQLite.openDatabaseSync("milcalc-cache.db");

// Initialize schema immediately to prevent "no such table" errors
db.execSync("CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value TEXT)");

// Helper for metadata persistence in SQLite
const getStoredMetadata = (): Record<string, string> => {
  try {
    const result = db.getFirstSync<{ value: string }>(
      "SELECT value FROM cache WHERE key = ?",
      [SYNC_METADATA_STORAGE_KEY]
    );
    return result ? JSON.parse(result.value) : {};
  } catch (e) {
    console.error("Error reading stored metadata from SQLite:", e);
    return {};
  }
};

const setStoredMetadata = (metadata: Record<string, string>) => {
  try {
    db.runSync(
      "INSERT OR REPLACE INTO cache (key, value) VALUES (?, ?)",
      [SYNC_METADATA_STORAGE_KEY, JSON.stringify(metadata)]
    );
  } catch (e) {
    console.error("Error saving stored metadata to SQLite:", e);
  }
};

export const SyncManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const cloudMetadata = await getSyncMetadata();
        if (!cloudMetadata) return;

        const storedMetadata = getStoredMetadata();
        let hasUpdates = false;
        const newStoredMetadata = { ...storedMetadata };

        for (const entry of cloudMetadata) {
          const tableName = entry.table_name;
          const cloudUpdatedAt = entry.last_updated_at;
          const storedUpdatedAt = storedMetadata[tableName];

          if (cloudUpdatedAt && (!storedUpdatedAt || new Date(cloudUpdatedAt) > new Date(storedUpdatedAt))) {
            // Found an update!
            const queryKeys = SYNC_METADATA_QUERY_KEYS[tableName];
            if (queryKeys) {
              console.log(`Invalidating query keys for table: ${tableName}`);
              queryKeys.forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
              hasUpdates = true;
            }
            newStoredMetadata[tableName] = cloudUpdatedAt;
          }
        }

        if (hasUpdates) {
          setStoredMetadata(newStoredMetadata);
        }
      } catch (error) {
        console.error('Error during background sync check:', error);
      }
    };

    // Check for updates on mount
    checkForUpdates();
  }, [queryClient]);

  return <>{children}</>;
};

export default SyncManager;
