import {
  getAlphaColor,
  NeumorphicInset,
  StyledTextInput,
  useTheme,
} from "@repo/ui";
import React, { useImperativeHandle, useMemo, useRef } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";

interface InsetTextInputProps extends Omit<TextInputProps, "style"> {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

const InsetTextInput = React.forwardRef<TextInput, InsetTextInputProps>(
  (
    { style, inputStyle, children, leftContent, rightContent, ...props },
    ref,
  ) => {
    const { theme } = useTheme();
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => inputRef.current!);

    const styles = useMemo(
      () =>
        StyleSheet.create({
          container: {
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: theme.spacing.s,
            paddingRight: theme.spacing.s,
            paddingVertical: theme.spacing.s,
          },
          input: {
            borderWidth: 0,
            padding: 0,
            margin: 0,
            textAlign: "center",
            ...theme.typography.label,
            color: theme.colors.text,
            flex: 1,
            backgroundColor: getAlphaColor("#000000", 0),
            left: leftContent ? "-15%" : "0%",
          },
          leftContentContainer: {
            flex: leftContent ? 1 : 0,
            alignItems: "flex-start",
            justifyContent: "center",
          },
          rightGroup: {
            flex: leftContent ? 2 : 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          },
          rightContentContainer: {
            position: "absolute",
            right: 0,
            alignItems: "center",
            justifyContent: "center",
          },
          contentStyle: {
            padding: 0,
          },
        }),
      [theme, leftContent],
    );

    const handlePress = () => {
      inputRef.current?.focus();
    };

    return (
      <NeumorphicInset
        containerStyle={style}
        contentStyle={styles.contentStyle}
      >
        <TouchableWithoutFeedback onPress={handlePress}>
          <View style={styles.container}>
            {leftContent ? (
              <View style={styles.leftContentContainer}>{leftContent}</View>
            ) : (
              <View style={styles.leftContentContainer} />
            )}

            <View style={styles.rightGroup}>
              <StyledTextInput
                ref={inputRef}
                {...props}
                style={[styles.input, inputStyle]}
              />
              {rightContent && (
                <View style={styles.rightContentContainer}>{rightContent}</View>
              )}
            </View>
            {children}
          </View>
        </TouchableWithoutFeedback>
      </NeumorphicInset>
    );
  },
);

InsetTextInput.displayName = "InsetTextInput";

export default InsetTextInput;
