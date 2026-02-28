# MilCalc Testing Strategy

This document outlines the testing strategy for the MilCalc mobile application. The goal is to ensure the reliability, correctness, and performance of all features through a multi-layered testing approach.

## 1. Setup and Configuration

The project uses **Jest** for unit and integration testing, configured to run in a `pnpm` monorepo environment. The setup is centralized to ensure consistency across all packages.

### Key Configuration Learnings

1.  **Centralized Dependencies:** All core testing dependencies (`jest`, `ts-jest`, `@types/jest`, `jest-environment-jsdom`) are installed in the root `package.json` to ensure version consistency.
2.  **Workspace Configuration:** Each workspace that contains tests (e.g., `packages/utils`) must have its own `jest.config.js` file that inherits from the root configuration.
3.  **Root Configuration:** The root `jest.config.js` is the source of truth. It is configured for TypeScript transformation using `ts-jest` and handles path mapping for workspace aliases (`@repo/utils`, `@repo/ui`).
4.  **Type Safety:** The test runner will fail if there are TypeScript compilation errors anywhere in the imported module graph. This enforces that all code under test, including utilities and API helpers, is strict-mode compliant.

### Running Tests

To run all tests across the monorepo, use the root `test` script:

```bash
pnpm test
```

## 2. Unit Testing

Unit tests are the foundation of the testing strategy, focusing on pure functions and isolated logic. All calculation utilities in `packages/utils` are designed as pure functions, making them ideal candidates for unit testing.

**Data Mocking:** To ensure tests are fast and deterministic, all external data dependencies (i.e., Supabase API calls) are mocked. Mock data is stored in the `packages/utils/__tests__/test-mocks/` directory and imported directly into test files. 

**Critical Rule for Mocks:** The structure of the mock data must **precisely match the transformed structure** of the data returned by the data-fetching functions (e.g., `getPtStandards`), not the raw Supabase database schema. 

### 2.1. PT Calculator (`pt-calculator.ts`)
-   **Test File:** `packages/utils/__tests__/pt-calculator.test.ts`
-   **Coverage:** 
    - Standard passing and failing scores.
    - Component exemptions.
    - Pass/fail status for the 2km walk.
    - Altitude adjustments.

### 2.2. Pay Calculator (`pay-calculator.ts`)
-   **Test Files:** `pay-calculator.test.ts`, `pay-calculator-disability.test.ts`
-   **Coverage:** 
    - Active Duty vs. Guard/Reserve math.
    - Calculation of military pay vs. VA disability offsets.
    - FICA, Federal, and State tax bracket processing.

### 2.3. Retirement Calculator (`retirement-calculator.ts`)
-   **Test File:** `retirement-calculator.test.ts`
-   **Coverage:** 
    - High-3 vs. BRS multiplier rules.
    - Guard/Reserve point conversion.
    - TSP growth forecasting and matching rules.

## 3. Offline Data Verification

Given our "Smart Cache" architecture, verification must include "Airplane Mode" testing on physical devices to ensure the local SQLite persistence layer properly hydrates and returns standard data without network timeouts.

## 4. Integration and E2E Testing

*(To be implemented)*
Future E2E testing will leverage tools like **Maestro** to simulate full user journeys (e.g., opening the app in Airplane mode, entering PT data, verifying the final score color changes, and opening a help modal). Golden path tests will reside in a `.maestro/` directory at the project root.