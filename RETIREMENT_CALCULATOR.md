# Retirement Calculator Implementation

This document describes the implementation of the Retirement Calculator feature in MilCalc.

## Overview

The Retirement Calculator allows users to estimate their military retirement pay based on their retirement plan, years of service, and other factors.

## File Structure

The implementation is spread across several files in the monorepo:

-   `apps/mobile/app/(tabs)/retirement-calculator.tsx`: The main screen component for the Retirement Calculator in the mobile app.
-   `packages/ui/src/hooks/useRetirementCalculatorState.ts`: A custom hook that manages the state and business logic for the Retirement Calculator.
-   `packages/utils/src/retirement-calculator.ts`: A set of pure functions that perform the actual retirement pay calculations.
-   `packages/ui/src/components/PayDisplay.tsx`: A component that displays the retirement pay summary.

## Architectural Choices

### Separation of Concerns

As with our other calculators, we've separated the UI, state management, and calculation logic. This makes the code more modular, testable, and easier to maintain.

## State Management

The state of the Retirement Calculator is managed by the `useRetirementCalculatorState` hook. This hook is responsible for:

-   Managing the user's input for retirement plan, years of service, etc.
-   Calculating the estimated retirement pay, including pension, disability income, and TSP.

## Calculation Logic

The core calculation logic is located in `packages/utils/src/retirement-calculator.ts`.

### Pension Calculation

-   **High-3 System**: For members under the High-3 system, the pension is calculated as 2.5% of their High-3 average basic pay for each year of service.
-   **Blended Retirement System (BRS)**: For members under BRS, the multiplier is 2.0% per year of service.
-   **High-3 Average**: The "High-3" average is the average of the member's highest 36 months of basic pay. For simplicity, our calculator uses the average of the last three years of service as an estimate.
-   **Reserve/Guard**: For reservists, the pension is calculated based on points. We convert points into "equivalent years" of service (points / 360) to calculate the pension.

### TSP Calculation

The Thrift Savings Plan (TSP) is a key component of retirement savings. Our calculator provides two ways to estimate TSP funds:

1.  **Manual Entry**: Users can enter their estimated final TSP balance directly.
2.  **TSP Calculator**: For a more detailed estimate, users can use our TSP calculator, which projects the future value based on:
    -   **Contributions**: The user's own contributions (as a percentage of their salary).
    -   **Employer Matching (BRS only)**: For BRS members, the calculator includes the 1% automatic government contribution and up to 4% matching contributions.
    -   **Rate of Return**: The calculator defaults to an 8% annual rate of return. This is a common historical average for long-term stock market investments. However, this is just an estimate, and users can adjust this value to see how different market conditions might affect their savings.

### TSP Withdrawal

The calculator estimates the total value of your TSP at retirement. A common rule of thumb for withdrawals is the "4% rule," which suggests that you can safely withdraw 4% of your initial retirement balance each year, adjusted for inflation, without depleting your funds for at least 30 years. For example, if your TSP balance is $500,000, a 4% withdrawal rate would provide $20,000 in the first year of retirement.

### Disability Income

The calculator can also include VA disability pay. This is based on the user's disability rating and dependent status, with the data fetched from our Supabase backend.

### Taxes

The calculator also estimates federal and state taxes on the taxable portion of the retirement income. Disability income is not taxed.

## Retirement Pay Summary Display

## Contextual Help System

To improve clarity, the Retirement Calculator now features a comprehensive contextual help system.

-   **Pay Display Summary**: A help icon in the top-right of the `PayDisplay` component opens a modal explaining the retirement pay summary in detail. This includes context on how the pension is calculated, how it relates to the Thrift Savings Plan (TSP), and its applicability to Active Guard Reserve (AGR) members.

-   **Label-Specific Help**: Various input fields (e.g., "Years of Service", "Service Points") have help icons that open a modal providing detailed explanations of that specific term or calculation. All help content is fetched from the `retirement_help_details` table in Supabase and rendered with markdown formatting for readability.

The retirement pay summary is displayed using the `PayDisplay.tsx` component. This component receives the calculated retirement pay data from the `useRetirementCalculatorState` hook and renders it in a user-friendly format.
