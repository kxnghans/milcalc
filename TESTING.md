# PT Calculator Testing Requirements

This document outlines the testing requirements for the PT score calculator and best score functionality.

## 1. Unit Tests for `pt-calculator.ts`

A comprehensive suite of unit tests should be created for the `packages/utils/src/pt-calculator.ts` file. The tests should cover all functions and all possible scenarios.

### 1.1. `getAgeGroup`

- Test with various ages and genders to ensure the correct age group is returned.
- Test edge cases, such as the minimum and maximum age for each group.
- Test with invalid inputs (e.g., negative age, invalid gender).

### 1.2. `getCardioScore`

- Test for both `run` and `shuttles` components.
- Test with performance values that fall into each scoring bracket.
- Test with performance values that are on the edge of the brackets.
- Test with minimum and maximum possible performance values.
- Test with zero and invalid performance values.

### 1.3. `getMuscularFitnessScore`

- Test for all muscular fitness components: `push_ups_1min`, `hand_release_pushups_2min`, `sit_ups_1min`, `cross_leg_reverse_crunch_2min`.
- Test with rep counts that fall into each scoring bracket.
- Test with rep counts that are on the edge of the brackets.
- Test with minimum and maximum possible rep counts.
- Test with zero and invalid rep counts.

### 1.4. `getPlankScore`

- Test with plank times that fall into each scoring bracket.
- Test with plank times that are on the edge of the brackets.
- Test with minimum and maximum possible plank times.
- Test with zero and invalid plank times.

### 1.5. `getScoreForExercise`

- Test all exercise components.
- Test with different age, gender, and performance combinations.
- **Altitude Adjustments:**
    - Test with each altitude group (`group1`, `group2`, `group3`, `group4`).
    - For the `run` component, test with various run times to ensure the correct time correction is applied.
    - For the `shuttles` component, ensure the correct number of shuttles is added.

### 1.6. `checkWalkPass`

- Test with different age, gender, and walk times.
- Test with times that are faster than, equal to, and slower than the required time.
- **Altitude Adjustments:**
    - Test with each altitude group and ensure the correct maximum time is used for pass/fail evaluation.

### 1.7. `calculatePtScore`

- Test with a variety of complete data sets (age, gender, all components).
- Test with different component combinations (e.g., run + push-ups + sit-ups, shuttles + hand-release push-ups + plank).
- **Exemptions:**
    - Test the scenario where the cardio component is `walk`.
    - If `walkPassed` is `pass`, ensure the total score is calculated correctly based on the strength and core components only (i.e., `((pushupScore + coreScore) / 40) * 100`).
    - If `walkPassed` is `fail`, ensure the `isPass` is `false`.
- Test for passing and failing scores.
- Test with minimum scores for each component to ensure `isPass` is `true`.
- Test with scores below the minimum for one or more components to ensure `isPass` is `false`.
- Test with invalid and incomplete input data.

### 1.8. `calculateBestScore`

- Test with a set of scores for all exercises.
- Ensure the function correctly identifies the maximum score from each category (Strength, Core, Cardio) and sums them up.
- Test with zero and negative scores.

### 1.9. `getMinMaxValues`, `getCardioMinMaxValues`, `getPerformanceForScore`

- Test these utility functions to ensure they return the correct values based on the `pt-data.json` file.

## 2. End-to-End (E2E) Testing

E2E tests should be created to simulate user interaction with the PT Calculator and Best Score pages in the mobile app.

### 2.1. PT Calculator Page (`apps/mobile/app/(tabs)/pt-calculator.tsx`)

- Enter user data (age, gender) and performance data for all components.
- Verify that the calculated scores (individual and total) are displayed correctly.
- Verify that the pass/fail status is correct.
- Test the functionality of the altitude selection and ensure the scores are adjusted accordingly.
- Test the walk component and verify the pass/fail/n/a display.

### 2.2. Best Score Page (`apps/mobile/app/(tabs)/best-score.tsx`)

- Enter performance data for various exercises.
- Verify that the score for each exercise is calculated and displayed correctly.
- Verify that the total best score is calculated correctly by summing the highest scores from each category.
- Test the altitude selection and ensure the scores are adjusted accordingly.

## 3. Data Validation

- Create a test script to validate the integrity of the `packages/ui/src/pt_data/pt-data.json`, `packages/ui/src/pt_data/walk-standards.json`, and `packages/ui/src/pt_data/altitude-adjustments.json` files.
- The script should check for:
    - Correct data types.
    - Consistent structure.
    - No missing data.
    - Logical consistency (e.g., score brackets should not overlap).

## 4. Input Validation

- Scores should only be calculated and updated when all required input arguments for a given component are present.
- For example, a push-up score requires age, gender, push-up component selection, and the number of push-ups. The score should not be calculated if any of these inputs are missing.
- An altitude adjustment for the HAMR component only requires the altitude selection.
- Test cases should be written to verify that scores are not calculated with incomplete data.
