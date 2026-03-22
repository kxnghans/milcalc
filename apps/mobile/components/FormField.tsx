import React from 'react';
import { View, Text, StyleSheet, TextInput, TextInputProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import * as Icons from '@expo/vector-icons';
import { useTheme, Icon, ICON_SETS } from '@repo/ui';
import InsetTextInput from './InsetTextInput';

interface FormFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  icon?: string;
  iconSet?: keyof typeof Icons;
  labelCentered?: boolean;
  iconOnLabel?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  insetStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  iconSize?: number;
}

const FormField = React.forwardRef<TextInput, FormFieldProps>(({ 
  label, 
  icon, 
  iconSet = ICON_SETS.MATERIAL_COMMUNITY, 
  labelCentered = false, 
  iconOnLabel = false,
  containerStyle,
  inputStyle,
  insetStyle,
  labelStyle,
  iconSize = 18,
  children,
  ...props 
}, ref) => {
  const { theme } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      marginBottom: theme.spacing.m,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.s,
      justifyContent: labelCentered ? 'center' : 'flex-start',
      paddingLeft: iconOnLabel && !labelCentered ? theme.spacing.xs : 0,
    },
    label: {
      ...theme.typography.bodybold,
      color: theme.colors.text,
    }
  }), [theme, labelCentered, iconOnLabel]);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelRow}>
        {icon && iconOnLabel && (
          <Icon name={icon} size={iconSize} color={theme.colors.primary} iconSet={iconSet} />
        )}
        <Text style={[styles.label, { marginLeft: icon && iconOnLabel ? theme.spacing.s : 0 }, labelStyle]}>{label}</Text>
      </View>
      
      <InsetTextInput
        ref={ref}
        style={insetStyle}
        inputStyle={inputStyle}
        leftContent={icon && !iconOnLabel ? (
          <Icon name={icon} size={20} color={theme.colors.primary} iconSet={iconSet} />
        ) : undefined}
        {...props}
      >
        {children}
      </InsetTextInput>
    </View>
  );
});

FormField.displayName = 'FormField';

export default FormField;
