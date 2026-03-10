import React, { useMemo } from 'react';
import { TextInput, TextInputProps, StyleSheet, StyleProp, ViewStyle, TextStyle, View } from 'react-native';
import { NeumorphicInset, StyledTextInput, useTheme } from '@repo/ui';

interface InsetTextInputProps extends Omit<TextInputProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

const InsetTextInput = React.forwardRef<TextInput, InsetTextInputProps>(({ style, inputStyle, children, leftContent, rightContent, ...props }, ref) => {
  const { theme } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: theme.spacing.s,
      paddingRight: theme.spacing.s,
      paddingVertical: theme.spacing.s, // Reverted to 's' padding as per instruction
    },
    input: {
      borderWidth: 0,
      padding: 0,
      margin: 0,
      textAlign: 'center',
      ...theme.typography.label,
      color: theme.colors.text,
      flex: 1,
      backgroundColor: 'transparent',
      left: leftContent ? '-15%' : '0%',
    },
    leftContentContainer: {
      flex: leftContent ? 1 : 0,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    rightGroup: {
      flex: leftContent ? 2 : 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    rightContentContainer: {
      position: 'absolute',
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }), [theme]);

  return (
    <NeumorphicInset
      containerStyle={style}
      contentStyle={styles.container}
    >
      {leftContent ? (
        <View style={styles.leftContentContainer}>
          {leftContent}
        </View>
      ) : <View style={styles.leftContentContainer} />}

      <View style={styles.rightGroup}>
        <StyledTextInput
          ref={ref}
          {...props}
          style={[styles.input, inputStyle]}
        />
        {rightContent && (
          <View style={styles.rightContentContainer}>
            {rightContent}
          </View>
        )}
      </View>
      {children}
    </NeumorphicInset>
  );
});

InsetTextInput.displayName = 'InsetTextInput';

export default InsetTextInput;
