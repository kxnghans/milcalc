import { Slot } from "expo-router";
import { ThemeProvider, BottomSheet } from "@repo/ui";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import * as SQLite from "expo-sqlite";
import { SyncManager } from "../components/SyncManager";
import { OverlayProvider, useOverlay } from "../contexts/OverlayContext";
import { MainOverlay } from "../components/MainOverlay";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DetailModal from "../components/DetailModal";
import DocumentModal from "../components/DocumentModal";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  },
});

// Setup SQLite-based persistence for TanStack Query
const db = SQLite.openDatabaseSync("milcalc-cache.db");

// Initialize schema immediately
db.execSync("CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value TEXT)");

// Simple wrapper for SQLite to work with createSyncStoragePersister
const sqliteStorage = {
  getItem: (key: string) => {
    try {
      const result = db.getFirstSync<{ value: string }>(
        "SELECT value FROM cache WHERE key = ?",
        [key]
      );
      return result ? result.value : null;
    } catch (e) {
      console.error("Error reading from SQLite cache:", e);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      db.runSync(
        "INSERT OR REPLACE INTO cache (key, value) VALUES (?, ?)",
        [key, value]
      );
    } catch (e) {
      console.error("Error writing to SQLite cache:", e);
    }
  },
  removeItem: (key: string) => {
    try {
      db.runSync("DELETE FROM cache WHERE key = ?", [key]);
    } catch (e) {
      console.error("Error removing from SQLite cache:", e);
    }
  },
};

const sqlitePersister = createSyncStoragePersister({
  storage: sqliteStorage,
});

function LayoutContent() {
  const { 
    isVisible, 
    closeOverlay, 
    snapToIndex, 
    setSnapToIndex, 
    overlayType,
    helpContentKey,
    helpMascot,
    helpSource,
    closeHelp,
    documentCategory,
    isDocumentVisible,
    closeDocuments
  } = useOverlay();

  return (
    <SyncManager>
      <Slot />
      
      {/* Main BottomSheet Overlay */}
      <BottomSheet
        isVisible={isVisible}
        snapToIndex={snapToIndex}
        onSnap={setSnapToIndex}
        onClose={closeOverlay}
        title={overlayType === 'MENU' ? 'MILCALC MENU' : undefined}
        mode="standard"
      >
        <MainOverlay />
      </BottomSheet>

      {/* Global Detail Modal (Help) */}
      <DetailModal
        isVisible={!!helpContentKey}
        onClose={closeHelp}
        contentKey={helpContentKey || ''}
        source={helpSource || 'pt'}
        mascotAsset={helpMascot}
      />

      {/* Global Document Modal (PDFs) */}
      <DocumentModal 
        category={documentCategory || 'PAY'} 
        isModalVisible={isDocumentVisible} 
        setModalVisible={closeDocuments} 
      />
    </SyncManager>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: sqlitePersister }}
      >
        <ThemeProvider>
          <OverlayProvider>
            <LayoutContent />
          </OverlayProvider>
        </ThemeProvider>
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  );
}
