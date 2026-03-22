import React from 'react';
import { StyleSheet, ImageSourcePropType } from 'react-native';

import { usePayCalculatorState, PayDisplay, useTheme, MASCOT_URLS } from '@repo/ui';
import Divider from '../../components/Divider';
import MainCalculatorLayout from '../../components/MainCalculatorLayout';
import { useOverlay } from '../../contexts/OverlayContext';

// Extracted Components
import PayDemographics from '../../components/PayCalculator/PayDemographics';
import PaySpecialDuty from '../../components/PayCalculator/PaySpecialDuty';
import PayDeductions from '../../components/PayCalculator/PayDeductions';

const payMascots = [
  { uri: MASCOT_URLS.PAY },
  { uri: MASCOT_URLS.PAY1 },
  { uri: MASCOT_URLS.RETIREMENT },
];

export default function PayCalculatorScreen() {
  const { theme } = useTheme();
  const { openHelp, openDocuments } = useOverlay();
  const [payMascotIndex, setPayMascotIndex] = React.useState(0);

  const {
    // ... (rest of destructuring)
    // Display Values
    annualPay,
    monthlyPay,
    incomeForDisplay,
    deductionsForDisplay,
    // Data for Pickers
    mhaData,
    mhaError,
    isLoading,
    filteredRanks,
    // Form State & Setters
    status, setStatus,
    rank, setRank,
    yearsOfService, setYearsOfService,
    mha,
    handleMhaChange,
    mhaDisplayName,
    filingStatus, setFilingStatus,
    state,
    bahDependencyStatus, setBahDependencyStatus,
    vaDependencyStatus,
    component, setComponent,
    disabilityPercentage,
    disabilityError,
    handleDisabilityChange, disabilityDisplayName,
    isIncomeExpanded, setIncomeExpanded,
    isDeductionsExpanded, setDeductionsExpanded,
    isStandardDeductionsExpanded, setIsStandardDeductionsExpanded,
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
    paySource,
    disabilityPickerData,
    disabilityPercentageItems,
  } = usePayCalculatorState();

  const getNextPayMascot = React.useCallback(() => {
    const mascot = payMascots[payMascotIndex];
    setPayMascotIndex((prevIndex) => (prevIndex + 1) % payMascots.length);
    return mascot;
  }, [payMascotIndex]);

  const handleOpenHelp = React.useCallback((key: string, mascot?: ImageSourcePropType) => {
    openHelp(key, 'pay', mascot || getNextPayMascot());
  }, [openHelp, getNextPayMascot]);

  const styles = React.useMemo(() => StyleSheet.create({
    dividerMargin: {
        marginVertical: theme.spacing.s,
    },
  }), [theme]);

  return (
    <MainCalculatorLayout
      title="Pay Calculator"
      isLoading={isLoading}
      actions={['reset', 'document', 'theme']}
      onReset={resetState}
      onDocument={() => openDocuments('PAY')}
      summaryContent={
        <PayDisplay
            onHelpPress={() => handleOpenHelp('Pay Display Summary')}
            annualPay={annualPay}
            monthlyPay={monthlyPay}
            payDetails={incomeForDisplay}
            deductions={deductionsForDisplay}
            federalStandardDeduction={federalStandardDeduction}
            stateStandardDeduction={stateStandardDeduction}
            isStandardDeductionsExpanded={isStandardDeductionsExpanded}
            onToggleStandardDeductions={() => setIsStandardDeductionsExpanded(!isStandardDeductionsExpanded)}
            paySource={paySource}
        />
      }
      inputContent={
        <>
            <PayDemographics 
                component={component}
                setComponent={setComponent}
                status={status}
                setStatus={setStatus}
                rank={rank}
                setRank={setRank}
                yearsOfService={yearsOfService}
                setYearsOfService={setYearsOfService}
                filteredRanks={filteredRanks}
                filingStatus={filingStatus}
                setFilingStatus={setFilingStatus}
                bahDependencyStatus={bahDependencyStatus}
                setBahDependencyStatus={setBahDependencyStatus}
                mhaData={mhaData || null}
                mha={mha}
                handleMhaChange={handleMhaChange}
                mhaDisplayName={mhaDisplayName}
                isLoading={isLoading}
                mhaError={mhaError}
                state={state}
                disabilityPickerData={disabilityPickerData as Record<string, { label: string; value: string | number | null }[]> | null}
                vaDependencyStatus={vaDependencyStatus}
                handleDisabilityChange={handleDisabilityChange}
                disabilityDisplayName={disabilityDisplayName}
                disabilityError={disabilityError}
                disabilityPercentage={disabilityPercentage}
                disabilityPercentageItems={disabilityPercentageItems}
            />

            <Divider style={styles.dividerMargin} />

            <PaySpecialDuty 
                isIncomeExpanded={isIncomeExpanded}
                toggleIncome={() => setIncomeExpanded(!isIncomeExpanded)}
                specialPays={specialPays}
                setSpecialPays={setSpecialPays}
                additionalIncomes={additionalIncomes}
                setAdditionalIncomes={setAdditionalIncomes}
                showAddIncomeButton={showAddIncomeButton}
                openDetailModal={(contentKey) => handleOpenHelp(contentKey)}
            />

            <Divider style={styles.dividerMargin} />

            <PayDeductions 
                isDeductionsExpanded={isDeductionsExpanded}
                toggleDeductions={() => setDeductionsExpanded(!isDeductionsExpanded)}
                isTaxOverride={isTaxOverride}
                setIsTaxOverride={setIsTaxOverride}
                deductions={deductions}
                setDeductions={setDeductions}
                additionalDeductions={additionalDeductions}
                setAdditionalDeductions={setAdditionalDeductions}
                showAddDeductionButton={showAddDeductionButton}
                openDetailModal={(contentKey) => handleOpenHelp(contentKey)}
            />
        </>
      }
    />
  );
}
