import {
  MASCOT_URLS,
  PayDisplay,
  useRetirementCalculatorState,
  useTheme,
} from "@repo/ui";
import React from "react";
import {
  ImageSourcePropType,
  Keyboard,
  Platform,
  StyleSheet,
} from "react-native";

import Divider from "../../components/Divider";
import MainCalculatorLayout from "../../components/MainCalculatorLayout";
import { RetirementAge } from "../../components/RetirementCalculator/RetirementAge";
import { RetirementDemographics } from "../../components/RetirementCalculator/RetirementDemographics";
import { RetirementTsp } from "../../components/RetirementCalculator/RetirementTsp";
import { useOverlay } from "../../contexts/OverlayContext";
import { ProfileData, useProfile } from "../../contexts/ProfileContext";

const retirementMascot = { uri: MASCOT_URLS.RETIREMENT };
const payMascots = [{ uri: MASCOT_URLS.PAY }, { uri: MASCOT_URLS.PAY1 }];

export default function RetirementCalculatorScreen() {
  const { theme } = useTheme();
  const { openHelp, openDocuments } = useOverlay();
  const { age: profileAge, setProfileData } = useProfile();

  const handleOpenHelp = React.useCallback(
    (key: string, mascot?: ImageSourcePropType) => {
      let helpMascot = mascot || retirementMascot;
      if (key === "TSP" && !mascot) {
        helpMascot = payMascots[Math.floor(Math.random() * payMascots.length)];
      }
      openHelp(key, "retirement", helpMascot);
    },
    [openHelp],
  );

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
    mha,
    handleMhaChange,
    mhaDisplayName,
    filingStatus,
    setFilingStatus,
    state,
    dependentStatus,
    mhaError,
    isLoading,
    mhaData,
    tspAmount,
    setTspAmount,
    isTspCalculatorVisible,
    setIsTspCalculatorVisible,
    tspContributionAmount,
    setTspContributionAmount,
    tspContributionPercentage,
    setTspContributionPercentage,
    tspContributionYears,
    setTspContributionYears,
    servicePoints,
    setServicePoints,
    goodYears,
    setGoodYears,
    disabilityPickerData,
    disabilityPercentageItems,
    handleDisabilityChange,
    disabilityDisplayName,
    disabilityError,
    disabilityPercentage,
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
    breakInService,
    setBreakInService,
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
    qualifyingDeploymentDays,
    setQualifyingDeploymentDays,
    resetState,
  } = useRetirementCalculatorState(profileAge, (data) =>
    setProfileData(data as Partial<ProfileData>),
  );

  const wasExpandedBeforeKeyboard = React.useRef(false);
  const isExpandedRef = React.useRef(isPayDisplayExpanded);

  // Keep ref in sync with state to avoid stale closures in listeners
  React.useEffect(() => {
    isExpandedRef.current = isPayDisplayExpanded;
  }, [isPayDisplayExpanded]);

  React.useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

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

  const tspWithdrawal = tsp * 0.04;
  const annualPay =
    pension * 12 +
    disabilityIncome * 12 -
    (taxes?.federal || 0) -
    (taxes?.state || 0) +
    tspWithdrawal;
  const monthlyPay =
    pension +
    disabilityIncome -
    (taxes?.federal || 0) / 12 -
    (taxes?.state || 0) / 12 +
    tspWithdrawal / 12;

  const payDetails = React.useMemo(
    () => [
      { label: "Pension", value: pension },
      { label: "VA DISABILITY", value: disabilityIncome },
      { label: "TSP", value: tspWithdrawal / 12 },
    ],
    [pension, disabilityIncome, tspWithdrawal],
  );

  const deductions = React.useMemo(
    () => [
      { label: "Federal Tax", value: taxes?.federal || 0 },
      { label: "State Tax", value: taxes?.state || 0 },
    ],
    [taxes?.federal, taxes?.state],
  );

  const yearsOfServiceNum = parseInt(yearsOfService) || 0;

  const payGradesForYear1Options = React.useMemo(
    () => payGradesForYear1.map((grade) => ({ label: grade, value: grade })),
    [payGradesForYear1],
  );
  const payGradesForYear2Options = React.useMemo(
    () => payGradesForYear2.map((grade) => ({ label: grade, value: grade })),
    [payGradesForYear2],
  );
  const payGradesForYear3Options = React.useMemo(
    () => payGradesForYear3.map((grade) => ({ label: grade, value: grade })),
    [payGradesForYear3],
  );

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        dividerMargin: {
          marginVertical: theme.spacing.m,
        },
      }),
    [theme],
  );

  return (
    <MainCalculatorLayout
      title="Retirement Calculator"
      actions={["reset", "document", "theme"]}
      isLoading={isLoading}
      onReset={resetState}
      onDocument={() => openDocuments("RETIREMENT")}
      summaryContent={
        <PayDisplay
          title="Est Monthly Income"
          onHelpPress={() => handleOpenHelp("Retirement Display Summary")}
          annualPay={annualPay}
          monthlyPay={monthlyPay}
          payDetails={payDetails}
          deductions={deductions}
          federalStandardDeduction={federalStandardDeduction}
          stateStandardDeduction={stateStandardDeduction}
          isStandardDeductionsExpanded={isPayDisplayExpanded}
          onToggleStandardDeductions={() =>
            setIsPayDisplayExpanded(!isPayDisplayExpanded)
          }
        />
      }
      inputContent={
        <>
          <RetirementDemographics
            component={component}
            setComponent={setComponent}
            retirementSystem={retirementSystem}
            setRetirementSystem={setRetirementSystem}
            yearsOfService={yearsOfService}
            setYearsOfService={setYearsOfService}
            yearsOfServiceNum={yearsOfServiceNum}
            payGradesForYear1Options={payGradesForYear1Options}
            high3PayGrade1={high3PayGrade1}
            setHigh3PayGrade1={setHigh3PayGrade1}
            payGradesForYear2Options={payGradesForYear2Options}
            high3PayGrade2={high3PayGrade2}
            setHigh3PayGrade2={setHigh3PayGrade2}
            payGradesForYear3Options={payGradesForYear3Options}
            high3PayGrade3={high3PayGrade3}
            setHigh3PayGrade3={setHigh3PayGrade3}
            filingStatus={filingStatus}
            setFilingStatus={setFilingStatus}
            mhaData={mhaData || null}
            mha={mha}
            handleMhaChange={(val, prim) => handleMhaChange(val, prim)}
            mhaDisplayName={mhaDisplayName}
            isLoading={isLoading}
            mhaError={mhaError}
            state={state}
            dependentStatus={dependentStatus}
            handleDisabilityChange={(val, prim) =>
              handleDisabilityChange(val, prim)
            }
            disabilityDisplayName={disabilityDisplayName}
            disabilityError={disabilityError}
            disabilityPercentage={disabilityPercentage}
            disabilityPickerData={
              disabilityPickerData as Record<
                string,
                { label: string; value: string | number | null }[]
              > | null
            }
            disabilityPercentageItems={disabilityPercentageItems}
            qualifyingDeploymentDays={qualifyingDeploymentDays}
            setQualifyingDeploymentDays={setQualifyingDeploymentDays}
            servicePoints={servicePoints}
            setServicePoints={setServicePoints}
            goodYears={goodYears}
            setGoodYears={setGoodYears}
            handleOpenHelp={handleOpenHelp}
          />

          <Divider style={styles.dividerMargin} />

          <RetirementTsp
            tspType={tspType}
            setTspType={setTspType}
            tspAmount={tspAmount}
            setTspAmount={setTspAmount}
            isTspCalculatorVisible={isTspCalculatorVisible}
            setIsTspCalculatorVisible={setIsTspCalculatorVisible}
            tspContributionAmount={tspContributionAmount}
            setTspContributionAmount={setTspContributionAmount}
            tspContributionPercentage={tspContributionPercentage}
            setTspContributionPercentage={setTspContributionPercentage}
            tspContributionYears={tspContributionYears}
            setTspContributionYears={setTspContributionYears}
            tspReturn={tspReturn}
            setTspReturn={setTspReturn}
            handleOpenHelp={handleOpenHelp}
          />

          <Divider style={styles.dividerMargin} />

          <RetirementAge
            isRetirementAgeCalculatorVisible={isRetirementAgeCalculatorVisible}
            setIsRetirementAgeCalculatorVisible={
              setIsRetirementAgeCalculatorVisible
            }
            retirementAge={retirementAge}
            birthDate={birthDate}
            setBirthDate={setBirthDate}
            serviceEntryDate={serviceEntryDate}
            setServiceEntryDate={setServiceEntryDate}
            breakInService={breakInService}
            setBreakInService={setBreakInService}
            handleOpenHelp={handleOpenHelp}
          />
        </>
      }
    />
  );
}
