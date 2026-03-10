import React, { useState, useEffect } from "react";
import { Slot } from "expo-router";
import { ThemeProvider, BottomSheet, useTheme } from "@repo/ui";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import * as SQLite from "expo-sqlite";
import { SyncManager } from "../components/SyncManager";
import { OverlayProvider, useOverlay } from "../contexts/OverlayContext";
import { ProfileProvider, useProfile } from "../contexts/ProfileContext";
import { MainOverlay } from "../components/MainOverlay";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DetailModal from "../components/DetailModal";
import DocumentModal from "../components/DocumentModal";
import { LaunchAd } from "../components/LaunchAd";
import { FullScreenPaywall } from "../components/FullScreenPaywall";
import { View, ActivityIndicator, StyleSheet } from "react-native";

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
    overlayFooter,
    helpContentKey,
    helpMascot,
    helpSource,
    closeHelp,
    documentCategory,
    isDocumentVisible,
    closeDocuments
  } = useOverlay();

  const { theme } = useTheme();
  const { isLoading, hasSeenOnboarding, setProfileData } = useProfile();
  
  const [appState, setAppState] = useState<'LOADING' | 'PAYWALL' | 'AD' | 'READY'>('LOADING');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isLoading && !isInitialized) {
      if (!hasSeenOnboarding) {
        setAppState('PAYWALL');
      } else {
        setAppState('AD');
      }
      setIsInitialized(true);
    }
  }, [isLoading, isInitialized, hasSeenOnboarding]);

  const handlePaywallComplete = () => {
    setProfileData({ hasSeenOnboarding: true });
    setAppState('AD');
  };

  const handleAdSkip = () => {
    setAppState('READY');
  };

  if (appState === 'LOADING') {
    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SyncManager>
      <Slot />
      
      {/* Main BottomSheet Overlay */}
      <BottomSheet
        isVisible={isVisible}
        snapToIndex={snapToIndex}
        onSnap={setSnapToIndex}
        onClose={closeOverlay}
        title={overlayType === 'MENU' ? 'MILCALC MENU' : overlayType === 'ACCOUNT' ? 'MY ACCOUNT' : overlayType === 'BUG_REPORT' ? 'REPORT A BUG' : overlayType === 'PAYWALL' ? 'PREMIUM UPGRADE' : undefined}
        titleStyle={{
          textShadowColor: theme.colors.neumorphic.outset.shadow,
          textShadowRadius: 0.25,
          textShadowOffset: { width: 0, height: 0 },
        }}
        mode="standard"
        footer={overlayFooter}
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

      {/* Onboarding / Ad Overlays */}
      {appState === 'PAYWALL' && <FullScreenPaywall onComplete={handlePaywallComplete} />}
      {appState === 'AD' && <LaunchAd onSkip={handleAdSkip} />}
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
          <ProfileProvider>
            <OverlayProvider>
              <LayoutContent />
            </OverlayProvider>
          </ProfileProvider>
        </ThemeProvider>
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  );
}
