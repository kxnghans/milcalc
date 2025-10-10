# MilCalc Project Context

This document provides a comprehensive overview of the MilCalc project for the Gemini AI assistant.

## 1. Project Overview

MilCalc is a suite of tools for military personnel, delivered as a monorepo application built with pnpm workspaces.

### 1.1. Monorepo Structure

-   `apps/web`: A Next.js web application.
-   `apps/mobile`: A React Native mobile application using Expo.
-   `packages/ui`: A shared UI component library.
-   `packages/eslint-config`: Shared ESLint configurations.
-   `packages/typescript-config`: Shared TypeScript configurations.

### 1.2. Key Features

-   **Air Force PT Calculator**: Calculates PT scores based on official standards, with data served from a Supabase backend.
-   **Best Score Tracker**: Helps users track their personal bests for each exercise.
-   **Dynamic Theming**: The mobile app supports light, dark, and automatic theme switching.
-   **PDF Viewer**: Provides access to official PT documents.

## 2. Getting Started

The project uses `pnpm` for package management and `turbo` for the monorepo build tool.

### 2.1. Installation

```bash
pnpm install
```

### 2.2. Running the Apps

-   **Run both web and mobile apps:**
    ```bash
    pnpm dev
    ```
-   **Run web app only:**
    ```bash
    pnpm --filter milcalc-web dev
    ```
    Access at `http://localhost:3000`.

-   **Run mobile app only:**
    ```bash
    pnpm --filter milcalc-mobile dev
    ```
    Use the Expo Go app to scan the QR code.

## 3. Core Logic

The application's core logic is centralized in `packages/utils` to ensure consistency and reusability.

### 3.1. PT Score Calculation

The PT score calculation logic resides in `packages/utils/src/pt-calculator.ts`. The functions in this file are designed as pure functions, meaning they accept all necessary data as parameters and do not perform their own data fetching. This improves testability and separates concerns.

-   **`calculatePtScore`**: Calculates the total PT score. It takes user inputs, PT standards, walk standards, and altitude adjustments as parameters.
-   **`getScoreForExercise`**: Calculates the score for a single exercise, taking the standards data as a parameter.
-   **`checkWalkPass`**: Determines the pass/fail status for the walk component, also accepting walk standards and altitude adjustments as parameters.

### 3.2. Data Fetching (`pt-supabase-api.ts`)

All data for the PT calculator is fetched from the Supabase backend via functions in `packages/utils/src/pt-supabase-api.ts`.

-   **`getPtStandards`**: Fetches scoring standards by querying and joining data from three tables: `pt_age_sex_groups`, `pt_muscular_fitness_standards`, and `pt_cardio_respiratory_standards`. It then transforms this data into a consistent format for the calculation functions.
-   **`getWalkStandards`**: Fetches standards for the 2km walk from the `walk_standards` table.
-   **`getAltitudeAdjustments`**: Fetches altitude adjustment data from `run_altitude_adjustments`, `walk_altitude_adjustments`, or `hamr_altitude_adjustments` depending on the exercise.

### 3.3. State Management (`usePtCalculatorState.ts`)

The main calculator screen's state is managed by the `usePtCalculatorState` hook in `packages/ui/src/hooks`.

-   It fetches all necessary data (PT standards, walk standards, altitude adjustments) from Supabase when the component mounts or when user demographics (age, gender) change.
-   It uses debouncing on user inputs to prevent excessive API calls and recalculations while the user is typing.
-   It manages a loading state (`isLoading`) which is controlled by a 500ms timer to prevent the loading indicator from flashing on fast network responses.

## 4. UI and Styling

### 4.1. Color Conventions & `ProgressBar`

Scores and progress bars are color-coded using a centralized system.

-   **`getScoreCategory`** (`@repo/utils/color-utils`): This function determines the category of a component score (`excellent`, `pass`, `fail`).
    -   `excellent`: Score is >= 90% of the component's maximum score (e.g., >= 18 for Strength/Core).
    -   `pass`: Score is > 0.
    -   `fail`: Score is 0.
-   **`ProgressBar.tsx`** (`@repo/ui/components`): This component has been updated to reflect the user's desired logic.
    -   The **fill level** of the bar is determined by the user's raw performance (`value` prop) relative to the maximum possible performance (`maxPointsThreshold` prop).
    -   The **color** of the bar is determined by the calculated score (`score` and `maxScore` props), which is passed to `getScoreCategory`.

## 5. Development Conventions & Key Findings

-   **Pure Calculation Functions**: Functions that perform calculations (`pt-calculator.ts`) should not fetch their own data. Data should be fetched in the state hooks (`usePtCalculatorState.ts`) and passed as parameters.
-   **Case Sensitivity**: Supabase queries are case-sensitive. The `gender` value from the UI (`male`/`female`) must be capitalized (`Male`/`Female`) before being used in a query.
-   **Data Parsing**: Values from the database may contain non-numeric characters (e.g., `*`, `>`, `-`). Calculation functions must have robust parsing logic to strip these characters before performing mathematical operations.
-   **Dependency Management**: Avoid direct API calls from lower-level utility functions. This caused several `ReferenceError` bugs during development. Instead, pass all necessary data and dependencies as function parameters.

## 6. Supabase Integration

To provide a scalable and maintainable backend, MilCalc is integrated with Supabase. This handles all database, authentication, and storage needs.

### 6.1. Supabase MCP Tools

This project has access to a special `supabase` MCP tool suite, which allows for direct, programmatic interaction with the Supabase backend. This is the preferred method for all database schema and data migrations.

For a complete list and description of all available Supabase tools, please refer to the `SUPABASE.md` file in the project root.

### 6.2. Database Migration Workflow

The general workflow for migrating local data to the Supabase database is as follows:

1.  **Define Schema**: A `CREATE TABLE` SQL statement is written.
2.  **Apply Schema Migration**: The `supabase.apply_migration` tool executes the SQL to create the table.
3.  **Process and Insert Data**: The local data file is read, processed into `INSERT` statements, and executed via the `supabase.execute_sql` tool.

This automated process is used for all database setup and removes the need for manual data handling.