# Pay Calculator Implementation

This document describes the implementation of the Pay Calculator feature in MilCalc.

## Overview

The Pay Calculator allows users to calculate their estimated monthly and annual military pay based on their rank, years of service, and other factors.

## File Structure

The implementation is spread across several files in the monorepo:

-   `apps/mobile/app/(tabs)/pay-calculator.tsx`: The main screen component for the Pay Calculator in the mobile app.
-   `packages/ui/src/hooks/usePayCalculatorState.ts`: A custom hook that manages the state and business logic for the Pay Calculator.
-   `packages/utils/src/pay-calculator.ts`: A set of pure functions that perform the actual pay calculations.
-   `packages/utils/src/pay-supabase-api.ts`: Functions for fetching pay data from the Supabase backend.
-   `packages/ui/src/components/PayDisplay.tsx`: A component that displays the pay summary.

## Architectural Choices

### Separation of Concerns

Similar to the PT Calculator, we have separated the code into UI, state management, and calculation layers. This makes the code easier to understand, test, and maintain.

### Debouncing User Input

We use debouncing to prevent recalculating the pay on every keystroke, which makes the app more responsive.

## State Management

The state of the Pay Calculator is managed by the `usePayCalculatorState` hook. This hook is responsible for:

-   Fetching all necessary data (pay tables, BAH rates, etc.) from Supabase when the component mounts or when user inputs change.
-   Managing the user's input for rank, years of service, etc.
-   Calculating the total pay and its components.

## Calculation Logic

The core calculation logic is located in `packages/utils/src/pay-calculator.ts`. The main function is `calculatePay`.

### `calculatePay`

This function calculates the user's total pay. It takes the user's rank, years of service, and other inputs as parameters.

The function works as follows:

1.  **Base Pay**: It looks up the user's base pay in the pay table based on their rank and years of service.
2.  **BAS (Basic Allowance for Subsistence)**: It adds the current BAS rate.
3.  **BAH (Basic Allowance for Housing)**: It looks up the BAH rate based on the user's rank and location.
4.  **Special Pays**: It adds any special pays that the user is entitled to.
5.  **Total Pay**: It sums up all the components to get the total monthly pay.
6.  **Annual Pay**: It multiplies the monthly pay by 12 to get the total annual pay.

### Tax Calculations

-   **Taxable vs. Non-Taxable Income**: The calculator correctly distinguishes between taxable and non-taxable income. Base pay and most special pays are taxable, while allowances like BAH and BAS are not.
-   **FICA Taxes**: The Federal Insurance Contributions Act (FICA) tax is calculated at a fixed rate of 7.65%. This is a combination of the Social Security tax (6.2%) and the Medicare tax (1.45%).
-   **Federal and State Income Taxes**: The calculator fetches the latest federal and state tax brackets from our Supabase backend. It then uses the user's filing status (e.g., single, married filing jointly) and state of residence to determine the correct standard deduction and tax rates.

## Pay Summary Display

The pay summary is displayed using the `PayDisplay.tsx` component. This component receives the calculated pay data from the `usePayCalculatorState` hook and renders it in a user-friendly format.

## Recent Enhancements

Several new features have been added to improve the accuracy and user experience of the Pay Calculator.

### 1. Component Selector

A **Component** selector has been added, allowing users to specify whether they are *Active Duty*, *Guard*, or *Reserve*. This choice affects the type of pay calculated:

-   **Active Duty**: Calculates standard monthly base pay.
-   **Guard/Reserve**: Calculates estimated **Drill Pay** for a standard drill period (typically 4 drills).

### 2. VA Disability Pay Integration

The calculator now includes a **VA Disability** picker. When a disability rating is selected, the calculator will:

1.  Calculate the estimated military pay (Base Pay or Drill Pay).
2.  Fetch the corresponding tax-free VA Disability monthly payment.
3.  The main display will automatically show the **higher of the two values**, as a member cannot receive both simultaneously for the same period. The `paySource` in the `PayDisplay` component indicates which source is being shown (*Military* or *VA*).

### 3. Contextual Help

A help icon has been added to the top-right corner of the `PayDisplay` summary. Tapping this icon opens a detailed modal that explains:

-   The difference between Annual and Monthly gross pay.
-   The meaning of the `paySource`.
-   How the Income and Deductions columns are derived.

This information is fetched from the `pay_help_details` table in Supabase.

## Data Fetching

All data for the Pay Calculator is fetched from the Supabase backend via functions in `packages/utils/src/pay-supabase-api.ts`.

-   `getPayData`: Fetches the basic pay tables.
-   `getBahRates`: Fetches the BAH rates.
-   `getBasRate`: Fetches the BAS rate.
-   `getFederalTaxData` and `getStateTaxData`: Fetches the federal and state tax data.
