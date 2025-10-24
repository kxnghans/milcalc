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

  const calculateRetirementAge = () => {
    if (!birthDate || !serviceEntryDate) return;

    if (component === 'Active') {
      const retirementDate = new Date(serviceEntryDate);
      retirementDate.setFullYear(retirementDate.getFullYear() + parseInt(yearsOfService, 10));
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

  const [payGrades, setPayGrades] = useState([]);
  const [isPayGradesLoading, setIsPayGradesLoading] = useState(false);
  const [payGradesError, setPayGradesError] = useState(null);

  const [federalTaxData, setFederalTaxData] = useState([]);
  const [isFederalTaxDataLoading, setIsFederalTaxDataLoading] = useState(false);
  const [federalTaxDataError, setFederalTaxDataError] = useState(null);

  const [stateTaxData, setStateTaxData] = useState([]);
  const [isStateTaxDataLoading, setIsStateTaxDataLoading] = useState(false);
  const [stateTaxDataError, setStateTaxDataError] = useState(null);

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

  useEffect(() => {
    calculateRetirementAge();
  }, [birthDate, serviceEntryDate, yearsOfService, qualifyingDeploymentDays, component]);

  useEffect(() => {
    const calculate = async () => {
      const pensionValue = await calculatePension(component, retirementSystem, high3PayGrade1, high3PayGrade2, high3PayGrade3, yearsOfService, servicePoints, goodYears);
      setPension(pensionValue);

      const disabilityIncomeValue = await calculateDisabilityIncome(disabilityPercentage, dependentStatus);
      setDisabilityIncome(disabilityIncomeValue);

      const tspValue = calculateTsp(tspAmount, isTspCalculatorVisible, debouncedTspContributionAmount, debouncedTspContributionPercentage, debouncedTspContributionYears, retirementSystem, tspReturn);
      setTsp(tspValue);

      if (isTspCalculatorVisible) {
        setTspAmount(tspValue.toString());
      }

      const grossIncome = pensionValue + disabilityIncomeValue;
      const { federal, state, federalStandardDeduction, stateStandardDeduction } = calculateTaxes(grossIncome, state, filingStatus, federalTaxData, stateTaxData);
      setTaxes({ federal, state });
      setFederalStandardDeduction(federalStandardDeduction);
      setStateStandardDeduction(stateStandardDeduction);
    };

    calculate();
  }, [component, retirementSystem, high3PayGrade1, high3PayGrade2, high3PayGrade3, yearsOfService, servicePoints, disabilityPercentage, dependentStatus, tspAmount, state, filingStatus, isTspCalculatorVisible, debouncedTspContributionAmount, debouncedTspContributionPercentage, debouncedTspContributionYears, tspReturn, tspType]);

  // MHA State
  const [mha, setMha] = useState('initial');
  const [state, setState] = useState('');
  const [mhaData, setMhaData] = useState({});
  const [isLoadingMha, setIsLoadingMha] = useState(false);
  const [mhaError, setMhaError] = useState(null);

  // Disability State
  const [disabilityPercentage, setDisabilityPercentage] = useState(null);
  const [dependentStatus, setDependentStatus] = useState(null);
  const [disabilityData, setDisabilityData] = useState([]);
  const [isDisabilityLoading, setIsDisabilityLoading] = useState(false);
  const [disabilityError, setDisabilityError] = useState(null);

  const disabilityPickerData = useMemo(() => {
    if (!disabilityData) return {};
    const groupedData = {
        '0%': [{ label: 'No Disability', value: 'none' }]
    };
    disabilityData.forEach(item => {
      for (const key in item) {
        if (key.endsWith('%')) {
          if (!groupedData[key]) {
            groupedData[key] = [];
          }
          groupedData[key].push({ label: item.dependent_status, value: item.dependent_status });
        }
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

  // Effect to fetch MHA data once on mount
  useEffect(() => {
    const fetchMhaData = async () => {
      setIsLoadingMha(true);
      try {
        const data = await getMhaData();
        setMhaData(data);
      } catch (error) {
        setMhaError(error.message);
      } finally {
        setIsLoadingMha(false);
      }
    };
    fetchMhaData();
  }, []);

  useEffect(() => {
    const fetchPayGrades = async () => {
      setIsPayGradesLoading(true);
      try {
        const data = await getPayGrades();
        
        const getRankOrder = (payGrade) => {
          const rankType = payGrade.charAt(0);
          const rankNum = parseInt(payGrade.substring(2));

          if (rankType === 'E') {
            return rankNum;
          } else if (rankType === 'W') {
            return 100 + rankNum;
          } else if (rankType === 'O') {
            if (payGrade.endsWith('E')) {
              return 200 + rankNum + 0.5;
            } else {
              return 200 + rankNum;
            }
          }
          return 400; // Should not happen
        };

        const sortedData = data.sort((a, b) => getRankOrder(a) - getRankOrder(b));
        setPayGrades(sortedData);
      } catch (error) {
        setPayGradesError(error.message);
      } finally {
        setIsPayGradesLoading(false);
      }
    };
    fetchPayGrades();
  }, []);

  useEffect(() => {
    const fetchTaxData = async () => {
      setIsFederalTaxDataLoading(true);
      setIsStateTaxDataLoading(true);
      try {
        const federalData = await getFederalTaxData(2024);
        const stateData = await getStateTaxData(2024);
        setFederalTaxData(federalData);
        setStateTaxData(stateData);
      } catch (error) {
        setFederalTaxDataError(error.message);
        setStateTaxDataError(error.message);
      } finally {
        setIsFederalTaxDataLoading(false);
        setIsStateTaxDataLoading(false);
      }
    };
    fetchTaxData();
  }, []);

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

  useEffect(() => {
    const fetchDisabilityData = async () => {
      setIsDisabilityLoading(true);
      try {
        const data = await getDisabilityData();
        setDisabilityData(data);
      } catch (error) {
        setDisabilityError(error.message);
      } finally {
        setIsDisabilityLoading(false);
      }
    };
    fetchDisabilityData();
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
    if (!dependentStatus) return "Select disability";
    if (disabilityPercentage === '0%') return "No Disability";
    return `${disabilityPercentage}% / ${dependentStatus}`;
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
    isLoadingMha,
    mhaError,
    handleMhaChange,
    mhaDisplayName,
    disabilityPercentage,
    setDisabilityPercentage,
    dependentStatus,
    setDependentStatus,
    disabilityData,
    isDisabilityLoading,
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
    handleDisabilityChange,
    disabilityDisplayName,

    // New State
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
    isPayGradesLoading,
    payGradesError,
    federalTaxData,
    isFederalTaxDataLoading,
    federalTaxDataError,
    stateTaxData,
    isStateTaxDataLoading,
    stateTaxDataError,
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

    // Calculated values
    pension,
    disabilityIncome,
    tsp,
    taxes,
  };
};
