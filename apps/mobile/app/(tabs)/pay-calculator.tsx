import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, LayoutAnimation, UIManager, Platform, TouchableOpacity } from 'react-native';
import { usePayCalculatorState, Card, IconRow, PayDisplay, SegmentedSelector, useTheme, PillButton } from '@repo/ui';
import { ICONS } from '@repo/ui/icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DocumentModal from '../components/DocumentModal';
import Divider from '../components/Divider';
import InsetTextInput from '../components/InsetTextInput';
import PickerInput from '../components/PickerInput';
import NumberInput from '../components/NumberInput';
import CurrencyInput from '../components/CurrencyInput';
import DetailModal from '../components/DetailModal';

import VerticalDivider from '../components/VerticalDivider';
import TwoColumnPicker from '../components/TwoColumnPicker';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PayCalculatorScreen() {
  const { theme, themeMode, toggleTheme } = useTheme();
  const [isPdfModalVisible, setPdfModalVisible] = React.useState(false);
  const [detailModalContentKey, setDetailModalContentKey] = React.useState<string | null>(null);

  const openDetailModal = (key: string) => {
    setDetailModalContentKey(key);
  };

  const closeDetailModal = () => {
    setDetailModalContentKey(null);
  };

  const {
    // Display Values
    annualPay,
    monthlyPay,
    incomeForDisplay,
    deductionsForDisplay,
    // Data for Pickers
    mhaData,
    isLoadingMha,
    mhaError,
    filteredRanks,
    // Form State & Setters
    status, setStatus,
    rank, setRank,
    yearsOfService, setYearsOfService,
    mha, setMha,
    handleMhaChange,
    mhaDisplayName,
    filingStatus, setFilingStatus,
    dependencyStatus, setDependencyStatus,
    isIncomeExpanded, setIncomeExpanded,
    isDeductionsExpanded, setDeductionsExpanded,
    specialPays, setSpecialPays,
    additionalIncomes, setAdditionalIncomes,
    deductions, setDeductions,
    additionalDeductions, setAdditionalDeductions,
    showAddIncomeButton,
    showAddDeductionButton,
    isTaxOverride, 
    setIsTaxOverride,
    federalStandardDeduction,
    stateStandardDeduction,
    resetState,
  } = usePayCalculatorState();

  const toggleIncome = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIncomeExpanded(!isIncomeExpanded);
  };

  const toggleDeductions = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDeductionsExpanded(!isDeductionsExpanded);
  };

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
    label: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
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

  const LabelWithHelp = ({ label, contentKey }) => (
    <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Pressable onPress={() => openDetailModal(contentKey)}>
            <MaterialCommunityIcons name="help-circle-outline" size={16} color={theme.colors.disabled} />
        </Pressable>
    </View>
  );

  const RoundIconButton = ({ onPress, iconName, backgroundColor, size = 24, iconSize = 16, iconColor = '#FFFFFF' }) => (
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

  const AddButton = ({ onPress }) => (
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

  const CancelButton = ({ onPress }) => (
    <RoundIconButton
        onPress={onPress}
        iconName="close"
        backgroundColor={theme.colors.error}
        size={20}
        iconSize={14}
    />
  );

  return (
    <View style={styles.container}>
        <DocumentModal category="PAY" isModalVisible={isPdfModalVisible} setModalVisible={setPdfModalVisible} />
        <DetailModal
            isVisible={!!detailModalContentKey}
            onClose={closeDetailModal}
            contentKey={detailModalContentKey}
            source="pay"
        />
        <Card containerStyle={{ marginBottom: theme.spacing.s }}>
            <PayDisplay
                annualPay={annualPay}
                monthlyPay={monthlyPay}
                payDetails={incomeForDisplay}
                deductions={deductionsForDisplay}
                federalStandardDeduction={federalStandardDeduction}
                stateStandardDeduction={stateStandardDeduction}
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
        <Card style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{paddingBottom: 0}} showsVerticalScrollIndicator={false}>
                {/* Two-Column Layout for Demographics */}
                <View style={{ flexDirection: 'row' }}>
                    {/* Left Column */}
                    <View style={{ flex: 1 }}>
                        <View style={[styles.fieldRow, { marginBottom: theme.spacing.s }]}>
                            <Text style={[styles.boldLabel, { marginBottom: 0 }]}>Status</Text>
                            <SegmentedSelector
                                options={[{label: 'Officer', value: 'Officer'}, {label: 'WO', value: 'Warrant Officer'}, {label: 'Enlisted', value: 'Enlisted'}]}
                                ratios={[4, 2.75, 5]}
                                selectedValues={[status]}
                                onValueChange={(value) => setStatus(value)}
                                style={{ marginLeft: 0, marginRight: 0 }}
                            />
                        </View>
                        <View style={styles.fieldRow}>
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
                                selectedValues={[dependencyStatus]}
                                onValueChange={(value) => setDependencyStatus(value)}
                                style={{ marginLeft: 0, marginRight: 0 }}
                            />
                        </View>
                        <View style={[styles.fieldRow, { marginTop: theme.spacing.s }]}>
                            <Text style={styles.boldLabel}>Mil Housing Area</Text>
                            <TwoColumnPicker mhaData={mhaData} selectedMha={mha} onMhaChange={handleMhaChange} displayName={mhaDisplayName} isLoading={isLoadingMha} error={mhaError} />
                        </View>
                    </View>
                </View>

                <Divider style={{ marginVertical: theme.spacing.s }} />

                {/* Special Duty Pay Section */}
                <View style={[styles.fieldRow, { marginBottom: 0 }]}>
                    <Pressable onPress={toggleIncome} style={styles.expandableHeader}>
                        <Text style={styles.boldLabel}>Special Duty Pay</Text>
                        <RoundIconButton
                            onPress={toggleIncome}
                            iconName={isIncomeExpanded ? "chevron-up" : "chevron-down"}
                            backgroundColor={theme.colors.primary}
                            iconSize={18}
                        />
                    </Pressable>
                    {isIncomeExpanded && (
                        <View style={styles.expandableContent}>
                            <View style={styles.fieldRow}><LabelWithHelp label="Clothing Allowance" contentKey="Clothing Allowance" /><CurrencyInput placeholder="0.00" value={specialPays.clothing} onChangeText={(text) => setSpecialPays(p => ({...p, clothing: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Hostile Fire Pay" contentKey="Hostile Fire Pay (HFP)" /><CurrencyInput placeholder="0.00" value={specialPays.hostileFire} onChangeText={(text) => setSpecialPays(p => ({...p, hostileFire: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Imminent Danger Pay" contentKey="Imminent Danger Pay (IDP)" /><CurrencyInput placeholder="0.00" value={specialPays.imminentDanger} onChangeText={(text) => setSpecialPays(p => ({...p, imminentDanger: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Hazardous Duty Incentive Pay" contentKey="Hazardous Duty Incentive Pay (HDIP)" /><CurrencyInput placeholder="0.00" value={specialPays.hazardousDuty} onChangeText={(text) => setSpecialPays(p => ({...p, hazardousDuty: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Hardship Duty Pay" contentKey="Hardship Duty Pay - Location (HDP-L)" /><CurrencyInput placeholder="0.00" value={specialPays.hardshipDuty} onChangeText={(text) => setSpecialPays(p => ({...p, hardshipDuty: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Aviation Incentive Pay" contentKey="Aviation Incentive Pays (AvIP)" /><CurrencyInput placeholder="0.00" value={specialPays.aviation} onChangeText={(text) => setSpecialPays(p => ({...p, aviation: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Assignment Incentive Pay" contentKey="Assignment Incentive Pay (AIP)" /><CurrencyInput placeholder="0.00" value={specialPays.assignment} onChangeText={(text) => setSpecialPays(p => ({...p, assignment: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Career Sea Pay" contentKey="Career Sea Pay" /><CurrencyInput placeholder="0.00" value={specialPays.careerSea} onChangeText={(text) => setSpecialPays(p => ({...p, careerSea: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Health Professions Officers" contentKey="Health Professions Special Pays" /><CurrencyInput placeholder="0.00" value={specialPays.healthProfessions} onChangeText={(text) => setSpecialPays(p => ({...p, healthProfessions: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Foreign Language Proficiency Bonus" contentKey="Foreign Language Proficiency Bonus (FLPB)" /><CurrencyInput placeholder="0.00" value={specialPays.foreignLanguage} onChangeText={(text) => setSpecialPays(p => ({...p, foreignLanguage: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Special Duty Assignment Pay" contentKey="Special Duty Assignment Pay (SDAP)" /><CurrencyInput placeholder="0.00" value={specialPays.specialDuty} onChangeText={(text) => setSpecialPays(p => ({...p, specialDuty: text}))} /></View>
                            
                            <LabelWithHelp label="Additional Income" contentKey="Additional Income" />
                            {additionalIncomes.map((income, index) => (
                                <View key={index} style={[styles.fieldRow, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                                    <View style={{ flex: 1, marginRight: theme.spacing.s }}>
                                        <InsetTextInput
                                            placeholder="Description"
                                            value={income.name}
                                            onChangeText={(text) => { const newIncomes = [...additionalIncomes]; newIncomes[index].name = text; setAdditionalIncomes(newIncomes); }}
                                        />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: theme.spacing.s, marginRight: theme.spacing.s }}>
                                        <CurrencyInput
                                            placeholder="0.00"
                                            value={income.amount}
                                            onChangeText={(text) => { const newIncomes = [...additionalIncomes]; newIncomes[index].amount = text; setAdditionalIncomes(newIncomes); }}
                                        />
                                    </View>
                                    {(income.name || income.amount) && (
                                        <CancelButton onPress={() => {
                                            const newIncomes = [...additionalIncomes];
                                            if (newIncomes.length > 1) {
                                                newIncomes.splice(index, 1);
                                            } else {
                                                newIncomes[index] = { name: '', amount: '' };
                                            }
                                            setAdditionalIncomes(newIncomes);
                                        }} />
                                    )}
                                </View>
                            ))}
                            {showAddIncomeButton && (
                                <AddButton onPress={() => setAdditionalIncomes(i => [...i, {name: '', amount: ''}])} />
                            )}
                        </View>
                    )}
                </View>

                <Divider style={{ marginVertical: theme.spacing.s }} />

                {/* Deductions Section */}
                <View style={styles.fieldRow}>
                    <Pressable onPress={toggleDeductions} style={styles.expandableHeader}>
                        <Text style={styles.boldLabel}>Deductions</Text>
                        <RoundIconButton
                            onPress={toggleDeductions}
                            iconName={isDeductionsExpanded ? "chevron-up" : "chevron-down"}
                            backgroundColor={theme.colors.primary}
                            iconSize={18}
                        />
                    </Pressable>
                    {isDeductionsExpanded && (
                        <View style={[styles.expandableContent, { marginTop: 0 }]}>
                            <View style={{alignItems: 'center'}}>
                                <PillButton 
                                    title={isTaxOverride ? 'Use Calculated Taxes' : 'Override Taxes'} 
                                    onPress={() => setIsTaxOverride(!isTaxOverride)} 
                                    textStyle={theme.typography.subtitle}
                                />
                            </View>

                            {isTaxOverride && (
                                <>
                                    <View style={styles.fieldRow}><LabelWithHelp label="Federal Tax" contentKey="Federal Tax" /><CurrencyInput placeholder="0.00" value={deductions.overrideFedTax} onChangeText={(text) => setDeductions(d => ({...d, overrideFedTax: text}))} /></View>
                                    <View style={styles.fieldRow}><LabelWithHelp label="State Tax" contentKey="State Tax" /><CurrencyInput placeholder="0.00" value={deductions.overrideStateTax} onChangeText={(text) => setDeductions(d => ({...d, overrideStateTax: text}))} /></View>
                                    <View style={styles.fieldRow}><LabelWithHelp label="FICA" contentKey="FICA" /><CurrencyInput placeholder="0.00" value={deductions.overrideFicaTax} onChangeText={(text) => setDeductions(d => ({...d, overrideFicaTax: text}))} /></View>
                                </>
                            )}

                            <View style={styles.fieldRow}><LabelWithHelp label="SGLI" contentKey="Servicemembers' Group Life Insurance (SGLI)" /><CurrencyInput placeholder="0.00" value={deductions.sgli} onChangeText={(text) => setDeductions(d => ({...d, sgli: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="TSP" contentKey="Thrift Savings Plan (TSP)" /><CurrencyInput placeholder="0.00" value={deductions.tsp} onChangeText={(text) => setDeductions(d => ({...d, tsp: text}))} /></View>

                            <LabelWithHelp label="Additional Deductions" contentKey="Additional Deductions" />
                            {additionalDeductions.map((deduction, index) => (
                                <View key={index} style={[styles.fieldRow, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                                    <View style={{ flex: 1, marginRight: theme.spacing.s }}>
                                        <InsetTextInput
                                            placeholder="Description"
                                            value={deduction.name}
                                            onChangeText={(text) => { const newDeductions = [...additionalDeductions]; newDeductions[index].name = text; setAdditionalDeductions(newDeductions); }}
                                        />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: theme.spacing.s, marginRight: theme.spacing.s }}>
                                        <CurrencyInput
                                            placeholder="0.00"
                                            value={deduction.amount}
                                            onChangeText={(text) => { const newDeductions = [...additionalDeductions]; newDeductions[index].amount = text; setAdditionalDeductions(newDeductions); }}
                                        />
                                    </View>
                                    {(deduction.name || deduction.amount) && (
                                        <CancelButton onPress={() => {
                                            const newDeductions = [...additionalDeductions];
                                            if (newDeductions.length > 1) {
                                                newDeductions.splice(index, 1);
                                            } else {
                                                newDeductions[index] = { name: '', amount: '' };
                                            }
                                            setAdditionalDeductions(newDeductions);
                                        }} />
                                    )}
                                </View>
                            ))}
                            {showAddDeductionButton && (
                                <AddButton onPress={() => setAdditionalDeductions(d => [...d, {name: '', amount: ''}])} />
                            )}
                        </View>
                    )}
                </View>

            </ScrollView>
        </Card>
    </View>
  );
}
