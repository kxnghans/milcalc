# MilCalc Feature Implementation Documentation

This document provides a comprehensive overview of the implementation details for the core calculators and features within the MilCalc application.

---

## 1. Pay Calculator Implementation

This section describes the implementation of the Pay Calculator feature in MilCalc.

### 1.1 Overview

The Pay Calculator allows users to calculate their estimated monthly and annual military pay based on their rank, years of service, and other factors.

### 1.2 File Structure

The implementation is spread across several files in the monorepo:

-   `apps/mobile/app/(tabs)/pay-calculator.tsx`: The main screen component for the Pay Calculator in the mobile app.
-   `packages/ui/src/hooks/usePayCalculatorState.ts`: A custom hook that manages the state and business logic for the Pay Calculator.
-   `packages/utils/src/pay-calculator.ts`: A set of pure functions that perform the actual pay calculations.
-   `packages/utils/src/pay-supabase-api.ts`: Functions for fetching pay data from the Supabase backend.
-   `packages/ui/src/components/PayDisplay.tsx`: A component that displays the pay summary.

### 1.3 Architectural Choices

#### Separation of Concerns
Similar to the PT Calculator, we have separated the code into UI, state management, and calculation layers. This makes the code easier to understand, test, and maintain.

#### Debouncing User Input
We use debouncing to prevent recalculating the pay on every keystroke, which makes the app more responsive.

### 1.4 State Management

The state of the Pay Calculator is managed by the `usePayCalculatorState` hook. This hook is responsible for:

-   Fetching all necessary data (pay tables, BAH rates, etc.) from Supabase when the component mounts or when user inputs change.
-   Managing the user's input for rank, years of service, etc.
-   Calculating the total pay and its components.

### 1.5 Calculation Logic

The core calculation logic is located in `packages/utils/src/pay-calculator.ts`. The main function is `calculatePay`.

#### `calculatePay`
This function calculates the user's total pay. It takes the user's rank, years of service, and other inputs as parameters.

The function works as follows:

1.  **Base Pay**: It looks up the user's base pay in the pay table based on their rank and years of service.
2.  **BAS (Basic Allowance for Subsistence)**: It adds the current BAS rate.
3.  **BAH (Basic Allowance for Housing)**: It looks up the BAH rate based on the user's rank and location.
4.  **Special Pays**: It adds any special pays that the user is entitled to.
5.  **Total Pay**: It sums up all the components to get the total monthly pay.
6.  **Annual Pay**: It multiplies the monthly pay by 12 to get the total annual pay.

#### Tax Calculations

-   **Taxable vs. Non-Taxable Income**: The calculator correctly distinguishes between taxable and non-taxable income. Base pay and most special pays are taxable, while allowances like BAH and BAS are not.
-   **FICA Taxes**: The Federal Insurance Contributions Act (FICA) tax is calculated at a fixed rate of 7.65%. This is a combination of the Social Security tax (6.2%) and the Medicare tax (1.45%).
-   **Federal and State Income Taxes**: The calculator fetches the latest federal and state tax brackets from our Supabase backend. It then uses the user's filing status (e.g., single, married filing jointly) and state of residence to determine the correct standard deduction and tax rates.

### 1.6 Pay Summary Display

The pay summary is displayed using the `PayDisplay.tsx` component. This component receives the calculated pay data from the `usePayCalculatorState` hook and renders it in a user-friendly format.

### 1.7 Recent Enhancements

Several new features have been added to improve the accuracy and user experience of the Pay Calculator.

#### 1. Component Selector
A **Component** selector has been added, allowing users to specify whether they are *Active Duty*, *Guard*, or *Reserve*. This choice affects the type of pay calculated:

-   **Active Duty**: Calculates standard monthly base pay.
-   **Guard/Reserve**: Calculates estimated **Drill Pay** for a standard drill period (typically 4 drills).

#### 2. VA Disability Pay Integration
The calculator now includes a **VA Disability** picker. When a disability rating is selected, the calculator will:

1.  Calculate the estimated military pay (Base Pay or Drill Pay).
2.  Fetch the corresponding tax-free VA Disability monthly payment.
3.  The main display will automatically show the **higher of the two values**, as a member cannot receive both simultaneously for the same period. The `paySource` in the `PayDisplay` component indicates which source is being shown (*Military* or *VA*).

#### 3. Contextual Help
A help icon has been added to the top-right corner of the `PayDisplay` summary. Tapping this icon opens a detailed modal that explains:

-   The difference between Annual and Monthly gross pay.
-   The meaning of the `paySource`.
-   How the Income and Deductions columns are derived.

This information is fetched from the `pay_help_details` table in Supabase.

### 1.8 Data Fetching

All data for the Pay Calculator is fetched from the Supabase backend via functions in `packages/utils/src/pay-supabase-api.ts`.

-   `getPayData`: Fetches the basic pay tables.
-   `getBahRates`: Fetches the BAH rates.
-   `getBasRate`: Fetches the BAS rate.
-   `getFederalTaxData` and `getStateTaxData`: Fetches the federal and state tax data.

---

## 2. PT Calculator and Best Score Implementation

This section describes the implementation of the PT Calculator and Best Score features in MilCalc.

### 2.1 Overview

The PT Calculator allows users to calculate their Physical Fitness Test score based on their age, gender, and performance in various exercises. The Best Score feature allows users to track their personal bests for each component of the PT test.

### 2.2 File Structure

The implementation is spread across several files in the monorepo:

-   `apps/mobile/app/(tabs)/pt-calculator.tsx`: The main screen component for the PT Calculator in the mobile app.
-   `apps/mobile/app/(tabs)/best-score.tsx`: The main screen component for the Best Score feature in the mobile app.
-   `packages/ui/src/hooks/usePtCalculatorState.ts`: A custom hook that manages the state and business logic for the PT Calculator.
-   `packages/ui/src/hooks/useBestScoreState.ts`: A custom hook that manages the state and business logic for the Best Score feature.
-   `packages/utils/src/pt-calculator.ts`: A set of pure functions that perform the actual PT score calculations.
-   `packages/utils/src/pt-supabase-api.ts`: Functions for fetching PT standards and other data from the Supabase backend.

### 2.3 Architectural Choices

We made a few key architectural choices to ensure the calculator is reliable, easy to maintain, and provides a good user experience.

#### Separation of Concerns
We intentionally separated the code into three distinct layers:

1.  **UI Components (`pt-calculator.tsx`, `best-score.tsx`):** These files are only responsible for displaying the user interface and capturing user input. They don't contain any business logic.
2.  **State Management (`usePtCalculatorState.ts`, `useBestScoreState.ts`):** These custom hooks act as the "brain" of the feature. They fetch data, manage the state of the calculator, and handle user interactions.
3.  **Calculation Logic (`pt-calculator.ts`):** This file contains pure functions that perform the calculations. These functions are completely independent of the UI and state management, which makes them easy to test and reuse.

#### Debouncing User Input
In the `usePtCalculatorState` hook, we use a technique called "debouncing" on the user's input. This means that we wait for the user to stop typing for a short period of time before we recalculate the score. This prevents the app from recalculating the score on every single keystroke, which would be inefficient and could make the app feel sluggish.

#### Loading Indicator Timer
We also use a 500ms timer for the loading indicator. This means that the loading indicator will only appear if the data is taking longer than 500ms to load. This prevents the loading indicator from flashing on the screen for very short periods of time, which can be visually jarring for the user.

### 2.4 State Management

#### PT Calculator
The state of the PT Calculator is managed by the `usePtCalculatorState` hook. This hook is responsible for:

-   Fetching all necessary data (PT standards, walk standards, altitude adjustments) from Supabase when the component mounts or when user demographics (age, gender) change.
-   Managing the user's input for each exercise.
-   Debouncing user inputs to prevent excessive API calls and recalculations while the user is typing.
-   Calculating the total PT score and the score for each individual component.
-   Managing a loading state (`isLoading`) which is controlled by a 500ms timer to prevent the loading indicator from flashing on fast network responses.

#### Best Score
The state of the Best Score feature is managed by the `useBestScoreState` hook. This hook is responsible for:

-   Fetching the user's best scores from local storage.
-   Providing functions for updating the best scores.
-   Calculating the total best score.

### 2.5 Calculation Logic

The core calculation logic is located in `packages/utils/src/pt-calculator.ts`. The functions in this file are pure functions, meaning they do not have any side effects and their output is solely determined by their input. This makes them easy to test and reuse.

#### `calculatePtScore`
This is the main function that calculates the total PT score. It takes user inputs, PT standards, walk standards, and altitude adjustments as parameters.

The function works as follows:

1.  It initializes a `totalScore` variable to 0.
2.  For each exercise component (strength, core, and cardio), it calls the `getScoreForExercise` function to get the score for that component.
3.  It adds the component scores to the `totalScore`.
4.  If the cardio component is the walk, it calls the `checkWalkPass` function to determine if the user passed the walk.
5.  Finally, it returns an object containing the total score and the scores for each component.

#### `getScoreForExercise`
This function calculates the score for a single exercise. It takes the standards data and the user's performance as parameters.

The function works as follows:

1.  It finds the appropriate row in the standards data for the user's performance.
2.  It returns the corresponding score from that row.
3.  The function handles parsing of the performance values, which may contain non-numeric characters.

#### `checkWalkPass`
This function determines the pass/fail status for the walk component. It takes the walk standards, altitude adjustments, and the user's performance as parameters.

The function works as follows:

1.  It adjusts the user's walk time based on the altitude.
2.  It compares the adjusted walk time to the pass/fail threshold in the walk standards.
3.  It returns `true` if the user passed and `false` otherwise.

### 2.6 Data Fetching

All data for the PT calculator is fetched from the Supabase backend via functions in `packages/utils/src/pt-supabase-api.ts`.

-   `getPtStandards`: Fetches scoring standards by querying and joining data from three tables: `pt_age_sex_groups`, `pt_muscular_fitness_standards`, and `pt_cardio_respiratory_standards`. It then transforms this data into a consistent format for the calculation functions.
-   `getWalkStandards`: Fetches standards for the 2km walk from the `walk_standards` table.
-   `getAltitudeAdjustments`: Fetches altitude adjustment data from `run_altitude_adjustments`, `walk_altitude_adjustments`, or `hamr_altitude_adjustments` depending on the exercise.

### 2.7 Real-time Calculation

The Best Score feature calculates potential scores in real-time as the user inputs their performance for different exercises. It provides an immediate overview of how individual achievements contribute to an overall PT score.

### 2.8 Contextual Help

The PT Calculator and Best Score features use the application's central `DetailModal` component to provide detailed information and instructions for each exercise and for features like Altitude Adjustments. This content is fetched from the `pt_help_details` and `best_score_help_details` tables in Supabase.

---

## 3. Retirement Calculator Implementation

This section describes the implementation of the Retirement Calculator feature in MilCalc.

### 3.1 Overview

The Retirement Calculator allows users to estimate their military retirement pay based on their retirement plan, years of service, and other factors.

### 3.2 File Structure

The implementation is spread across several files in the monorepo:

-   `apps/mobile/app/(tabs)/retirement-calculator.tsx`: The main screen component for the Retirement Calculator in the mobile app.
-   `packages/ui/src/hooks/useRetirementCalculatorState.ts`: A custom hook that manages the state and business logic for the Retirement Calculator.
-   `packages/utils/src/retirement-calculator.ts`: A set of pure functions that perform the actual retirement pay calculations.
-   `packages/ui/src/components/PayDisplay.tsx`: A component that displays the retirement pay summary.

### 3.3 Architectural Choices

#### Separation of Concerns
As with our other calculators, we've separated the UI, state management, and calculation logic. This makes the code more modular, testable, and easier to maintain.

### 3.4 State Management

The state of the Retirement Calculator is managed by the `useRetirementCalculatorState` hook. This hook is responsible for:

-   Managing the user's input for retirement plan, years of service, etc.
-   Calculating the estimated retirement pay, including pension, disability income, and TSP.

### 3.5 Calculation Logic

The core calculation logic is located in `packages/utils/src/retirement-calculator.ts`.

#### Pension Calculation

-   **High-3 System**: For members under the High-3 system, the pension is calculated as 2.5% of their High-3 average basic pay for each year of service.
-   **Blended Retirement System (BRS)**: For members under BRS, the multiplier is 2.0% per year of service.
-   **High-3 Average**: The "High-3" average is the average of the member's highest 36 months of basic pay. For simplicity, our calculator uses the average of the last three years of service as an estimate.
-   **Reserve/Guard**: For reservists, the pension is calculated based on points. We convert points into "equivalent years" of service (points / 360) to calculate the pension.

#### TSP Calculation

The Thrift Savings Plan (TSP) is a key component of retirement savings. Our calculator provides two ways to estimate TSP funds:

1.  **Manual Entry**: Users can enter their estimated final TSP balance directly.
2.  **TSP Calculator**: For a more detailed estimate, users can use our TSP calculator, which projects the future value based on:
    -   **Contributions**: The user's own contributions (as a percentage of their salary).
    -   **Employer Matching (BRS only)**: For BRS members, the calculator includes the 1% automatic government contribution and up to 4% matching contributions.
    -   **Rate of Return**: The calculator defaults to an 8% annual rate of return. This is a common historical average for long-term stock market investments. However, this is just an estimate, and users can adjust this value to see how different market conditions might affect their savings.

#### TSP Withdrawal

The calculator estimates the total value of your TSP at retirement. A common rule of thumb for withdrawals is the "4% rule," which suggests that you can safely withdraw 4% of your initial retirement balance each year, adjusted for inflation, without depleting your funds for at least 30 years. For example, if your TSP balance is $500,000, a 4% withdrawal rate would provide $20,000 in the first year of retirement.

#### Disability Income

The calculator can also include VA disability pay. This is based on the user's disability rating and dependent status, with the data fetched from our Supabase backend.

#### Taxes

The calculator also estimates federal and state taxes on the taxable portion of the retirement income. Disability income is not taxed.

### 3.6 Retirement Pay Summary Display

The retirement pay summary is displayed using the `PayDisplay.tsx` component. This component receives the calculated retirement pay data from the `useRetirementCalculatorState` hook and renders it in a user-friendly format.

### 3.7 Contextual Help System

To improve clarity, the Retirement Calculator now features a comprehensive contextual help system.

-   **Pay Display Summary**: A help icon in the top-right of the `PayDisplay` component opens a modal explaining the retirement pay summary in detail. This includes context on how the pension is calculated, how it relates to the Thrift Savings Plan (TSP), and its applicability to Active Guard Reserve (AGR) members.

-   **Label-Specific Help**: Various input fields (e.g., "Years of Service", "Service Points") have help icons that open a modal providing detailed explanations of that specific term or calculation. All help content is fetched from the `retirement_help_details` table in Supabase and rendered with markdown formatting for readability.
