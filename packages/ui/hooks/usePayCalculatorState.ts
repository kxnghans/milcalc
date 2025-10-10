
import { useState, useMemo, useEffect } from 'react';
import { calculateBasePay, calculateBAS, calculateBAH, calculateFederalTax } from '@repo/utils/pay-calculator';
import { useDebounce } from './useDebounce';
import { bahRates2025 } from '@repo/data';

// Define types for complex state objects
type SpecialPays = { [key: string]: string };
type Deductions = { [key: string]: string };
type AdditionalItem = { name: string; amount: string };

export const usePayCalculatorState = () => {
    // --- FORM STATE ---
    const [status, setStatus] = useState('Enlisted');
    const [rank, setRank] = useState('');
    const [yearsOfService, setYearsOfService] = useState('');
    const [zipCode, setZipCode] = useState(''); // To be replaced with MHA
    const [mha, setMha] = useState(''); // Military Housing Area
    const [filingStatus, setFilingStatus] = useState('single');
    const [dependencyStatus, setDependencyStatus] = useState('WITHOUT_DEPENDENTS');
    const [isIncomeExpanded, setIncomeExpanded] = useState(false);
    const [isDeductionsExpanded, setDeductionsExpanded] = useState(false);

    // --- DYNAMIC FORM STATE ---
    const [specialPays, setSpecialPays] = useState<SpecialPays>({});
    const [additionalIncomes, setAdditionalIncomes] = useState<AdditionalItem[]>([{ name: '', amount: '' }]);
    const [deductions, setDeductions] = useState<Deductions>({});
    const [additionalDeductions, setAdditionalDeductions] = useState<AdditionalItem[]>([{ name: '', amount: '' }]);

    // Debounce inputs to prevent rapid recalculations
    const debouncedRank = useDebounce(rank, 300);
    const debouncedYears = useDebounce(yearsOfService, 300);
    const debouncedMha = useDebounce(mha, 300);

    // --- DATA EXPORTS ---
    const mhaList = useMemo(() => {
        // Assuming both sections have the same locations
        const withDepsSection = bahRates2025.sections.find(s => s.section_key === 'WITH_DEPENDENTS');
        if (!withDepsSection) return [];
        return withDepsSection.rows.map(r => ({ label: `${r.MHA_NAME} (${r.MHA})`, value: r.MHA }));
    }, []);

    // --- CALCULATIONS ---

    const yearsAsNumber = useMemo(() => parseInt(debouncedYears, 10) || 0, [debouncedYears]);

    const basePay = useMemo(() => {
        return calculateBasePay(debouncedRank, yearsAsNumber);
    }, [debouncedRank, yearsAsNumber]);

    const bas = useMemo(() => {
        return calculateBAS(debouncedRank);
    }, [debouncedRank]);

    const bah = useMemo(() => {
        return calculateBAH(debouncedRank, dependencyStatus as 'WITH_DEPENDENTS' | 'WITHOUT_DEPENDENTS', debouncedMha);
    }, [debouncedRank, dependencyStatus, debouncedMha]);

    const totalIncome = useMemo(() => {
        const specialPaysTotal = Object.values(specialPays).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
        const additionalIncomesTotal = additionalIncomes.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        return basePay + bas + bah + specialPaysTotal + additionalIncomesTotal;
    }, [basePay, bas, bah, specialPays, additionalIncomes]);

    const federalTax = useMemo(() => {
        return calculateFederalTax(totalIncome, filingStatus);
    }, [totalIncome, filingStatus]);

    const totalDeductions = useMemo(() => {
        const mainDeductionsTotal = Object.values(deductions).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
        const additionalDeductionsTotal = additionalDeductions.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        return federalTax + mainDeductionsTotal + additionalDeductionsTotal;
    }, [federalTax, deductions, additionalDeductions]);

    const totalPay = useMemo(() => totalIncome - totalDeductions, [totalIncome, totalDeductions]);

    // --- DISPLAY FORMATTING ---

    const incomeForDisplay = useMemo(() => [
        { label: 'Base Pay', value: basePay.toFixed(2) },
        { label: 'BAS', value: bas.toFixed(2) },
        { label: 'BAH', value: bah.toFixed(2) },
    ], [basePay, bas, bah]);

    const deductionsForDisplay = useMemo(() => [
        { label: 'Taxes', value: federalTax.toFixed(2) },
        { label: 'SGLI', value: (parseFloat(deductions.sgli) || 0).toFixed(2) },
    ], [federalTax, deductions]);

    // --- UI LOGIC ---

    // Reset rank when status changes
    useEffect(() => {
        setRank('');
    }, [status]);

    const showAddIncomeButton = useMemo(() => {
        return additionalIncomes.length < 5 && (additionalIncomes[additionalIncomes.length - 1].name !== '' || additionalIncomes[additionalIncomes.length - 1].amount !== '');
    }, [additionalIncomes]);

    const showAddDeductionButton = useMemo(() => {
        return additionalDeductions.length < 5 && (additionalDeductions[additionalDeductions.length - 1].name !== '' || additionalDeductions[additionalDeductions.length - 1].amount !== '');
    }, [additionalDeductions]);


    return {
        // Display Values
        totalPay,
        incomeForDisplay,
        deductionsForDisplay,
        // Data for Pickers
        mhaList,
        // Form State & Setters
        status, setStatus,
        rank, setRank,
        yearsOfService, setYearsOfService,
        zipCode, setZipCode, // Keep for now, but UI will use MHA
        mha, setMha,
        filingStatus, setFilingStatus,
        dependencyStatus, setDependencyStatus,
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
