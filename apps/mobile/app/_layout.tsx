import React, { useState, useEffect } from "react";
import { Slot } from "expo-router";
import { ThemeProvider, BottomSheet, useTheme } from "@repo/ui";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  // Hydration logic: Seed the cache from seed-data.json if it's empty
  useEffect(() => {
    const hydrateCache = async () => {
      // Simple check to see if we have any data (e.g., altitude corrections)
      const existingData = queryClient.getQueryData(['altitudeCorrections']);
      if (!existingData) {
        console.log('Cache is empty. Hydrating from seed-data.json...');
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const seedData = require('../assets/seed-data.json');
          
          // 1. Demographic-independent data
          if (seedData.pt_altitude_corrections) {
            queryClient.setQueryData(['altitudeCorrections'], seedData.pt_altitude_corrections);
          }
          if (seedData.base_pay_2024) {
            queryClient.setQueryData(['payGrades'], seedData.base_pay_2024.map((i: any) => i.pay_grade));
          }
          if (seedData.bas_rates) {
            queryClient.setQueryData(['basRate', 2025], seedData.bas_rates[0]?.enlisted_rate || 460.25); // Default fallback
          }
          if (seedData.federal_tax_data) {
            const years = [...new Set(seedData.federal_tax_data.map((i: any) => i.year))];
            years.forEach(year => {
              queryClient.setQueryData(['federalTaxData', year], seedData.federal_tax_data.filter((i: any) => i.year === year));
            });
            if (years.length > 0) {
              queryClient.setQueryData(['maxFederalTaxYear'], Math.max(...years as number[]));
            }
          }
          if (seedData.state_tax_data) {
            const years = [...new Set(seedData.state_tax_data.map((i: any) => i.year))];
            years.forEach(year => {
              queryClient.setQueryData(['stateTaxData', year], seedData.state_tax_data.filter((i: any) => i.year === year));
            });
            if (years.length > 0) {
              queryClient.setQueryData(['maxStateTaxYear'], Math.max(...years as number[]));
            }
          }
          if (seedData.veterans_disability_compensation) {
            queryClient.setQueryData(['disabilityData'], seedData.veterans_disability_compensation);
          }

          // 2. Demographic-dependent data (PT Standards)
          if (seedData.pt_age_sex_groups && seedData.pt_scoring_standards) {
            const whtrData = seedData.pt_scoring_standards.filter((s: any) => s.exercise_type === 'whtr');
            
            seedData.pt_age_sex_groups.forEach((group: any) => {
              const groupStandards = seedData.pt_scoring_standards
                .filter((s: any) => s.age_sex_group_id === group.id)
                .map((item: any) => ({
                  exercise: item.exercise_type,
                  measurement: item.performance,
                  points: item.points,
                  healthRiskCategory: item.health_risk_category
                }));
              
              const whtrMapped = whtrData.map((item: any) => ({
                exercise: item.exercise_type,
                measurement: item.performance,
                points: item.points,
                healthRiskCategory: item.health_risk_category
              }));

              queryClient.setQueryData(['ptStandards', group.sex, group.age_range], [...groupStandards, ...whtrMapped]);
              
              if (seedData.pt_pass_fail_standards) {
                const groupPassFail = seedData.pt_pass_fail_standards.filter((s: any) => 
                  s.age_sex_group_id === group.id || (s.sex === group.sex && s.age_range === group.age_range)
                );
                queryClient.setQueryData(['passFailStandards', group.sex, group.age_range], groupPassFail);
              }

              if (seedData.pt_altitude_walk_thresholds) {
                const groupWalk = seedData.pt_altitude_walk_thresholds.filter((s: any) => 
                  s.sex === group.sex && s.age_range === group.age_range
                );
                queryClient.setQueryData(['walkAltitudeThresholds', group.sex, group.age_range], groupWalk);
              }
            });
          }

          // 3. Help Content
          const helpTables = ['pt_help_details', 'pay_help_details', 'retirement_help_details', 'best_score_help_details'];
          helpTables.forEach(tableName => {
            if (seedData[tableName]) {
               seedData[tableName].forEach((item: any) => {
                 const key = item.content_key || item.title;
                 if (key) {
                   queryClient.setQueryData(['helpContent', key], seedData[tableName].filter((i: any) => (i.content_key === key || i.title === key)));
                 }
               });
            }
          });

          console.log('Hydration complete.');
        } catch (error) {
          console.error('Failed to hydrate cache from seed-data.json:', error);
        }
      }
    };

    hydrateCache();
  }, [queryClient]);
  
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
