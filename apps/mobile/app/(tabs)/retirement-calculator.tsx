import React from 'react';
import { ScrollView, View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRetirementCalculatorState, Card, IconRow, PayDisplay, SegmentedSelector, useTheme, StyledTextInput, PillButton } from '@repo/ui';
import PickerInput from '../components/PickerInput';
import DocumentModal from '../components/DocumentModal';
import { ICONS } from '@repo/ui/icons';
import CurrencyInput from '../components/CurrencyInput';
import NumberInput from '../components/NumberInput';
import TwoColumnPicker from '../components/TwoColumnPicker';

export default function RetirementCalculatorScreen() {
  const { theme, themeMode, toggleTheme } = useTheme();
  const [isPdfModalVisible, setPdfModalVisible] = React.useState(false);

  const {
    component,
    setComponent,
    retirementSystem,
    setRetirementSystem,
    high3PayGrade1,
    setHigh3PayGrade1,
    high3PayGrade2,
    setHigh3PayGrade2,
    high3PayGrade3,
    setHigh3PayGrade3,
    yearsOfService,
    setYearsOfService,
    filingStatus,
    setFilingStatus,
    brsPayGrade,
    setBrsPayGrade,
    tspAmount,
    setTspAmount,
    servicePoints,
    setServicePoints,
    goodYears,
    setGoodYears,
    resetState,
    mha,
    setMha,
    state,
    mhaData,
    isLoadingMha,
    mhaError,
    handleMhaChange,
    mhaDisplayName,
    disabilityPercentage,
    setDisabilityPercentage,
    dependentStatus,
    setDependentStatus,
    disabilityData,
    isDisabilityLoading,
    disabilityError,
    isTspCalculatorVisible,
    setIsTspCalculatorVisible,
    tspContributionAmount,
    setTspContributionAmount,
    tspContributionPercentage,
    setTspContributionPercentage,
    tspContributionYears,
    setTspContributionYears,
    tspType,
    setTspType,
    tspReturn,
    setTspReturn,
    showServicePoints,
    showGoodYears,
    payGrades,
    pension,
    disabilityIncome,
    tsp,
    taxes,
    isTspCalculated,
    calculateAndSetTsp,
    disabilityPickerData,
    handleDisabilityChange,
    disabilityDisplayName,
    federalStandardDeduction,
    stateStandardDeduction,
    isPayDisplayExpanded,
    setIsPayDisplayExpanded,
    birthDate,
    setBirthDate,
    serviceEntryDate,
    setServiceEntryDate,
    qualifyingDeploymentDays,
    setQualifyingDeploymentDays,
    retirementAge,
    isRetirementAgeCalculatorVisible,
    setIsRetirementAgeCalculatorVisible,
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
    boldLabel: {
        ...theme.typography.subtitle,
        color: theme.colors.text,
        marginBottom: theme.spacing.s,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.s,
    },
    expandableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    expandableContent: {
        overflow: 'hidden',
        marginTop: theme.spacing.s,
    },
    addIconContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.s,
    }
  });
    
      const getThemeIcon = () => {
        if (themeMode === 'light') return ICONS.THEME_LIGHT;
        if (themeMode === 'dark') return ICONS.THEME_DARK;
        return ICONS.THEME_AUTO;
      };
    
      const tspWithdrawal = tsp * 0.04;
      const annualPay = pension * 12 + disabilityIncome * 12 - taxes.federal - taxes.state + tspWithdrawal;
      const monthlyPay = pension + disabilityIncome - (taxes.federal / 12) - (taxes.state / 12) + (tspWithdrawal / 12);

      const payDetails = [
        { label: 'Pension', value: pension },
        { label: 'VA DISABILITY', value: disabilityIncome },
        { label: 'TSP', value: tspWithdrawal / 12 },
      ];

      const deductions = [
        { label: 'Federal Tax', value: taxes.federal },
        { label: 'State Tax', value: taxes.state },
      ];

      return (
        <View style={styles.container}>
          <DocumentModal category="RETIREMENT" isModalVisible={isPdfModalVisible} setModalVisible={setPdfModalVisible} />
          <View>
            <Card containerStyle={{ marginBottom: theme.spacing.s }}>
              <PayDisplay
                annualPay={annualPay}
                monthlyPay={monthlyPay}
                payDetails={payDetails}
                deductions={deductions}
                federalStandardDeduction={federalStandardDeduction}
                stateStandardDeduction={stateStandardDeduction}
                isStandardDeductionsExpanded={isPayDisplayExpanded}
                onToggleStandardDeductions={() => setIsPayDisplayExpanded(!isPayDisplayExpanded)}
                onGetRetirementAge={() => setIsRetirementAgeCalculatorVisible(!isRetirementAgeCalculatorVisible)}
                isRetirementAgeCalculatorVisible={isRetirementAgeCalculatorVisible}
                birthDate={birthDate}
                setBirthDate={setBirthDate}
                serviceEntryDate={serviceEntryDate}
                setServiceEntryDate={setServiceEntryDate}
                retirementAge={retirementAge}
                component={component}
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
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={{ flex: 1 }}>
              <Card style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{paddingBottom: 0}} showsVerticalScrollIndicator={false}>
                  <SegmentedSelector
                    style={{ marginLeft: 0, marginRight: 0 }}
                    options={[{label: 'Active', value: 'Active'}, {label: 'Reserves', value: 'Reserves'}, {label: 'Guard', value: 'Guard'}]}
                    selectedValues={[component]}
                    onValueChange={(value) => setComponent(value)}
                  />
                  <SegmentedSelector
                    style={{ marginLeft: 0, marginRight: 0, marginBottom: theme.spacing.m }}
                    options={[{label: 'High 3', value: 'High 3'}, {label: 'BRS', value: 'BRS'}]}
                    selectedValues={[retirementSystem]}
                    onValueChange={(value) => setRetirementSystem(value)}
                  />

                  <View style={styles.fieldRow}>
                    <Text style={styles.boldLabel}>Years of Service</Text>
                    <NumberInput placeholder="0" value={yearsOfService} onChangeText={setYearsOfService} />
                  </View>

                  <View style={styles.row}>
                    <View style={{flex: 1, marginRight: 8}}>
                      <Text style={[styles.boldLabel, styles.centerLabel]}>Year -2</Text>
                      <PickerInput items={payGrades.map(grade => ({label: grade, value: grade}))} selectedValue={high3PayGrade1} onValueChange={setHigh3PayGrade1} placeholder="Select..." disabled={!yearsOfService || yearsOfService < 3} />
                    </View>
                    <View style={{flex: 1, marginRight: 8}}>
                      <Text style={[styles.boldLabel, styles.centerLabel]}>Year -1</Text>
                      <PickerInput items={payGrades.map(grade => ({label: grade, value: grade}))} selectedValue={high3PayGrade2} onValueChange={setHigh3PayGrade2} placeholder="Select..." disabled={!yearsOfService || yearsOfService < 3} />
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={[styles.boldLabel, styles.centerLabel]}>Final Year</Text>
                      <PickerInput items={payGrades.map(grade => ({label: grade, value: grade}))} selectedValue={high3PayGrade3} onValueChange={setHigh3PayGrade3} placeholder="Select..." disabled={!yearsOfService || yearsOfService < 3} />
                    </View>
                  </View>

                  <View style={styles.fieldRow}>
                    <Text style={styles.boldLabel}>Filing Status</Text>
                    <SegmentedSelector
                      style={{ marginLeft: 0, marginRight: 0 }}
                      options={[{label: 'Single', value: 'Single'}, {label: 'Married', value: 'Married'}]}
                      selectedValues={[filingStatus]}
                      onValueChange={(value) => setFilingStatus(value)}
                    />
                  </View>


        
                  <View>

                    <View style={styles.fieldRow}>
                      <Text style={styles.boldLabel}>MHA</Text>
                      <TwoColumnPicker data={mhaData} selectedValue={mha} onChange={handleMhaChange} displayName={mhaDisplayName} isLoading={isLoadingMha} error={mhaError} primaryColumnValue={state} />
                    </View>
                    <View style={styles.fieldRow}>
                      <Text style={styles.boldLabel}>VA Disability</Text>
                      <TwoColumnPicker data={disabilityPickerData} selectedValue={dependentStatus} onChange={handleDisabilityChange} displayName={disabilityDisplayName} isLoading={isDisabilityLoading} error={disabilityError} primaryColumnValue={disabilityPercentage} primaryPlaceholder="Select..." secondaryPlaceholder="No Disability" />
                    </View>
                    <View style={styles.fieldRow}>
                      <Text style={styles.boldLabel}>TSP</Text>
                      <SegmentedSelector
                        style={{ marginLeft: 0, marginRight: 0, marginBottom: theme.spacing.m }}
                        options={[{label: 'Roth', value: 'Roth'}, {label: 'Traditional', value: 'Traditional'}]}
                        selectedValues={[tspType]}
                        onValueChange={(value) => setTspType(value)}
                      />
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CurrencyInput style={{ flex: 1 }} placeholder="0.00" value={tspAmount} onChangeText={setTspAmount} editable={!isTspCalculatorVisible} />
                        <View style={{ width: theme.spacing.s }} />
                        <PillButton title={isTspCalculatorVisible ? "Input TSP" : "Calculate TSP"} onPress={() => setIsTspCalculatorVisible(!isTspCalculatorVisible)} backgroundColor={isTspCalculatorVisible ? theme.colors.disabled : theme.colors.primary} style={{ marginTop: 0, marginBottom: 0 }} textStyle={theme.typography.bodybold} />
                      </View>
                    </View>
    
                    {isTspCalculatorVisible && (
                      <View style={styles.row}>
                          <View style={{flex: 4.75, marginRight: 8}}>
                              <Text style={[styles.boldLabel, styles.centerLabel]}>Avg Salary</Text>
                              <CurrencyInput placeholder="0.00" value={tspContributionAmount} onChangeText={setTspContributionAmount} />
                          </View>
                          <View style={{flex: 2, marginRight: 8}}>
                              <Text style={[styles.boldLabel, styles.centerLabel]}>Cont. %</Text>
                              <NumberInput placeholder="0" value={tspContributionPercentage} onChangeText={setTspContributionPercentage} />
                          </View>
                          <View style={{flex: 2, marginRight: 8}}>
                              <Text style={[styles.boldLabel, styles.centerLabel]}>Years</Text>
                              <NumberInput placeholder="0" value={tspContributionYears} onChangeText={setTspContributionYears} />
                          </View>
                          <View style={{flex: 3}}>
                              <Text style={[styles.boldLabel, styles.centerLabel]}>Return</Text>
                              <PickerInput items={Array.from({ length: 51 }, (_, i) => ({ label: `${i}%`, value: i }))} selectedValue={tspReturn} onValueChange={setTspReturn} placeholder="Select..." />
                          </View>
                      </View>
                    )}
                    {showServicePoints && <View style={styles.fieldRow}>
                      <Text style={styles.boldLabel}>Service Points</Text>
                      <NumberInput placeholder="0" value={servicePoints} onChangeText={setServicePoints} />
                    </View>}
                    {showGoodYears && <View style={styles.fieldRow}>
                      <Text style={styles.boldLabel}>Good Years</Text>
                      <NumberInput placeholder="0" value={goodYears} onChangeText={setGoodYears} />
                    </View>}
                    {component !== 'Active' && <View style={styles.fieldRow}>
                      <Text style={styles.boldLabel}>Qualifying Deployment Days</Text>
                      <NumberInput placeholder="0" value={qualifyingDeploymentDays} onChangeText={setQualifyingDeploymentDays} />
                    </View>}
                  </View>
                </ScrollView>
              </Card>
            </View>
          </KeyboardAvoidingView>
        </View>
      );
    }