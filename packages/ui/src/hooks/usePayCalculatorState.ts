import { useState, useMemo, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { getBasePay, getBasRate, getBahRate, getMhaData, getFederalTaxData, getStateTaxData, calculatePay, getMaxFederalTaxYear, getMaxStateTaxYear, getDisabilityData, getReserveDrillPay } from '@repo/utils';
import { calculateDisabilityIncome } from '@repo/utils';

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

const formatCurrency = (value: number | string) => {
    const num = parseCurrency(value);
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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

export const usePayCalculatorState = () => {
  // --- Raw Input State ---
  const [status, setStatus] = useState('Enlisted');
  const [rank, setRank] = useState(null);
  const [yearsOfService, setYearsOfService] = useState('');
  const [mha, setMha] = useState('initial');
  const [bahDependencyStatus, setBahDependencyStatus] = useState('WITHOUT_DEPENDENTS');
  const [vaDependencyStatus, setVaDependencyStatus] = useState(null);
  const [filingStatus, setFilingStatus] = useState('single');
  const [state, setState] = useState('');
  const [component, setComponent] = useState('Active');
  const [disabilityPercentage, setDisabilityPercentage] = useState(null);
  const [disabilityData, setDisabilityData] = useState([]);
  const [disabilityError, setDisabilityError] = useState(null);
  const [reserveDrillPayData, setReserveDrillPayData] = useState([]);
  const [paySource, setPaySource] = useState('Military');
  const [vaDisabilityPay, setVaDisabilityPay] = useState(0);

  // --- Data & UI State ---
  const [mhaData, setMhaData] = useState({});
  const [mhaError, setMhaError] = useState(null);
  const [filteredRanks, setFilteredRanks] = useState(enlistedRanks);
  const [isTaxOverride, setIsTaxOverride] = useState(false);


  // Debounced values for calculations
  const debouncedRank = useDebounce(rank, 500);
  const debouncedYears = useDebounce(yearsOfService, 500);
  const debouncedMha = useDebounce(mha, 500);
  const debouncedBahDependencyStatus = useDebounce(bahDependencyStatus, 500);

  const debouncedFilingStatus = useDebounce(filingStatus, 500);
  const debouncedState = useDebounce(state, 500);

  // --- Fetched & Calculated Income State ---
  const [basePay, setBasePay] = useState(0);
  const [bah, setBah] = useState(0);
  const [bas, setBas] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
  const [federalTaxData, setFederalTaxData] = useState([]);
  const [stateTaxData, setStateTaxData] = useState([]);
  const [federalTaxYear, setFederalTaxYear] = useState<number | null>(null);
  const [stateTaxYear, setStateTaxYear] = useState<number | null>(null);
  const [federalTaxDataError, setFederalTaxDataError] = useState(null);
  const [stateTaxDataError, setStateTaxDataError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const mhaPromise = getMhaData().catch(e => { setMhaError(e.message); return {}; });
        const taxYearPromise = (async () => {
            try {
                const maxFederalYear = await getMaxFederalTaxYear();
                const maxStateYear = await getMaxStateTaxYear();
                setFederalTaxYear(maxFederalYear);
                setStateTaxYear(maxStateYear);
                return { maxFederalYear, maxStateYear };
            } catch (e) {
                setFederalTaxDataError(e.message);
                setStateTaxDataError(e.message);
                return { maxFederalYear: null, maxStateYear: null };
            }
        })();

        const disabilityPromise = getDisabilityData().catch(e => { setDisabilityError(e.message); return []; });
        const [mhaResult, { maxFederalYear, maxStateYear }, disabilityResult] = await Promise.all([mhaPromise, taxYearPromise, disabilityPromise]);

        for (const state in mhaResult) {
            mhaResult[state].unshift({ label: 'ON BASE', value: 'ON_BASE' });
        }
        setMhaData(mhaResult);
        setDisabilityData(disabilityResult);

        if (maxFederalYear) {
            getFederalTaxData(maxFederalYear).then(setFederalTaxData).catch(e => setFederalTaxDataError(e.message));
        }
        if (maxStateYear) {
            getStateTaxData(maxStateYear).then(setStateTaxData).catch(e => setStateTaxDataError(e.message));
        }

      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

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
    const calculateAll = async () => {
      if (!debouncedRank && !debouncedYears) return;
      setIsLoading(true);
      try {
        const militaryPayPromise =
          debouncedRank && debouncedYears
            ? component === 'Active'
              ? getBasePay(debouncedRank, Number(debouncedYears))
              : getReserveDrillPay(debouncedRank, Number(debouncedYears))
            : Promise.resolve(basePay);

        const basPromise = debouncedRank ? getBasRate(debouncedRank) : Promise.resolve(bas);
        const bahPromise = (debouncedMha && debouncedMha !== 'initial' && debouncedMha !== 'ON_BASE' && debouncedRank && bahDependencyStatus)
            ? getBahRate(debouncedMha, debouncedRank, bahDependencyStatus as 'WITH_DEPENDENTS' | 'WITHOUT_DEPENDENTS')
            : Promise.resolve(0);

        const [newMilitaryPay, newBas, newBah] = await Promise.all([militaryPayPromise, basPromise, bahPromise]);

        const vaDisabilityPayResult = await calculateDisabilityIncome(disabilityPercentage, vaDependencyStatus);
        setVaDisabilityPay(vaDisabilityPayResult);

        const militaryMonthlyPay = newMilitaryPay + newBas + newBah;

        if (vaDisabilityPayResult > militaryMonthlyPay) {
          setPaySource('VA Disability');
          setCalculatedTaxes({ fedTax: 0, stateTax: 0, ficaTax: 0, federalStandardDeduction: 0, stateStandardDeduction: 0 });
        } else {
          setPaySource('Military');
          setBasePay(newMilitaryPay);
          setBas(newBas);
          setBah(newBah);

          if (federalTaxData.length > 0 && stateTaxData.length > 0 && debouncedMha !== 'initial') {
            const payInputs = {
              basePay: newMilitaryPay,
              bah: newBah,
              bas: newBas,
              specialPays,
              additionalIncomes,
              deductions,
              additionalDeductions,
              filingStatus: debouncedFilingStatus,
              state: debouncedState,
            };
            const { federalTax, stateTax, ficaTax, federalStandardDeduction, stateStandardDeduction } = await calculatePay(payInputs, federalTaxData, stateTaxData);
            setCalculatedTaxes({ fedTax: federalTax, stateTax: stateTax, ficaTax: ficaTax, federalStandardDeduction, stateStandardDeduction });
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    calculateAll();
  }, [debouncedRank, debouncedYears, debouncedMha, debouncedBahDependencyStatus, debouncedFilingStatus, debouncedState, component, disabilityPercentage]);

  const totalIncome = useMemo(() => {
    if (paySource === 'VA Disability') {
      return vaDisabilityPay;
    }
    const specialPayTotal = Object.values(specialPays).reduce((sum, val) => sum + parseCurrency(val), 0);
    const additionalIncomesTotal = additionalIncomes.reduce((sum, item) => sum + parseCurrency(item.amount), 0);
    return basePay + bah + bas + specialPayTotal + additionalIncomesTotal;
  }, [basePay, bah, bas, specialPays, additionalIncomes, paySource, vaDisabilityPay]);

  const totalDeductions = useMemo(() => {
    const sgliAndTsp = parseCurrency(deductions.sgli) + parseCurrency(deductions.tsp);
    const additionalDeductionsTotal = additionalDeductions.reduce((sum, item) => sum + parseCurrency(item.amount), 0);
  
    let taxesTotal = 0;
    if (isTaxOverride) {
      taxesTotal = parseCurrency(deductions.overrideFedTax) + parseCurrency(deductions.overrideStateTax) + parseCurrency(deductions.overrideFicaTax);
    } else {
      taxesTotal = calculatedTaxes.fedTax + calculatedTaxes.stateTax + calculatedTaxes.ficaTax;
    }
  
    return taxesTotal + sgliAndTsp + additionalDeductionsTotal;
  }, [deductions, calculatedTaxes, isTaxOverride, additionalDeductions]);

  const monthlyPay = useMemo(() => totalIncome - totalDeductions, [totalIncome, totalDeductions]);
  const annualPay = useMemo(() => monthlyPay * 12, [monthlyPay]);

  const incomeForDisplay = useMemo(() => {
    if (paySource === 'VA Disability') {
      return [{ label: 'VA Disability', value: vaDisabilityPay }];
    }

    const details = [];
    const primaryPayLabel = component === 'Active' ? 'Base Pay' : 'Drill Pay';
    details.push({ label: primaryPayLabel, value: basePay });
    details.push({ label: 'BAH', value: bah });
    details.push({ label: 'BAS', value: bas });

    const otherIncomeTotal = Object.values(specialPays).reduce((sum, val) => sum + parseCurrency(val), 0) + 
                             additionalIncomes.reduce((sum, item) => sum + parseCurrency(item.amount), 0);

    if (otherIncomeTotal > 0) {
        details.push({ label: 'Other', value: otherIncomeTotal });
    }

    return details;
  }, [basePay, bah, bas, specialPays, additionalIncomes, paySource, vaDisabilityPay, component]);

  const deductionsForDisplay = useMemo(() => {
    const fedTaxValue = isTaxOverride ? parseCurrency(deductions.overrideFedTax) : calculatedTaxes.fedTax;
    const stateTaxValue = isTaxOverride ? parseCurrency(deductions.overrideStateTax) : calculatedTaxes.stateTax;
    const ficaTaxValue = isTaxOverride ? parseCurrency(deductions.overrideFicaTax) : calculatedTaxes.ficaTax;

    const details = [
        { label: 'FED TAX', value: fedTaxValue },
        { label: 'FICA TAX', value: ficaTaxValue },
        { label: 'STATE TAX', value: stateTaxValue },
    ];

    const otherDeductionsTotal =
      parseCurrency(deductions.sgli) +
      parseCurrency(deductions.tsp) +
      additionalDeductions.reduce((sum, item) => sum + parseCurrency(item.amount), 0);

    if (otherDeductionsTotal > 0) {
      details.push({ label: 'Other', value: otherDeductionsTotal });
    }

    return details;
  }, [deductions, calculatedTaxes, isTaxOverride, additionalDeductions]);

  const lastAdditionalIncome = additionalIncomes[additionalIncomes.length - 1];
  const showAddIncomeButton = lastAdditionalIncome && lastAdditionalIncome.name && lastAdditionalIncome.amount;

  const lastAdditionalDeduction = additionalDeductions[additionalDeductions.length - 1];
  const showAddDeductionButton = lastAdditionalDeduction && lastAdditionalDeduction.name && lastAdditionalDeduction.amount;


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

  const handleMhaChange = (mha, state) => {
    setMha(mha);
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

  const disabilityDisplayName = useMemo(() => {
    if (!disabilityPercentage) return "Select disability";
    if (disabilityPercentage === '0%') return "0% - No Disability";
    if (!vaDependencyStatus) return "Select a dependent status";
    return `${disabilityPercentage} - ${vaDependencyStatus}`;
  }, [disabilityPercentage, vaDependencyStatus]);

  const handleDisabilityChange = (status, percentage) => {
    setVaDependencyStatus(status);
    setDisabilityPercentage(percentage);
    if (percentage === '0%') {
        setVaDependencyStatus('none');
    }
  };


  const setRankAndStatus = (selectedRank) => {
    setRank(selectedRank);
    if (selectedRank) {
        const rankType = selectedRank.charAt(0).toUpperCase();
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
    setState('');
    setBahDependencyStatus('WITHOUT_DEPENDENTS');
    setVaDependencyStatus(null);
    setDisabilityPercentage(null);
    setFilingStatus('single');
    setSpecialPays({
      clothing: '', hostileFire: '', imminentDanger: '', hazardousDuty: '',
      hardshipDuty: '', aviation: '', assignment: '', careerSea: '',
      healthProfessions: '', foreignLanguage: '', specialDuty: ''
    });
    setAdditionalIncomes([{ name: '', amount: '' }]);
    setDeductions({
        sgli: '',
        tsp: '',
        overrideFedTax: '',
        overrideStateTax: '',
        overrideFicaTax: '',
    });
    setAdditionalDeductions([{ name: '', amount: '' }]);
    setIsTaxOverride(false);
    setIncomeExpanded(false);
    setDeductionsExpanded(false);
    setIsStandardDeductionsExpanded(false);
  };

  return {
    resetState,
    annualPay,
    monthlyPay,
    incomeForDisplay,
    deductionsForDisplay,
    isLoading,
    federalStandardDeduction: calculatedTaxes.federalStandardDeduction,
    stateStandardDeduction: calculatedTaxes.stateStandardDeduction,
    mhaData,
    mhaError,
    filteredRanks,
    status, setStatus,
    rank, setRank: setRankAndStatus,
    yearsOfService, setYearsOfService,
    mha, setMha,
    handleMhaChange,
    mhaDisplayName,
    state, setState,
    bahDependencyStatus, setBahDependencyStatus,
    vaDependencyStatus, setVaDependencyStatus,
    filingStatus, setFilingStatus,
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
    paySource,
    component, setComponent,
    disabilityPercentage, setDisabilityPercentage,
    disabilityData, disabilityError,
    disabilityPickerData,
    disabilityPercentageItems,
    handleDisabilityChange,
    disabilityDisplayName,
  };
};