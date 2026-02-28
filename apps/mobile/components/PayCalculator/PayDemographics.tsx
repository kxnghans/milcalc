import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SegmentedSelector, useTheme } from '@repo/ui';
import PickerInput from '../PickerInput';
import NumberInput from '../NumberInput';
import VerticalDivider from '../VerticalDivider';
import TwoColumnPicker from '../TwoColumnPicker';

interface PayDemographicsProps {
  component: string;
  setComponent: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  rank: string | null;
  setRank: (value: string | null) => void;
  yearsOfService: string;
  setYearsOfService: (value: string) => void;
  filteredRanks: { label: string; value: string }[];
  filingStatus: string;
  setFilingStatus: (value: string) => void;
  bahDependencyStatus: string;
  setBahDependencyStatus: (value: string) => void;
  mhaData: any; // Define a more specific type if possible
  mha: string;
  handleMhaChange: (mha: string, state: string) => void;
  mhaDisplayName: string;
  isLoading: boolean;
  mhaError: any; // Define a more specific type if possible
  state: string;
  disabilityPickerData: any; // Define a more specific type if possible
  vaDependencyStatus: string | null;
  handleDisabilityChange: (status: string, percentage: string) => void;
  disabilityDisplayName: string;
  disabilityError: any; // Define a more specific type if possible
  disabilityPercentage: string | null;
  disabilityPercentageItems: string[];
}

export const PayDemographics: React.FC<PayDemographicsProps> = ({
  component,
  setComponent,
  status,
  setStatus,
  rank,
  setRank,
  yearsOfService,
  setYearsOfService,
  filteredRanks,
  filingStatus,
  setFilingStatus,
  bahDependencyStatus,
  setBahDependencyStatus,
  mhaData,
  mha,
  handleMhaChange,
  mhaDisplayName,
  isLoading,
  mhaError,
  state,
  disabilityPickerData,
  vaDependencyStatus,
  handleDisabilityChange,
  disabilityDisplayName,
  disabilityError,
  disabilityPercentage,
  disabilityPercentageItems,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    fieldRow: {
      marginBottom: theme.spacing.m,
    },
    boldLabel: {
        ...theme.typography.subtitle,
        color: theme.colors.text,
        marginBottom: theme.spacing.s,
    },
  });

  return (
    <View style={{ flexDirection: 'row' }}>
      {/* Left Column */}
      <View style={{ flex: 1 }}>
        <View style={[styles.fieldRow, { marginBottom: theme.spacing.s }]}>
            <Text style={[styles.boldLabel, { marginBottom: 0 }]}>Component</Text>
            <SegmentedSelector
                options={[{label: 'Active', value: 'Active'}, {label: 'Guard', value: 'Guard'}, {label: 'Reserve', value: 'Reserve'}]}
                ratios={[4, 4, 5]}
                selectedValues={[component]}
                onValueChange={(value) => setComponent(value)}
                style={{ marginLeft: 0, marginRight: 0 }}
            />
        </View>
        <View style={[styles.fieldRow, { marginBottom: theme.spacing.s }]}>
            <Text style={[styles.boldLabel, { marginBottom: 0 }]}>Status</Text>
            <SegmentedSelector
                options={[{label: 'Enlisted', value: 'Enlisted'}, {label: 'WO', value: 'Warrant Officer'}, {label: 'Officer', value: 'Officer'}]}
                ratios={[5, 2.75, 4]}
                selectedValues={[status]}
                onValueChange={(value) => setStatus(value)}
                style={{ marginLeft: 0, marginRight: 0 }}
            />
        </View>
        <View style={styles.fieldRow} collapsable={false}>
            <Text style={styles.boldLabel}>Pay Grade</Text>
            <PickerInput items={filteredRanks} selectedValue={rank} onValueChange={setRank} placeholder="Select..." />
        </View>
        <View style={styles.fieldRow}>
            <Text style={styles.boldLabel}>Years of Service</Text>
            <NumberInput placeholder="0" value={yearsOfService} onChangeText={setYearsOfService} />
        </View>
      </View>

      <VerticalDivider style={{ marginHorizontal: theme.spacing.m, backgroundColor: 'rgba(0, 0, 0, 0.01)' }} />

      {/* Right Column */}
      <View style={{ flex: 1, paddingRight: theme.spacing.s }}>
        <View style={[styles.fieldRow, { marginBottom: theme.spacing.s }]}>
            <Text style={[styles.boldLabel, { marginBottom: 0 }]}>Tax Filing Status</Text>
            <SegmentedSelector
                options={[{label: 'Single', value: 'single'}, {label: 'Married', value: 'married'}]}
                selectedValues={[filingStatus]}
                onValueChange={(value) => setFilingStatus(value)}
                style={{ marginLeft: 0, marginRight: 0 }}
            />
        </View>
        <View style={[styles.fieldRow, { marginBottom: 0 }]}>
            <Text style={[styles.boldLabel, { marginTop: 0, marginBottom: 0 }]}>Dependents</Text>
            <SegmentedSelector
                options={[{label: 'No', value: 'WITHOUT_DEPENDENTS'}, {label: 'Yes', value: 'WITH_DEPENDENTS'}]}
                selectedValues={[bahDependencyStatus]}
                onValueChange={(value) => setBahDependencyStatus(value)}
                style={{ marginLeft: 0, marginRight: 0 }}
            />
        </View>
        <View style={[styles.fieldRow, { marginTop: theme.spacing.s }]}>
            <Text style={styles.boldLabel}>Mil Housing Area</Text>
            <TwoColumnPicker data={mhaData} selectedValue={mha} onChange={handleMhaChange} displayName={mhaDisplayName} isLoading={isLoading} error={mhaError} primaryColumnValue={state} secondaryPlaceholder="Select a location" />
        </View>
        <View style={[styles.fieldRow, { marginTop: theme.spacing.s }]}>
            <Text style={styles.boldLabel}>VA Disability</Text>
            <TwoColumnPicker data={disabilityPickerData} selectedValue={vaDependencyStatus} onChange={handleDisabilityChange} displayName={disabilityDisplayName} isLoading={isLoading} error={disabilityError} primaryColumnValue={disabilityPercentage} primaryItems={disabilityPercentageItems} primaryPlaceholder="..." secondaryPlaceholder="Select disability rating" primarySort={(a, b) => Number(a.replace('%', '')) - Number(b.replace('%', ''))} />
        </View>
      </View>
    </View>
  );
};

export default PayDemographics;
