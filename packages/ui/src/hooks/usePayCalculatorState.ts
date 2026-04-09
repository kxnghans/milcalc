import { useState, useMemo, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';
import { getBasePay, getBasRate, getBahRate, getMhaData, getFederalTaxData, getStateTaxData, calculatePay, getMaxFederalTaxYear, getMaxStateTaxYear, getDisabilityData, getReserveDrillPay, calculateDisabilityIncome, DisabilityPercentage, DependentStatus } from '@repo/utils';

// A simple utility to parse currency strings into numbers
const parseCurrency = (value: string | number) => {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
  }
  return 0; // Return 0 if value is undefined, null, etc.
};

const officerRanks = [
  { label: 'O-1', value: 'O-1' }, { label: 'O-1E', value: 'O-1E' }, 
  { label: 'O-2', value: 'O-2' }, { label: 'O-2E', value: 'O-2E' }, 
  { label: 'O-3', value: 'O-3' }, { label: 'O-3E', value: 'O-3E' },
  { label: 'O-4', value: 'O-4' }, { label: 'O-5', value: 'O-5' }, { label: 'O-6', value: 'O-6' },
  { label: 'O-7', value: 'O-7' }, { label: 'O-8', value: 'O-8' }, { label: 'O-9', value: 'O-9' }, { label: 'O-10', value: 'O-10' },
];

const warrantOfficerRanks = [
  { label: 'W-1', value: 'W-1' }, { label: 'W-2', value: 'W-2' }, { label: 'W-3', value: 'W-3' },
  { label: 'W-4', value: 'W-4' }, { label: 'W-5', value: 'W-5' },
];

const enlistedRanks = [
  { label: 'E-1', value: 'E-1' }, { label: 'E-2', value: 'E-2' }, { label: 'E-3', value: 'E-3' },
  { label: 'E-4', value: 'E-4' }, { label: 'E-5', value: 'E-5' }, { label: 'E-6', value: 'E-6' },
  { label: 'E-7', value: 'E-7' }, { label: 'E-8', value: 'E-8' }, { label: 'E-9', value: 'E-9' },
];

export const usePayCalculatorState = (
  initialAge: string = '',
  initialGender: string = 'male',
  onSaveToProfile?: (data: { age?: string; gender?: string }) => void
) => {
  // --- Raw Input State ---
  const [status, setStatus] = useState('Enlisted');
  const [rank, setRank] = useState<string | null>(null);
  const [yearsOfService, setYearsOfService] = useState('');
  const [mha, setMha] = useState('initial');
  const [bahDependencyStatus, setBahDependencyStatus] = useState('WITHOUT_DEPENDENTS');
  const [vaDependencyStatus, setVaDependencyStatus] = useState<DependentStatus>('none');
  const [filingStatus, setFilingStatus] = useState('single');
  const [state, setState] = useState('');
  const [component, setComponent] = useState('Active');
  const [disabilityPercentage, setDisabilityPercentage] = useState<DisabilityPercentage>('0%');
  const [paySource, setPaySource] = useState('Military');
  const [vaDisabilityPay, setVaDisabilityPay] = useState(0);

  // Demographic state for consistency across calculators
  const [age, setAgeState] = useState('');
  const [gender, setGenderState] = useState('male');

  const hasModifiedAge = useRef(false);
  const hasModifiedGender = useRef(false);

  // --- Hydration logic ---
  useEffect(() => {
    if (initialAge && !hasModifiedAge.current && age === '') {
      setAgeState(initialAge);
    }
  }, [initialAge, age]);

  useEffect(() => {
    if (initialGender && !hasModifiedGender.current && gender !== initialGender) {
      setGenderState(initialGender);
    }
  }, [initialGender, gender]);

  /**
   * Triggers a native alert asking if the user wants to save the demographic change to their profile.
   */
  const promptSaveToProfile = (type: 'age' | 'gender', value: string) => {
    if (!onSaveToProfile) return;

    const isProfileEmpty = type === 'age' ? !initialAge : false;

    if (isProfileEmpty) {
      Alert.alert(
        "Save to Profile?",
        `Would you like to save this ${type} to your permanent profile?`,
        [
          { text: "Not Now", style: "cancel" },
          { 
            text: "Save", 
            onPress: () => onSaveToProfile({ [type]: value })
          }
        ]
      );
    }
  };

  const setAge = (newAge: string) => {
    hasModifiedAge.current = true;
    setAgeState(newAge);
    if (newAge.length >= 2 && !initialAge) {
      promptSaveToProfile('age', newAge);
    }
  };

  const setGender = (newGender: string) => {
    hasModifiedGender.current = true;
    setGenderState(newGender);
  };

  // --- User Input Income/Deduction States ---
  const [isIncomeExpanded, setIncomeExpanded] = useState(false);
  const [specialPays, setSpecialPays] = useState({
    clothing: '', hostileFire: '', imminentDanger: '', hazardousDuty: '',
    hardshipDuty: '', aviation: '', assignment: '', careerSea: '',
    healthProfessions: '', foreignLanguage: '', specialDuty: ''
  });
  const [additionalIncomes, setAdditionalIncomes] = useState([{ name: '', amount: '' }]);
  const [isDeductionsExpanded, setDeductionsExpanded] = useState(false);
  const [isStandardDeductionsExpanded, setIsStandardDeductionsExpanded] = useState(false);
  const [deductions, setDeductions] = useState({
    sgli: '',
    tsp: '',
    overrideFedTax: '',
    overrideStateTax: '',
    overrideFicaTax: '',
  });
  const [additionalDeductions, setAdditionalDeductions] = useState([{ name: '', amount: '' }]);
  const [calculatedTaxes, setCalculatedTaxes] = useState({ fedTax: 0, stateTax: 0, ficaTax: 0, federalStandardDeduction: 0, stateStandardDeduction: 0 });

  // --- Data & UI State ---
  const [filteredRanks, setFilteredRanks] = useState(enlistedRanks);
  const [isTaxOverride, setIsTaxOverride] = useState(false);

  // Debounced values for calculations
  const debouncedRank = useDebounce(rank, 500);
  const debouncedYears = useDebounce(yearsOfService, 500);
  const debouncedMha = useDebounce(mha, 500);
  const debouncedBahDependencyStatus = useDebounce(bahDependencyStatus, 500);
  const debouncedFilingStatus = useDebounce(filingStatus, 500);
  const debouncedState = useDebounce(state, 500);

  // Deep debounce for object/array states to prevent excessive re-renders during typing
  const debouncedSpecialPays = useDebounce(specialPays, 500);
  const debouncedAdditionalIncomes = useDebounce(additionalIncomes, 500);
  const debouncedDeductions = useDebounce(deductions, 500);
  const debouncedAdditionalDeductions = useDebounce(additionalDeductions, 500);


  // --- Data Fetching with React Query ---
  const { data: mhaData, error: mhaError, isLoading: isLoadingMha } = useQuery({
    queryKey: ['mhaData'],
    queryFn: async () => {
      const data = await getMhaData();
      for (const state in data) {
        data[state].unshift({ label: 'ON BASE', value: 'ON_BASE' });
      }
      return data;
    },
    staleTime: Infinity,
  });

  const { data: federalTaxYear } = useQuery({
    queryKey: ['maxFederalTaxYear'],
    queryFn: getMaxFederalTaxYear,
    staleTime: Infinity,
  });

  const { data: stateTaxYear } = useQuery({
    queryKey: ['maxStateTaxYear'],
    queryFn: getMaxStateTaxYear,
    staleTime: Infinity,
  });

  const { data: federalTaxData, isLoading: isLoadingFedTax } = useQuery({
    queryKey: ['federalTaxData', federalTaxYear],
    queryFn: () => getFederalTaxData(federalTaxYear as number),
    enabled: !!federalTaxYear,
    staleTime: Infinity,
  });

  const { data: stateTaxData, isLoading: isLoadingStateTax } = useQuery({
    queryKey: ['stateTaxData', stateTaxYear],
    queryFn: () => getStateTaxData(stateTaxYear as number),
    enabled: !!stateTaxYear,
    staleTime: Infinity,
  });

  const { data: disabilityData, error: disabilityError, isLoading: isLoadingDisability } = useQuery({
    queryKey: ['disabilityData'],
    queryFn: getDisabilityData,
    staleTime: Infinity,
  });

  const { data: basePay, isLoading: isLoadingBasePay } = useQuery({
    queryKey: ['basePay', debouncedRank, debouncedYears, component],
    queryFn: () => component === 'Active'
      ? getBasePay(debouncedRank as string, Number(debouncedYears))
      : getReserveDrillPay(debouncedRank as string, Number(debouncedYears)),
    enabled: !!debouncedRank && !!debouncedYears,
  });

  const { data: bah, isLoading: isLoadingBah } = useQuery({
    queryKey: ['bahRate', debouncedMha, debouncedRank, debouncedBahDependencyStatus],
    queryFn: () => getBahRate(debouncedMha, debouncedRank as string, debouncedBahDependencyStatus as 'WITH_DEPENDENTS' | 'WITHOUT_DEPENDENTS'),
    enabled: !!debouncedMha && debouncedMha !== 'initial' && debouncedMha !== 'ON_BASE' && !!debouncedRank && !!debouncedBahDependencyStatus,
  });

  const { data: bas, isLoading: isLoadingBas } = useQuery({
    queryKey: ['basRate', debouncedRank],
    queryFn: () => getBasRate(debouncedRank as string),
    enabled: !!debouncedRank,
  });

  const isLoading = isLoadingMha || isLoadingFedTax || isLoadingStateTax || isLoadingDisability || isLoadingBasePay || isLoadingBah || isLoadingBas;

  useEffect(() => {
    if (status === 'Officer') {
      setFilteredRanks(officerRanks);
    } else if (status === 'Warrant Officer') {
      setFilteredRanks(warrantOfficerRanks);
    } else {
      setFilteredRanks(enlistedRanks);
    }
    setRank(null);
  }, [status]);

  useEffect(() => {
    const calculateAll = () => {
      if (!debouncedRank) {
        setCalculatedTaxes({ fedTax: 0, stateTax: 0, ficaTax: 0, federalStandardDeduction: 0, stateStandardDeduction: 0 });
        setVaDisabilityPay(0);
        return;
      }

      // Now synchronous and uses passed data
      const vaDisabilityPayResult = calculateDisabilityIncome(disabilityPercentage || '0%', vaDependencyStatus || 'none', disabilityData || []);
      setVaDisabilityPay(vaDisabilityPayResult);

      const militaryMonthlyPay = (basePay || 0) + (bas || 0) + (bah || 0);

      if (vaDisabilityPayResult > militaryMonthlyPay) {
        setPaySource('VA Disability');
        setCalculatedTaxes({ fedTax: 0, stateTax: 0, ficaTax: 0, federalStandardDeduction: 0, stateStandardDeduction: 0 });
      } else {
        setPaySource('Military');
        if (federalTaxData && stateTaxData && debouncedMha !== 'initial') {
          const payInputs = {
            basePay: basePay || 0,
            bah: bah || 0,
            bas: bas || 0,
            specialPays: debouncedSpecialPays,
            additionalIncomes: debouncedAdditionalIncomes,
            filingStatus: debouncedFilingStatus,
            mha: debouncedMha,
            additionalDeductions: debouncedAdditionalDeductions,
            state: debouncedState,
          };
          // Now synchronous
          const { federalTax, stateTax, ficaTax, federalStandardDeduction, stateStandardDeduction } = calculatePay(payInputs, federalTaxData, stateTaxData);
          setCalculatedTaxes({ fedTax: federalTax, stateTax: stateTax, ficaTax: ficaTax, federalStandardDeduction, stateStandardDeduction });
        }
      }
    };

    calculateAll();
  }, [basePay, bah, bas, debouncedRank, debouncedMha, debouncedFilingStatus, debouncedState, disabilityPercentage, vaDependencyStatus, federalTaxData, stateTaxData, debouncedSpecialPays, debouncedAdditionalIncomes, debouncedDeductions, debouncedAdditionalDeductions, disabilityData]);

  const totalIncome = useMemo(() => {
    if (paySource === 'VA Disability') {
      return vaDisabilityPay;
    }
    const specialPayTotal = Object.values(debouncedSpecialPays).reduce((sum: number, val: string | number) => sum + parseCurrency(val), 0);
    const additionalIncomesTotal = debouncedAdditionalIncomes.reduce((sum: number, item: { amount: string | number }) => sum + parseCurrency(item.amount), 0);
    return (basePay || 0) + (bah || 0) + (bas || 0) + specialPayTotal + additionalIncomesTotal;
  }, [basePay, bah, bas, debouncedSpecialPays, debouncedAdditionalIncomes, paySource, vaDisabilityPay]);

  const totalDeductions = useMemo(() => {
    const sgliAndTsp = parseCurrency(debouncedDeductions.sgli) + parseCurrency(debouncedDeductions.tsp);
    const additionalDeductionsTotal = debouncedAdditionalDeductions.reduce((sum: number, item: { amount: string | number }) => sum + parseCurrency(item.amount), 0);
  
    let taxesTotal = 0;
    if (isTaxOverride) {
      taxesTotal = parseCurrency(debouncedDeductions.overrideFedTax) + parseCurrency(debouncedDeductions.overrideStateTax) + parseCurrency(debouncedDeductions.overrideFicaTax);
    } else {
      taxesTotal = calculatedTaxes.fedTax + calculatedTaxes.stateTax + calculatedTaxes.ficaTax;
    }
  
    return taxesTotal + sgliAndTsp + additionalDeductionsTotal;
  }, [debouncedDeductions, calculatedTaxes, isTaxOverride, debouncedAdditionalDeductions]);

  const monthlyPay = useMemo(() => totalIncome - totalDeductions, [totalIncome, totalDeductions]);
  const annualPay = useMemo(() => monthlyPay * 12, [monthlyPay]);

  const incomeForDisplay = useMemo(() => {
    if (paySource === 'VA Disability') {
      return [{ label: 'VA Disability', value: vaDisabilityPay }];
    }

    const details = [];
    const primaryPayLabel = component === 'Active' ? 'Base Pay' : 'Drill Pay';
    details.push({ label: primaryPayLabel, value: basePay || 0 });
    details.push({ label: 'BAH', value: bah || 0 });
    details.push({ label: 'BAS', value: bas || 0 });

    const otherIncomeTotal = Object.values(debouncedSpecialPays).reduce((sum: number, val: string | number) => sum + parseCurrency(val), 0) + 
                             debouncedAdditionalIncomes.reduce((sum: number, item: { amount: string | number }) => sum + parseCurrency(item.amount), 0);

    if (otherIncomeTotal > 0) {
        details.push({ label: 'Other', value: otherIncomeTotal });
    }

    return details;
  }, [basePay, bah, bas, debouncedSpecialPays, debouncedAdditionalIncomes, paySource, vaDisabilityPay, component]);

  const deductionsForDisplay = useMemo(() => {
    const fedTaxValue = isTaxOverride ? parseCurrency(debouncedDeductions.overrideFedTax) : calculatedTaxes.fedTax;
    const stateTaxValue = isTaxOverride ? parseCurrency(debouncedDeductions.overrideStateTax) : calculatedTaxes.stateTax;
    const ficaTaxValue = isTaxOverride ? parseCurrency(debouncedDeductions.overrideFicaTax) : calculatedTaxes.ficaTax;

    const details = [
        { label: 'FED TAX', value: fedTaxValue },
        { label: 'FICA TAX', value: ficaTaxValue },
        { label: 'STATE TAX', value: stateTaxValue },
    ];

    const otherDeductionsTotal =
      parseCurrency(debouncedDeductions.sgli) +
      parseCurrency(debouncedDeductions.tsp) +
      debouncedAdditionalDeductions.reduce((sum: number, item: { amount: string | number }) => sum + parseCurrency(item.amount), 0);

    if (otherDeductionsTotal > 0) {
      details.push({ label: 'Other', value: otherDeductionsTotal });
    }

    return details;
  }, [debouncedDeductions, calculatedTaxes, isTaxOverride, debouncedAdditionalDeductions]);

  const lastAdditionalIncome = additionalIncomes[additionalIncomes.length - 1];
  const showAddIncomeButton = !!(lastAdditionalIncome && lastAdditionalIncome.name && lastAdditionalIncome.amount);

  const lastAdditionalDeduction = additionalDeductions[additionalDeductions.length - 1];
  const showAddDeductionButton = !!(lastAdditionalDeduction && lastAdditionalDeduction.name && lastAdditionalDeduction.amount);


  const mhaDisplayName = useMemo(() => {
    if (mha === 'initial') return "Select a state";
    if (mha === 'ON_BASE') return "ON BASE";
    if (!mha || !mhaData) return "...";
    for (const stateCode in mhaData) {
        const mhaList = mhaData[stateCode] as { label: string; value: string }[];
        const mhaObject = mhaList.find((m) => m.value === mha);
        if (mhaObject) {
            return mhaObject.label;
        }
    }
    return "...";
  }, [mha, mhaData]);

  const handleMhaChange = (mha: string | number | null, state: string) => {
    if (mha !== null) {
      setMha(String(mha));
    }
    setState(state);
  };

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
    const groupedData: Record<string, { label: string; value: string }[]> = {
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

  const disabilityDisplayName = useMemo(() => {
    if (!disabilityPercentage) return "Select disability";
    if (disabilityPercentage === '0%') return "0% - No Disability";
    if (!vaDependencyStatus) return "Select a dependent status";
    return `${disabilityPercentage} - ${vaDependencyStatus}`;
  }, [disabilityPercentage, vaDependencyStatus]);

  const handleDisabilityChange = (status: string | number | null, percentage: string) => {
    if (status !== null) {
      setVaDependencyStatus(String(status) as DependentStatus);
    }
    setDisabilityPercentage(percentage as DisabilityPercentage);
    if (percentage === '0%') {
        setVaDependencyStatus('none');
    }
  };


  const setRankAndStatus = (selectedRank: string | number | null) => {
    const rankStr = selectedRank === null ? null : String(selectedRank);
    setRank(rankStr);
    if (rankStr) {
        const rankType = rankStr.charAt(0).toUpperCase();
        if (rankType === 'O' && status !== 'Officer') {
            setStatus('Officer');
        } else if (rankType === 'E' && status !== 'Enlisted') {
            setStatus('Enlisted');
        }
    }
  };

  const resetState = () => {
    setStatus('Enlisted');
    setRank(null);
    setYearsOfService('');
    setMha('initial');
    setBahDependencyStatus('WITHOUT_DEPENDENTS');
    setFilingStatus('single');
    setState('');
    setComponent('Active');
    setDisabilityPercentage('0%');
    setVaDependencyStatus('none');
    setPaySource('Military');
    setSpecialPays({ clothing: '', hostileFire: '', imminentDanger: '', hazardousDuty: '', hardshipDuty: '', aviation: '', assignment: '', careerSea: '', healthProfessions: '', foreignLanguage: '', specialDuty: '' });
    setAdditionalIncomes([{ name: '', amount: '' }]);
    setDeductions({ sgli: '', tsp: '', overrideFedTax: '', overrideStateTax: '', overrideFicaTax: '' });
    setAdditionalDeductions([{ name: '', amount: '' }]);
    setIsTaxOverride(false);
    setAgeState(initialAge);
    setGenderState(initialGender);
    hasModifiedAge.current = false;
    hasModifiedGender.current = false;
  };

  return {
    age, setAge, gender, setGender,
    status, setStatus, rank, setRank: setRankAndStatus, yearsOfService, setYearsOfService, mha, setMha, handleMhaChange, bahDependencyStatus, setBahDependencyStatus, vaDependencyStatus, filingStatus, setFilingStatus, state, setState, component, setComponent, disabilityPercentage, setDisabilityPercentage, disabilityData, disabilityError, paySource, vaDisabilityPay, mhaData, mhaError, filteredRanks, isTaxOverride, setIsTaxOverride, basePay, bah, bas, isLoading, isIncomeExpanded, setIncomeExpanded, specialPays, setSpecialPays, additionalIncomes, setAdditionalIncomes, isDeductionsExpanded, setDeductionsExpanded, isStandardDeductionsExpanded, setIsStandardDeductionsExpanded, deductions, setDeductions, additionalDeductions, setAdditionalDeductions, calculatedTaxes, federalTaxData, stateTaxData, federalTaxYear, stateTaxYear, totalIncome, totalDeductions, monthlyPay, annualPay, incomeForDisplay, deductionsForDisplay, showAddIncomeButton, showAddDeductionButton, mhaDisplayName, disabilityPercentageItems, disabilityPickerData, disabilityDisplayName, handleDisabilityChange, resetState,
    federalStandardDeduction: calculatedTaxes.federalStandardDeduction,
    stateStandardDeduction: calculatedTaxes.stateStandardDeduction
  };
};
