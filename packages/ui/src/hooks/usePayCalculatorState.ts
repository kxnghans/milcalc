import { useState, useMemo, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { getBasePay, getBasRate, getBahRate, getMhaData, getFederalTaxData, getStateTaxData, calculatePay, getMaxFederalTaxYear, getMaxStateTaxYear } from '@repo/utils';

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
  const [dependencyStatus, setDependencyStatus] = useState('WITHOUT_DEPENDENTS');
  const [filingStatus, setFilingStatus] = useState('single');
  const [state, setState] = useState('');

  // --- Data & UI State ---
  const [mhaData, setMhaData] = useState({});
  const [filteredRanks, setFilteredRanks] = useState(officerRanks);
  const [isTaxOverride, setIsTaxOverride] = useState(false);


  // Debounced values for calculations
  const debouncedRank = useDebounce(rank, 500);
  const debouncedYears = useDebounce(yearsOfService, 500);
  const debouncedMha = useDebounce(mha, 500);
  const debouncedDependencyStatus = useDebounce(dependencyStatus, 500);
  const debouncedFilingStatus = useDebounce(filingStatus, 500);
  const debouncedState = useDebounce(state, 500);

  // --- Fetched & Calculated Income State ---
  const [basePay, setBasePay] = useState(0);
  const [bah, setBah] = useState(0);
  const [bas, setBas] = useState(0);
  const [isBahLoading, setIsBahLoading] = useState(false);
  const [isBasePayLoading, setIsBasePayLoading] = useState(false);

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

  // Effect to fetch MHA data once on mount
  useEffect(() => {
    const fetchMhaData = async () => {
        const data = await getMhaData();
        for (const state in data) {
            data[state].unshift({ label: 'ON BASE', value: 'ON_BASE' });
        }
        setMhaData(data);
    };
    fetchMhaData();
  }, []);

  const [federalTaxData, setFederalTaxData] = useState([]);
  const [stateTaxData, setStateTaxData] = useState([]);
  const [federalTaxYear, setFederalTaxYear] = useState<number | null>(null);
  const [stateTaxYear, setStateTaxYear] = useState<number | null>(null);

  // Effect to fetch tax data once on mount
  useEffect(() => {
    const fetchTaxYearsAndData = async () => {
      const maxFederalYear = await getMaxFederalTaxYear();
      const maxStateYear = await getMaxStateTaxYear();
      setFederalTaxYear(maxFederalYear);
      setStateTaxYear(maxStateYear);

      if (maxFederalYear) {
        const federalData = await getFederalTaxData(maxFederalYear);
        setFederalTaxData(federalData);
      }
      if (maxStateYear) {
        const stateData = await getStateTaxData(maxStateYear);
        setStateTaxData(stateData);
      }
    };
    fetchTaxYearsAndData();
  }, []);

  // Effect to filter ranks when status changes
  useEffect(() => {
    if (status === 'Officer') {
      setFilteredRanks(officerRanks);
    } else if (status === 'Warrant Officer') {
      setFilteredRanks(warrantOfficerRanks);
    } else {
      setFilteredRanks(enlistedRanks);
    }
    setRank(null); // Reset rank when status changes
  }, [status]);

  // Main calculation effect
  useEffect(() => {
    const calculateAll = async () => {
      if (debouncedRank && debouncedYears) {
        setIsBasePayLoading(true);
        try {
          const newBasePay = await getBasePay(debouncedRank, Number(debouncedYears));
          setBasePay(newBasePay);
        } finally {
          setIsBasePayLoading(false);
        }
      }

      if (debouncedRank) {
        const newBas = await getBasRate(debouncedRank);
        setBas(newBas);
      }

      if (debouncedMha === 'initial' || debouncedMha === 'ON_BASE') {
        setBah(0);
      } else if (debouncedRank && debouncedDependencyStatus && debouncedMha) {
        setIsBahLoading(true);
        try {
          const newBah = await getBahRate(debouncedMha, debouncedRank, debouncedDependencyStatus as 'WITH_DEPENDENTS' | 'WITHOUT_DEPENDENTS');
          setBah(newBah);
        } finally {
          setIsBahLoading(false);
        }
      }

      if (federalTaxData.length > 0 && stateTaxData.length > 0 && debouncedMha !== 'initial') {
        const payInputs = {
          basePay,
          bah,
          bas,
          specialPays,
          additionalIncomes,
          deductions,
          additionalDeductions,
          filingStatus: debouncedFilingStatus,
          state,
        };
        const { federalTax, stateTax, ficaTax, federalStandardDeduction, stateStandardDeduction } = await calculatePay(payInputs, federalTaxData, stateTaxData);
        setCalculatedTaxes({ fedTax: federalTax, stateTax: stateTax, ficaTax: ficaTax, federalStandardDeduction, stateStandardDeduction });
      }
    };

    calculateAll();
  }, [debouncedRank, debouncedYears, debouncedMha, debouncedDependencyStatus, debouncedFilingStatus, debouncedState, federalTaxData, stateTaxData, federalTaxYear, stateTaxYear, basePay, bah, bas, specialPays, additionalIncomes, deductions, additionalDeductions]);

  // --- Aggregation Logic ---

  const totalIncome = useMemo(() => {
    const specialPayTotal = Object.values(specialPays).reduce((sum, val) => sum + parseCurrency(val), 0);
    const additionalIncomesTotal = additionalIncomes.reduce((sum, item) => sum + parseCurrency(item.amount), 0);
    return basePay + bah + bas + specialPayTotal + additionalIncomesTotal;
  }, [basePay, bah, bas, specialPays, additionalIncomes]);

  const totalDeductions = useMemo(() => {
    const sgliAndTsp = parseCurrency(deductions.sgli) + parseCurrency(deductions.tsp);
  
    let taxesTotal = 0;
    if (isTaxOverride) {
      taxesTotal = parseCurrency(deductions.overrideFedTax) + parseCurrency(deductions.overrideStateTax) + parseCurrency(deductions.overrideFicaTax);
    } else {
      taxesTotal = calculatedTaxes.fedTax + calculatedTaxes.stateTax + calculatedTaxes.ficaTax;
    }
  
    return taxesTotal + sgliAndTsp;
  }, [deductions, calculatedTaxes, isTaxOverride]);

  const monthlyPay = useMemo(() => totalIncome - totalDeductions, [totalIncome, totalDeductions]);
  const annualPay = useMemo(() => monthlyPay * 12, [monthlyPay]);

  // --- Display-Specific Logic ---

  const incomeForDisplay = useMemo(() => {
    const otherIncomeTotal = Object.values(specialPays).reduce((sum, val) => sum + parseCurrency(val), 0) + 
                             additionalIncomes.reduce((sum, item) => sum + parseCurrency(item.amount), 0);

    const details = [
        { label: 'Base Pay', value: `$${formatCurrency(basePay)}` },
        { label: 'BAH', value: `$${formatCurrency(bah)}` },
        { label: 'BAS', value: `$${formatCurrency(bas)}` },
    ];

    if (otherIncomeTotal > 0) {
        details.push({ label: 'Other', value: `$${formatCurrency(otherIncomeTotal)}` });
    }

    return details;
  }, [basePay, bah, bas, specialPays, additionalIncomes]);

  const deductionsForDisplay = useMemo(() => {
    const fedTaxValue = isTaxOverride ? deductions.overrideFedTax : calculatedTaxes.fedTax;
    const stateTaxValue = isTaxOverride ? deductions.overrideStateTax : calculatedTaxes.stateTax;
    const ficaTaxValue = isTaxOverride ? deductions.overrideFicaTax : calculatedTaxes.ficaTax;

    const details = [
        { label: 'FED TAX', value: `$${formatCurrency(fedTaxValue)}` },
        { label: 'FICA TAX', value: `$${formatCurrency(ficaTaxValue)}` },
        { label: 'STATE TAX', value: `$${formatCurrency(stateTaxValue)}` },
    ];

    const otherDeductionsTotal =
      parseCurrency(deductions.sgli) +
      parseCurrency(deductions.tsp);

    if (otherDeductionsTotal > 0) {
      details.push({ label: 'Other', value: `$${formatCurrency(otherDeductionsTotal)}` });
    }

    return details;
  }, [deductions, calculatedTaxes, isTaxOverride]);

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
    setDependencyStatus('WITHOUT_DEPENDENTS');
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

  // --- Return Values ---
  return {
    resetState, // Export the new function
    // Values for Display
    annualPay,
    monthlyPay,
    incomeForDisplay,
    deductionsForDisplay,
    isBahLoading,
    isBasePayLoading,
    federalStandardDeduction: calculatedTaxes.federalStandardDeduction,
    stateStandardDeduction: calculatedTaxes.stateStandardDeduction,

    // Data for Pickers
    mhaData,
    filteredRanks,

    // Form State & Setters
    status, setStatus,
    rank, setRank: setRankAndStatus, // Override setRank with our custom function
    yearsOfService, setYearsOfService,
    mha, setMha,
    handleMhaChange,
    mhaDisplayName,
    state, setState,
    dependencyStatus, setDependencyStatus,
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
  };
};
