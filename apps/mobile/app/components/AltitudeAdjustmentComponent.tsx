/**
 * @file AltitudeAdjustmentComponent.tsx
 * @description This file defines a component that allows users to select an altitude group
 * to apply the appropriate adjustments to their cardio scores.
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, SegmentedSelector, Icon, ICONS } from '@repo/ui';

/**
 * Props for the AltitudeAdjustmentComponent.
 */
interface AltitudeAdjustmentComponentProps {
  /** The currently selected altitude group value. */
  selectedValue: string;
  /** A function to be called when the selected value changes. */
  onValueChange: (value: string) => void;
  /** A function to open the detail modal. */
  openDetailModal: (key: string) => void;
}

/**
 * A component that renders a segmented control for selecting the altitude group.
 * @param {AltitudeAdjustmentComponentProps} props - The component props.
 * @returns {JSX.Element} The rendered altitude adjustment component.
 */
export default function AltitudeAdjustmentComponent({ selectedValue, onValueChange, openDetailModal }: AltitudeAdjustmentComponentProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    cardTitle: {
      ...theme.typography.title,
      color: theme.colors.text,
    },
  });

  // The options for the segmented selector, including labels with line breaks for better readability.
  const altitudeOptions = [
    { label: 'Normal\n< 5,250', value: 'normal' },
    { label: 'Group 1\n5,250\n5,499', value: 'group1' },
    { label: 'Group 2\n5,500\n5,999', value: 'group2' },
    { label: 'Group 3\n6,000\n6,599', value: 'group3' },
    { label: 'Group 4\n≥ 6,600', value: 'group4' },
  ];

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => openDetailModal('altitude_adjustment')}>
            <Icon name={ICONS.HELP} size={16} color={theme.colors.disabled} />
        </TouchableOpacity>
        <Text style={[styles.cardTitle, { marginLeft: theme.spacing.s }]}>Altitude Adjustment (ft)</Text>
      </View>
      <SegmentedSelector
        options={altitudeOptions}
        selectedValues={[selectedValue]}
        onValueChange={onValueChange}
      />
    </View>
  );
}