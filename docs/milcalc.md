# MilCalc Feature Implementation Documentation

This document provides a comprehensive overview of the implementation details for the core calculators and features within the MilCalc application.

---

## 1. Pay Calculator Implementation

This section describes the implementation of the Pay Calculator feature in MilCalc.

### 1.1 Overview

The Pay Calculator allows users to calculate their estimated monthly and annual military pay based on their rank, years of service, and other factors.

### 1.2 File Structure

The implementation is spread across several files in the monorepo:

-   `apps/mobile/app/(tabs)/pay-calculator.tsx`: The main screen component for the Pay Calculator in the mobile app.
-   `packages/ui/src/hooks/usePayCalculatorState.ts`: A custom hook that manages the state and business logic for the Pay Calculator.
-   `packages/utils/src/pay-calculator.ts`: A set of pure functions that perform the actual pay calculations.
-   `packages/utils/src/pay-supabase-api.ts`: Functions for fetching pay data from the Supabase backend.
-   `packages/ui/src/components/PayDisplay.tsx`: A component that displays the pay summary.

### 1.3 Architectural Choices

#### Separation of Concerns
We have strictly separated the code into UI components, state management (hooks), and pure calculation logic. This ensures that the math is 100% testable without a database or UI environment.

#### Context-Driven UI (Globalized Overlays)
To reduce boilerplate and ensure a consistent user experience, we utilize a **Context-Driven UI** pattern. Common interactive elements like Help modals (`DetailModal`), PDF viewers (`DocumentModal`), and system-wide menus are managed via the `OverlayContext`.
- **Global Mounting**: Modals are mounted once in the root `app/_layout.tsx`, preventing redundant re-renders and simplifying screen-level logic.
- **Hook-Based Triggers**: Screens use specialized hooks (e.g., `openHelp(key, source, mascot)` or `openDocuments(category)`) to trigger these global overlays, eliminating ~15-20 lines of state management per screen.

#### Standardized Calculator Layout
All primary calculators consume the `MainCalculatorLayout` wrapper. This component encapsulates the nested hierarchy of `ScreenHeader`, `DismissKeyboardView`, and `KeyboardAwareScrollView`, allowing screen files to focus exclusively on their unique input fields and results.

#### Stability & Performance Optimization
To prevent "Maximum update depth exceeded" errors—especially common in complex React Native applications using global contexts—we enforce strict memoization and style stability:
- **Provider Hardening**: All context providers (`ProfileContext`, `ThemeContext`, `OverlayContext`) must memoize their `value` object using `useMemo` and all setter functions using `useCallback`.
- **Style Stabilization**: Components MUST NOT call `StyleSheet.create` directly in the render body. If styles depend on the `theme` object, they must be wrapped in `useMemo`.
- **Hydration Guardrails**: Hydration effects use explicit comparison checks (e.g., `if (val !== currentVal)`) to prevent infinite update loops during initialization.

### 1.4 State Management

The state of the Pay Calculator is managed by the `usePayCalculatorState` hook. This hook is responsible for:

-   **Data Fetching**: Orchestrates React Query calls to fetch base pay (from `base_pay_2025` or `reserve_drill_pay`), BAH (2026), BAS, and tax metadata from Supabase.
-   **User Inputs**: Manages state for rank, years of service, location (MHA), filing status, and additional incomes/deductions.
-   **Calculation Orchestration**: Debounces user inputs and triggers the `calculatePay` engine whenever inputs change.

### 1.5 Calculation Logic

The core calculation logic is located in `packages/utils/src/pay-calculator.ts`.

#### `calculatePay`
This is a **pure function** that performs the heavy lifting for the financial simulation. It takes the pre-fetched base pay, allowances, and tax metadata as inputs.

The function works as follows:

1.  **Income Categorization**: Distinguishes between taxable (Base Pay, Special Pays, Additional Incomes) and non-taxable (BAH, BAS) components.
2.  **FICA Taxes**: Calculates Social Security and Medicare taxes at a fixed 7.65% rate strictly on **Base Pay**, ensuring compliance with military pay regulations.
3.  **Income Tax Simulation**: Applies federal and state tax brackets and **2026 standard deductions** ($16,100 for Single, $32,200 for Married Filing Jointly). It supports manual **Tax Overrides** for users who want 100% precision against their actual paychecks.
4.  **Deduction Summation**: Aggregates FICA, Federal, State, and user-defined deductions (SGLI, TSP, etc.) to determine the final take-home pay.

#### VA Disability Integration
The calculator includes a **VA Disability** picker. When a disability rating is selected, the state hook fetches the tax-free VA monthly payment.

#### Senior Officer Pay Cap
The engine enforces the statutory **Executive Level II pay cap** for officers O-7 and above, ensuring base pay does not exceed the legal limit.

### 1.6 Pay Summary Display

The pay summary is displayed using the `PayDisplay.tsx` component. This component receives the calculated pay data from the `usePayCalculatorState` hook and renders it in a user-friendly format. 

- **Standard Deduction Expansion**: Users can expand the "Standard Deductions" section in the summary to see the specific federal and state deductions applied to their calculation.

### 1.7 Data Fetching & Sync Strategy

All data for the Pay Calculator is synchronized from Supabase into a local **Smart Cache** (SQLite) via the `SyncManager`. 
- **Offline Reliability**: Once initial hydration is complete, the app performs all calculations locally, ensuring zero-latency even in "Airplane Mode".
- **TTL Caching**: The app uses a **24-hour Time-to-Live (TTL)** cache, checking for data updates only once per day to minimize network requests and improve launch performance.
- **Data Sanitization**: The API layer now sanitizes known data anomalies (e.g., incorrect tax rates for California's first bracket) during the fetch process, ensuring the calculation engine receives clean, reliable data.

---

## 2. PT Calculator and Best Score Implementation

### 2.1 Overview

The PT Calculator provides real-time scoring based on the latest Air Force Fitness standards. It supports all muscular and cardio-respiratory components, including alternative exercises and altitude adjustments.

### 2.2 Supported Exercises

The calculator supports the full suite of AF fitness components:
- **Cardio**: 2-Mile Run, 20-Meter Shuttle Run (HAMR), and 2-Kilometer Walk.
- **Strength**: 1-Minute Pushups and 2-Minute Hand-Release Pushups.
- **Core**: 1-Minute Situps, 2-Minute Cross-Leg Reverse Crunches, and Forearm Plank.

### 2.3 Architectural Choices

#### Separation of Concerns
We intentionally separated the code into three distinct layers:

1.  **UI Components (`pt-calculator.tsx`, `best-score.tsx`):** Responsible for capturing user input and displaying results.
2.  **State Management (`usePtCalculatorState.ts`, `useBestScoreState.ts`):** Custom hooks that manage calculation triggers, debouncing, and loading states.
3.  **Calculation Logic (`pt-calculator.ts`):** Pure functions that perform the scoring based on demographics and altitude-adjusted performance.

#### Health Risk Category Tracking
The PT Calculator now tracks and displays **Health Risk Categories** for critical components (WHtR and Cardio). This metadata is integrated directly into the scoring engine, allowing the UI to provide visual feedback beyond simple point totals.

#### Exemption Handling
The calculator includes robust **Exemption** logic. Users can mark individual components (Strength, Core, or Cardio) as exempt. The composite score is then automatically recalculated. A component category is only considered exempt if *all* alternate exercises within it are unavailable, preventing incorrect score calculations.

### 2.4 State Management

#### PT Calculator
The state is managed by the `usePtCalculatorState` hook, which handles:
- **Altitude Adjustments**: Automatically applies performance offsets for high-elevation environments based on the selected altitude group.
- **Debouncing**: Input changes are debounced to ensure smooth performance during real-time score updates.

#### Best Score
The `useBestScoreState` hook tracks the highest achieved score for each component across all supported exercises. It then calculates a **Theoretical Best Composite Score** by combining the highest scores from each of the three categories.

### 2.5 Calculation Logic

The core calculation logic is located in `packages/utils/src/pt-calculator.ts`. 

#### `calculatePtScore`
This function determines the composite score, pass/fail status, and health risk indicators:
1.  **Component Scoring**: Calls `getScoreForExercise` for each active component. This function now returns a structured object `{ points: number, healthRiskCategory: string | null }`.
2.  **Pass Criteria**: Checks that the user meets the **Minimum Performance Threshold** for every non-exempt component and achieves a composite score of **75 or higher**.
3.  **Walk Test**: The 2km Walk is a pass/fail assessment per **DAFMAN 36-2905 (2026)**. If selected, it does not contribute points to the composite score; the total score is calculated based on the remaining points. The `checkWalkPass` engine uses specific demographic filtering (Sex and Age Range) and granular altitude-specific thresholds to ensure 100% precision.
4.  **Health Risk Mapping**: Automatically identifies and propagates risk categories for WHtR and Cardio components (e.g., "Optimal", "Moderate", "High Risk") to the UI.

#### Optimized Range and Inequality Parsing
The data fetching layer now pre-parses human-readable standards (e.g., `"45-48"`, `">= 50"`, `"<= 13:25"`) into numeric `performanceRange` arrays. The scoring engine consumes these pre-calculated values, eliminating expensive string parsing and regex operations from the real-time scoring loop for maximum performance.

### 2.6 Data Fetching

Data is fetched from Supabase via `packages/utils/src/pt-supabase-api.ts` and cached locally:
- **Simplified Standards Lookup**: Consumes the `pt_scoring_standards` and `pt_pass_fail_standards` tables (2026 updates). These tables include direct `gender` and `age_group` columns for high-performance demographic filtering.
- **Pre-Parsed Performance**: The API layer now returns pre-parsed numeric ranges (`performanceRange: [min, max]`) for each standard, offloading expensive string manipulation from the client's real-time calculation engine.
- **Altitude Data**: Dynamically loads Run/HAMR corrections from `pt_altitude_corrections` and demographic-specific Walk thresholds from `pt_altitude_walk_thresholds` (covering all 4 altitude groups up to >= 6600ft).

---

## 3. Retirement Calculator Implementation

### 3.1 Overview

The Retirement Calculator estimates military retirement income by modeling the High-3 and Blended Retirement Systems (BRS), factoring in years of service, TSP growth, and VA disability compensation.

### 3.2 Key Features

- **Plan Modeling**: Accurate multipliers for High-3 (2.5% per year) and BRS (2.0% per year).
- **TSP Integration**: Forecasts future value using **monthly compounding** and statutory **BRS tiered matching** (100% on first 3%, 50% on next 2%).
- **Retirement Age Calculator**: A specialized tool to estimate the first day of retirement pay eligibility.

### 3.3 Retirement Age Calculation

The **Retirement Age Calculator** (integrated within the summary) uses the following logic:
- **Active Duty**: Projects retirement based on Birth Date, Service Entry Date, and Total Years of Service (including any **Break in Service**).
- **Guard/Reserve**: Calculates the "Reduced Age" eligibility. For every **90 days of qualifying deployment** in a fiscal year, the age at which a member can draw retirement pay is reduced by 3 months (from the standard age of 60).

### 3.4 State Management

The `useRetirementCalculatorState` hook manages a comprehensive set of inputs:
- **High-3 Averaging**: Allows users to select pay grades for their final three years of service to calculate an accurate average basic pay.
- **Service Points & Good Years**: For Guard/Reserve members, calculates "equivalent years" of service (Points / 360). This calculation enforces the statutory **130-point annual cap** (`min(points, goodYears * 130)`) for pension eligibility to prevent inflation of retirement pay from inactive duty points.
- **VA Disability Income**: Accurately models the pension offset for non-CRDP cases. If disability is < 50%, the pension is reduced dollar-for-dollar by VA pay. If >= 50%, the user is assumed to be eligible for concurrent receipt and receives both.

### 3.5 Calculation Logic

#### TSP Withdrawal (The "4% Rule")
The calculator estimates the total TSP balance at retirement using monthly compounding and applies the industry-standard **4% Rule** to determine a safe monthly withdrawal amount. This amount is then added to the monthly pension and VA income to provide a total gross retirement income figure.

#### Tax Estimation
The calculator performs a full tax simulation for retirement income:
- **Pension & TSP**: Taxed as ordinary income.
- **VA Disability**: Explicitly excluded from taxable income.
- **Standard Deductions**: Automatically applies federal and state standard deductions based on the user's filing status and state.

### 3.6 Contextual Help System

To ensure clarity for complex terms like "Service Points" or "Equivalent Years," the Retirement Calculator features label-specific help icons. These icons trigger markdown-rich modals with content fetched from the `retirement_help_details` table in Supabase.
