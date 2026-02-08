# MilCalc Testing Strategy

This document outlines the testing strategy for the MilCalc mobile application. The goal is to ensure the reliability, correctness, and performance of all features through a multi-layered testing approach.

## 1. Setup and Configuration

The project uses **Jest** for unit and integration testing, configured to run in a `pnpm` monorepo environment. The setup is centralized to ensure consistency across all packages.

### Key Configuration Learnings

1.  **Centralized Dependencies:** All core testing dependencies (`jest`, `ts-jest`, `@types/jest`, `jest-environment-jsdom`) are installed in the root `package.json` to ensure version consistency.
2.  **Workspace Configuration:** Each workspace that contains tests (e.g., `packages/utils`) must have its own `jest.config.js` file that inherits from the root configuration:
    ```js
    // packages/utils/jest.config.js
    module.exports = require('../../jest.config.js');
    ```
3.  **Root Configuration:** The root `jest.config.js` is the source of truth. It must be configured for TypeScript transformation using `ts-jest`:
    ```js
    // jest.config.js
    module.exports = {
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      // ... other configurations
    };
    ```
4.  **Type Safety:** The test runner will fail if there are TypeScript compilation errors anywhere in the imported module graph. This enforces that all code under test, including utilities and API helpers, is type-safe. This includes:
    -   **Strict Typing:** Avoid `any` where possible. Functions and variables should be strongly typed.
    -   **Null Safety:** Data returned from Supabase can be `null`. Code must be robust enough to handle potentially null values to prevent runtime errors during tests.

### Running Tests

To run all tests across the monorepo, use the root `test` script:

```bash
pnpm test
```

This command will execute the `test` script in each workspace package.

## 2. Unit Testing

Unit tests are the foundation of the testing strategy, focusing on pure functions and isolated logic. All calculation utilities in `packages/utils` are designed as pure functions, making them ideal candidates for unit testing.

**Data Mocking:** To ensure tests are fast and deterministic, all external data dependencies (i.e., Supabase API calls) are mocked. Mock data is stored in the `packages/utils/src/test-mocks/` directory and imported directly into test files. This approach avoids actual network requests and isolates the logic being tested.

A critical lesson learned during development is that **the structure of the mock data must precisely match the structure of the data returned by the data-fetching functions (e.g., `getPtStandards`), not the raw Supabase database schema.** These fetching functions often transform the data by joining tables or renaming fields. The application's business logic is built to expect this transformed data structure, and tests will fail if the mocks do not accurately represent it. The recent test failures were a direct result of this mismatch, which was resolved by updating the mocks to align with the API function outputs.

### 2.1. PT Calculator (`pt-calculator.ts`)

-   **Status:** Implemented
-   **Test File:** `packages/utils/__tests__/pt-calculator.test.ts`
-   **Mocks:** `packages/utils/__tests__/test-mocks/pt-data-mocks.ts`

Tests cover the `calculatePtScore` function with a variety of scenarios, including:
-   Standard passing and failing scores.
-   Edge cases where one component score is zero.
-   Calculations involving single and multiple exemptions.
-   Pass/fail status for the 2km walk component.

### 2.2. Pay Calculator (`pay-calculator.ts`)

-   **Status:** Implemented
-   **Test Files:** 
    -   `packages/utils/__tests__/pay-calculator.test.ts`
    -   `packages/utils/__tests__/pay-calculator-disability.test.ts`

Tests verify:
-   Correct calculation of military pay vs. VA disability pay.
-   Accurate calculations for different pay grades, years of service, and disability ratings.
-   Proper handling of edge cases and invalid inputs.

### 2.3. Retirement Calculator (`retirement-calculator.ts`)

-   **Status:** Implemented
-   **Test File:** `packages/utils/__tests__/retirement-calculator.test.ts`

Tests verify:
-   Correct calculations for both High-3 and BRS retirement systems.
-   Accurate disability offsets for the BRS plan.
-   Proper handling of different years of service and pay grades.

## 3. Integration and E2E Testing

(As described in the original plan, to be implemented)
