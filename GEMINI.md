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

-   **Air Force PT Calculator**: Calculates PT scores based on official standards.
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

The PT score calculation is based on the standards outlined in `dafman36-2905.pdf`. The main functions are:

-   **`calculatePtScore`**: Calculates the total PT score for the main calculator screen.
-   **`getScoreForExercise`**: Calculates the score for a single exercise.
-   **`calculateBestScore`**: Calculates the best possible total score from a set of individual scores.

Altitude adjustments are automatically applied for cardio exercises based on the selected altitude group.

### 3.2. Utility Functions

Key utility functions are located in `packages/utils`:

-   **`pt-calculator.ts`**
    -   `checkWalkPass`: Determines if the 2-kilometer walk is a "pass", "fail", or "n/a".
    -   `getMinMaxValues`: Returns the minimum and maximum possible performance values for an exercise.
    -   `getCardioMinMaxValues`: Returns the min/max performance values for a cardio exercise.
    -   `getPerformanceForScore`: Returns the performance required to achieve a specific score.

-   **`color-utils.ts`**
    -   `getScoreCategory`: Returns a performance category (`excellent`, `pass`, `fail`, `none`) for a score.
    -   `getPerformanceCategory`: Returns a performance category for a performance value (reps, time, etc.).

## 4. UI and Styling

### 4.1. Neumorphic Design

The app uses a neumorphic design style, achieved through two main components:

-   **`NeumorphicInset`**: Creates a "pressed-in" effect using inner shadows.
-   **`NeumorphicOutset`**: Creates a "raised" effect using outer shadows.

Both components are customizable through `containerStyle` and `contentStyle` props.

### 4.2. Color Conventions

Scores are color-coded using a centralized system:

-   **`getScoreCategory`** (`@repo/utils/color-utils`): Determines the performance category.
-   **`useScoreColors`** (`@repo/ui/hooks`): Provides the colors based on the category.
    -   `excellent`: `theme.colors.ninetyPlus` (blue)
    -   `pass`: `theme.colors.success` (green)
    -   `fail`: `theme.colors.error` (red)

This system is used by the `ScoreDisplay`, `ProgressBar`, and on the `best-score` page.

### 4.3. Theming

The `shadowRadius` for the neumorphic effect is set to `5` for both light and dark themes in `packages/ui/src/theme.ts`.

## 5. Component Library (`packages/ui`)

### 5.1. Key Components

-   **`Icon`**: A wrapper around `@expo/vector-icons` for consistent icon usage.
-   **`IconRow`**: A flexible component for displaying icons and text, with an optional non-interactive mode.
-   **`SegmentedSelector`**: A custom segmented control with an optional non-interactive mode (`isTouchable={false}`).
-   **`ProgressBar`**: A progress bar with support for pass/fail modes and conditional neumorphic styling.
-   **`ScoreDisplay`**: Displays the total score and a breakdown of component scores.
-   **`NumberInput` / `TimeInput`**: Custom input components with conditional neumorphic styling.

## 6. Development Conventions

### 6.1. General

-   **Code Style**: Enforced by a shared ESLint configuration.
-   **TypeScript**: Uses a shared TypeScript configuration.
-   **Code Reuse**: Maximize code reuse by creating shared components and utilities in `packages`.
-   **Focus**: Current development is focused on the mobile application.
-   **Documentation**: Keep this `GEMINI.md` file updated.

### 6.2. Component Design

-   **Separation of Concerns**: Components should be self-contained and not impose layout styles on their children. Use `containerStyle` and `contentStyle` props for layout adjustments.
