import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator, Pressable, ImageSourcePropType, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRetirementCalculatorState, Card, IconRow, PayDisplay, SegmentedSelector, useTheme, StyledTextInput, PillButton, MASCOT_URLS } from '@repo/ui';
import PickerInput from '../components/PickerInput';
import DocumentModal from '../components/DocumentModal';
import { useNavigation } from '@react-navigation/native';
import { ICONS } from '@repo/ui/icons';
import CurrencyInput from '../components/CurrencyInput';
import NumberInput from '../components/NumberInput';
import TwoColumnPicker from '../components/TwoColumnPicker';
import DetailModal from '../components/DetailModal';
import DismissKeyboardView from '../components/DismissKeyboardView';
import ScreenHeader from '../components/ScreenHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const retirementMascot = { uri: MASCOT_URLS.RETIREMENT };

export default function RetirementCalculatorScreen() {
  const { theme, themeMode, toggleTheme, isDarkMode } = useTheme();
  const [isPdfModalVisible, setPdfModalVisible] = React.useState(false);
  const [detailModalContentKey, setDetailModalContentKey] = React.useState<string | null>(null);
  const [detailModalMascot, setDetailModalMascot] = React.useState<ImageSourcePropType | null>(null);

  const openDetailModal = (key: string, mascot: ImageSourcePropType) => {
    setDetailModalContentKey(key);
    setDetailModalMascot(mascot);
  };

  const closeDetailModal = () => {
    setDetailModalContentKey(null);
    setDetailModalMascot(null);
  };

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
    isLoading,
    mhaError,
    handleMhaChange,
    mhaDisplayName,
    disabilityPercentage,
    setDisabilityPercentage,
    dependentStatus,
    setDependentStatus,
    disabilityData,
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
    payGrades,
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

  const navigation = useNavigation();

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
        // If it was already collapsed, we don't want to expand it automatically later
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
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
      paddingHorizontal: theme.spacing.s,
    },
    label: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
      marginHorizontal: theme.spacing.s,
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

  const LabelWithHelp = ({ label, contentKey, mascot }) => (
    <View style={styles.labelRow}>
        <Text style={{ ...theme.typography.subtitle, color: theme.colors.text }}>{label}</Text>
        <Pressable onPress={() => openDetailModal(contentKey, mascot)}>
            <MaterialCommunityIcons name="help-circle-outline" size={16} color={theme.colors.disabled} />
        </Pressable>
    </View>
  );
    
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
          <ScreenHeader title="Retirement" isLoading={isLoading} />
          <DetailModal
            isVisible={!!detailModalContentKey}
            onClose={closeDetailModal}
            contentKey={detailModalContentKey}
            source="retirement"
            mascotAsset={detailModalMascot}
          />
          <DocumentModal category="RETIREMENT" isModalVisible={isPdfModalVisible} setModalVisible={setPdfModalVisible} />
          <View style={styles.content}>
            <DismissKeyboardView style={{ flex: 0, width: '100%' }}>
                <Card containerStyle={{ marginBottom: theme.spacing.s }}>
                                <PayDisplay
                                    onHelpPress={() => openDetailModal('Retirement Display Summary', retirementMascot)}                annualPay={annualPay}
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
                    breakInService={breakInService}
                    setBreakInService={setBreakInService}
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
            </DismissKeyboardView>
            <View style={{ flex: 1 }}>
                <Card style={{ flex: 1 }}>
                <KeyboardAwareScrollView contentContainerStyle={{paddingBottom: 0, flexGrow: 1}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <DismissKeyboardView>
                    <SegmentedSelector
                    options={[{label: 'Active', value: 'Active'}, {label: 'Reserves', value: 'Reserves'}, {label: 'Guard', value: 'Guard'}]}
                    selectedValues={[component]}
                    onValueChange={(value) => setComponent(value)}
                    />
                    <SegmentedSelector
                    style={{ marginBottom: theme.spacing.m }}
                    options={[{label: 'High 3', value: 'High 3'}, {label: 'BRS', value: 'BRS'}]}
                    selectedValues={[retirementSystem]}
                    onValueChange={(value) => setRetirementSystem(value)}
                    />

                    <View style={styles.fieldRow}>
                    <LabelWithHelp label="Years of Service" contentKey="High-3" mascot={retirementMascot} />
                    <NumberInput placeholder="0" value={yearsOfService} onChangeText={setYearsOfService} style={{ marginHorizontal: theme.spacing.s }} />
                    </View>

                    <View style={styles.row}>
                    <View style={{flex: 1, marginRight: 8}}>
                        <Text style={[styles.boldLabel, styles.centerLabel, { marginHorizontal: 0 }]}>Year -2</Text>
                        <PickerInput items={payGradesForYear1.map(grade => ({label: grade, value: grade}))} selectedValue={high3PayGrade1} onValueChange={setHigh3PayGrade1} placeholder="Select..." disabled={!yearsOfService || yearsOfService < 3} />
                    </View>
                    <View style={{flex: 1, marginRight: 8}}>
                        <Text style={[styles.boldLabel, styles.centerLabel, { marginHorizontal: 0 }]}>Year -1</Text>
                        <PickerInput items={payGradesForYear2.map(grade => ({label: grade, value: grade}))} selectedValue={high3PayGrade2} onValueChange={setHigh3PayGrade2} placeholder="Select..." disabled={!yearsOfService || yearsOfService < 3} />
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={[styles.boldLabel, styles.centerLabel, { marginHorizontal: 0 }]}>Final Year</Text>
                        <PickerInput items={payGradesForYear3.map(grade => ({label: grade, value: grade}))} selectedValue={high3PayGrade3} onValueChange={setHigh3PayGrade3} placeholder="Select..." disabled={!yearsOfService || yearsOfService < 3} />
                    </View>
                    </View>

                    <View style={styles.fieldRow}>
                    <Text style={styles.boldLabel}>Filing Status</Text>
                    <SegmentedSelector
                        options={[{label: 'Single', value: 'Single'}, {label: 'Married', value: 'Married'}]}
                        selectedValues={[filingStatus]}
                        onValueChange={(value) => setFilingStatus(value)}
                    />
                    </View>


            
                    <View>

                    <View style={styles.fieldRow}>
                        <Text style={styles.boldLabel}>MHA</Text>
                        <TwoColumnPicker data={mhaData} selectedValue={mha} onChange={handleMhaChange} displayName={mhaDisplayName} isLoading={isLoading} error={mhaError} primaryColumnValue={state} secondaryPlaceholder="Select a location" style={{ marginHorizontal: theme.spacing.s }} />
                    </View>
                    <View style={styles.fieldRow}>
                        <Text style={styles.boldLabel}>VA Disability</Text>
                        <TwoColumnPicker data={disabilityPickerData} selectedValue={dependentStatus} onChange={handleDisabilityChange} displayName={disabilityDisplayName} isLoading={isLoading} error={disabilityError} primaryColumnValue={disabilityPercentage} primaryItems={disabilityPercentageItems} primaryPlaceholder="..." secondaryPlaceholder="Select disability rating" primarySort={(a, b) => Number(a.replace('%', '')) - Number(b.replace('%', ''))} style={{ marginHorizontal: theme.spacing.s }} />
                    </View>
                    <View style={styles.fieldRow}>
                        <LabelWithHelp label="TSP" contentKey="TSP" mascot={retirementMascot} />
                        <SegmentedSelector
                        style={{ marginBottom: theme.spacing.m }}
                        options={[{label: 'Roth', value: 'Roth'}, {label: 'Traditional', value: 'Traditional'}]}
                        selectedValues={[tspType]}
                        onValueChange={(value) => setTspType(value)}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: theme.spacing.s }}>
                        <CurrencyInput style={{ flex: 1 }} placeholder="0.00" value={tspAmount} onChangeText={setTspAmount} editable={!isTspCalculatorVisible} />
                        <View style={{ width: theme.spacing.s }} />
                        <PillButton title={isTspCalculatorVisible ? "Input TSP" : "Calculate TSP"} onPress={() => setIsTspCalculatorVisible(!isTspCalculatorVisible)} backgroundColor={isTspCalculatorVisible ? theme.colors.disabled : theme.colors.primary} style={{ marginTop: 0, marginBottom: 0 }} textStyle={theme.typography.bodybold} />
                        </View>
                    </View>
        
                    {isTspCalculatorVisible && (
                        <View style={styles.row}>
                            <View style={{flex: 4.75, marginRight: 8}}>
                                <Text style={[styles.boldLabel, styles.centerLabel, { marginHorizontal: 0 }]}>Avg Salary</Text>
                                <CurrencyInput placeholder="0.00" value={tspContributionAmount} onChangeText={setTspContributionAmount} />
                            </View>
                            <View style={{flex: 2, marginRight: 8}}>
                                <Text style={[styles.boldLabel, styles.centerLabel, { marginHorizontal: 0 }]}>Cont. %</Text>
                                <NumberInput placeholder="0" value={tspContributionPercentage} onChangeText={setTspContributionPercentage} />
                            </View>
                            <View style={{flex: 2, marginRight: 8}}>
                                <Text style={[styles.boldLabel, styles.centerLabel, { marginHorizontal: 0 }]}>Years</Text>
                                <NumberInput placeholder="0" value={tspContributionYears} onChangeText={setTspContributionYears} />
                            </View>
                            <View style={{flex: 3}}>
                                <Text style={[styles.boldLabel, styles.centerLabel, { marginHorizontal: 0 }]}>Return</Text>
                                <PickerInput items={Array.from({ length: 51 }, (_, i) => ({ label: `${i}%`, value: i }))} selectedValue={tspReturn} onValueChange={setTspReturn} placeholder="Select..." />
                            </View>
                        </View>
                    )}
                    {showServicePoints && <View style={styles.fieldRow}>
                        <LabelWithHelp label="Service Points" contentKey="Service Points" mascot={retirementMascot} />
                        <NumberInput placeholder="0" value={servicePoints} onChangeText={setServicePoints} style={{ marginHorizontal: theme.spacing.s }} />
                    </View>}
                    {showGoodYears && <View style={styles.fieldRow}>
                        <LabelWithHelp label="Good Years" contentKey="Good Years" mascot={retirementMascot} />
                        <NumberInput placeholder="0" value={goodYears} onChangeText={setGoodYears} style={{ marginHorizontal: theme.spacing.s }} />
                    </View>}
                    {component !== 'Active' && <View style={styles.fieldRow}>
                        <LabelWithHelp label="Qualifying Deployment Days" contentKey="Qualifying Deployment Days" mascot={retirementMascot} />
                        <NumberInput placeholder="0" value={qualifyingDeploymentDays} onChangeText={setQualifyingDeploymentDays} style={{ marginHorizontal: theme.spacing.s }} />
                    </View>}
                    </View>
                    </DismissKeyboardView>
                </KeyboardAwareScrollView>
                </Card>
            </View>
          </View>
        </View>
      );
    }