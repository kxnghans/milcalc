import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useTheme } from '@repo/ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Corrected LabelWithHelp for extraction
interface NewLabelWithHelpProps {
  label: string;
  contentKey: string;
  onHelpPress: (contentKey: string) => void;
}

export const NewLabelWithHelp: React.FC<NewLabelWithHelpProps> = ({ label, contentKey, onHelpPress }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.s,
    },
    labelStyle: { // Based on original usage of `styles.boldLabel`
        ...theme.typography.subtitle,
        color: theme.colors.text,
        marginBottom: theme.spacing.s,
    },
  });

  return (
    <View style={styles.labelRow}>
        <Text style={styles.labelStyle}>{label}</Text>
        <Pressable onPress={() => onHelpPress(contentKey)}>
            <MaterialCommunityIcons name="help-circle-outline" size={16} color={theme.colors.disabled} />
        </Pressable>
    </View>
  );
};

interface RoundIconButtonProps {
  onPress: () => void;
  iconName: string;
  backgroundColor: string;
  size?: number;
  iconSize?: number;
  iconColor?: string;
}

export const RoundIconButton: React.FC<RoundIconButtonProps> = ({ onPress, iconName, backgroundColor, size = 24, iconSize = 16, iconColor = '#FFFFFF' }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: backgroundColor,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1,
            }}
        >
            <MaterialCommunityIcons name={iconName as any} size={iconSize} color={iconColor} />
        </TouchableOpacity>
    );
};

interface AddButtonProps {
  onPress: () => void;
}

export const AddButton: React.FC<AddButtonProps> = ({ onPress }) => {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    addIconContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.s,
    }
  });
  return (
    <View style={styles.addIconContainer}>
        <RoundIconButton
            onPress={onPress}
            iconName="plus"
            backgroundColor={theme.colors.primary}
            size={20}
            iconSize={14}
        />
    </View>
  );
};

interface CancelButtonProps {
  onPress: () => void;
}

export const CancelButton: React.FC<CancelButtonProps> = ({ onPress }) => {
    const { theme } = useTheme();
    return (
        <RoundIconButton
            onPress={onPress}
            iconName="close"
            backgroundColor={theme.colors.error}
            size={20}
            iconSize={14}
        />
    );
};

export default NewLabelWithHelp;
