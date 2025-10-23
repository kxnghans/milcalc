import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRetirementCalculatorState, Card, IconRow, PayDisplay, SegmentedSelector, useTheme, StyledTextInput, PillButton } from '@repo/ui';
import PickerInput from '../components/PickerInput';
import DocumentModal from '../components/DocumentModal';
import { ICONS } from '@repo/ui/icons';
import DisabilityPicker from '../components/DisabilityPicker';
import CurrencyInput from '../components/CurrencyInput';
import NumberInput from '../components/NumberInput';

export default function RetirementCalculatorScreen() {
  const { theme, themeMode, toggleTheme } = useTheme();
  const [isPdfModalVisible, setPdfModalVisible] = React.useState(false);
  const {
    component,
    setComponent,
    retirementSystem,
    setRetirementSystem,
    high3Year1,
    setHigh3Year1,
    high3Year2,
    setHigh3Year2,
    high3Year3,
    setHigh3Year3,
    tspAmount,
    setTspAmount,
    servicePoints,
    setServicePoints,
    goodYears,
    setGoodYears,
    brsContribution,
    setBrsContribution,
    resetState,
    disabilityPercentage,
    setDisabilityPercentage,
    dependentStatus,
    setDependentStatus,
    disabilityData,
    isDisabilityLoading,
    disabilityError,
    percentageItems,
    statusItems,
    isTspCalculatorVisible,
    setIsTspCalculatorVisible,
    tspContributionAmount,
    setTspContributionAmount,
    tspContributionPercentage,
    setTspContributionPercentage,
    tspContributionYears,
    setTspContributionYears,
  } = useRetirementCalculatorState();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.s,
      paddingTop: theme.spacing.xs,
      paddingBottom: theme.spacing.xs,
    },
    fieldRow: {
      marginBottom: theme.spacing.m,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 8,
    },
        label: {
          ...theme.typography.body,
          color: theme.colors.text,
          marginBottom: theme.spacing.s,
        },
        centerLabel: {
          textAlign: 'center',
        },
      });
    
      const getThemeIcon = () => {
        if (themeMode === 'light') return ICONS.THEME_LIGHT;
        if (themeMode === 'dark') return ICONS.THEME_DARK;
        return ICONS.THEME_AUTO;
      };
    
      return (
        <ScrollView style={styles.container}>
          <DocumentModal category="RETIREMENT" isModalVisible={isPdfModalVisible} setModalVisible={setPdfModalVisible} />
          <Card containerStyle={{ marginBottom: theme.spacing.s }}>
            <PayDisplay
              annualPay="$0.00"
              monthlyPay="$0.00"
              payDetails={[]}
              deductions={[]}
              federalStandardDeduction={0}
              stateStandardDeduction={0}
              isStandardDeductionsExpanded={false}
              onToggleStandardDeductions={() => {}}
            />
          </Card>
          <IconRow icons={[
            {
                name: ICONS.RESET,
                onPress: resetState,
            },
            {
                name: ICONS.DOCUMENT,
                onPress: () => setPdfModalVisible(true),
            },
            {
                name: getThemeIcon(),
                onPress: toggleTheme,
            },
          ]} />
          <Card style={{ flex: 1, paddingBottom: 0 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <SegmentedSelector
                options={[{label: 'Active', value: 'Active'}, {label: 'Reserves', value: 'Reserves'}, {label: 'Guard', value: 'Guard'}]}
                selectedValues={[component]}
                onValueChange={(value) => setComponent(value)}
              />
              <SegmentedSelector
                options={[{label: 'High 3', value: 'High 3'}, {label: 'BRS', value: 'BRS'}]}
                selectedValues={[retirementSystem]}
                onValueChange={(value) => setRetirementSystem(value)}
              />
    
              {retirementSystem === 'High 3' && (
                <View>
                  <View style={styles.row}>
                    <View style={{flex: 1, marginRight: 8}}>
                      <Text style={[styles.label, styles.centerLabel]}>Year 1</Text>
                      <PickerInput items={[{label: '2023', value: '2023'}]} selectedValue={high3Year1} onValueChange={setHigh3Year1} placeholder="Select..." />
                    </View>
                    <View style={{flex: 1, marginRight: 8}}>
                      <Text style={[styles.label, styles.centerLabel]}>Year 2</Text>
                      <PickerInput items={[{label: '2022', value: '2022'}]} selectedValue={high3Year2} onValueChange={setHigh3Year2} placeholder="Select..." />
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={[styles.label, styles.centerLabel]}>Year 3</Text>
                      <PickerInput items={[{label: '2021', value: '2021'}]} selectedValue={high3Year3} onValueChange={setHigh3Year3} placeholder="Select..." />
                    </View>
                  </View>
                  <View style={styles.fieldRow}>
                    <Text style={styles.label}>Disability</Text>
                    <DisabilityPicker
                      onDisabilityChange={(percentage, status) => {
                        setDisabilityPercentage(percentage);
                        setDependentStatus(status);
                      }}
                      selectedDisability={{ percentage: disabilityPercentage, status: dependentStatus }}
                      displayName="Select Disability"
                      isLoading={isDisabilityLoading}
                      error={disabilityError}
                      percentageItems={percentageItems}
                      statusItems={statusItems}
                    />
                  </View>
                  <View style={styles.fieldRow}>
                    <Text style={styles.label}>TSP Amount</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <CurrencyInput style={{ flex: 1 }} placeholder="0.00" value={tspAmount} onChangeText={setTspAmount} />
                      <View style={{ width: theme.spacing.s }} />
                      <PillButton title={isTspCalculatorVisible ? "Input TSP" : "Calculate TSP"} onPress={() => setIsTspCalculatorVisible(!isTspCalculatorVisible)} backgroundColor={isTspCalculatorVisible ? theme.colors.disabled : theme.colors.primary} />
                    </View>
                  </View>

                  {isTspCalculatorVisible && (
                    <View style={styles.row}>
                        <View style={{flex: 5, marginRight: 8}}>
                            <Text style={[styles.label, styles.centerLabel]}>Avg Salary</Text>
                            <CurrencyInput placeholder="0.00" value={tspContributionAmount} onChangeText={setTspContributionAmount} />
                        </View>
                        <View style={{flex: 2, marginRight: 8}}>
                            <Text style={[styles.label, styles.centerLabel]}>Cont. %</Text>
                            <NumberInput placeholder="0" value={tspContributionPercentage} onChangeText={setTspContributionPercentage} />
                        </View>
                        <View style={{flex: 2}}>
                            <Text style={[styles.label, styles.centerLabel]}>Years</Text>
                            <NumberInput placeholder="0" value={tspContributionYears} onChangeText={setTspContributionYears} />
                        </View>
                    </View>
                  )}
                  <View style={styles.fieldRow}>
                    <Text style={styles.label}>Service Points</Text>
                    <NumberInput placeholder="0" value={servicePoints} onChangeText={setServicePoints} />
                  </View>
                  <View style={styles.fieldRow}>
                    <Text style={styles.label}>Good Years</Text>
                    <NumberInput placeholder="0" value={goodYears} onChangeText={setGoodYears} />
                  </View>
                </View>
              )}
            </ScrollView>
          </Card>
        </ScrollView>
      );
    }
    