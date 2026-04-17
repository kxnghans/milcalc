import {
  BottomSheet,
  CalculatorStateProvider,
  ThemeProvider,
  useTheme,
} from "@repo/ui";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Slot } from "expo-router";
import * as SQLite from "expo-sqlite";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import DetailModal from "../components/DetailModal";
import DocumentModal from "../components/DocumentModal";
import { FullScreenPaywall } from "../components/FullScreenPaywall";
import { LaunchAd } from "../components/LaunchAd";
import { MainOverlay } from "../components/MainOverlay";
import { SyncManager } from "../components/SyncManager";
import { OverlayProvider, useOverlay } from "../contexts/OverlayContext";
import { ProfileProvider, useProfile } from "../contexts/ProfileContext";

const styles = StyleSheet.create({
  flexItem: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  titleStyle: {
    textShadowRadius: 0.25,
    textShadowOffset: { width: 0, height: 0 },
  },
});

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
db.execSync(
  "CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value TEXT)",
);

// Simple wrapper for SQLite to work with createSyncStoragePersister
const sqliteStorage = {
  getItem: (key: string) => {
    try {
      const result = db.getFirstSync<{ value: string }>(
        "SELECT value FROM cache WHERE key = ?",
        [key],
      );
      return result ? result.value : null;
    } catch (e) {
      console.error("Error reading from SQLite cache:", e);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      db.runSync("INSERT OR REPLACE INTO cache (key, value) VALUES (?, ?)", [
        key,
        value,
      ]);
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

interface SeedData {
  pt_altitude_corrections?: unknown[];
  base_pay_2024?: Array<{ pay_grade: string }>;
  bas_rates?: Array<{ enlisted_rate: number }>;
  federal_tax_data?: Array<{ year: number }>;
  state_tax_data?: Array<{ year: number }>;
  veterans_disability_compensation?: unknown[];
  pt_scoring_standards?: Array<{
    exercise_type: string;
    gender: string;
    age_group: string;
    performance: string;
    points: number;
    health_risk_category: string | null;
  }>;
  pt_pass_fail_standards?: Array<{
    gender: string;
    age_group: string;
  }>;
  pt_altitude_walk_thresholds?: Array<{
    sex: string;
    age_range: string;
  }>;
  [key: string]: unknown;
}

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
    closeDocuments,
  } = useOverlay();

  const { theme } = useTheme();
  const { isLoading, hasSeenOnboarding, setProfileData, accountType } =
    useProfile();
  const queryClient = useQueryClient();

  const [appState, setAppState] = useState<
    "LOADING" | "PAYWALL" | "AD" | "READY"
  >("LOADING");
  const [isInitialized, setIsInitialized] = useState(false);

  // Track overlay state to trigger ad on close
  const prevVisible = useRef(isVisible);
  const activeOverlayOnClose = useRef(overlayType);

  useEffect(() => {
    if (isVisible) {
      activeOverlayOnClose.current = overlayType;
    }

    // If it was visible and now it's not
    if (prevVisible.current && !isVisible) {
      if (
        activeOverlayOnClose.current === "PAYWALL" &&
        accountType === "free"
      ) {
        // Delay slightly to allow bottom sheet animation to complete
        setTimeout(() => {
          setAppState("AD");
        }, 300);
      }
    }
    prevVisible.current = isVisible;
  }, [isVisible, overlayType, accountType]);

  // Hydration logic: Seed the cache from seed-data.json if it's empty
  useEffect(() => {
    const hydrateCache = async () => {
      // Simple check to see if we have any data (e.g., altitude corrections)
      const existingData = queryClient.getQueryData(["altitudeCorrections"]);
      if (!existingData) {
        console.warn("Cache is empty. Hydrating from seed-data.json...");
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const seedData = require("../assets/seed-data.json") as SeedData;

          // 1. Demographic-independent data
          if (seedData.pt_altitude_corrections) {
            queryClient.setQueryData(
              ["altitudeCorrections"],
              seedData.pt_altitude_corrections,
            );
          }
          if (seedData.base_pay_2024) {
            queryClient.setQueryData(
              ["payGrades"],
              seedData.base_pay_2024.map(
                (i: { pay_grade: string }) => i.pay_grade,
              ),
            );
          }
          if (seedData.bas_rates) {
            queryClient.setQueryData(
              ["basRate", 2025],
              seedData.bas_rates[0]?.enlisted_rate || 460.25,
            ); // Default fallback
          }
          const fedTaxData = seedData.federal_tax_data;
          if (fedTaxData) {
            const years = [
              ...new Set(fedTaxData.map((i: { year: number }) => i.year)),
            ];
            years.forEach((year) => {
              queryClient.setQueryData(
                ["federalTaxData", year],
                fedTaxData.filter((i: { year: number }) => i.year === year),
              );
            });
            if (years.length > 0) {
              queryClient.setQueryData(
                ["maxFederalTaxYear"],
                Math.max(...(years as number[])),
              );
            }
          }
          const stateTaxData = seedData.state_tax_data;
          if (stateTaxData) {
            const years = [
              ...new Set(stateTaxData.map((i: { year: number }) => i.year)),
            ];
            years.forEach((year) => {
              queryClient.setQueryData(
                ["stateTaxData", year],
                stateTaxData.filter((i: { year: number }) => i.year === year),
              );
            });
            if (years.length > 0) {
              queryClient.setQueryData(
                ["maxStateTaxYear"],
                Math.max(...(years as number[])),
              );
            }
          }
          if (seedData.veterans_disability_compensation) {
            queryClient.setQueryData(
              ["disabilityData"],
              seedData.veterans_disability_compensation,
            );
          }

          // 2. Demographic-dependent data (PT Standards)
          if (seedData.pt_scoring_standards) {
            const scoringStandards = seedData.pt_scoring_standards as Array<{
              exercise_type: string;
              gender: string;
              age_group: string;
              performance: string;
              points: number;
              health_risk_category: string | null;
            }>;
            const whtrData = scoringStandards.filter(
              (s) => s.exercise_type === "whtr",
            );

            // Get unique combinations of gender and age_group
            const groups = [
              ...new Set(
                scoringStandards
                  .filter((s) => s.exercise_type !== "whtr")
                  .map((s) => `${s.gender}|${s.age_group}`),
              ),
            ];

            groups.forEach((groupKey: string) => {
              const [gender, ageRange] = groupKey.split("|");

              const groupStandards = scoringStandards
                .filter((s) => s.gender === gender && s.age_group === ageRange)
                .map((item) => ({
                  exercise: item.exercise_type,
                  measurement: item.performance,
                  points: item.points,
                  healthRiskCategory: item.health_risk_category,
                }));

              const whtrMapped = whtrData.map((item) => ({
                exercise: item.exercise_type,
                measurement: item.performance,
                points: item.points,
                healthRiskCategory: item.health_risk_category,
              }));

              queryClient.setQueryData(
                ["ptStandards", gender, ageRange],
                [...groupStandards, ...whtrMapped],
              );

              if (seedData.pt_pass_fail_standards) {
                const groupPassFail = (
                  seedData.pt_pass_fail_standards as Array<{
                    gender: string;
                    age_group: string;
                  }>
                ).filter(
                  (s) => s.gender === gender && s.age_group === ageRange,
                );
                queryClient.setQueryData(
                  ["passFailStandards", gender, ageRange],
                  groupPassFail,
                );
              }

              if (seedData.pt_altitude_walk_thresholds) {
                const groupWalk = (
                  seedData.pt_altitude_walk_thresholds as Array<{
                    sex: string;
                    age_range: string;
                  }>
                ).filter((s) => s.sex === gender && s.age_range === ageRange);
                queryClient.setQueryData(
                  ["walkAltitudeThresholds", gender, ageRange],
                  groupWalk,
                );
              }
            });
          }

          // 3. Help Content
          const helpTables = [
            "pt_help_details",
            "pay_help_details",
            "retirement_help_details",
            "best_score_help_details",
          ];
          helpTables.forEach((tableName) => {
            const data = seedData[tableName];
            if (Array.isArray(data)) {
              data.forEach((item: { content_key?: string; title?: string }) => {
                const key = item.content_key || item.title;
                if (key) {
                  queryClient.setQueryData(
                    ["helpContent", key],
                    (
                      data as Array<{
                        content_key?: string;
                        title?: string;
                      }>
                    ).filter((i) => i.content_key === key || i.title === key),
                  );
                }
              });
            }
          });

          console.warn("Hydration complete.");
        } catch (error) {
          console.error("Failed to hydrate cache from seed-data.json:", error);
        }
      }
    };

    hydrateCache();
  }, [queryClient]);

  useEffect(() => {
    if (!isLoading && !isInitialized) {
      if (!hasSeenOnboarding) {
        setAppState("PAYWALL");
      } else if (accountType === "premium") {
        setAppState("READY");
      } else {
        setAppState("AD");
      }
      setIsInitialized(true);
    }
  }, [isLoading, isInitialized, hasSeenOnboarding, accountType]);

  const handlePaywallComplete = () => {
    setProfileData({ hasSeenOnboarding: true });
    setAppState("AD");
  };

  const handleAdSkip = () => {
    setAppState("READY");
  };

  if (appState === "LOADING") {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.loadingContainer,
          {
            backgroundColor: theme.colors.background,
          },
        ]}
      >
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
        title={
          overlayType === "MENU"
            ? "MILCALC MENU"
            : overlayType === "ACCOUNT"
              ? "MY ACCOUNT"
              : overlayType === "BUG_REPORT"
                ? "REPORT A BUG"
                : overlayType === "PAYWALL"
                  ? "PREMIUM UPGRADE"
                  : undefined
        }
        titleStyle={[
          styles.titleStyle,
          {
            textShadowColor: theme.colors.neumorphic.outset.shadow,
          },
        ]}
        mode="standard"
        footer={overlayFooter}
        isScrollable={overlayType !== "BUG_REPORT"}
      >
        <MainOverlay />
      </BottomSheet>

      {/* Global Detail Modal (Help) */}
      <DetailModal
        isVisible={!!helpContentKey}
        onClose={closeHelp}
        contentKey={helpContentKey || ""}
        source={helpSource || "pt"}
        mascotAsset={helpMascot}
      />

      {/* Global Document Modal (PDFs) */}
      <DocumentModal
        category={documentCategory || "PAY"}
        isModalVisible={isDocumentVisible}
        setModalVisible={closeDocuments}
      />

      {/* Onboarding / Ad Overlays */}
      {appState === "PAYWALL" && (
        <FullScreenPaywall onComplete={handlePaywallComplete} />
      )}
      {appState === "AD" && <LaunchAd onSkip={handleAdSkip} />}
    </SyncManager>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={styles.flexItem}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: sqlitePersister }}
      >
        <ThemeProvider>
          <ProfileProvider>
            <CalculatorStateProvider>
              <OverlayProvider>
                <LayoutContent />
              </OverlayProvider>
            </CalculatorStateProvider>
          </ProfileProvider>
        </ThemeProvider>
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  );
}
