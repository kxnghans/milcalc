# Product Requirements Document (PRD) - MilCalc

## 1. Product Overview

### 1.1 Mission Statement
MilCalc is a comprehensive suite of tools designed to empower military personnel by providing accurate, accessible, and easy-to-use calculators for fitness, finance, and retirement planning.

### 1.2 Purpose
The goal of MilCalc is to simplify complex military-specific calculations—such as PT scores, monthly pay (including disability offsets), and long-term retirement benefits—into a single, polished mobile application.

## 2. Target Audience
-   **Active Duty Personnel:** Requiring regular PT score calculations and accurate monthly pay/tax estimations.
-   **Guard & Reserve Members:** Needing drill pay calculations and points-based retirement projections.
-   **Military Retirees/Veterans:** Interested in disability pay comparisons and retirement benefit tracking.

## 3. Key Features

### 3.1 Air Force PT Calculator
-   **Score Calculation:** Real-time calculation of PT scores based on official Air Force standards.
-   **Component Support:** Includes Strength, Core, and Cardio (Run, HAMR, Walk) components.
-   **Altitude Adjustments:** Automatic adjustment of cardio scores based on elevation.
-   **Walk Standards:** Full support for the 2km walk component.
-   **Dynamic Standards:** Standards are fetched from Supabase to ensure they are always up-to-date.

### 3.2 Best Score Tracker
-   **Personal Records:** Allows users to track their personal bests for each exercise component.
-   **Real-time Potential:** Calculates a theoretical "Best Score" based on individual component records.
-   **Persistence:** Saves data locally for quick access and privacy.

### 3.3 Pay Calculator
-   **Comprehensive Estimation:** Calculates monthly and annual gross/net pay.
-   **Component Modes:** Supports Active Duty (Monthly) and Guard/Reserve (Drill Pay) modes.
-   **VA Disability Integration:** Compares military pay with tax-free VA disability rates to determine the optimal income source (as users cannot receive both for the same period).
-   **Tax Engine:** Calculates FICA, Federal, and State taxes based on user filing status and location, distinguishing between taxable (Base Pay) and non-taxable (BAH/BAS) income.
-   **Allowances:** Includes BAH (Basic Allowance for Housing) and BAS (Basic Allowance for Subsistence).

### 3.4 Retirement Calculator
-   **Plan Support:** Supports High-3 and Blended Retirement System (BRS).
-   **Pension Projections:** Estimates monthly pension based on years of service or points (for Guard/Reserve).
-   **TSP Forecasting:** Includes a Thrift Savings Plan calculator with contribution matching (BRS) and projected rates of return.
-   **Total Benefits:** Combines pension, TSP withdrawals (4% rule), and disability income into a unified retirement summary.

### 3.5 Contextual Help System
-   **In-App Guidance:** Centralized `DetailModal` provides markdown-formatted explanations for every calculation and input field.
-   **Remote Content:** Help text is managed in Supabase, allowing for updates without app store releases.

### 3.6 Official Documents
-   **PDF Viewer:** Provides direct access to official Air Force manuals and standards documents (DAFI 36-2905, etc.).

## 4. Technical Stack

### 4.1 Frontend
-   **Framework:** React Native with Expo.
-   **Language:** TypeScript.
-   **Styling:** Neumorphic design aesthetic using a centralized theme system.
-   **Navigation:** Expo Router (File-based routing).

### 4.2 Backend (Supabase)
-   **Database:** PostgreSQL for standards, tax tables, and help content.
-   **Storage:** Hosting for official PDF documents.
-   **Edge Functions:** For complex server-side logic (if needed).
-   **MCP Integration:** Custom tools for automated schema and data migrations.

### 4.3 Architecture
-   **Monorepo:** Managed via Turborepo and pnpm workspaces.
-   **Shared Packages:**
    -   `packages/ui`: Reusable UI components (buttons, inputs, cards).
    -   `packages/utils`: Pure calculation logic and API wrappers.
    -   `packages/data`: Static data assets.
-   **Logic Separation:** Pure functions for calculations, custom hooks for state, and declarative UI components.

## 5. User Experience (UX) & Design

### 5.1 Visual Language
-   **Theme:** Neumorphic (soft UI) with depth-based shadows.
-   **Theming:** Full support for Light and Dark modes.
-   **Color Coding:** Standardized colors for performance categories (Excellent, Pass, Fail).

### 5.2 Interaction Design
-   **Debounced Inputs:** Prevents UI jitter by delaying calculations until user input pauses.
-   **Loading Optimization:** 500ms timer on loading indicators to prevent flashing on fast networks.
-   **Dismissible Keyboards:** Centralized `DismissKeyboardView` for better mobile ergonomics.

## 6. Data Management & Privacy
-   **Remote Data:** Standards and tax data are fetched from Supabase and cached.
-   **Local Data:** Personal bests and user preferences are stored on-device (e.g., AsyncStorage) to maintain privacy.
-   **Case Sensitivity:** Handled at the API layer (e.g., normalizing gender/rank strings).

## 7. Quality Assurance
-   **Unit Testing:** Comprehensive tests for PT, Pay, and Retirement calculation logic in `packages/utils`.
-   **Logic Isolation:** Calculations are kept as pure functions to ensure reliability and ease of testing.
-   **Linting/Formatting:** Strict ESLint and Prettier configurations across the monorepo.
