import {
  calculateDisabilityIncome,
  calculatePension,
  calculateTaxes,
  calculateTsp,
  DependentStatus,
  DisabilityPercentage,
  getDisabilityData,
  getFederalTaxData,
  getMhaData,
  getPayGrades,
  getRetirementAge,
  getStateTaxData,
} from "@repo/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";

import { useDebounce } from "./useDebounce";

export const useRetirementCalculatorState = (
  initialAge: string = "",
  onSaveToProfile?: (data: { age?: string }) => void,
) => {
  const [component, setComponent] = useState("Active");
  const [retirementSystem, setRetirementSystem] = useState("High 3");

  // High 3 State
  const [high3PayGrade1, setHigh3PayGrade1] = useState<string | null>(null);
  const [high3PayGrade2, setHigh3PayGrade2] = useState<string | null>(null);
  const [high3PayGrade3, setHigh3PayGrade3] = useState<string | null>(null);
  const [tspAmount, setTspAmount] = useState("");
  const [servicePoints, setServicePoints] = useState("");
  const [goodYears, setGoodYears] = useState("");

  // New State
  const [yearsOfService, setYearsOfService] = useState("");
  const [filingStatus, setFilingStatus] = useState("Single");
  const [brsPayGrade, setBrsPayGrade] = useState(null);
  const [tspType, setTspType] = useState("Roth");
  const [tspReturn, setTspReturn] = useState(8);

  const [federalStandardDeduction, setFederalStandardDeduction] = useState(0);
  const [stateStandardDeduction, setStateStandardDeduction] = useState(0);
  const [birthDate, setBirthDateState] = useState<Date | null>(null);
  const [serviceEntryDate, setServiceEntryDate] = useState<Date | null>(null);
  const [qualifyingDeploymentDays, setQualifyingDeploymentDays] = useState("");
  const [isPayDisplayExpanded, setIsPayDisplayExpanded] = useState(false);
  const [
    isRetirementAgeCalculatorVisible,
    setIsRetirementAgeCalculatorVisible,
  ] = useState(false);
  const [retirementAge, setRetirementAge] = useState<number | null>(null);
  const [breakInService, setBreakInService] = useState("");

  const hasModifiedBirthDate = useRef(false);

  // --- Hydration Logic ---
  // We no longer estimate birth date from initialAge to avoid "guessing" for the user.

  /**
   * Triggers a native alert asking if the user wants to save the age change to their profile.
   */
  const promptSaveToProfile = (calculatedAge: number) => {
    if (!onSaveToProfile || initialAge) return;

    Alert.alert(
      "Save to Profile?",
      `Would you like to save your calculated age (${calculatedAge}) to your permanent profile?`,
      [
        { text: "Not Now", style: "cancel" },
        {
          text: "Save",
          onPress: () => onSaveToProfile({ age: calculatedAge.toString() }),
        },
      ],
    );
  };

  const setBirthDate = (date: Date | null) => {
    hasModifiedBirthDate.current = true;
    setBirthDateState(date);

    if (date && !initialAge) {
      // Calculate age from birth date
      const today = new Date();
      let age = today.getFullYear() - date.getFullYear();
      const m = today.getMonth() - date.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
        age--;
      }
      if (age > 0) {
        promptSaveToProfile(age);
      }
    }
  };

  // Calculated values
  const [pension, setPension] = useState(0);
  const [disabilityIncome, setDisabilityIncome] = useState(0);
  const [tsp, setTsp] = useState(0);
  const [taxes, setTaxes] = useState({ federal: 0, state: 0 });

  // TSP Calculator State
  const [isTspCalculatorVisible, setIsTspCalculatorVisible] = useState(false);
  const [tspContributionAmount, setTspContributionAmount] = useState("");
  const [tspContributionPercentage, setTspContributionPercentage] =
    useState("");
  const [tspContributionYears, setTspContributionYears] = useState("");

  const debouncedTspContributionAmount = useDebounce(
    tspContributionAmount,
    500,
  );
  const debouncedTspContributionPercentage = useDebounce(
    tspContributionPercentage,
    500,
  );
  const debouncedTspContributionYears = useDebounce(tspContributionYears, 500);

  const [disabilityPercentage, setDisabilityPercentage] = useState<
    DisabilityPercentage | "0%"
  >("0%");
  const [dependentStatus, setDependentStatus] = useState<
    DependentStatus | "none"
  >("none");

  // MHA State
  const [mha, setMha] = useState<string>("initial");
  const [state, setState] = useState<string>("");

  // --- Data Fetching with React Query ---
  const {
    data: mhaData,
    error: mhaError,
    isLoading: isLoadingMha,
  } = useQuery({
    queryKey: ["mhaData"],
    queryFn: getMhaData,
    staleTime: Infinity,
  });

  const {
    data: payGrades,
    error: payGradesError,
    isLoading: isLoadingPayGrades,
  } = useQuery({
    queryKey: ["payGrades"],
    queryFn: async () => {
      const data = await getPayGrades();
      const getRankOrder = (payGrade: string) => {
        const rankType = payGrade.charAt(0);
        const rankNum = parseInt(payGrade.substring(2));
        if (rankType === "E") return rankNum;
        if (rankType === "W") return 100 + rankNum;
        if (rankType === "O") {
          if (payGrade.endsWith("E")) return 200 + rankNum + 0.5;
          return 200 + rankNum;
        }
        return 400;
      };
      return (data || []).sort(
        (a: string, b: string) => getRankOrder(a) - getRankOrder(b),
      );
    },
    staleTime: Infinity,
  });

  const {
    data: federalTaxData,
    error: federalTaxDataError,
    isLoading: isLoadingFedTax,
  } = useQuery({
    queryKey: ["federalTaxData", 2024],
    queryFn: () => getFederalTaxData(2024),
    staleTime: Infinity,
  });

  const {
    data: stateTaxData,
    error: stateTaxDataError,
    isLoading: isLoadingStateTax,
  } = useQuery({
    queryKey: ["stateTaxData", 2024],
    queryFn: () => getStateTaxData(2024),
    staleTime: Infinity,
  });

  const {
    data: disabilityData,
    error: disabilityError,
    isLoading: isLoadingDisability,
  } = useQuery({
    queryKey: ["disabilityData"],
    queryFn: getDisabilityData,
    staleTime: Infinity,
  });

  const isLoading =
    isLoadingMha ||
    isLoadingPayGrades ||
    isLoadingFedTax ||
    isLoadingStateTax ||
    isLoadingDisability;

  useEffect(() => {
    const age = getRetirementAge(
      component as "Active" | "Reserve" | "Guard",
      birthDate,
      serviceEntryDate,
      parseInt(yearsOfService, 10),
      parseInt(breakInService, 10),
      parseInt(qualifyingDeploymentDays, 10),
    );
    setRetirementAge(age);
  }, [
    birthDate,
    serviceEntryDate,
    yearsOfService,
    qualifyingDeploymentDays,
    component,
    breakInService,
  ]);

  // This effect handles the TSP calculation logic separately to avoid infinite loops.
  useEffect(() => {
    const tspValue = calculateTsp(
      tspAmount,
      isTspCalculatorVisible,
      Number(debouncedTspContributionAmount),
      Number(debouncedTspContributionPercentage),
      Number(debouncedTspContributionYears),
      retirementSystem as "High 3" | "BRS",
      tspReturn,
    );
    setTsp(tspValue);

    // If the calculator is visible, sync the main TSP amount input with the calculated value.
    if (isTspCalculatorVisible) {
      setTspAmount(tspValue.toString());
    }
  }, [
    tspAmount,
    isTspCalculatorVisible,
    debouncedTspContributionAmount,
    debouncedTspContributionPercentage,
    debouncedTspContributionYears,
    retirementSystem,
    tspReturn,
  ]);

  // This is the main calculation effect, now simplified to not include TSP logic.
  useEffect(() => {
    const calculate = async () => {
      if (isLoading) return;
      try {
        const pensionValue = await calculatePension(
          component as "Active" | "Reserve" | "Guard",
          retirementSystem as "High 3" | "BRS",
          high3PayGrade1 || "",
          high3PayGrade2 || "",
          high3PayGrade3 || "",
          Number(yearsOfService),
          Number(servicePoints),
          Number(goodYears),
        );
        setPension(pensionValue);

        // Synchronous calculation
        const disabilityIncomeValue = calculateDisabilityIncome(
          disabilityPercentage || "0%",
          dependentStatus || "none",
          disabilityData || [],
        );
        setDisabilityIncome(disabilityIncomeValue);

        const grossIncome = pensionValue + disabilityIncomeValue;
        if (federalTaxData && stateTaxData) {
          const {
            federal,
            state: taxState,
            federalStandardDeduction: fedStd,
            stateStandardDeduction: stateStd,
          } = calculateTaxes(
            grossIncome,
            state,
            filingStatus,
            federalTaxData,
            stateTaxData,
          );
          setTaxes({ federal, state: taxState });
          setFederalStandardDeduction(fedStd);
          setStateStandardDeduction(stateStd);
        }
      } catch (e) {
        // console.error("Calculation error: ", e)
      }
    };

    calculate();
  }, [
    component,
    retirementSystem,
    high3PayGrade1,
    high3PayGrade2,
    high3PayGrade3,
    yearsOfService,
    servicePoints,
    goodYears,
    disabilityPercentage,
    dependentStatus,
    state,
    filingStatus,
    federalTaxData,
    stateTaxData,
    isLoading,
    disabilityData,
  ]);

  useEffect(() => {
    if (high3PayGrade1 && high3PayGrade2 && payGrades) {
      const year1Index = payGrades.findIndex(
        (p: string) => p === high3PayGrade1,
      );
      const year2Index = payGrades.findIndex(
        (p: string) => p === high3PayGrade2,
      );
      if (year1Index > year2Index) {
        setHigh3PayGrade2(null);
        setHigh3PayGrade3(null);
      }
    }
  }, [high3PayGrade1, high3PayGrade2, payGrades]);

  useEffect(() => {
    if (high3PayGrade2 && high3PayGrade3 && payGrades) {
      const year2Index = payGrades.findIndex(
        (p: string) => p === high3PayGrade2,
      );
      const year3Index = payGrades.findIndex(
        (p: string) => p === high3PayGrade3,
      );
      if (year2Index > year3Index) {
        setHigh3PayGrade3(null);
      }
    }
  }, [high3PayGrade2, high3PayGrade3, payGrades]);

  const payGradesForYear1 = useMemo(() => payGrades || [], [payGrades]);

  const payGradesForYear2 = useMemo(() => {
    if (!high3PayGrade1 || !payGrades) {
      return payGrades || [];
    }
    const selectedIndex = payGrades.findIndex(
      (p: string) => p === high3PayGrade1,
    );
    if (selectedIndex === -1) {
      return payGrades;
    }
    return payGrades.slice(selectedIndex);
  }, [payGrades, high3PayGrade1]);

  const payGradesForYear3 = useMemo(() => {
    if (!high3PayGrade2) {
      return payGradesForYear2;
    }
    const selectedIndex = payGradesForYear2.findIndex(
      (p: string) => p === high3PayGrade2,
    );
    if (selectedIndex === -1) {
      return payGradesForYear2;
    }
    return payGradesForYear2.slice(selectedIndex);
  }, [payGradesForYear2, high3PayGrade2]);
  const disabilityPercentageItems = useMemo(() => {
    if (!disabilityData || disabilityData.length === 0) return [];
    const keys = Object.keys(disabilityData[0]).filter((key) =>
      key.endsWith("%"),
    );
    keys.sort((a, b) => {
      const numA = parseInt(a.replace("%", ""));
      const numB = parseInt(b.replace("%", ""));
      return numA - numB;
    });
    return keys;
  }, [disabilityData]);

  const disabilityPickerData = useMemo(() => {
    if (!disabilityData) return {};
    const groupedData: { [key: string]: { label: string; value: string }[] } = {
      "0%": [{ label: "No Disability", value: "none" }],
    };
    const allStatuses = disabilityData.map((item) => ({
      label: item.dependent_status,
      value: item.dependent_status,
    }));
    const percentageKeys =
      disabilityData.length > 0
        ? Object.keys(disabilityData[0]).filter((key) => key.endsWith("%"))
        : [];
    percentageKeys.forEach((key) => {
      if (key !== "0%") {
        groupedData[key] = allStatuses;
      }
    });
    return groupedData;
  }, [disabilityData]);

  // Conditional Inputs
  const [showServicePoints, setShowServicePoints] = useState(true);
  const [showGoodYears, setShowGoodYears] = useState(true);
  useEffect(() => {
    if (component === "Active") {
      setShowServicePoints(false);
      setShowGoodYears(false);
    } else {
      setShowServicePoints(true);
      setShowGoodYears(true);
    }
  }, [component]);

  useEffect(() => {
    if (isTspCalculatorVisible) {
      setTspAmount("");
    }
  }, [isTspCalculatorVisible]);

  const mhaDisplayName = useMemo(() => {
    if (mha === "initial") return "Select a state";
    if (mha === "ON_BASE") return "ON BASE";
    if (!mha || !mhaData) return "...";
    for (const stateKey in mhaData) {
      const mhaList = mhaData[stateKey] as { label: string; value: string }[];
      const mhaObject = mhaList.find((m) => m.value === mha);
      if (mhaObject) {
        return mhaObject.label;
      }
    }
    return "...";
  }, [mha, mhaData]);

  const disabilityDisplayName = useMemo(() => {
    if (!disabilityPercentage) return "Select disability";
    if (disabilityPercentage === "0%") return "0% - No Disability";
    if (!dependentStatus) return "Select a dependent status";
    return `${disabilityPercentage} - ${dependentStatus}`;
  }, [disabilityPercentage, dependentStatus]);

  const handleMhaChange = (mhaValue: string, stateValue: string) => {
    setMha(mhaValue);
    setState(stateValue);
  };

  const handleDisabilityChange = (
    statusValue: string,
    percentageValue: string,
  ) => {
    setDependentStatus(statusValue as DependentStatus);
    setDisabilityPercentage(percentageValue as DisabilityPercentage);
    if (percentageValue === "0%") {
      setDependentStatus("none");
    }
  };

  const resetState = () => {
    setComponent("Active");
    setRetirementSystem("High 3");
    setHigh3PayGrade1(null);
    setHigh3PayGrade2(null);
    setHigh3PayGrade3(null);
    setTspAmount("");
    setServicePoints("");
    setGoodYears("");
    setMha("initial");
    setState("");
    setDisabilityPercentage("0%");
    setDependentStatus("none");
    setIsTspCalculatorVisible(false);
    setTspContributionAmount("");
    setTspContributionPercentage("");
    setTspContributionYears("");
    setFilingStatus("Single");
    setBrsPayGrade(null);
    setTspType("Roth");
    setTspReturn(8);
    setBirthDateState(null);
    setServiceEntryDate(null);
    hasModifiedBirthDate.current = false;
  };

  const percentageItems = [
    { label: "10%", value: "10" },
    { label: "20%", value: "20" },
    { label: "30%", value: "30" },
    { label: "40%", value: "40" },
    { label: "50%", value: "50" },
    { label: "60%", value: "60" },
    { label: "70%", value: "70" },
    { label: "80%", value: "80" },
    { label: "90%", value: "90" },
    { label: "100%", value: "100" },
  ];

  const statusItems = useMemo(() => {
    if (!disabilityData) return [];
    return disabilityData.map((item) => ({
      label: item.dependent_status,
      value: item.dependent_status,
    }));
  }, [disabilityData]);

  return {
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
    handleMhaChange,
    mhaDisplayName,
    disabilityPercentage,
    setDisabilityPercentage,
    dependentStatus,
    setDependentStatus,
    disabilityData,
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
    yearsOfService,
    setYearsOfService,
    filingStatus,
    setFilingStatus,
    brsPayGrade,
    setBrsPayGrade,
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
    mhaError,
    payGradesError,
    federalTaxDataError,
    stateTaxDataError,
    disabilityError,
    breakInService,
    setBreakInService,
  };
};
