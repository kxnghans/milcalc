# Product Requirements Document (PRD) - MilCalc

## 1. Product Overview

### 1.1 Mission Statement
MilCalc is a comprehensive suite of tools designed to empower military personnel by providing accurate, accessible, and easy-to-use calculators for fitness, finance, and retirement planning.

### 1.2 Purpose
Simplify complex military-specific calculations—such as PT scores, monthly pay (including disability offsets), and long-term retirement benefits—into a single, polished mobile application. **Crucially, the app must function 100% offline to support deployed service members.**

## 2. Target Audience
-   **Active Duty Personnel:** Requiring regular PT score calculations and accurate monthly pay/tax estimations.
-   **Guard & Reserve Members:** Needing drill pay calculations and points-based retirement projections.
-   **Military Retirees/Veterans:** Interested in disability pay comparisons and retirement benefit tracking.

## 3. Key Features

### 3.1 Air Force PT Calculator
-   **Score Calculation:** Real-time calculation of PT scores based on official Air Force standards.
-   **Component Support:** Includes Strength, Core, and Cardio (Run, HAMR, Walk).
-   **Altitude Adjustments:** Automatic adjustment of cardio scores based on elevation.
-   **Offline Execution:** Standards are fetched dynamically from a local SQLite cache.

### 3.2 Best Score Tracker
-   **Personal Records:** Allows users to track their personal bests for each exercise component.
-   **Real-time Potential:** Calculates a theoretical "Best Score" based on individual component records.

### 3.3 Pay Calculator
-   **Comprehensive Estimation:** Calculates monthly and annual gross/net pay.
-   **Component Modes:** Supports Active Duty (Monthly) and Guard/Reserve (Drill Pay) modes.
-   **VA Disability Integration:** Compares military pay with tax-free VA disability rates to determine the optimal income source.
-   **Tax Engine:** Calculates FICA, Federal, and State taxes based on user filing status. Includes BAH and BAS allowances.

### 3.4 Retirement Calculator
-   **Plan Support:** Supports High-3 and Blended Retirement System (BRS).
-   **Pension Projections:** Estimates monthly pension based on years of service or reserve points.
-   **TSP Forecasting:** Includes a Thrift Savings Plan calculator with contribution matching (BRS).

### 3.5 Contextual Help System
-   **In-App Guidance:** Centralized `DetailModal` provides markdown-formatted explanations for every calculation and input field.
-   **Smart Sync CMS:** Content is managed in Supabase and silently synced to the local device in the background when connectivity is available.

## 4. Technical Stack

-   **Frontend:** React Native, Expo Router, TypeScript.
-   **Design:** Shared UI package featuring a Neumorphic design system.
-   **Backend:** Supabase (PostgreSQL, Auth).
-   **Offline Persistence:** `expo-sqlite` and `@tanstack/react-query-persist-client`.
-   **Architecture:** Turborepo managed pnpm monorepo.

## 5. User Experience (UX)

-   **100% Offline Ready:** Functions immediately without requiring a network connection on first launch (via bundled seed data).
-   **Debounced Inputs:** Prevents UI jitter by delaying calculations until user input pauses.
-   **Ergonomics:** `DismissKeyboardView` implemented globally to prevent keyboard entrapment.
-   **Visual Feedback:** Progress bars intelligently color-code themselves (Blue/Green/Red) based on the calculated percentage of maximum possible points.