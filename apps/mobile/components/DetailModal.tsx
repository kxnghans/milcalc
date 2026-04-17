import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getAlphaColor, PillButton, useTheme } from "@repo/ui";
import { getHelpContentFromSource, Tables } from "@repo/utils";
import { BlurView } from "expo-blur";
import { Image as ExpoImage } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageSourcePropType,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { PayHelpTemplate } from "./help/PayHelpTemplate";
import { PtHelpTemplate } from "./help/PtHelpTemplate";
import { RetirementHelpTemplate } from "./help/RetirementHelpTemplate";

type HelpItem =
  | Tables<"pt_help_details">
  | Tables<"pay_help_details">
  | Tables<"retirement_help_details">
  | Tables<"best_score_help_details">;

interface DetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  contentKey: string | null;
  source: "pt" | "pay" | "retirement" | "best_score";
  mascotAsset?: ImageSourcePropType | null;
}

export default function DetailModal({
  isVisible,
  onClose,
  contentKey,
  source,
  mascotAsset,
}: DetailModalProps) {
  const { theme } = useTheme();
  const [content, setContent] = useState<HelpItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTopChevron, setShowTopChevron] = useState(false);
  const [showBottomChevron, setShowBottomChevron] = useState(false);
  const bounceAnim = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  useEffect(() => {
    bounceAnim.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 300 }),
        withTiming(0, { duration: 300 }),
      ),
      -1,
      true,
    );
  }, [bounceAnim]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: bounceAnim.value }],
    };
  });

  useEffect(() => {
    if (isVisible && contentKey && source) {
      const fetchContent = async () => {
        setIsLoading(true);
        setContent(null);
        setShowTopChevron(false);
        setShowBottomChevron(false);
        const data = await getHelpContentFromSource(source, contentKey);
        setContent(data);
        setIsLoading(false);
      };
      fetchContent();
    } else {
      setContent(null);
    }
  }, [isVisible, contentKey, source]);

  const handleScroll = (event: {
    nativeEvent: {
      layoutMeasurement: { height: number };
      contentOffset: { y: number };
      contentSize: { height: number };
    };
  }) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtTop = contentOffset.y <= 0;
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
    setShowTopChevron(!isAtTop);
    setShowBottomChevron(!isAtBottom);
  };

  const handleContentSizeChange = (
    _contentWidth: number,
    contentHeight: number,
  ) => {
    const isScrollable = contentHeight > scrollViewHeight;
    setShowBottomChevron(isScrollable);
    if (!isScrollable) {
      setShowTopChevron(false);
    }
  };

  const CHEVRON_HEIGHT = 24 + theme.spacing.s;
  const TITLE_HEIGHT = theme.typography.title.fontSize + theme.spacing.xs;
  const HEADER_HEIGHT = theme.mascot.height + TITLE_HEIGHT + CHEVRON_HEIGHT;
  const FOOTER_HEIGHT = CHEVRON_HEIGHT + 44 + theme.spacing.l;
  const MAX_SCROLL_HEIGHT =
    Dimensions.get("window").height * 0.85 -
    HEADER_HEIGHT -
    FOOTER_HEIGHT -
    theme.spacing.l * 2;

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          flex: 1,
          alignItems: "center",
          paddingHorizontal: theme.spacing.l,
        },
        mascot: {
          width: theme.mascot.width,
          height: theme.mascot.height,
        },
        modalView: {
          backgroundColor: theme.colors.surface,
          borderRadius: 20,
          alignItems: "center",
          shadowColor: getAlphaColor("#000000", 1),
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
          maxWidth: "90%",
          minWidth: "40%",
          marginTop: "auto",
          marginBottom: "auto",
          maxHeight: Dimensions.get("window").height * 0.85,
          overflow: "hidden",
        },
        headerContainer: {
          width: "100%",
          alignItems: "center",
          paddingTop: theme.spacing.l,
          paddingHorizontal: theme.spacing.l,
          backgroundColor: theme.colors.surface,
        },
        title: {
          ...theme.typography.title,
          color: theme.colors.text,
          textAlign: "center",
          marginBottom: theme.spacing.xs,
        },
        chevronContainer: {
          height: CHEVRON_HEIGHT,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        },
        scrollContainer: {
          width: "100%",
          maxHeight: MAX_SCROLL_HEIGHT,
          paddingHorizontal: theme.spacing.l,
        },
        footerContainer: {
          width: "100%",
          alignItems: "center",
          paddingBottom: theme.spacing.l,
          paddingHorizontal: theme.spacing.l,
          backgroundColor: theme.colors.surface,
        },
        loadingIndicator: {
          marginVertical: theme.spacing.xl,
        },
      }),
    [theme, MAX_SCROLL_HEIGHT, CHEVRON_HEIGHT],
  );

  const renderContentTemplate = () => {
    if (!content || content.length === 0) return null;

    switch (source) {
      case "pt":
      case "best_score":
        return (
          <PtHelpTemplate
            content={
              content as (
                | Tables<"pt_help_details">
                | Tables<"best_score_help_details">
              )[]
            }
          />
        );
      case "pay":
        return (
          <PayHelpTemplate content={content as Tables<"pay_help_details">[]} />
        );
      case "retirement":
        return (
          <RetirementHelpTemplate
            content={content as Tables<"retirement_help_details">[]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <TouchableWithoutFeedback onPress={onClose}>
          <BlurView
            intensity={40}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        </TouchableWithoutFeedback>
        <View style={styles.modalView}>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={theme.colors.primary}
              style={styles.loadingIndicator}
            />
          ) : content && content.length > 0 ? (
            <>
              {/* Persistent Header */}
              <View style={styles.headerContainer}>
                {mascotAsset && (
                  <ExpoImage
                    source={mascotAsset}
                    style={styles.mascot}
                    contentFit="contain"
                  />
                )}
                <Text style={styles.title}>{content[0].title}</Text>
                <View style={styles.chevronContainer}>
                  {showTopChevron && (
                    <Animated.View style={animatedStyle}>
                      <MaterialCommunityIcons
                        name="chevron-up"
                        size={24}
                        color={theme.colors.primary}
                      />
                    </Animated.View>
                  )}
                </View>
              </View>

              {/* Scrollable Content */}
              <View style={styles.scrollContainer}>
                <ScrollView
                  ref={scrollViewRef}
                  showsVerticalScrollIndicator={false}
                  onScroll={handleScroll}
                  onContentSizeChange={handleContentSizeChange}
                  onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    setScrollViewHeight(height);
                  }}
                  scrollEventThrottle={16}
                >
                  {renderContentTemplate()}
                </ScrollView>
              </View>

              {/* Persistent Footer */}
              <View style={styles.footerContainer}>
                <View style={styles.chevronContainer}>
                  {showBottomChevron && (
                    <Animated.View style={animatedStyle}>
                      <MaterialCommunityIcons
                        name="chevron-down"
                        size={24}
                        color={theme.colors.primary}
                      />
                    </Animated.View>
                  )}
                </View>
                <PillButton title="Close" onPress={onClose} />
              </View>
            </>
          ) : (
            <Text style={styles.title}>Information not available.</Text>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
