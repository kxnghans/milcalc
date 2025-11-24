# PT Calculator and Best Score Implementation

This document describes the implementation of the PT Calculator and Best Score features in MilCalc.

## Overview

The PT Calculator allows users to calculate their Physical Fitness Test score based on their age, gender, and performance in various exercises. The Best Score feature allows users to track their personal bests for each component of the PT test.

## File Structure

The implementation is spread across several files in the monorepo:

-   `apps/mobile/app/(tabs)/pt-calculator.tsx`: The main screen component for the PT Calculator in the mobile app.
-   `apps/mobile/app/(tabs)/best-score.tsx`: The main screen component for the Best Score feature in the mobile app.
-   `packages/ui/src/hooks/usePtCalculatorState.ts`: A custom hook that manages the state and business logic for the PT Calculator.
-   `packages/ui/src/hooks/useBestScoreState.ts`: A custom hook that manages the state and business logic for the Best Score feature.
-   `packages/utils/src/pt-calculator.ts`: A set of pure functions that perform the actual PT score calculations.
-   `packages/utils/src/pt-supabase-api.ts`: Functions for fetching PT standards and other data from the Supabase backend.

## Architectural Choices

We made a few key architectural choices to ensure the calculator is reliable, easy to maintain, and provides a good user experience.

### Separation of Concerns

We intentionally separated the code into three distinct layers:

1.  **UI Components (`pt-calculator.tsx`, `best-score.tsx`):** These files are only responsible for displaying the user interface and capturing user input. They don't contain any business logic.
2.  **State Management (`usePtCalculatorState.ts`, `useBestScoreState.ts`):** These custom hooks act as the "brain" of the feature. They fetch data, manage the state of the calculator, and handle user interactions.
3.  **Calculation Logic (`pt-calculator.ts`):** This file contains pure functions that perform the calculations. These functions are completely independent of the UI and state management, which makes them easy to test and reuse.

This separation makes the code easier to understand, test, and debug. For example, if there is a bug in the PT score calculation, we know to look in `pt-calculator.ts` without having to worry about the UI or state management code.

### Debouncing User Input

In the `usePtCalculatorState` hook, we use a technique called "debouncing" on the user's input. This means that we wait for the user to stop typing for a short period of time before we recalculate the score. This prevents the app from recalculating the score on every single keystroke, which would be inefficient and could make the app feel sluggish.

### Loading Indicator Timer

We also use a 500ms timer for the loading indicator. This means that the loading indicator will only appear if the data is taking longer than 500ms to load. This prevents the loading indicator from flashing on the screen for very short periods of time, which can be visually jarring for the user.

## State Management

### PT Calculator

The state of the PT Calculator is managed by the `usePtCalculatorState` hook. This hook is responsible for:

-   Fetching all necessary data (PT standards, walk standards, altitude adjustments) from Supabase when the component mounts or when user demographics (age, gender) change.
-   Managing the user's input for each exercise.
-   Debouncing user inputs to prevent excessive API calls and recalculations while the user is typing.
-   Calculating the total PT score and the score for each individual component.
-   Managing a loading state (`isLoading`) which is controlled by a 500ms timer to prevent the loading indicator from flashing on fast network responses.

### Best Score

The state of the Best Score feature is managed by the `useBestScoreState` hook. This hook is responsible for:

-   Fetching the user's best scores from local storage.
-   Providing functions for updating the best scores.
-   Calculating the total best score.

## Calculation Logic

The core calculation logic is located in `packages/utils/src/pt-calculator.ts`. The functions in this file are pure functions, meaning they do not have any side effects and their output is solely determined by their input. This makes them easy to test and reuse.

### `calculatePtScore`

This is the main function that calculates the total PT score. It takes user inputs, PT standards, walk standards, and altitude adjustments as parameters.

The function works as follows:

1.  It initializes a `totalScore` variable to 0.
2.  For each exercise component (strength, core, and cardio), it calls the `getScoreForExercise` function to get the score for that component.
3.  It adds the component scores to the `totalScore`.
4.  If the cardio component is the walk, it calls the `checkWalkPass` function to determine if the user passed the walk.
5.  Finally, it returns an object containing the total score and the scores for each component.

### `getScoreForExercise`

This function calculates the score for a single exercise. It takes the standards data and the user's performance as parameters.

The function works as follows:

1.  It finds the appropriate row in the standards data for the user's performance.
2.  It returns the corresponding score from that row.
3.  The function handles parsing of the performance values, which may contain non-numeric characters.

### `checkWalkPass`

This function determines the pass/fail status for the walk component. It takes the walk standards, altitude adjustments, and the user's performance as parameters.

The function works as follows:

1.  It adjusts the user's walk time based on the altitude.
2.  It compares the adjusted walk time to the pass/fail threshold in the walk standards.
3.  It returns `true` if the user passed and `false` otherwise.

## Data Fetching

All data for the PT calculator is fetched from the Supabase backend via functions in `packages/utils/src/pt-supabase-api.ts`.

-   `getPtStandards`: Fetches scoring standards by querying and joining data from three tables: `pt_age_sex_groups`, `pt_muscular_fitness_standards`, and `pt_cardio_respiratory_standards`. It then transforms this data into a consistent format for the calculation functions.
-   `getWalkStandards`: Fetches standards for the 2km walk from the `walk_standards` table.
-   `getAltitudeAdjustments`: Fetches altitude adjustment data from `run_altitude_adjustments`, `walk_altitude_adjustments`, or `hamr_altitude_adjustments` depending on the exercise.

## Data Storage

The user's best scores are stored in the local storage of the device using Expo's `AsyncStorage`. This allows the data to persist between app launches.

## Contextual Help

The PT Calculator uses the application's central `DetailModal` component to provide detailed information and instructions for each exercise and for features like Altitude Adjustments. This content is fetched from the `help_details` table in Supabase.
