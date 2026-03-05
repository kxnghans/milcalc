# MilCalc Testing & Resilience Strategy

This document outlines the multi-layered verification strategy for MilCalc, with a focus on reliability in extreme operational environments.

## 1. Unit & Integration Testing (Logic)

The project uses **Jest** for validating the "Pure Logic" layer in `packages/utils`.
-   **100% Logic Coverage**: Every calculation engine (PT, Pay, Retirement) must have a corresponding test file.
-   **Mock Rigor**: All external data dependencies are mocked using the `test-mocks` directory. Mock data must precisely reflect the *transformed* API result structure.

## 2. Environmental Constraints & Resilience

MilCalc is designed for military environments (flightlines, bunkers, deployed locations) where hardware and connectivity are unpredictable.

### 2.1 "Airplane Mode" Validation
-   **Constraint**: Zero network availability during first-launch or standard use.
-   **Verification**: Physical device testing in Airplane Mode. 
-   **Success Metric**: Application must boot within 3 seconds and allow a full PT calculation using local `seed-data.json` without network timeouts or UI "Loading" spinners.

### 2.2 Low-Bandwidth / Intermittent Sync
-   **Constraint**: High packet loss or 2G speeds.
-   **Verification**: Utilize network throttling in Chrome DevTools or iOS Network Link Conditioner.
-   **Success Metric**: `SyncManager` must fail silently and retry on the next clean boot without blocking the main UI thread.

### 2.3 Limited Memory / Thermal Throttling
-   **Constraint**: Older hardware (iPhone 8 / Galaxy S9) in high-heat environments.
-   **Verification**: Memory leak profiling using React Native Debugger and Xcode Instruments.
-   **Success Metric**: The PT Calculator must maintain 60 FPS during rapid score updates, even under 80% CPU load simulations.

## 3. Offline Data Integrity

Given our "Smart Cache" architecture, we must verify that the SQLite persistence layer never becomes corrupted.
-   **Scenario**: App crash during a background re-fetch.
-   **Verification**: Automated unit tests for `sync-api.ts` that simulate a failed transaction and verify that the "Last Known Good" cache remains intact.

## 4. E2E Golden Path (Maestro)

We leverage **Maestro** for black-box testing of critical user journeys.
1.  **The "New Airman" Flow**: Launch app -> Enter age/gender -> Enter Pushups -> Verify score color -> Open Help Modal.
2.  **The "Retiree" Flow**: Toggle VA Disability comparison -> Change Disability % -> Verify "Optimal Income" summary.

## 5. Build Rigor

Every Pull Request must pass the following automated gates:
-   `turbo run lint`: Ensure zero linting violations.
-   `turbo run check-types`: Ensure 100% type safety.
-   `turbo run test`: Ensure zero regression in calculation math.