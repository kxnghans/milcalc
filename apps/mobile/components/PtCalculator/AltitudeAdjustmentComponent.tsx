/**
 * @file AltitudeAdjustmentComponent.tsx
 * @description This file defines a component that allows users to select an altitude group
 * to apply the appropriate adjustments to their cardio scores.
 */

import {
  Icon,
  ICONS,
  MASCOT_URLS,
  SegmentedSelector,
  useTheme,
} from "@repo/ui";
import React from "react";
import {
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const altitudeMascots = [
  { uri: MASCOT_URLS.ALTITUDE },
  { uri: MASCOT_URLS.ALTITUDE1 },
];

/**
 * Props for the AltitudeAdjustmentComponent.
 */
interface AltitudeAdjustmentComponentProps {
  /** The currently selected altitude group value. */
  selectedValue: string;
  /** A function to be called when the selected value changes. */
  onValueChange: (value: string) => void;
  /** A function to open the detail modal. */
  openDetailModal: (key: string, mascot?: ImageSourcePropType) => void;
}

/**
 * A component that renders a segmented control for selecting the altitude group.
 * @param {AltitudeAdjustmentComponentProps} props - The component props.
 * @returns {JSX.Element} The rendered altitude adjustment component.
 */
export default function AltitudeAdjustmentComponent({
  selectedValue,
  onValueChange,
  openDetailModal,
}: AltitudeAdjustmentComponentProps) {
  const { theme } = useTheme();
  const [altitudeMascotIndex, setAltitudeMascotIndex] = React.useState(0);

  const getNextAltitudeMascot = () => {
    const mascot = altitudeMascots[altitudeMascotIndex];
    setAltitudeMascotIndex(
      (prevIndex) => (prevIndex + 1) % altitudeMascots.length,
    );
    return mascot;
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        cardTitle: {
          ...theme.typography.title,
          color: theme.colors.text,
          marginLeft: theme.spacing.s,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
        },
      }),
    [theme],
  );

  // The options for the segmented selector, including labels with line breaks for better readability.
  // Updated to match DAFMAN 36-2905 Attachment 3
  const altitudeOptions = [
    { label: "Normal\n< 5,250", value: "normal" },
    { label: "Group 1\n5,250\n5,499", value: "Group 1" },
    { label: "Group 2\n5,500\n5,999", value: "Group 2" },
    { label: "Group 3\n6,000\n6,599", value: "Group 3" },
    { label: "Group 4\n≥ 6,600", value: "Group 4" },
  ];

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            openDetailModal("altitude_adjustment", getNextAltitudeMascot())
          }
        >
          <Icon name={ICONS.HELP} size={16} color={theme.colors.disabled} />
        </TouchableOpacity>
        <Text style={styles.cardTitle}>Altitude Adjustment (ft)</Text>
      </View>
      <SegmentedSelector
        options={altitudeOptions}
        selectedValues={[selectedValue]}
        onValueChange={onValueChange}
      />
    </View>
  );
}
