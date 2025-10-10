import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, LayoutAnimation, UIManager, Platform, TouchableOpacity } from 'react-native';
import { usePayCalculatorState, Card, IconRow, PayDisplay, SegmentedSelector, useTheme } from '@repo/ui';
import { ICONS } from '@repo/ui/icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PdfModal from '../components/PdfModal';
import Divider from '../components/Divider';
import InsetTextInput from '../components/InsetTextInput';
import PickerInput from '../components/PickerInput';
import NumberInput from '../components/NumberInput';
import CurrencyInput from '../components/CurrencyInput';
import DetailModal from '../components/DetailModal';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const officerRanks = [
  { label: 'O-1', value: 'O-1' }, { label: 'O-2', value: 'O-2' }, { label: 'O-3', value: 'O-3' },
  { label: 'O-1E', value: 'O-1E' }, { label: 'O-2E', value: 'O-2E' }, { label: 'O-3E', value: 'O-3E' },
  { label: 'O-4', value: 'O-4' }, { label: 'O-5', value: 'O-5' }, { label: 'O-6', value: 'O-6' },
  { label: 'O-7', value: 'O-7' }, { label: 'O-8', value: 'O-8' }, { label: 'O-9', value: 'O-9' }, { label: 'O-10', value: 'O-10' },
];

const enlistedRanks = [
  { label: 'E-1', value: 'E-1' }, { label: 'E-2', value: 'E-2' }, { label: 'E-3', value: 'E-3' },
  { label: 'E-4', value: 'E-4' }, { label: 'E-5', value: 'E-5' }, { label: 'E-6', value: 'E-6' },
  { label: 'E-7', value: 'E-7' }, { label: 'E-8', value: 'E-8' }, { label: 'E-9', value: 'E-9' },
];

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
    totalPay,
    incomeForDisplay,
    deductionsForDisplay,
    // Data for Pickers
    mhaList,
    // Form State & Setters
    status, setStatus,
    rank, setRank,
    yearsOfService, setYearsOfService,
    mha, setMha,
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
        marginTop: theme.spacing.m,
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
        />
    </View>
  );

  const CancelButton = ({ onPress }) => (
    <RoundIconButton
        onPress={onPress}
        iconName="close"
        backgroundColor={theme.colors.error}
    />
  );

  return (
    <View style={styles.container}>
        <PdfModal isModalVisible={isPdfModalVisible} setModalVisible={setPdfModalVisible} />
        <DetailModal
            isVisible={!!detailModalContentKey}
            onClose={closeDetailModal}
            contentKey={detailModalContentKey}
            source="pay"
        />
        <Card containerStyle={{ marginBottom: theme.spacing.s }}>
            <PayDisplay
                totalPay={totalPay}
                payDetails={incomeForDisplay}
                deductions={deductionsForDisplay}
            />
        </Card>
        <IconRow icons={[
            {
                name: ICONS.PDF,
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
                    <View style={{ flex: 1, paddingRight: theme.spacing.s, borderRightWidth: 1, borderRightColor: theme.colors.border }}>
                        <View style={styles.fieldRow}>
                            <Text style={[styles.boldLabel, { marginBottom: 0 }]}>Status</Text>
                            <SegmentedSelector
                                options={[{label: 'Officer', value: 'Officer'}, {label: 'Enlisted', value: 'Enlisted'}]}
                                selectedValues={[status]}
                                onValueChange={(value) => setStatus(value)}
                                style={{ marginLeft: 0, marginRight: 0 }}
                            />
                        </View>
                        <View style={styles.fieldRow}>
                            <Text style={styles.boldLabel}>Pay Grade</Text>
                            <PickerInput items={status === 'Officer' ? officerRanks : enlistedRanks} selectedValue={rank} onValueChange={setRank} placeholder="Select..." />
                        </View>
                        <View style={styles.fieldRow}>
                            <Text style={styles.boldLabel}>Years of Service</Text>
                            <NumberInput placeholder="0" value={yearsOfService} onChangeText={setYearsOfService} />
                        </View>
                    </View>

                    {/* Right Column */}
                    <View style={{ flex: 1, paddingLeft: theme.spacing.s, paddingRight: theme.spacing.s }}>
                        <View style={styles.fieldRow}>
                            <Text style={[styles.boldLabel, { marginBottom: 0 }]}>Tax Filing Status</Text>
                            <SegmentedSelector
                                options={[{label: 'Single', value: 'single'}, {label: 'Married', value: 'married'}]}
                                selectedValues={[filingStatus]}
                                style={{ marginLeft: 0, marginRight: 0 }}
                            />
                        </View>
                        <View style={styles.fieldRow}>
                            <Text style={styles.boldLabel}>Dependents</Text>
                            <SegmentedSelector
                                options={[{label: 'Yes', value: 'WITH_DEPENDENTS'}, {label: 'No', value: 'WITHOUT_DEPENDENTS'}]}
                                selectedValues={[dependencyStatus]}
                                onValueChange={(value) => setDependencyStatus(value)}
                                style={{ marginLeft: 0, marginRight: 0 }}
                            />
                        </View>
                        <View style={styles.fieldRow}>
                            <Text style={styles.boldLabel}>Military Housing Area</Text>
                            <PickerInput items={mhaList} selectedValue={mha} onValueChange={setMha} placeholder="Select MHA..." />
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
                            <View style={styles.fieldRow}><LabelWithHelp label="Clothing Allowance" contentKey="clothing_allowance" /><CurrencyInput placeholder="0.00" value={specialPays.clothing} onChangeText={(text) => setSpecialPays(p => ({...p, clothing: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Hostile Fire Pay" contentKey="hostile_fire_pay" /><CurrencyInput placeholder="0.00" value={specialPays.hostileFire} onChangeText={(text) => setSpecialPays(p => ({...p, hostileFire: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Imminent Danger Pay" contentKey="imminent_danger_pay" /><CurrencyInput placeholder="0.00" value={specialPays.imminentDanger} onChangeText={(text) => setSpecialPays(p => ({...p, imminentDanger: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Hazardous Duty Incentive Pay" contentKey="hazardous_duty_pay" /><CurrencyInput placeholder="0.00" value={specialPays.hazardousDuty} onChangeText={(text) => setSpecialPays(p => ({...p, hazardousDuty: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Hardship Duty Pay" contentKey="hardship_duty_pay_location" /><CurrencyInput placeholder="0.00" value={specialPays.hardshipDuty} onChangeText={(text) => setSpecialPays(p => ({...p, hardshipDuty: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Aviation Incentive Pay" contentKey="aviation_incentive_pay" /><CurrencyInput placeholder="0.00" value={specialPays.aviation} onChangeText={(text) => setSpecialPays(p => ({...p, aviation: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Assignment Incentive Pay" contentKey="assignment_incentive_pay" /><CurrencyInput placeholder="0.00" value={specialPays.assignment} onChangeText={(text) => setSpecialPays(p => ({...p, assignment: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Career Sea Pay" contentKey="career_sea_pay" /><CurrencyInput placeholder="0.00" value={specialPays.careerSea} onChangeText={(text) => setSpecialPays(p => ({...p, careerSea: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Health Professions Officers" contentKey="health_professions_special_pays" /><CurrencyInput placeholder="0.00" value={specialPays.healthProfessions} onChangeText={(text) => setSpecialPays(p => ({...p, healthProfessions: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Foreign Language Proficiency Bonus" contentKey="foreign_language_proficiency_bonus" /><CurrencyInput placeholder="0.00" value={specialPays.foreignLanguage} onChangeText={(text) => setSpecialPays(p => ({...p, foreignLanguage: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="Special Duty Assignment Pay" contentKey="special_duty_assignment_pay" /><CurrencyInput placeholder="0.00" value={specialPays.specialDuty} onChangeText={(text) => setSpecialPays(p => ({...p, specialDuty: text}))} /></View>
                            
                            <LabelWithHelp label="Additional Income" contentKey="additional_income" />
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
                        <View style={styles.expandableContent}>
                            <View style={styles.fieldRow}><LabelWithHelp label="SGLI" contentKey="sgli" /><CurrencyInput placeholder="0.00" value={deductions.sgli} onChangeText={(text) => setDeductions(d => ({...d, sgli: text}))} /></View>
                            <View style={styles.fieldRow}><LabelWithHelp label="TSP CONTRIBUTION" contentKey="tsp" /><CurrencyInput placeholder="0.00" value={deductions.tsp} onChangeText={(text) => setDeductions(d => ({...d, tsp: text}))} /></View>

                            <LabelWithHelp label="Additional Deductions" contentKey="additional_deductions" />
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
