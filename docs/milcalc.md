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
Similar to the PT Calculator, we have separated the code into UI, state management, and calculation layers. This makes the code easier to understand, test, and maintain.

#### Context-Driven UI (Globalized Overlays)
To reduce boilerplate and ensure a consistent user experience, we utilize a **Context-Driven UI** pattern. Common interactive elements like Help modals (`DetailModal`), PDF viewers (`DocumentModal`), and system-wide menus are managed via the `OverlayContext`.
- **Global Mounting**: Modals are mounted once in the root `app/_layout.tsx`, preventing redundant re-renders and simplifying screen-level logic.
- **Hook-Based Triggers**: Screens use specialized hooks (e.g., `openDetail(key, mascot)` or `openDocument(category)`) to trigger these global overlays, eliminating ~15-20 lines of state management per screen.

#### Standardized Calculator Layout
All primary calculators consume the `MainCalculatorLayout` wrapper. This component encapsulates the nested hierarchy of `ScreenHeader`, `DismissKeyboardView`, and `KeyboardAwareScrollView`, allowing screen files to focus exclusively on their unique input fields and results.

#### Debouncing User Input
We use debouncing to prevent recalculating the pay on every keystroke, which makes the app more responsive.

### 1.4 State Management

The state of the Pay Calculator is managed by the `usePayCalculatorState` hook. This hook is responsible for:

-   Fetching all necessary data (pay tables, BAH rates, etc.) from Supabase when the component mounts or when user inputs change.
-   Managing the user's input for rank, years of service, etc.
-   Calculating the total pay and its components.

### 1.5 Calculation Logic

The core calculation logic is located in `packages/utils/src/pay-calculator.ts`. The main function is `calculatePay`.

#### `calculatePay`
This function calculates the user's total pay. It takes the user's rank, years of service, and other inputs as parameters.

The function works as follows:

1.  **Base Pay**: It looks up the user's base pay in the pay table based on their rank and years of service. For Guard and Reserve members, it calculates **Drill Pay** (typically 4 drills per month).
2.  **BAS (Basic Allowance for Subsistence)**: It adds the current BAS rate.
3.  **BAH (Basic Allowance for Housing)**: It looks up the BAH rate based on the user's rank, dependency status, and location (MHA).
4.  **Special Pays & Incomes**: It adds any special pays or additional incomes that the user is entitled to.
5.  **Total Pay**: It sums up all the components to get the total monthly pay.
6.  **Annual Pay**: It multiplies the monthly pay by 12 to get the total annual pay.

#### Tax Calculations

-   **Taxable vs. Non-Taxable Income**: The calculator correctly distinguishes between taxable and non-taxable income. Base pay and most special pays are taxable, while allowances like BAH and BAS are not.
-   **FICA Taxes**: The Federal Insurance Contributions Act (FICA) tax is calculated at a fixed rate of 7.65% (6.2% Social Security + 1.45% Medicare).
-   **Federal and State Income Taxes**: The calculator utilizes tax brackets and standard deductions (Single vs. Married) cached locally from Supabase. It calculates tax by applying tiered rates to the taxable income after standard and additional deductions.

### 1.6 Pay Summary Display

The pay summary is displayed using the `PayDisplay.tsx` component. This component receives the calculated pay data from the `usePayCalculatorState` hook and renders it in a user-friendly format. 

- **Standard Deduction Expansion**: Users can expand the "Standard Deductions" section in the summary to see the specific federal and state deductions applied to their calculation.

### 1.7 Recent Enhancements

Several new features have been added to improve the accuracy and user experience of the Pay Calculator.

#### 1. Component Selector (Active vs. Reserve)
A **Component** selector has been added, allowing users to specify whether they are *Active Duty*, *Guard*, or *Reserve*.
-   **Active Duty**: Calculates standard monthly base pay and allowances.
-   **Guard/Reserve**: Calculates estimated **Drill Pay** based on the `reserve_drill_pay` standards, typically representing a standard drill weekend (4 drill periods).

#### 2. VA Disability Pay Integration (The "Offset" Logic)
The calculator includes a **VA Disability** picker. When a disability rating and dependent status are selected, the calculator will:
1.  Calculate the estimated military pay (Base Pay or Drill Pay).
2.  Fetch the corresponding tax-free VA Disability monthly payment.
3.  The main display will automatically show the **higher of the two values**, as a member cannot receive both simultaneously for the same period. The `paySource` indicator in the `PayDisplay` component clearly shows whether *Military* or *VA* pay is being displayed.

#### 3. Contextual Help
A help icon has been added to the top-right corner of the `PayDisplay` summary. Tapping this icon opens a detailed modal explaining the breakdown of Income and Deductions columns.

### 1.8 Data Fetching & Sync Strategy

All data for the Pay Calculator is synchronized from Supabase into a local **Smart Cache** (SQLite) via the `SyncManager`. 
- **Offline Reliability**: Once initial hydration is complete, the app performs all calculations locally, ensuring zero-latency even in "Airplane Mode".
- **Background Refresh**: The app uses the `sync_metadata` table to check for updates on launch. If a newer version is available on the backend (e.g., a 2025 pay scale update), it background-fetches the diff without interrupting the user.

---

## 2. PT Calculator and Best Score Implementation

### 2.1 Overview

The PT Calculator provides real-time scoring based on the latest Air Force Fitness standards. It supports all muscular and cardio-respiratory components, including alternative exercises and altitude adjustments.

### 2.2 Supported Exercises

The calculator supports the full suite of AF fitness components:
- **Cardio**: 1.5-Mile Run, 20-Meter Shuttle Run (HAMR), and 2-Kilometer Walk.
- **Strength**: 1-Minute Pushups and 2-Minute Hand-Release Pushups.
- **Core**: 1-Minute Situps, 2-Minute Cross-Leg Reverse Crunches, and Forearm Plank.

### 2.3 Architectural Choices

#### Separation of Concerns
We intentionally separated the code into three distinct layers:

1.  **UI Components (`pt-calculator.tsx`, `best-score.tsx`):** Responsible for capturing user input and displaying results.
2.  **State Management (`usePtCalculatorState.ts`, `useBestScoreState.ts`):** Custom hooks that manage calculation triggers, debouncing, and loading states.
3.  **Calculation Logic (`pt-calculator.ts`):** Pure functions that perform the scoring based on demographics and altitude-adjusted performance.

#### Exemption Handling
The calculator includes robust **Exemption** logic. Users can mark individual components (Strength, Core, or Cardio) as exempt. The composite score is then automatically recalculated by excluding those points from the total possible score (e.g., if Strength is exempt, the total possible points drop from 100 to 80).

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
This function determines the composite score and pass/fail status:
1.  **Component Scoring**: Calls `getScoreForExercise` for each active component.
2.  **Pass Criteria**: Checks that the user meets the **Minimum Performance Threshold** for every non-exempt component and achieves a composite score of **75 or higher**.
3.  **Walk Test**: The 2km Walk is a pass/fail assessment. If selected, it does not contribute points to the composite score; the score is calculated based on the remaining 40 points.

### 2.6 Data Fetching

Data is fetched from Supabase via `packages/utils/src/pt-supabase-api.ts` and cached locally:
- **Standards Lookup**: Joins demographics (`pt_age_sex_groups`) with performance tables.
- **Altitude Data**: Dynamically loads run, walk, or HAMR adjustments based on the user's exercise selection.

---

## 3. Retirement Calculator Implementation

### 3.1 Overview

The Retirement Calculator estimates military retirement income by modeling the High-3 and Blended Retirement Systems (BRS), factoring in years of service, TSP growth, and VA disability compensation.

### 3.2 Key Features

- **Plan Modeling**: Accurate multipliers for High-3 (2.5% per year) and BRS (2.0% per year).
- **TSP Integration**: Forecasts future value based on contributions, BRS matching, and user-defined rates of return (defaulting to 8%).
- **Retirement Age Calculator**: A specialized tool to estimate the first day of retirement pay eligibility.

### 3.3 Retirement Age Calculation

The **Retirement Age Calculator** (integrated within the summary) uses the following logic:
- **Active Duty**: Projects retirement based on Birth Date, Service Entry Date, and Total Years of Service (including any **Break in Service**).
- **Guard/Reserve**: Calculates the "Reduced Age" eligibility. For every **90 days of qualifying deployment** in a fiscal year, the age at which a member can draw retirement pay is reduced by 3 months (from the standard age of 60).

### 3.4 State Management

The `useRetirementCalculatorState` hook manages a comprehensive set of inputs:
- **High-3 Averaging**: Allows users to select pay grades for their final three years of service to calculate an accurate average basic pay.
- **Service Points & Good Years**: For Guard/Reserve members, calculates "equivalent years" of service (Points / 360) for the pension multiplier.
- **VA Disability Income**: Unlike the Pay Calculator (which uses an offset logic), the Retirement Calculator **adds** VA disability pay to the pension, assuming concurrent receipt (CRDP/CRSC eligibility).

### 3.5 Calculation Logic

#### TSP Withdrawal (The "4% Rule")
The calculator estimates the total TSP balance at retirement and applies the industry-standard **4% Rule** to determine a safe monthly withdrawal amount. This amount is then added to the monthly pension and VA income to provide a total gross retirement income figure.

#### Tax Estimation
The calculator performs a full tax simulation for retirement income:
- **Pension & TSP**: Taxed as ordinary income.
- **VA Disability**: Explicitly excluded from taxable income.
- **Standard Deductions**: Automatically applies federal and state standard deductions based on the user's filing status and state.

### 3.6 Contextual Help System

To ensure clarity for complex terms like "Service Points" or "Equivalent Years," the Retirement Calculator features label-specific help icons. These icons trigger markdown-rich modals with content fetched from the `retirement_help_details` table in Supabase.
