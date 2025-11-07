# MilCalc Project Context

This document provides a comprehensive overview of the MilCalc project for the Gemini AI assistant.

## 1. Project Overview

MilCalc is a suite of tools for military personnel, delivered as a monorepo application built with pnpm workspaces.

### 1.1. Monorepo Structure

-   `apps/web`: A Next.js web application.
-   `apps/mobile`: A React Native mobile application using Expo.
-   `packages/data`: Contains data files for the application.
-   `packages/ui`: A shared UI component library.
-   `packages/utils`: Shared utilities and functions.
-   `packages/eslint-config`: Shared ESLint configurations.
-   `packages/typescript-config`: Shared TypeScript configurations.

### 1.2. Key Features

-   **Air Force PT Calculator**: Calculates PT scores based on official standards, with data served from a Supabase backend.
-   **Best Score Tracker**: Helps users track their personal bests for each exercise.
-   **Pay Calculator**: Calculates military pay, including comparisons between military and VA disability income.
-   **Retirement Calculator**: Calculates retirement pay.
-   **Contextual Help System**: A robust, centralized modal (`DetailModal`) provides detailed, markdown-formatted explanations for calculations and UI elements across the application.
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

## 3. Documentation

- [PT Calculator and Best Score](./PT_CALCULATOR.md)
- [Pay Calculator](./PAY_CALCULATOR.md)
- [Retirement Calculator](./RETIREMENT_CALCULATOR.md)

## 4. Core Logic

The application's core logic is centralized in `packages/utils` to ensure consistency and reusability.

### 4.1. PT Score Calculation

The PT score calculation logic resides in `packages/utils/src/pt-calculator.ts`. The functions in this file are designed as pure functions, meaning they accept all necessary data as parameters and do not perform their own data fetching. This improves testability and separates concerns.

-   **`calculatePtScore`**: Calculates the total PT score. It takes user inputs, PT standards, walk standards, and altitude adjustments as parameters.
-   **`getScoreForExercise`**: Calculates the score for a single exercise, taking the standards data as a parameter.
-   **`checkWalkPass`**: Determines the pass/fail status for the walk component, also accepting walk standards and altitude adjustments as parameters.

### 4.2. Data Fetching (`pt-supabase-api.ts`)

All data for the PT calculator is fetched from the Supabase backend via functions in `packages/utils/src/pt-supabase-api.ts`.

-   **`getPtStandards`**: Fetches scoring standards by querying and joining data from three tables: `pt_age_sex_groups`, `pt_muscular_fitness_standards`, and `pt_cardio_respiratory_standards`. It then transforms this data into a consistent format for the calculation functions.
-   **`getWalkStandards`**: Fetches standards for the 2km walk from the `walk_standards` table.
-   **`getAltitudeAdjustments`**: Fetches altitude adjustment data from `run_altitude_adjustments`, `walk_altitude_adjustments`, or `hamr_altitude_adjustments` depending on the exercise.

### 4.3. State Management Strategy

Each major feature (PT Calculator, Pay Calculator, etc.) has its own dedicated custom hook that encapsulates all of its state and business logic. This follows the separation of concerns principle and makes the UI components simple and declarative.

-   **Example (`usePtCalculatorState.ts`)**: Manages the state for the PT Calculator, including fetching data from Supabase, handling user input with debouncing, and calculating scores.
-   **Example (`usePayCalculatorState.ts`)**: Manages the state for the Pay Calculator, including the logic for comparing military vs. VA disability pay.

This pattern is consistent across the application, promoting code reuse and maintainability.

### 4.4. Contextual Help System

To provide detailed, maintainable help content, a centralized system has been implemented.

-   **`getHelpContentFromSource` (`packages/utils/src/help-utils.ts`)**: This function acts as a single entry point for fetching all help-related content. It takes a `source` (`pt`, `pay`, or `retirement`) and a `contentKey` and queries the appropriate Supabase table (`help_details`, `pay_help_details`, or `retirement_help_details`).

-   **`DetailModal.tsx` (`apps/mobile/app/components`)**: This is the sole component responsible for displaying help content. It is a fully self-contained modal that:
    -   Calls `getHelpContentFromSource` to fetch its content based on the `source` and `contentKey` props.
    -   Includes a lightweight internal parser that renders markdown-style formatting (`**bold**`, `*italic*`, and paragraph breaks) to style the text, ensuring a rich and readable user experience.
    -   Is designed to be vertically centered and to shrink-to-fit its content, providing a polished and consistent look and feel.

## 5. UI and Styling

The application uses a shared component library in `packages/ui` to ensure a consistent look and feel. The styling is based on a neumorphic design aesthetic, with a centralized theme system providing colors, spacing, and typography.

### 5.1. Shared UI Components

Several key components are shared across the application:

-   **`DetailModal.tsx`**: This is the central component for all contextual help. It is designed to be highly reusable and is responsible for fetching its own content from Supabase based on a `source` and `contentKey`. It includes a lightweight markdown parser to render bold, italic, and multi-paragraph text, ensuring a rich user experience.

-   **`PayDisplay.tsx`**: This component provides a standardized summary of financial information. It is used by both the Pay and Retirement calculators. It can be configured with an `onHelpPress` callback to display a help icon, which triggers the `DetailModal`.

### 5.2. Color Conventions & `ProgressBar`

Scores and progress bars are color-coded using a centralized system.

-   **`getScoreCategory`** (`@repo/utils/color-utils`): This function determines the category of a component score (`excellent`, `pass`, `fail`).
    -   `excellent`: Score is >= 90% of the component's maximum score (e.g., >= 18 for Strength/Core).
    -   `pass`: Score is > 0.
    -   `fail`: Score is 0.
-   **`ProgressBar.tsx`** (`@repo/ui/components`): This component has been updated to reflect the user's desired logic.
    -   The **fill level** of the bar is determined by the user's raw performance (`value` prop) relative to the maximum possible performance (`maxPointsThreshold` prop).
    -   The **color** of the bar is determined by the calculated score (`score` and `maxScore` props), which is passed to `getScoreCategory`.

## 6. Development Conventions & Key Findings

-   **Pure Calculation Functions**: Functions that perform calculations (`pt-calculator.ts`) should not fetch their own data. Data should be fetched in the state hooks (`usePtCalculatorState.ts`) and passed as parameters.
-   **Case Sensitivity**: Supabase queries are case-sensitive. The `gender` value from the UI (`male`/`female`) must be capitalized (`Male`/`Female`) before being used in a query.
-   **Data Parsing**: Values from the database may contain non-numeric characters (e.g., `*`, `>`, `-`). Calculation functions must have robust parsing logic to strip these characters before performing mathematical operations.
-   **Dependency Management**: Avoid direct API calls from lower-level utility functions. This caused several `ReferenceError` bugs during development. Instead, pass all necessary data and dependencies as function parameters.

## 7. Supabase Integration

To provide a scalable and maintainable backend, MilCalc is integrated with Supabase. This handles all database, authentication, and storage needs.

### 7.1. Supabase MCP Tools

This project has access to a special `supabase` MCP tool suite, which allows for direct, programmatic interaction with the Supabase backend. This is the preferred method for all database schema and data migrations.

For a complete list and description of all available Supabase tools, please refer to the `SUPABASE.md` file in the project root.

### 7.2. Database Migration Workflow

The general workflow for migrating local data to the Supabase database is as follows:

1.  **Define Schema**: A `CREATE TABLE` SQL statement is written.
2.  **Apply Schema Migration**: The `supabase.apply_migration` tool executes the SQL to create the table.
3.  **Process and Insert Data**: The local data file is read, processed into `INSERT` statements, and executed via the `supabase.execute_sql` tool.

This automated process is used for all database setup and removes the need for manual data handling.

## 8. Project Status

The MilCalc project is a suite of military calculators developed as a monorepo application. The current status is as follows:

-   **`apps/mobile`**: The React Native mobile application is considered **complete and stable**. No further development or changes should be made to the mobile app to avoid regressions.

-   **`apps/web`**: The Next.js web application is the **primary focus of current development**. The goal is to build out the web version to match the functionality of the mobile app, following the plan outlined in `WEB.md`. This will involve using **Next.js** and **Tailwind CSS**.

## 9. Web Development Plan

All web development should follow the strategic plan detailed in the `WEB.md` document. This includes the architecture, component strategy, and phased implementation for each calculator.

## 10. Core Logic & Shared Packages

**IMPORTANT:** To prevent regressions in the completed mobile app, **do not modify existing components** in `packages/ui` or `packages/utils` in a way that would introduce breaking changes. If web-specific functionality is needed, create new components or utilities in the `apps/web` directory.