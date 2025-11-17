# MilCalc Testing Plan

This document outlines the testing strategy for the MilCalc mobile application. The goal is to ensure the reliability, correctness, and performance of all features through a multi-layered testing approach.

## 1. Overview

The testing strategy is divided into three main categories:

1.  **Unit Testing:** To verify that individual functions and isolated components work correctly.
2.  **Integration Testing:** To ensure that different parts of the application (hooks, components, and services) work together as expected.
3.  **End-to-End (E2E) Testing:** To validate complete user flows from the user's perspective.

Given the application's dependency on a Supabase backend, all tests should treat the API as an external dependency and use mock data to ensure tests are deterministic, fast, and can run offline.

## 2. Unit Testing

Unit tests will be written using a framework like **Jest**. The focus is on testing pure functions and isolated UI components.

### 2.1. Calculation Utilities (`packages/utils/`)

All calculation functions are pure and must be tested by passing mock data objects that simulate the data structures returned from the Supabase APIs.

-   **`pt-calculator.ts`:**
    -   Test `calculatePtScore` with various complete data sets, including exemptions for the walk component. Verify `isPass` status for passing, failing, and edge-case scores.
    -   Test `getScoreForExercise` for all exercise types, ensuring correct scores are returned based on mock standards data. Include tests for altitude adjustments.
    -   Test `checkWalkPass` for pass/fail scenarios, including altitude adjustments.
-   **`pay-calculator.ts`:**
    -   Test `calculateMilitaryVsVaDisability` with various inputs to ensure the comparison logic is correct.
    -   Verify calculations for different pay grades, years of service, and disability ratings.
-   **`retirement-calculator.ts`:**
    -   Test retirement pay calculations for different scenarios (e.g., High-3, BRS).
    -   Verify logic for different years of service and pay grades.
-   **Other Utilities:**
    -   Test `color-utils.ts` to ensure `getScoreCategory` returns the correct category (`excellent`, `pass`, `fail`) based on score inputs.

### 2.2. UI Components (`packages/ui/`)

-   Shared UI components like `PayDisplay`, `ProgressBar`, and `SegmentedSelector` should be tested in isolation using **React Native Testing Library**.
-   Tests should verify that components render correctly based on the props they receive.
-   User interactions (e.g., `onPress` events) should be mocked and verified.

## 3. Integration Testing

Integration tests will focus on custom hooks and screen-level components to ensure they correctly manage state and integrate with services.

### 3.1. Custom Hooks (`packages/ui/src/hooks/`)

-   Test custom state hooks like `usePtCalculatorState`, `usePayCalculatorState`, and `useRetirementCalculatorState`.
-   Mock the Supabase API modules (`pt-supabase-api.ts`, etc.) to simulate data fetching.
-   Verify that the hooks manage state correctly in response to user input (e.g., debouncing) and API responses (loading, success, error states).

### 3.2. Screen Components (`apps/mobile/app/(tabs)/`)

-   Test individual screen components (`pt-calculator.tsx`, `pay-calculator.tsx`, etc.) with their associated hooks.
-   Mock the navigation and data-fetching hooks to test the UI's response to different states (e.g., displaying a loading indicator, showing results, rendering an error message).

## 4. End-to-End (E2E) Testing

E2E tests will be conducted on the compiled mobile application for both iOS and Android using a framework like **Detox**. This ensures that complete user flows work as expected on a real device or emulator.

### 4.1. PT Calculator Flow

-   Navigate to the PT Calculator.
-   Enter user demographics (age, gender).
-   Select an altitude.
-   Input performance data for a full set of exercises.
-   **Verification:** Assert that the individual component scores and the total score are calculated and displayed correctly and that the pass/fail status is accurate.

### 4.2. Pay Calculator Flow

-   Navigate to the Pay Calculator.
-   Enter all required data (pay grade, years of service, disability rating, etc.).
-   **Verification:** Assert that the final pay comparison results are displayed correctly.

### 4.3. Best Score Flow

-   Navigate to the Best Score page.
-   Enter performance data for multiple exercises across different categories (Strength, Core, Cardio).
-   **Verification:** Assert that the highest score from each category is correctly identified and that the total best score is calculated and displayed accurately.

### 4.4. Retirement Calculator Flow

-   Navigate to the Retirement Calculator.
-   Enter all required data for a retirement calculation.
-   **Verification:** Assert that the retirement pay summary is calculated and displayed correctly.