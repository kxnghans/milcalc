import { View, Text, StyleSheet } from 'react-native';
import { useTheme, SegmentedSelector, Icon, ICONS } from '@repo/ui';

interface AltitudeAdjustmentComponentProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export default function AltitudeAdjustmentComponent({ selectedValue, onValueChange }: AltitudeAdjustmentComponentProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    cardTitle: {
      ...theme.typography.title,
      color: theme.colors.text,
    },
  });

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
        <Icon name={ICONS.HELP} size={16} color={theme.colors.disabled} />
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
