import React from 'react';
import { View, Text, StyleSheet, Platform, Pressable, Keyboard, ImageSourcePropType } from 'react-native';
import { useRetirementCalculatorState, PayDisplay, SegmentedSelector, PillButton, MASCOT_URLS, useTheme } from '@repo/ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PickerInput from '../../components/PickerInput';
import CurrencyInput from '../../components/CurrencyInput';
import NumberInput from '../../components/NumberInput';
import TwoColumnPicker from '../../components/TwoColumnPicker';
import MainCalculatorLayout from '../../components/MainCalculatorLayout';
import { useOverlay } from '../../contexts/OverlayContext';

const retirementMascot = { uri: MASCOT_URLS.RETIREMENT };

const componentOptions = [{label: 'Active', value: 'Active'}, {label: 'Reserves', value: 'Reserves'}, {label: 'Guard', value: 'Guard'}];
const componentRatios = [4, 5, 4];
const retirementSystemOptions = [{label: 'High 3', value: 'High 3'}, {label: 'BRS', value: 'BRS'}];
const filingStatusOptions = [{label: 'Single', value: 'Single'}, {label: 'Married', value: 'Married'}];
const tspTypeOptions = [{label: 'Roth', value: 'Roth'}, {label: 'Traditional', value: 'Traditional'}];

interface LabelWithHelpProps {
  label: string;
  contentKey: string;
  onPress: (key: string) => void;
  style: any;
  textStyle: any;
  iconColor: string;
}

const LabelWithHelp = ({ label, contentKey, onPress, style, textStyle, iconColor }: LabelWithHelpProps) => (
  <View style={style}>
    <Text style={textStyle}>{label}</Text>
    <Pressable onPress={() => onPress(contentKey)}>
      <MaterialCommunityIcons name="help-circle-outline" size={16} color={iconColor} />
    </Pressable>
  </View>
);

export default function RetirementCalculatorScreen() {
  const { theme } = useTheme();
  const { openHelp, openDocuments } = useOverlay();

  const handleOpenHelp = React.useCallback((key: string, mascot?: ImageSourcePropType) => {
    openHelp(key, 'retirement', mascot);
  }, [openHelp]);

  const {
    // ... (rest of the destructuring remains the same)
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
    tspAmount,
    setTspAmount,
    servicePoints,
    setServicePoints,
    goodYears,
    setGoodYears,
    resetState,
    mha,
    state,
    mhaData,
    isLoading,
    mhaError,
    handleMhaChange,
    mhaDisplayName,
    disabilityPercentage,
    dependentStatus,
    disabilityError,
    isTspCalculatorVisible,
    setIsTspCalculatorVisible,
    tspContributionAmount,
    setTspContributionAmount,
    tspContributionPercentage,
    setTspContributionPercentage,
    tspContributionYears,
    setTspContributionYears,
    showServicePoints,
    showGoodYears,
    disabilityPickerData,
    disabilityPercentageItems,
    handleDisabilityChange,
    disabilityDisplayName,
    tspType,
    setTspType,
    tspReturn,
    setTspReturn,
    payGradesForYear1,
    payGradesForYear2,
    payGradesForYear3,
    birthDate,
    setBirthDate,
    serviceEntryDate,
    setServiceEntryDate,
    qualifyingDeploymentDays,
    setQualifyingDeploymentDays,
    isPayDisplayExpanded,
    setIsPayDisplayExpanded,
    isRetirementAgeCalculatorVisible,
    setIsRetirementAgeCalculatorVisible,
    retirementAge,
    federalStandardDeduction,
    stateStandardDeduction,
    pension,
    disabilityIncome,
    tsp,
    taxes,
    breakInService,
    setBreakInService,
  } = useRetirementCalculatorState();

  const wasExpandedBeforeKeyboard = React.useRef(false);
  const isExpandedRef = React.useRef(isPayDisplayExpanded);

  // Keep ref in sync with state to avoid stale closures in listeners
  React.useEffect(() => {
    isExpandedRef.current = isPayDisplayExpanded;
  }, [isPayDisplayExpanded]);

  React.useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = () => {
      if (isExpandedRef.current) {
        wasExpandedBeforeKeyboard.current = true;
        setIsPayDisplayExpanded(false);
      } else {
        wasExpandedBeforeKeyboard.current = false;
      }
    };

    const onHide = () => {
      if (wasExpandedBeforeKeyboard.current) {
        setIsPayDisplayExpanded(true);
        wasExpandedBeforeKeyboard.current = false;
      }
    };

    const showListener = Keyboard.addListener(showEvent, onShow);
    const hideListener = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [setIsPayDisplayExpanded]);

  const styles = React.useMemo(() => StyleSheet.create({
    fieldRow: {
      marginBottom: theme.spacing.m,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 8,
      paddingHorizontal: theme.spacing.s,
    },
    centerLabel: {
      textAlign: 'center',
    },
    boldLabel: {
        ...theme.typography.subtitle,
        color: theme.colors.text,
        marginBottom: theme.spacing.s,
        marginHorizontal: theme.spacing.s,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.s,
        marginHorizontal: theme.spacing.s,
    },
    labelHelpText: {
        ...theme.typography.subtitle,
        color: theme.colors.text
    },
    segmentedSelectorSpacing: {
        marginBottom: theme.spacing.m,
    },
    marginHorizontalS: {
        marginHorizontal: theme.spacing.s,
    },
    yearColumn: {
        flex: 1,
        marginRight: 8,
    },
    lastYearColumn: {
        flex: 1,
    },
    boldLabelNoMargin: {
        marginHorizontal: 0,
    },
    tspInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: theme.spacing.s,
    },
    tspAmountInput: {
        flex: 1,
    },
    tspSpacer: {
        width: theme.spacing.s,
    },
    tspPillButton: {
        marginTop: 0,
        marginBottom: 0,
    },
    avgSalaryColumn: {
        flex: 4.75,
        marginRight: 8,
    },
    contPercentageColumn: {
        flex: 2,
        marginRight: 8,
    },
    contYearsColumn: {
        flex: 2,
        marginRight: 8,
    },
    returnColumn: {
        flex: 3,
    }
    }), [theme]);
    
  const tspWithdrawal = tsp * 0.04;
  const annualPay = pension * 12 + disabilityIncome * 12 - (taxes?.federal || 0) - (taxes?.state || 0) + tspWithdrawal;
  const monthlyPay = pension + disabilityIncome - ((taxes?.federal || 0) / 12) - ((taxes?.state || 0) / 12) + (tspWithdrawal / 12);

  const payDetails = React.useMemo(() => [
    { label: 'Pension', value: pension },
    { label: 'VA DISABILITY', value: disabilityIncome },
    { label: 'TSP', value: tspWithdrawal / 12 },
  ], [pension, disabilityIncome, tspWithdrawal]);

  const deductions = React.useMemo(() => [
    { label: 'Federal Tax', value: taxes?.federal || 0 },
    { label: 'State Tax', value: taxes?.state || 0 },
  ], [taxes?.federal, taxes?.state]);

  const yearsOfServiceNum = parseInt(yearsOfService) || 0;

  const payGradesForYear1Options = React.useMemo(() => payGradesForYear1.map(grade => ({label: grade, value: grade})), [payGradesForYear1]);
  const payGradesForYear2Options = React.useMemo(() => payGradesForYear2.map(grade => ({label: grade, value: grade})), [payGradesForYear2]);
  const payGradesForYear3Options = React.useMemo(() => payGradesForYear3.map(grade => ({label: grade, value: grade})), [payGradesForYear3]);
  const tspReturnOptions = React.useMemo(() => Array.from({ length: 51 }, (_, i) => ({ label: `${i}%`, value: i })), []);

  return (
    <MainCalculatorLayout
      title="Retirement"
      isLoading={isLoading}
      actions={['reset', 'document', 'theme']}
      onReset={resetState}
      onDocument={() => openDocuments('RETIREMENT')}
      summaryContent={
        <PayDisplay
            onHelpPress={() => handleOpenHelp('Retirement Display Summary', retirementMascot)}                
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
            birthDate={birthDate || undefined}
            setBirthDate={setBirthDate}
            serviceEntryDate={serviceEntryDate || undefined}
            setServiceEntryDate={setServiceEntryDate}
            retirementAge={retirementAge || undefined}
            component={component}
            breakInService={breakInService}
            setBreakInService={setBreakInService}
        />
      }
      inputContent={
        <>
            <SegmentedSelector
              options={componentOptions}
              ratios={componentRatios}
              selectedValues={[component]}
              onValueChange={(value) => setComponent(value)}
            />
            <SegmentedSelector
              style={styles.segmentedSelectorSpacing}
              options={retirementSystemOptions}
              selectedValues={[retirementSystem]}
              onValueChange={(value) => setRetirementSystem(value)}
            />

            <View style={styles.fieldRow}>
              <LabelWithHelp 
                label="Years of Service" 
                contentKey="High-3" 
                onPress={handleOpenHelp}
                style={styles.labelRow}
                textStyle={styles.labelHelpText}
                iconColor={theme.colors.disabled}
              />
              <NumberInput placeholder="0" value={yearsOfService} onChangeText={setYearsOfService} style={styles.marginHorizontalS} />
            </View>

            <View style={styles.row}>
              <View style={styles.yearColumn}>
                  <Text style={[styles.boldLabel, styles.centerLabel, styles.boldLabelNoMargin]}>Year -2</Text>
                  <PickerInput items={payGradesForYear1Options} selectedValue={high3PayGrade1} onValueChange={(val) => setHigh3PayGrade1(val as string | null)} placeholder="Select..." disabled={yearsOfServiceNum < 3} />
              </View>
              <View style={styles.yearColumn}>
                  <Text style={[styles.boldLabel, styles.centerLabel, styles.boldLabelNoMargin]}>Year -1</Text>
                  <PickerInput items={payGradesForYear2Options} selectedValue={high3PayGrade2} onValueChange={(val) => setHigh3PayGrade2(val as string | null)} placeholder="Select..." disabled={yearsOfServiceNum < 3} />
              </View>
              <View style={styles.lastYearColumn}>
                  <Text style={[styles.boldLabel, styles.centerLabel, styles.boldLabelNoMargin]}>Final Year</Text>
                  <PickerInput items={payGradesForYear3Options} selectedValue={high3PayGrade3} onValueChange={(val) => setHigh3PayGrade3(val as string | null)} placeholder="Select..." disabled={yearsOfServiceNum < 3} />
              </View>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.boldLabel}>Filing Status</Text>
              <SegmentedSelector
                  options={filingStatusOptions}
                  selectedValues={[filingStatus]}
                  onValueChange={(value) => setFilingStatus(value)}
              />
            </View>

            <View style={styles.fieldRow}>
                <Text style={styles.boldLabel}>MHA</Text>
                <TwoColumnPicker data={mhaData || null} selectedValue={mha} onChange={(val, prim) => handleMhaChange(val as string, prim)} displayName={mhaDisplayName} isLoading={isLoading} error={mhaError} primaryColumnValue={state} secondaryPlaceholder="Select a location" style={styles.marginHorizontalS} />
            </View>
            <View style={styles.fieldRow}>
                <Text style={styles.boldLabel}>VA Disability</Text>
                <TwoColumnPicker data={disabilityPickerData as Record<string, { label: string; value: string | number | null }[]> | null} selectedValue={dependentStatus} onChange={(val, prim) => handleDisabilityChange(val as string, prim)} displayName={disabilityDisplayName} isLoading={isLoading} error={disabilityError} primaryColumnValue={disabilityPercentage} primaryItems={disabilityPercentageItems} primaryPlaceholder="..." secondaryPlaceholder="Select disability rating" primarySort={(a, b) => Number(a.replace('%', '')) - Number(b.replace('%', ''))} style={styles.marginHorizontalS} />
            </View>
            <View style={styles.fieldRow}>
                <LabelWithHelp 
                  label="TSP" 
                  contentKey="TSP" 
                  onPress={handleOpenHelp}
                  style={styles.labelRow}
                  textStyle={styles.labelHelpText}
                  iconColor={theme.colors.disabled}
                />
                <SegmentedSelector
                style={styles.segmentedSelectorSpacing}
                options={tspTypeOptions}
                selectedValues={[tspType]}
                onValueChange={(value) => setTspType(value)}
                />
                <View style={styles.tspInputRow}>
                <CurrencyInput style={styles.tspAmountInput} placeholder="0.00" value={tspAmount} onChangeText={setTspAmount} editable={!isTspCalculatorVisible} />
                <View style={styles.tspSpacer} />
                <PillButton title={isTspCalculatorVisible ? "Input TSP" : "Calculate TSP"} onPress={() => setIsTspCalculatorVisible(!isTspCalculatorVisible)} backgroundColor={isTspCalculatorVisible ? theme.colors.disabled : theme.colors.primary} style={styles.tspPillButton} textStyle={theme.typography.bodybold} />
                </View>
            </View>

            {isTspCalculatorVisible && (
                <View style={styles.row}>
                    <View style={styles.avgSalaryColumn}>
                        <Text style={[styles.boldLabel, styles.centerLabel, styles.boldLabelNoMargin]}>Avg Salary</Text>
                        <CurrencyInput placeholder="0.00" value={tspContributionAmount} onChangeText={setTspContributionAmount} />
                    </View>
                    <View style={styles.contPercentageColumn}>
                        <Text style={[styles.boldLabel, styles.centerLabel, styles.boldLabelNoMargin]}>Cont. %</Text>
                        <NumberInput placeholder="0" value={tspContributionPercentage} onChangeText={setTspContributionPercentage} />
                    </View>
                    <View style={styles.contYearsColumn}>
                        <Text style={[styles.boldLabel, styles.centerLabel, styles.boldLabelNoMargin]}>Years</Text>
                        <NumberInput placeholder="0" value={tspContributionYears} onChangeText={setTspContributionYears} />
                    </View>
                    <View style={styles.returnColumn}>
                        <Text style={[styles.boldLabel, styles.centerLabel, styles.boldLabelNoMargin]}>Return</Text>
                        <PickerInput items={tspReturnOptions} selectedValue={tspReturn} onValueChange={(val) => setTspReturn(val as number)} placeholder="Select..." />
                    </View>
                </View>
            )}
            {showServicePoints && <View style={styles.fieldRow}>
                <LabelWithHelp 
                  label="Service Points" 
                  contentKey="Service Points" 
                  onPress={handleOpenHelp}
                  style={styles.labelRow}
                  textStyle={styles.labelHelpText}
                  iconColor={theme.colors.disabled}
                />
                <NumberInput placeholder="0" value={servicePoints} onChangeText={setServicePoints} style={styles.marginHorizontalS} />
            </View>}
            {showGoodYears && <View style={styles.fieldRow}>
                <LabelWithHelp 
                  label="Good Years" 
                  contentKey="Good Years" 
                  onPress={handleOpenHelp}
                  style={styles.labelRow}
                  textStyle={styles.labelHelpText}
                  iconColor={theme.colors.disabled}
                />
                <NumberInput placeholder="0" value={goodYears} onChangeText={setGoodYears} style={styles.marginHorizontalS} />
            </View>}
            {component !== 'Active' && <View style={styles.fieldRow}>
                <LabelWithHelp 
                  label="Qualifying Deployment Days" 
                  contentKey="Qualifying Deployment Days" 
                  onPress={handleOpenHelp}
                  style={styles.labelRow}
                  textStyle={styles.labelHelpText}
                  iconColor={theme.colors.disabled}
                />
                <NumberInput placeholder="0" value={qualifyingDeploymentDays} onChangeText={setQualifyingDeploymentDays} style={styles.marginHorizontalS} />
            </View>}
        </>
      }
    />
  );
}
