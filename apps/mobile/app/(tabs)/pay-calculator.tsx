import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, LayoutAnimation, UIManager, Platform } from 'react-native';
import { usePayCalculatorState, Card, IconRow, PayDisplay, SegmentedSelector, useTheme } from '@repo/ui';
import { ICONS } from '@repo/ui/icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PdfModal from '../components/PdfModal';
import Divider from '../components/Divider';
import InsetTextInput from '../components/InsetTextInput';
import PickerInput from '../components/PickerInput';
import NumberInput from '../components/NumberInput';
import CurrencyInput from '../components/CurrencyInput';

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

  const {
    // Display Values
    totalPay,
    incomeForDisplay,
    deductionsForDisplay,
    // Form State & Setters
    status, setStatus,
    rank, setRank,
    yearsOfService, setYearsOfService,
    zipCode, setZipCode,
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
      padding: theme.spacing.m,
    },
    fieldRow: {
      marginBottom: theme.spacing.m,
    },
    label: {
      ...theme.typography.label,
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
    },
    expandableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    expandableContent: {
        overflow: 'hidden',
        marginTop: theme.spacing.m,
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

  return (
    <View style={styles.container}>
        <PdfModal isModalVisible={isPdfModalVisible} setModalVisible={setPdfModalVisible} />
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
        <Card style={{ flex: 1, marginTop: theme.spacing.m }}>
            <ScrollView contentContainerStyle={{paddingBottom: 0}} showsVerticalScrollIndicator={false}>
                {/* Row 1: Status and Years of Service */}
                <View style={[styles.fieldRow, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Status</Text>
                        <SegmentedSelector
                            options={[{label: 'Officer', value: 'Officer'}, {label: 'Enlisted', value: 'Enlisted'}]}
                            selectedValues={[status]}
                            onValueChange={setStatus}
                        />
                    </View>
                    <View style={{ flex: 1, marginLeft: theme.spacing.m }}>
                        <Text style={styles.label}>Years of Service</Text>
                        <NumberInput placeholder="0" value={yearsOfService} onChangeText={setYearsOfService} />
                    </View>
                </View>

                {/* Row 2: Pay Grade and Zip Code */}
                <View style={[styles.fieldRow, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <View style={{ flex: 1, marginRight: theme.spacing.s }}>
                        <Text style={styles.label}>Pay Grade</Text>
                        <PickerInput items={status === 'Officer' ? officerRanks : enlistedRanks} selectedValue={rank} onValueChange={setRank} placeholder="Select..." />
                    </View>
                    <View style={{ flex: 1, marginLeft: theme.spacing.s }}>
                        <Text style={styles.label}>Zip Code</Text>
                        <InsetTextInput placeholder="5 digits" keyboardType="numeric" value={zipCode} onChangeText={setZipCode} />
                    </View>
                </View>

                <Divider />

                {/* Special Duty Pay Section */}
                <View style={styles.fieldRow}>
                    <Pressable onPress={toggleIncome} style={styles.expandableHeader}>
                        <Text style={styles.label}>Special Duty Pay</Text>
                        <MaterialCommunityIcons name={isIncomeExpanded ? "chevron-up" : "chevron-down"} size={24} color={theme.colors.text} />
                    </Pressable>
                    {isIncomeExpanded && (
                        <View style={styles.expandableContent}>
                            <View style={styles.fieldRow}><Text style={styles.label}>Clothing Allowance</Text><CurrencyInput placeholder="0.00" value={specialPays.clothing} onChangeText={(text) => setSpecialPays(p => ({...p, clothing: text}))} /></View>
                            <View style={styles.fieldRow}><Text style={styles.label}>Hostile Fire Pay</Text><CurrencyInput placeholder="0.00" value={specialPays.hostileFire} onChangeText={(text) => setSpecialPays(p => ({...p, hostileFire: text}))} /></View>
                            <View style={styles.fieldRow}><Text style={styles.label}>Imminent Danger Pay</Text><CurrencyInput placeholder="0.00" value={specialPays.imminentDanger} onChangeText={(text) => setSpecialPays(p => ({...p, imminentDanger: text}))} /></View>
                            <View style={styles.fieldRow}><Text style={styles.label}>Hazardous Duty Incentive Pay</Text><CurrencyInput placeholder="0.00" value={specialPays.hazardousDuty} onChangeText={(text) => setSpecialPays(p => ({...p, hazardousDuty: text}))} /></View>
                            <View style={styles.fieldRow}><Text style={styles.label}>Hardship Duty Pay</Text><CurrencyInput placeholder="0.00" value={specialPays.hardshipDuty} onChangeText={(text) => setSpecialPays(p => ({...p, hardshipDuty: text}))} /></View>
                            <View style={styles.fieldRow}><Text style={styles.label}>Aviation Incentive Pay</Text><CurrencyInput placeholder="0.00" value={specialPays.aviation} onChangeText={(text) => setSpecialPays(p => ({...p, aviation: text}))} /></View>
                            <View style={styles.fieldRow}><Text style={styles.label}>Assignment Incentive Pay</Text><CurrencyInput placeholder="0.00" value={specialPays.assignment} onChangeText={(text) => setSpecialPays(p => ({...p, assignment: text}))} /></View>
                            <View style={styles.fieldRow}><Text style={styles.label}>Career Sea Pay</Text><CurrencyInput placeholder="0.00" value={specialPays.careerSea} onChangeText={(text) => setSpecialPays(p => ({...p, careerSea: text}))} /></View>
                            <View style={styles.fieldRow}><Text style={styles.label}>Health Professions Officers</Text><CurrencyInput placeholder="0.00" value={specialPays.healthProfessions} onChangeText={(text) => setSpecialPays(p => ({...p, healthProfessions: text}))} /></View>
                            <View style={styles.fieldRow}><Text style={styles.label}>Foreign Language Proficiency Bonus</Text><CurrencyInput placeholder="0.00" value={specialPays.foreignLanguage} onChangeText={(text) => setSpecialPays(p => ({...p, foreignLanguage: text}))} /></View>
                            <View style={styles.fieldRow}><Text style={styles.label}>Special Duty Assignment Pay</Text><CurrencyInput placeholder="0.00" value={specialPays.specialDuty} onChangeText={(text) => setSpecialPays(p => ({...p, specialDuty: text}))} /></View>
                            
                            <Text style={styles.label}>Additional Income</Text>
                            {additionalIncomes.map((income, index) => (
                                <View key={index} style={[styles.fieldRow, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                                    <View style={{ flex: 2, marginRight: theme.spacing.s }}>
                                        <InsetTextInput
                                            placeholder="Description"
                                            value={income.name}
                                            onChangeText={(text) => { const newIncomes = [...additionalIncomes]; newIncomes[index].name = text; setAdditionalIncomes(newIncomes); }}
                                        />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: theme.spacing.s }}>
                                        <CurrencyInput
                                            placeholder="0.00"
                                            value={income.amount}
                                            onChangeText={(text) => { const newIncomes = [...additionalIncomes]; newIncomes[index].amount = text; setAdditionalIncomes(newIncomes); }}
                                        />
                                    </View>
                                </View>
                            ))}
                            {showAddIncomeButton && (
                                <Pressable onPress={() => setAdditionalIncomes(i => [...i, {name: '', amount: ''}])} style={styles.addIconContainer}>
                                    <MaterialCommunityIcons name="plus-circle-outline" size={28} color={theme.colors.primary} />
                                </Pressable>
                            )}
                        </View>
                    )}
                </View>

                <Divider />

                {/* Deductions Section */}
                <View style={styles.fieldRow}>
                    <Pressable onPress={toggleDeductions} style={styles.expandableHeader}>
                        <Text style={styles.label}>Deductions</Text>
                        <MaterialCommunityIcons name={isDeductionsExpanded ? "chevron-up" : "chevron-down"} size={24} color={theme.colors.text} />
                    </Pressable>
                    {isDeductionsExpanded && (
                        <View style={styles.expandableContent}>
                            <View style={styles.fieldRow}><Text style={styles.label}>FED INC TAX</Text><CurrencyInput placeholder="0.00" value={deductions.fedTax} onChangeText={(text) => setDeductions(d => ({...d, fedTax: text}))} /></View>
                            <View style={styles.fieldRow}><Text style={styles.label}>FICA TAX</Text><CurrencyInput placeholder="0.00" value={deductions.ficaTax} onChangeText={(text) => setDeductions(d => ({...d, ficaTax: text}))} /></View>
                            <View style={styles.fieldRow}><Text style={styles.label}>STATE INC TAX</Text><CurrencyInput placeholder="0.00" value={deductions.stateTax} onChangeText={(text) => setDeductions(d => ({...d, stateTax: text}))} /></View>
                            <View style={styles.fieldRow}><Text style={styles.label}>SGLI</Text><CurrencyInput placeholder="0.00" value={deductions.sgli} onChangeText={(text) => setDeductions(d => ({...d, sgli: text}))} /></View>
                            <View style={styles.fieldRow}><Text style={styles.label}>TSP CONTRIBUTION</Text><CurrencyInput placeholder="0.00" value={deductions.tsp} onChangeText={(text) => setDeductions(d => ({...d, tsp: text}))} /></View>

                            <Text style={styles.label}>Additional Deductions</Text>
                            {additionalDeductions.map((deduction, index) => (
                                <View key={index} style={[styles.fieldRow, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                                    <View style={{ flex: 2, marginRight: theme.spacing.s }}>
                                        <InsetTextInput
                                            placeholder="Description"
                                            value={deduction.name}
                                            onChangeText={(text) => { const newDeductions = [...additionalDeductions]; newDeductions[index].name = text; setAdditionalDeductions(newDeductions); }}
                                        />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: theme.spacing.s }}>
                                        <CurrencyInput
                                            placeholder="0.00"
                                            value={deduction.amount}
                                            onChangeText={(text) => { const newDeductions = [...additionalDeductions]; newDeductions[index].amount = text; setAdditionalDeductions(newDeductions); }}
                                        />
                                    </View>
                                </View>
                            ))}
                            {showAddDeductionButton && (
                                <Pressable onPress={() => setAdditionalDeductions(d => [...d, {name: '', amount: ''}])} style={styles.addIconContainer}>
                                    <MaterialCommunityIcons name="plus-circle-outline" size={28} color={theme.colors.primary} />
                                </Pressable>
                            )}
                        </View>
                    )}
                </View>

            </ScrollView>
        </Card>
    </View>
  );
}