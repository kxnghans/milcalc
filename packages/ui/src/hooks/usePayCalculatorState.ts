import { useState, useMemo, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { getBasePay, getBasRate, getBahRate, getMhaData } from '@repo/utils';

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
  { label: 'O-1', value: 'O-1' }, { label: 'O-2', value: 'O-2' }, { label: 'O-3', value: 'O-3' },
  { label: 'O-1E', value: 'O-1E' }, { label: 'O-2E', value: 'O-2E' }, { label: 'O-3E', value: 'O-3E' },
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
  const [status, setStatus] = useState('Officer');
  const [rank, setRank] = useState(null);
  const [yearsOfService, setYearsOfService] = useState('');
  const [mha, setMha] = useState('');
  const [dependencyStatus, setDependencyStatus] = useState('WITHOUT_DEPENDENTS');
  const [filingStatus, setFilingStatus] = useState('single');

  // --- Data & UI State ---
  const [mhaData, setMhaData] = useState({});
  const [filteredRanks, setFilteredRanks] = useState(officerRanks);

  // Debounced values for calculations
  const debouncedRank = useDebounce(rank, 500);
  const debouncedYears = useDebounce(yearsOfService, 500);
  const debouncedMha = useDebounce(mha, 500);
  const debouncedDependencyStatus = useDebounce(dependencyStatus, 500);

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
  const [deductions, setDeductions] = useState({
    fedTax: '', ficaTax: '', stateTax: '', sgli: '', tsp: ''
  });
  const [additionalDeductions, setAdditionalDeductions] = useState([{ name: '', amount: '' }]);

  // Effect to fetch MHA data once on mount
  useEffect(() => {
    const fetchMhaData = async () => {
        const data = await getMhaData();
        setMhaData(data);
    };
    fetchMhaData();
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

  // Effect to fetch Base Pay
  useEffect(() => {
    const fetchBasePay = async () => {
        if (debouncedRank && debouncedYears) {
            setIsBasePayLoading(true);
            try {
                const newBasePay = await getBasePay(debouncedRank, Number(debouncedYears));
                setBasePay(newBasePay);
            } finally {
                setIsBasePayLoading(false);
            }
        }
    };
    fetchBasePay();
  }, [debouncedRank, debouncedYears]);

  // Effect to fetch BAS
  useEffect(() => {
    const fetchBas = async () => {
        if (debouncedRank) {
            const newBas = await getBasRate(debouncedRank);
            setBas(newBas);
        }
    };
    fetchBas();
  }, [debouncedRank]);

  // Effect to fetch BAH
  useEffect(() => {
    const fetchBah = async () => {
        if (debouncedRank && debouncedDependencyStatus && debouncedMha) {
            setIsBahLoading(true);
            try {
                const newBah = await getBahRate(debouncedMha, debouncedRank, debouncedDependencyStatus as 'WITH_DEPENDENTS' | 'WITHOUT_DEPENDENTS');
                setBah(newBah);
            } finally {
                setIsBahLoading(false);
            }
        }
    };
    fetchBah();
  }, [debouncedRank, debouncedDependencyStatus, debouncedMha]);

  // --- Aggregation Logic ---

  const totalIncome = useMemo(() => {
    const specialPayTotal = Object.values(specialPays).reduce((sum, val) => sum + parseCurrency(val), 0);
    const additionalIncomesTotal = additionalIncomes.reduce((sum, item) => sum + parseCurrency(item.amount), 0);
    return basePay + bah + bas + specialPayTotal + additionalIncomesTotal;
  }, [basePay, bah, bas, specialPays, additionalIncomes]);

  const totalDeductions = useMemo(() => {
    const standardDeductionsTotal = Object.values(deductions).reduce((sum, val) => sum + parseCurrency(val), 0);
    const additionalDeductionsTotal = additionalDeductions.reduce((sum, item) => sum + parseCurrency(item.amount), 0);
    return standardDeductionsTotal + additionalDeductionsTotal;
  }, [deductions, additionalDeductions]);

  const biWeeklyPay = useMemo(() => totalIncome - totalDeductions, [totalIncome, totalDeductions]);
  const annualPay = useMemo(() => biWeeklyPay * 26, [biWeeklyPay]);

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
    const details = [
        { label: 'FED INC TAX', value: `$${formatCurrency(deductions.fedTax)}` },
        { label: 'FICA TAX', value: `$${formatCurrency(deductions.ficaTax)}` },
        { label: 'STATE INC TAX', value: `$${formatCurrency(deductions.stateTax)}` },
    ];

    if (parseCurrency(deductions.sgli) > 0) {
        details.push({ label: 'SGLI', value: `$${formatCurrency(deductions.sgli)}` });
    }
    if (parseCurrency(deductions.tsp) > 0) {
        details.push({ label: 'TSP CONTRIBUTION', value: `$${formatCurrency(deductions.tsp)}` });
    }

    additionalDeductions.forEach(deduction => {
        if (parseCurrency(deduction.amount) > 0) {
            details.push({ label: deduction.name, value: `$${formatCurrency(deduction.amount)}` });
        }
    });

    return details;
  }, [deductions, additionalDeductions]);
  const lastAdditionalIncome = additionalIncomes[additionalIncomes.length - 1];
  const showAddIncomeButton = lastAdditionalIncome && lastAdditionalIncome.name && lastAdditionalIncome.amount;

  const lastAdditionalDeduction = additionalDeductions[additionalDeductions.length - 1];
  const showAddDeductionButton = lastAdditionalDeduction && lastAdditionalDeduction.name && lastAdditionalDeduction.amount;


  const mhaDisplayName = useMemo(() => {
    if (!mha || !mhaData) return "Select MHA...";
    const state = mha.substring(0, 2);
    if (mhaData[state]) {
        const mhaObject = mhaData[state].find(m => m.value === mha);
        return mhaObject ? mhaObject.label : "Select MHA...";
    }
    return "Select MHA...";
  }, [mha, mhaData]);


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
    setStatus('Officer');
    setRank(null);
    setYearsOfService('');
    setMha('');
    setDependencyStatus('WITHOUT_DEPENDENTS');
    setFilingStatus('single');
    setSpecialPays({
      clothing: '', hostileFire: '', imminentDanger: '', hazardousDuty: '',
      hardshipDuty: '', aviation: '', assignment: '', careerSea: '',
      healthProfessions: '', foreignLanguage: '', specialDuty: ''
    });
    setAdditionalIncomes([{ name: '', amount: '' }]);
    setDeductions({
      fedTax: '', ficaTax: '', stateTax: '', sgli: '', tsp: ''
    });
    setAdditionalDeductions([{ name: '', amount: '' }]);
  };

  // --- Return Values ---
  return {
    resetState, // Export the new function
    // Values for Display
    annualPay: `$${formatCurrency(annualPay)}`,
    biWeeklyPay: `$${formatCurrency(biWeeklyPay)}`,
    incomeForDisplay,
    deductionsForDisplay,
    isBahLoading,
    isBasePayLoading,

    // Data for Pickers
    mhaData,
    filteredRanks,

    // Form State & Setters
    status, setStatus,
    rank, setRank: setRankAndStatus, // Override setRank with our custom function
    yearsOfService, setYearsOfService,
    mha, setMha,
    mhaDisplayName,
    dependencyStatus, setDependencyStatus,
    filingStatus, setFilingStatus,
    isIncomeExpanded, setIncomeExpanded,
    isDeductionsExpanded, setDeductionsExpanded,
    specialPays, setSpecialPays,
    additionalIncomes, setAdditionalIncomes,
    deductions, setDeductions,
    additionalDeductions, setAdditionalDeductions,
    showAddIncomeButton,
    showAddDeductionButton,
  };
};