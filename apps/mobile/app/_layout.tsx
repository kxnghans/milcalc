import {
  BottomSheet,
  CalculatorStateProvider,
  ThemeProvider,
  useTheme,
} from "@repo/ui";
import { Slot } from "expo-router";
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
import { useAppBootstrap } from "../hooks/useAppBootstrap";
import { PersistenceProvider } from "../providers/PersistenceProvider";

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

  // Initialize background data hydration and sync
  useAppBootstrap();

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
      <PersistenceProvider>
        <ThemeProvider>
          <ProfileProvider>
            <CalculatorStateProvider>
              <OverlayProvider>
                <LayoutContent />
              </OverlayProvider>
            </CalculatorStateProvider>
          </ProfileProvider>
        </ThemeProvider>
      </PersistenceProvider>
    </GestureHandlerRootView>
  );
}
