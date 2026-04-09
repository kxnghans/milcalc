# MilCalc Refinement & Refactoring Guide

This document centralizes architectural reviews, logic corrections, and performance optimizations identified across the MilCalc codebase. Use this as a roadmap for maintaining the "Single Source of Truth" for military standards and ensuring a premium, high-performance mobile experience.

---

## 1. Core Logic & Calculations

### 1.1 Tax Logic (Federal, State, FICA)

| Issue | Target Files | Current State | Refactored State / Fix | Impact |
| :--- | :--- | :--- | :--- | :--- |
| **DRY Violation** | `pay-calculator.ts`, `retirement-calculator.ts` | Identical tax implementations exist in both. | Extract to shared `tax-utils.ts`. | **Pending** |
| **CA Tax Rate Bug** | `pay-calculator.ts` | Hardcoded `rate === 1.0` fix for CA inside the loop. | Patch at API boundary or DB level. | **Medium** |
| **FICA Calculation** | `pay-calculator.ts` | Calculated against total taxable income. | Calculate against **Base Pay ONLY**. | **High** |
| **Decimal Accuracy** | `pay-calculator.ts` | Integer `+1/-1` hack in state tax brackets. | Use standard bound subtraction. | **High** |

#### Shared Tax Logic Extraction (`packages/utils/src/tax-utils.ts`)
```typescript
import { Tables } from './types';

export const calculateFederalTax = (
  taxableIncome: number,
  filingStatus: string,
  federalTaxData: Tables<'federal_tax_data'>[]
) => {
  const capitalizedFilingStatus = filingStatus.charAt(0).toUpperCase() + filingStatus.slice(1);
  const brackets = federalTaxData
    .filter(row => row.filing_status === capitalizedFilingStatus)
    .sort((a, b) => (a.income_bracket_low || 0) - (b.income_bracket_low || 0));

  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    const bracketMin = bracket.income_bracket_low || 0;
    const bracketMax = bracket.income_bracket_high === 'inf' ? Infinity : parseFloat(bracket.income_bracket_high || '0');
    const taxRate = bracket.tax_rate || 0;

    const incomeInBracket = Math.min(remainingIncome, bracketMax - bracketMin);
    tax += incomeInBracket * taxRate;
    remainingIncome -= incomeInBracket;
  }
  return tax;
};

export const calculateStateTax = (
  taxableIncome: number,
  filingStatus: string,
  state: string,
  stateTaxData: Tables<'state_tax_data'>[]
) => {
  const capitalizedFilingStatus = filingStatus.charAt(0).toUpperCase() + filingStatus.slice(1);
  const rawBrackets = stateTaxData
    .filter(row => row.state === state && row.filing_status === capitalizedFilingStatus)
    .sort((a, b) => (a.income_bracket_low || 0) - (b.income_bracket_low || 0));

  if (rawBrackets.length === 0) return 0;

  const brackets = rawBrackets.map((bracket, index) => {
    const nextBracket = rawBrackets[index + 1];
    let rate = bracket.tax_rate || 0;
    // Data Sanitization check
    if (state === 'CA' && bracket.income_bracket_low === 0 && rate === 1.0) rate = 0.01;
    
    return {
      min: bracket.income_bracket_low || 0,
      max: nextBracket ? (nextBracket.income_bracket_low || 0) : Infinity, // FIXED: Safe for decimals
      rate: rate,
    };
  });

  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    const bracketSize = bracket.max - bracket.min; 
    const incomeInBracket = Math.min(remainingIncome, bracketSize);
    tax += incomeInBracket * bracket.rate;
    remainingIncome -= incomeInBracket;
  }
  return tax;
};
```

#### Corrected Military FICA Calculation
```typescript
// Update in pay-calculator.ts
const taxableIncome = annualBasePay + annualSpecialPays + annualAdditionalIncomes;
const nonTaxableIncome = annualBah + annualBas;

// Military Rule: FICA does not apply to special/incentive pays or allowances
const FICA_RATE = 0.0765; // 6.2% SS + 1.45% Medicare
const ficaTax = annualBasePay * FICA_RATE; 

/**
 * Statutory Edge Case: Senior Officer Level II Pay Cap
 * Military basic pay for senior officers (O-7 to O-10) is capped by law at Executive Level II.
 */
const EXEC_LEVEL_II_CAP_2025 = 221100 / 12; // Statutory annual cap divided by 12
const cappedBasePay = Math.min(rawBasePay, EXEC_LEVEL_II_CAP_2025);
```

---

### 1.2 PT Calculator (Scores, Exemptions, & Standards)

| Issue | Target File | Mitigation | Impact |
| :--- | :--- | :--- | :--- |
| **Complexity** | `pt-calculator.ts` | Break `calculatePtScore` into pure sub-functions. | **High** |
| **Mixed Types** | `pt-calculator.ts` | Return strictly `number` for scores, use boolean flags for exemptions. | **High** |
| **Alternate Trap** | `pt-calculator.ts` | Category is only exempt if **all** exercises in it are exempt. | **High** |
| **Perf Stutter** | `pt-calculator.ts` | Pre-parse `measurement` regex once on load/sync. | **Medium** |

#### Alternate PT Score Trap & Strict Typing Fix
```typescript
export const calculateBestScore = (scores: { [key: string]: number | string }): number => {
    let totalPossiblePoints = 100;
    let earnedPoints = 0;

    const whtrScore = typeof scores.whtr === 'number' ? scores.whtr : 0;
    const strengthScore = Math.max(
        typeof scores.push_ups_1min === 'number' ? scores.push_ups_1min : 0,
        typeof scores.hand_release_pushups_2min === 'number' ? scores.hand_release_pushups_2min : 0
    );
    // ... logic for core and cardio

    // FIXED: Only deduct category points if ALL exercises in that category are Exempt
    if (scores.whtr === 'Exempt') totalPossiblePoints -= 20; else earnedPoints += whtrScore;
    
    if (scores.push_ups_1min === 'Exempt' && scores.hand_release_pushups_2min === 'Exempt') {
        totalPossiblePoints -= 15;
    } else {
        earnedPoints += strengthScore;
    }
    // ... repeat for core and cardio categories
    
    return totalPossiblePoints > 0 ? (earnedPoints / totalPossiblePoints) * 100 : 100;
};
```

#### WHtR "Dead Zone" Precision
Directives mandate rounding to two decimal places before comparison to avoid "rounding into failure" (e.g., a 0.496 being treated as 0.50 inconsistently).
```typescript
// Enforce toFixed(2) precision for WHtR comparison logic
const calculatedWHtR = parseFloat((waist / height).toFixed(2));
```

#### PT Standard Performance Optimization
```typescript
// Pre-parse standards ONCE during hydrate/fetch
const memoizedStandards = rawStandards.map(s => {
    const [min, max] = parsePerformanceRange(s.measurement);
    return { ...s, parsedMin: min, parsedMax: max };
});

// findScore loop becomes O(N) number comparison:
for (const s of memoizedStandards) {
    if (higherIsBetter ? performanceValue >= s.parsedMin : performanceValue <= s.parsedMax) {
        // ... return s.points
    }
}
```

---

### 1.3 Retirement & TSP Logic

| Issue | Current Bug | Recommended Fix | Impact |
| :--- | :--- | :--- | :--- |
| **TSP Compounding** | Annual compounding (`Math.pow`). | Switch to **Monthly** compounding. | **Medium** |
| **BRS Match Law** | Naive 1-to-1 matching up to 4%. | Implement **Tiered Match** (3% @ 100%, 2% @ 50%). | **High** |
| **Age Floor** | Deployment reductions drop below 50. | Enforce statutory **Age 50 floor**. | **Low** |
| **Brittle Params** | Long positional arguments list (8+). | Use **Interface-based params** object. | **Medium** |

#### BRS Tiered Matching Law Fix
```typescript
  if (retirementSystem === 'BRS') {
    const automaticContribution = avgSalary * 0.01; 
    let matchingPercentage = 0;
    
    if (contributionPercentage <= 3) {
      matchingPercentage = contributionPercentage;
    } else if (contributionPercentage > 3 && contributionPercentage <= 5) {
      matchingPercentage = 3 + ((contributionPercentage - 3) * 0.5);
    } else if (contributionPercentage > 5) {
      matchingPercentage = 4;
    }

    const matchingContribution = avgSalary * (matchingPercentage / 100);
    employerContribution = automaticContribution + matchingContribution;
  }
```

#### Monthly Compounding (Future Value of Series)
```typescript
  const monthlyContribution = totalAnnualContribution / 12;
  const monthlyRate = (tspReturn / 100) / 12;
  const totalMonths = years * 12;

  const futureValue = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  return futureValue;
```

#### Reserve Retirement Age Statutory Floor
```typescript
// Enforce the age 50 statutory floor for Reserve/Guard (Title 10 U.S.C. § 12731)
const calculatedAge = 60 - Math.floor(qualifyingDeploymentDays / 90) * 0.25;
return Math.max(50, calculatedAge);
```

#### Reserve Retirement "Point Ceiling"
Inactive duty points (drills, correspondence) counting toward the multiplier are capped annually by law (Title 10 U.S.C. § 12733).
```typescript
/**
 * Statutory Limit: Inactive Point Cap (130 Points)
 * Ceiling for Inactive Duty training points per anniversary year.
 */
const annualInactivePoints = Math.min(rawInactivePoints, 130);
const equivalentYears = (activeDutyPoints + annualInactivePoints) / 360;
```

#### VA Disability: Offset vs. Concurrent Receipt (CRDP)
Military pension is only "added" to VA pay if the retiree meets the 50% disability threshold.
```typescript
// Logic: If VA Rating < 50%, subtract VA amount from taxable pension (The VA Waiver)
const vaWaiverAmount = vaRating < 50 ? vaMonthlyPayment : 0;
const taxablePension = Math.max(0, rawPension - vaWaiverAmount);
const netRetirementIncome = taxablePension + vaMonthlyPayment; // Adding back tax-free VA
```

---

## 2. API & Infrastructure

### 2.1 Supabase Cost & Bandwidth Optimization

| Strategy | Description | Cost Impact |
| :--- | :--- | :--- |
| **TTL Caching** | Use a 24-hour timeout locally before re-checking for updates. | **Massive** (Reduces egress/reads) |
| **RPC Bundling** | Combine all reference tables into a single JSON blob via Postgres function. | **Medium** (Lower latency, fewer handshakes) |
| **Drop pg_cron** | Supabase Free tier no longer counts internal crons as activity. | **Medium** (Save CPU/Logs) |

#### Cost-Conscious Sync (TTL Example)
```typescript
const CACHE_KEY = 'sync_metadata_cache';
const TTL_MS = 24 * 60 * 60 * 1000;

export const getCostConsciousSyncMetadata = async () => {
  const cached = await AsyncStorage.getItem(CACHE_KEY);
  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    if (Date.now() - timestamp < TTL_MS) return data;
  }
  // ... fetch and store
};
```

---

## 3. UI/UX & React Native Performance

### 3.1 StyleSheet Lifecycle Management

> [!CAUTION]
> **Anti-Pattern**: Calling `StyleSheet.create` inside the render body. This forces a bridge transfer on EVERY render, destroying performance.

#### Correct Pattern: Static Bases + Dynamic Overrides
```tsx
const staticStyles = StyleSheet.create({
    baseButton: { justifyContent: 'center', alignItems: 'center', elevation: 2 }
});

export const RoundIconButton = ({ backgroundColor, size }) => (
    <TouchableOpacity style={[
        staticStyles.baseButton, 
        { width: size, height: size, borderRadius: size / 2, backgroundColor } // Dynamic inline
    ]}>
        {/* ... */}
    </TouchableOpacity>
);
```



## 4. Type Safety & Stability

### 4.1 Safe Async Handling
Avoid `Promise.all` for critical data fetching where one failure shouldn't kill the batch.

```typescript
// Use allSettled or ensure internal try/catch
const results = await Promise.allSettled([
  getBasePay(params1),
  getBasePay(params2),
  getBasePay(params3)
]);
```

### 4.2 Error Bubbling
Don't swallow errors at the API layer. Return structured results for UI error handling.
```typescript
export interface SyncResponse {
  data: SyncMetadata[] | null;
  error: PostgrestError | null;
}
```

---

**Final Verdict:** The MilCalc codebase is structurally sound. By applying these mathematical, domain, and performance refinements, the application achieves enterprise-grade reliability and financial accuracy.
