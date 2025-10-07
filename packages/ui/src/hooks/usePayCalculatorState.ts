import { useState, useMemo } from 'react';

// A simple utility to parse currency strings into numbers
const parseCurrency = (value: string) => parseFloat(value.replace(/[^\d.-]/g, '')) || 0;

export const usePayCalculatorState = () => {
  // --- Raw Input State ---
  const [status, setStatus] = useState('Officer');
  const [rank, setRank] = useState(null);
  const [yearsOfService, setYearsOfService] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Income States
  const [basePay, setBasePay] = useState('0.00');
  const [bah, setBah] = useState('0.00');
  const [bas, setBas] = useState('0.00');
  const [isIncomeExpanded, setIncomeExpanded] = useState(false);
  const [specialPays, setSpecialPays] = useState({
    clothing: '', hostileFire: '', imminentDanger: '', hazardousDuty: '',
    hardshipDuty: '', aviation: '', assignment: '', careerSea: '',
    healthProfessions: '', foreignLanguage: '', specialDuty: ''
  });
  const [additionalIncomes, setAdditionalIncomes] = useState([{ name: '', amount: '' }]);

  // Deduction States
  const [isDeductionsExpanded, setDeductionsExpanded] = useState(false);
  const [deductions, setDeductions] = useState({
    fedTax: '', ficaTax: '', stateTax: '', sgli: '', tsp: ''
  });
  const [additionalDeductions, setAdditionalDeductions] = useState([{ name: '', amount: '' }]);

  // --- Aggregation Logic ---

  const totalIncome = useMemo(() => {
    const specialPayTotal = Object.values(specialPays).reduce((sum, val) => sum + parseCurrency(val), 0);
    const additionalIncomesTotal = additionalIncomes.reduce((sum, item) => sum + parseCurrency(item.amount), 0);
    return parseCurrency(basePay) + parseCurrency(bah) + parseCurrency(bas) + specialPayTotal + additionalIncomesTotal;
  }, [basePay, bah, bas, specialPays, additionalIncomes]);

  const totalDeductions = useMemo(() => {
    const standardDeductionsTotal = Object.values(deductions).reduce((sum, val) => sum + parseCurrency(val), 0);
    const additionalDeductionsTotal = additionalDeductions.reduce((sum, item) => sum + parseCurrency(item.amount), 0);
    return standardDeductionsTotal + additionalDeductionsTotal;
  }, [deductions, additionalDeductions]);

  const totalPay = useMemo(() => totalIncome - totalDeductions, [totalIncome, totalDeductions]);

  // --- Display-Specific Logic ---

  const incomeForDisplay = useMemo(() => {
    const otherIncomeTotal = Object.values(specialPays).reduce((sum, val) => sum + parseCurrency(val), 0) + 
                             additionalIncomes.reduce((sum, item) => sum + parseCurrency(item.amount), 0);

    const details = [
        { label: 'Base Pay', value: `$${parseCurrency(basePay).toFixed(2)}` },
        { label: 'BAH', value: `$${parseCurrency(bah).toFixed(2)}` },
        { label: 'BAS', value: `$${parseCurrency(bas).toFixed(2)}` },
    ];

    if (otherIncomeTotal > 0) {
        details.push({ label: 'Other', value: `$${otherIncomeTotal.toFixed(2)}` });
    }

    return details;
  }, [basePay, bah, bas, specialPays, additionalIncomes]);

  const deductionsForDisplay = useMemo(() => {
    const details = [
        { label: 'FED INC TAX', value: `$${parseCurrency(deductions.fedTax).toFixed(2)}` },
        { label: 'FICA TAX', value: `$${parseCurrency(deductions.ficaTax).toFixed(2)}` },
        { label: 'STATE INC TAX', value: `$${parseCurrency(deductions.stateTax).toFixed(2)}` },
    ];

    if (parseCurrency(deductions.sgli) > 0) {
        details.push({ label: 'SGLI', value: `$${parseCurrency(deductions.sgli).toFixed(2)}` });
    }
    if (parseCurrency(deductions.tsp) > 0) {
        details.push({ label: 'TSP CONTRIBUTION', value: `$${parseCurrency(deductions.tsp).toFixed(2)}` });
    }

    additionalDeductions.forEach(deduction => {
        if (parseCurrency(deduction.amount) > 0) {
            details.push({ label: deduction.name, value: `$${parseCurrency(deduction.amount).toFixed(2)}` });
        }
    });

    return details;
  }, [deductions, additionalDeductions]);
  const lastAdditionalIncome = additionalIncomes[additionalIncomes.length - 1];
  const showAddIncomeButton = lastAdditionalIncome && lastAdditionalIncome.name && lastAdditionalIncome.amount;

  const lastAdditionalDeduction = additionalDeductions[additionalDeductions.length - 1];
  const showAddDeductionButton = lastAdditionalDeduction && lastAdditionalDeduction.name && lastAdditionalDeduction.amount;


  // --- Return Values ---
  return {
    // Values for Display
    totalPay: `$${totalPay.toFixed(2)}`,
    incomeForDisplay,
    deductionsForDisplay,

    // Form State & Setters
    status, setStatus,
    rank, setRank,
    yearsOfService, setYearsOfService,
    zipCode, setZipCode,
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