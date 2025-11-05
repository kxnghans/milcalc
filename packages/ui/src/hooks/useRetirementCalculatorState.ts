import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { getDisabilityData, getMhaData, getPayGrades, getFederalTaxData, getStateTaxData, calculatePension, calculateDisabilityIncome, calculateTsp, calculateTaxes } from '@repo/utils';

export const useRetirementCalculatorState = () => {
  const [component, setComponent] = useState('Active');
  const [retirementSystem, setRetirementSystem] = useState('High 3');

  // High 3 State
  const [high3PayGrade1, setHigh3PayGrade1] = useState(null);
  const [high3PayGrade2, setHigh3PayGrade2] = useState(null);
  const [high3PayGrade3, setHigh3PayGrade3] = useState(null);
  const [tspAmount, setTspAmount] = useState('');
  const [servicePoints, setServicePoints] = useState('');
  const [goodYears, setGoodYears] = useState('');

  // New State
  const [yearsOfService, setYearsOfService] = useState('');
  const [filingStatus, setFilingStatus] = useState('Single');
  const [brsPayGrade, setBrsPayGrade] = useState(null);
  const [tspType, setTspType] = useState('Roth');
  const [tspReturn, setTspReturn] = useState(8);

  const [federalStandardDeduction, setFederalStandardDeduction] = useState(0);
  const [stateStandardDeduction, setStateStandardDeduction] = useState(0);
  const [birthDate, setBirthDate] = useState(null);
  const [serviceEntryDate, setServiceEntryDate] = useState(null);
  const [qualifyingDeploymentDays, setQualifyingDeploymentDays] = useState('');
  const [isPayDisplayExpanded, setIsPayDisplayExpanded] = useState(false);
  const [isRetirementAgeCalculatorVisible, setIsRetirementAgeCalculatorVisible] = useState(false);
  const [retirementAge, setRetirementAge] = useState(null);
  const [breakInService, setBreakInService] = useState('');

  const [payGrades, setPayGrades] = useState([]);
  const [payGradesError, setPayGradesError] = useState(null);
  const [federalTaxData, setFederalTaxData] = useState([]);
  const [federalTaxDataError, setFederalTaxDataError] = useState(null);
  const [stateTaxData, setStateTaxData] = useState([]);
  const [stateTaxDataError, setStateTaxDataError] = useState(null);
  const [mhaData, setMhaData] = useState({});
  const [mhaError, setMhaError] = useState(null);
  const [disabilityData, setDisabilityData] = useState([]);
  const [disabilityError, setDisabilityError] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  // Calculated values
  const [pension, setPension] = useState(0);
  const [disabilityIncome, setDisabilityIncome] = useState(0);
  const [tsp, setTsp] = useState(0);
  const [taxes, setTaxes] = useState({ federal: 0, state: 0 });
  
  // TSP Calculator State
  const [isTspCalculatorVisible, setIsTspCalculatorVisible] = useState(false);
  const [tspContributionAmount, setTspContributionAmount] = useState('');
  const [tspContributionPercentage, setTspContributionPercentage] = useState('');
  const [tspContributionYears, setTspContributionYears] = useState('');

  const debouncedTspContributionAmount = useDebounce(tspContributionAmount, 500);
  const debouncedTspContributionPercentage = useDebounce(tspContributionPercentage, 500);
  const debouncedTspContributionYears = useDebounce(tspContributionYears, 500);

  const [disabilityPercentage, setDisabilityPercentage] = useState(null);
  const [dependentStatus, setDependentStatus] = useState(null);

  useEffect(() => {
    const calculateRetirementAge = () => {
      if (!birthDate || !serviceEntryDate) return;
  
      if (component === 'Active') {
        const retirementDate = new Date(serviceEntryDate);
        const totalYears = (parseInt(yearsOfService, 10) || 0) + (parseInt(breakInService, 10) || 0);
        retirementDate.setFullYear(retirementDate.getFullYear() + totalYears);
        const ageAtRetirement = retirementDate.getFullYear() - birthDate.getFullYear();
        const m = retirementDate.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && retirementDate.getDate() < birthDate.getDate())) {
          setRetirementAge(ageAtRetirement - 1);
        } else {
          setRetirementAge(ageAtRetirement);
        }
      } else {
        const retirementAgeYears = 60 - Math.floor(qualifyingDeploymentDays / 90) * 0.25;
        setRetirementAge(retirementAgeYears);
      }
    };
    calculateRetirementAge();
  }, [birthDate, serviceEntryDate, yearsOfService, qualifyingDeploymentDays, component, breakInService]);

  // This effect handles the TSP calculation logic separately to avoid infinite loops.
  useEffect(() => {
    const tspValue = calculateTsp(
      tspAmount,
      isTspCalculatorVisible,
      debouncedTspContributionAmount,
      debouncedTspContributionPercentage,
      debouncedTspContributionYears,
      retirementSystem,
      tspReturn
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
      try {
        const pensionValue = await calculatePension(component, retirementSystem, high3PayGrade1, high3PayGrade2, high3PayGrade3, yearsOfService, servicePoints, goodYears);
        setPension(pensionValue);

        const disabilityIncomeValue = await calculateDisabilityIncome(disabilityPercentage, dependentStatus);
        setDisabilityIncome(disabilityIncomeValue);

        const grossIncome = pensionValue + disabilityIncomeValue;
        const { federal, state, federalStandardDeduction, stateStandardDeduction } = calculateTaxes(grossIncome, state, filingStatus, federalTaxData, stateTaxData);
        setTaxes({ federal, state });
        setFederalStandardDeduction(federalStandardDeduction);
        setStateStandardDeduction(stateStandardDeduction);
      } finally {
        setIsLoading(false);
      }
    };

    calculate();
  }, [component, retirementSystem, high3PayGrade1, high3PayGrade2, high3PayGrade3, yearsOfService, servicePoints, disabilityPercentage, dependentStatus, state, filingStatus, federalTaxData, stateTaxData]);

  // MHA State
  const [mha, setMha] = useState('initial');
  const [state, setState] = useState('');

  useEffect(() => {
    if (high3PayGrade1 && high3PayGrade2) {
      const year1Index = payGrades.findIndex(p => p === high3PayGrade1);
      const year2Index = payGrades.findIndex(p => p === high3PayGrade2);
      if (year1Index > year2Index) {
        setHigh3PayGrade2(null);
        setHigh3PayGrade3(null);
      }
    }
  }, [high3PayGrade1, high3PayGrade2, payGrades]);

  useEffect(() => {
    if (high3PayGrade2 && high3PayGrade3) {
      const year2Index = payGrades.findIndex(p => p === high3PayGrade2);
      const year3Index = payGrades.findIndex(p => p === high3PayGrade3);
      if (year2Index > year3Index) {
        setHigh3PayGrade3(null);
      }
    }
  }, [high3PayGrade2, high3PayGrade3, payGrades]);

  const payGradesForYear1 = useMemo(() => payGrades, [payGrades]);

  const payGradesForYear2 = useMemo(() => {
    if (!high3PayGrade1) {
      return payGrades;
    }
    const selectedIndex = payGrades.findIndex(p => p === high3PayGrade1);
    if (selectedIndex === -1) {
      return payGrades;
    }
    return payGrades.slice(selectedIndex);
  }, [payGrades, high3PayGrade1]);

  const payGradesForYear3 = useMemo(() => {
    if (!high3PayGrade2) {
      return payGradesForYear2;
    }
    const selectedIndex = payGradesForYear2.findIndex(p => p === high3PayGrade2);
    if (selectedIndex === -1) {
      return payGradesForYear2;
    }
    return payGradesForYear2.slice(selectedIndex);
  }, [payGradesForYear2, high3PayGrade2]);
  const disabilityPercentageItems = useMemo(() => {
    if (!disabilityData || disabilityData.length === 0) return [];
    const keys = Object.keys(disabilityData[0]).filter(key => key.endsWith('%'));
    keys.sort((a, b) => {
      const numA = parseInt(a.replace('%', ''));
      const numB = parseInt(b.replace('%', ''));
      return numA - numB;
    });
    return keys;
  }, [disabilityData]);

  const disabilityPickerData = useMemo(() => {
    if (!disabilityData) return {};
    const groupedData = {
        '0%': [{ label: 'No Disability', value: 'none' }]
    };
    const allStatuses = disabilityData.map(item => ({ label: item.dependent_status, value: item.dependent_status }));
    const percentageKeys = disabilityData.length > 0 ? Object.keys(disabilityData[0]).filter(key => key.endsWith('%')) : [];
    percentageKeys.forEach(key => {
        if(key !== '0%') {
            groupedData[key] = allStatuses;
        }
    });
    return groupedData;
  }, [disabilityData]);

  // Conditional Inputs
  const [showServicePoints, setShowServicePoints] = useState(true);
  const [showGoodYears, setShowGoodYears] = useState(true);
  useEffect(() => {
    if (component === 'Active') {
      setShowServicePoints(false);
      setShowGoodYears(false);
    } else {
      setShowServicePoints(true);
      setShowGoodYears(true);
    }
  }, [component]);

  useEffect(() => {
    if (isTspCalculatorVisible) {
      setTspAmount('');
    }
  }, [isTspCalculatorVisible]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          (async () => {
            try {
              const data = await getMhaData();
              setMhaData(data);
            } catch (error) {
              setMhaError(error.message);
            }
          })(),
          (async () => {
            try {
              const data = await getPayGrades();
              const getRankOrder = (payGrade) => {
                const rankType = payGrade.charAt(0);
                const rankNum = parseInt(payGrade.substring(2));
                if (rankType === 'E') return rankNum;
                if (rankType === 'W') return 100 + rankNum;
                if (rankType === 'O') {
                  if (payGrade.endsWith('E')) return 200 + rankNum + 0.5;
                  return 200 + rankNum;
                }
                return 400;
              };
              const sortedData = data.sort((a, b) => getRankOrder(a) - getRankOrder(b));
              setPayGrades(sortedData);
            } catch (error) {
              setPayGradesError(error.message);
            }
          })(),
          (async () => {
            try {
              const federalData = await getFederalTaxData(2024);
              const stateData = await getStateTaxData(2024);
              setFederalTaxData(federalData);
              setStateTaxData(stateData);
            } catch (error) {
              setFederalTaxDataError(error.message);
              setStateTaxDataError(error.message);
            }
          })(),
          (async () => {
            try {
              const data = await getDisabilityData();
              setDisabilityData(data);
            } catch (error) {
              setDisabilityError(error.message);
            }
          })(),
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const mhaDisplayName = useMemo(() => {
    if (mha === 'initial') return "Select a state";
    if (mha === 'ON_BASE') return "ON BASE";
    if (!mha || !mhaData) return "...";
    for (const state in mhaData) {
      const mhaObject = mhaData[state].find(m => m.value === mha);
      if (mhaObject) {
        return mhaObject.label;
      }
    }
    return "...";
  }, [mha, mhaData]);

  const disabilityDisplayName = useMemo(() => {
    if (!disabilityPercentage) return "Select disability";
    if (disabilityPercentage === '0%') return "0% - No Disability";
    if (!dependentStatus) return "Select a dependent status";
    return `${disabilityPercentage} - ${dependentStatus}`;
  }, [disabilityPercentage, dependentStatus]);

  const handleMhaChange = (mha, state) => {
    setMha(mha);
    setState(state);
  };

  const handleDisabilityChange = (status, percentage) => {
    setDependentStatus(status);
    setDisabilityPercentage(percentage);
    if (percentage === '0%') {
        setDependentStatus('none');
    }
  };

  const resetState = () => {
    setComponent('Active');
    setRetirementSystem('High 3');
    setHigh3PayGrade1(null);
    setHigh3PayGrade2(null);
    setHigh3PayGrade3(null);
    setTspAmount('');
    setServicePoints('');
    setGoodYears('');
    setMha('initial');
    setState('');
    setDisabilityPercentage(null);
    setDependentStatus(null);
    setIsTspCalculatorVisible(false);
    setTspContributionAmount('');
    setTspContributionPercentage('');
    setTspContributionYears('');
    setFilingStatus('Single');
    setBrsPayGrade(null);
    setTspType('Roth');
    setTspReturn(8);
  };

  const percentageItems = [
    { label: '10%', value: '10' },
    { label: '20%', value: '20' },
    { label: '30%', value: '30' },
    { label: '40%', value: '40' },
    { label: '50%', value: '50' },
    { label: '60%', value: '60' },
    { label: '70%', value: '70' },
    { label: '80%', value: '80' },
    { label: '90%', value: '90' },
    { label: '100%', value: '100' },
  ];

  const statusItems = useMemo(() => {
    if (!disabilityData) return [];
    return disabilityData.map(item => ({ label: item.dependent_status, value: item.dependent_status }));
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