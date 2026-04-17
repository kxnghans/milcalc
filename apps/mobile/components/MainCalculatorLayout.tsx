import { Card, SmartAction, SmartIconRow, useTheme } from "@repo/ui";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import DismissKeyboardView from "./DismissKeyboardView";
import ScreenHeader from "./ScreenHeader";

interface MainCalculatorLayoutProps {
  title: string;
  isLoading?: boolean;
  summaryContent: React.ReactNode;
  inputContent: React.ReactNode;
  actions: SmartAction[];
  onReset?: () => void;
  onHelp?: () => void;
  onDocument?: () => void;
  containerStyle?: ViewStyle;
}

const MainCalculatorLayout: React.FC<MainCalculatorLayoutProps> = ({
  title,
  isLoading,
  summaryContent,
  inputContent,
  actions,
  onReset,
  onHelp,
  onDocument,
  containerStyle,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        containerStyle,
      ]}
    >
      <ScreenHeader title={title} isLoading={isLoading} />

      <View style={styles.content}>
        <DismissKeyboardView style={styles.dismissKeyboard}>
          <Card containerStyle={styles.summaryCard}>{summaryContent}</Card>

          <SmartIconRow
            actions={actions}
            onReset={onReset}
            onHelp={onHelp}
            onDocument={onDocument}
          />
        </DismissKeyboardView>

        <Card style={styles.flex1}>
          <KeyboardAwareScrollView
            enableOnAndroid
            contentContainerStyle={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <DismissKeyboardView>{inputContent}</DismissKeyboardView>
          </KeyboardAwareScrollView>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12, // Standard spacing.s is usually around here
    paddingTop: 8,
    paddingBottom: 8,
  },
  summaryCard: {
    marginBottom: 8,
  },
  dismissKeyboard: {
    flex: 0,
    width: "100%",
  },
  flex1: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

export default MainCalculatorLayout;
