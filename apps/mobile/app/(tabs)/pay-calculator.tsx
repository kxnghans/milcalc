import {
  MASCOT_URLS,
  PayDisplay,
  usePayCalculatorState,
  useTheme,
} from "@repo/ui";
import React from "react";
import { ImageSourcePropType, StyleSheet } from "react-native";

import Divider from "../../components/Divider";
import MainCalculatorLayout from "../../components/MainCalculatorLayout";
import PayDeductions from "../../components/PayCalculator/PayDeductions";
// Extracted Components
import PayDemographics from "../../components/PayCalculator/PayDemographics";
import PaySpecialDuty from "../../components/PayCalculator/PaySpecialDuty";
import { useOverlay } from "../../contexts/OverlayContext";
import { ProfileData, useProfile } from "../../contexts/ProfileContext";

const payMascots = [{ uri: MASCOT_URLS.PAY }, { uri: MASCOT_URLS.PAY1 }];

export default function PayCalculatorScreen() {
  const { theme } = useTheme();
  const { openHelp, openDocuments } = useOverlay();
  const {
    age: profileAge,
    gender: profileGender,
    setProfileData,
  } = useProfile();

  const {
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
    status,
    setStatus,
    rank,
    setRank,
    yearsOfService,
    setYearsOfService,
    mha,
    handleMhaChange,
    mhaDisplayName,
    filingStatus,
    setFilingStatus,
    state,
    bahDependencyStatus,
    setBahDependencyStatus,
    vaDependencyStatus,
    component,
    setComponent,
    disabilityPercentage,
    disabilityError,
    handleDisabilityChange,
    disabilityDisplayName,
    isIncomeExpanded,
    setIncomeExpanded,
    isDeductionsExpanded,
    setDeductionsExpanded,
    isStandardDeductionsExpanded,
    setIsStandardDeductionsExpanded,
    specialPays,
    setSpecialPays,
    additionalIncomes,
    setAdditionalIncomes,
    deductions,
    setDeductions,
    additionalDeductions,
    setAdditionalDeductions,
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
  } = usePayCalculatorState(profileAge, profileGender, (data) =>
    setProfileData(data as Partial<ProfileData>),
  );

  const getNextPayMascot = React.useCallback(() => {
    const randomIndex = Math.floor(Math.random() * payMascots.length);
    return payMascots[randomIndex];
  }, []);

  const handleOpenHelp = React.useCallback(
    (key: string, mascot?: ImageSourcePropType) => {
      openHelp(key, "pay", mascot || getNextPayMascot());
    },
    [openHelp, getNextPayMascot],
  );

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        dividerMargin: {
          marginVertical: theme.spacing.s,
        },
      }),
    [theme],
  );

  return (
    <MainCalculatorLayout
      title="Pay Calculator"
      isLoading={isLoading}
      actions={["reset", "document", "theme"]}
      onReset={resetState}
      onDocument={() => openDocuments("PAY")}
      summaryContent={
        <PayDisplay
          onHelpPress={() => handleOpenHelp("Pay Display Summary")}
          annualPay={annualPay}
          monthlyPay={monthlyPay}
          payDetails={incomeForDisplay}
          deductions={deductionsForDisplay}
          federalStandardDeduction={federalStandardDeduction}
          stateStandardDeduction={stateStandardDeduction}
          isStandardDeductionsExpanded={isStandardDeductionsExpanded}
          onToggleStandardDeductions={() =>
            setIsStandardDeductionsExpanded(!isStandardDeductionsExpanded)
          }
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
            disabilityPickerData={
              disabilityPickerData as Record<
                string,
                { label: string; value: string | number | null }[]
              > | null
            }
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
            toggleDeductions={() =>
              setDeductionsExpanded(!isDeductionsExpanded)
            }
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
