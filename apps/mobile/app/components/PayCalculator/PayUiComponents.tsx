import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Keyboard } from 'react-native';
import { useTheme, PillButton } from '@repo/ui';
import { ICONS } from '@repo/ui/icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CurrencyInput from '../../components/CurrencyInput';
import InsetTextInput from '../../components/InsetTextInput';

interface LabelWithHelpProps {
  label: string;
  contentKey: string;
}

export const LabelWithHelp: React.FC<LabelWithHelpProps> = ({ label, contentKey }) => {
  const { theme } = useTheme();
  // Assuming openDetailModal is passed down or available via context/global state
  // For now, it will be handled by the parent component that uses this LabelWithHelp
  // If openDetailModal needs to be here, it suggests this component should take it as a prop.
  // Given the current architecture, openDetailModal is in the parent screen.
  // So, this LabelWithHelp should just render the UI and let the parent handle the interaction.
  // Re-reading original `LabelWithHelp`: it uses `openDetailModal(contentKey)`
  // So, `LabelWithHelp` needs to accept `onHelpPress` prop or similar.
  // Let's modify LabelWithHelpProps to accept `onPress`

  const styles = StyleSheet.create({
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.s,
    },
    labelStyle: { // Renamed from boldLabel to avoid conflict and be specific
        ...theme.typography.subtitle,
        color: theme.colors.text,
        marginBottom: theme.spacing.s, // This was `theme.spacing.s` in original `boldLabel`
    },
  });

  return (
    <View style={styles.labelRow}>
        <Text style={styles.labelStyle}>{label}</Text>
        <Pressable onPress={() => { /* This will be handled by the parent, or passed as a prop */ }}>
            <MaterialCommunityIcons name="help-circle-outline" size={16} color={theme.colors.disabled} />
        </Pressable>
    </View>
  );
};

// Original LabelWithHelp implementation:
// const LabelWithHelp = ({ label, contentKey }) => (
//     <View style={styles.labelRow}>
//         <Text style={styles.label}>{label}</Text> // Original used `styles.label` which is `.body`
//         <Pressable onPress={() => openDetailModal(contentKey)}>
//             <MaterialCommunityIcons name="help-circle-outline" size={16} color={theme.colors.disabled} />
//         </Pressable>
//     </View>
// );
// The original `LabelWithHelp` uses `styles.boldLabel` for the text.

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
            <MaterialCommunityIcons name={iconName} size={iconSize} color={iconColor} />
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
