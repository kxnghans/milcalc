# Mascot & UI Refinement Checklist

## 🎭 Mascot Refinements
- [x] **Phase 1: Mascot Rotation Logic**
    - [x] Update `pay-calculator.tsx` to randomly rotate between `PAY` and `PAY1` mascots for all help icons.
    - [x] Update `retirement-calculator.tsx`:
        - [x] Use `RETIREMENT` mascot for basic retirement tips.
        - [x] Use random `PAY`/`PAY1` mascot rotation specifically for **TSP** help.

## 🎨 Layout & Styling
- [x] **Phase 2: UI Consistency**
    - [x] Align "Retirement Age" help icon to the right (consistent with TSP).
    - [x] Fix "Retirement Age" `PillButton` text color to match the "Calculate TSP" button exactly in both states.
    - [x] Ensure button titles and styles are synchronized across both calculators.
- [x] **Phase 2.1: Layout Polish (Gap Fix)**
    - [x] Remove `marginTop: theme.spacing.s` from `retirementAgeContainer` in `StyleSheet`.
    - [x] Remove `marginBottom: theme.spacing.s` from "Calculate Retirement Age" container.
    - [x] Verify vertical alignment matches TSP section.

## 🚀 Splash Screen Optimization
- [x] **Phase 2.2: Conditional Display**
    - [x] Implement SQLite splash history tracking in `index.tsx`.
    - [x] Add redirection logic for non-splash conditions (Skip if not first launch or season change day).
    - [x] Add `isCheckingHistory` guard to prevent flicker.


## ⚖️ WHtR & Best Score Integration
- [x] **Phase 4: Hook Re-architecture**
    - [x] Update `useBestScoreState` hook signature to accept `calculatedWhtr`.
    - [x] Remove redundant string-based `whtr` state and debouncing.
- [x] **Phase 5: UI Connection**
    - [x] Pass `calculatedWhtr` from `useDemographicsState` to `useBestScoreState` in `best-score.tsx`.
- [x] **Phase 6: Logic Validation**
    - [x] Ensure `isWhtrExempt` is correctly handled.
    - [x] Verify composite score calculation includes WHtR points (max 100).
    - [x] Fix `ReferenceError` for missing state (`shuttles`, `debouncedWalkMinutes`).

## ✅ Final Verification
- [x] **Phase 7: Build & Test**
    - [x] Run `pnpm build` to verify integrity.

## 📊 PT Calculator Progress Bar Visibility Refinement
- [x] **Phase 1: Input & Component Infrastructure**
    - [x] Update `InsetTextInput.tsx` to forward `onFocus` prop.
    - [x] Update `NumberInput.tsx` to forward `onFocus` prop.
    - [x] Update `TimeInput.tsx` to accept and forward `onFocus` prop.
    - [x] Update `Demographics.tsx`, `StrengthComponent.tsx`, `CoreComponent.tsx`, `CardioComponent.tsx` to accept `onFocus` prop.
- [x] **Phase 2: Screen State & Logic**
    - [x] Implement `showProgress` state in `pt-calculator.tsx`.
    - [x] Implement `isPrepopulated` state to track initial profile status.
    - [x] Implement `useFocusEffect` to reset `showProgress` on screen change.
    - [x] Implement logic to show progress bars if age is populated (non-profile case).
    - [x] Implement logic to show progress bars if an exercise input is focused or populated (profile case).
- [x] Pass `showProgress` and `onFocus` to all calculator sub-components.
- [x] **Phase 4: Demographics UI Cleanup**
    - [x] Remove `ProgressBar` and `NeumorphicOutset` from `Demographics.tsx`.
    - [x] Clean up unused props (`showProgressBars`, `minMax`, `score`) and styles in `Demographics.tsx`.
    - [x] Update `pt-calculator.tsx` to stop passing progress props to `Demographics`.
- [x] **Phase 5: Final Validation & Build**
    - [x] Verify persistence while on screen and reset on navigation.
    - [x] Run `pnpm build` to ensure no regressions.

## 🔢 Input Validation & Haptic Feedback Refinement
- [x] **Phase 1: Progress Bar Visibility Context**
    - [x] Update `pt-calculator.tsx` to distinguish between exercise and demographics focus.
    - [x] Update `Demographics.tsx` to stop passing `onFocus` to WHtR fields (Waist, Height).
- [x] **Phase 2: Core Validation Hooks**
    - [x] Update `useTimeInput.ts` to include character-level validation for seconds < 60 and trigger `expo-haptics`.
    - [x] Enhance `useNumericInput.ts` to support optional validation rules and haptic feedback on rejection.
- [x] **Phase 3: Demographic Validations**
    - [x] Implement specific height validation in `useDemographicsState.ts`:
        - [x] Feet: limit to 1-7.
        - [x] Inches (FT/IN mode): limit to < 12.
        - [x] Trigger haptics on invalid entry.
- [x] **Phase 4: Verification**
    - [x] Run `pnpm lint`.
    - [x] Run `pnpm check-types`.
    - [x] Run `pnpm build`.

## 🧹 useRetirementCalculatorState Refactor
- [x] **Phase 1: Code Cleanup**
    - [x] Remove duplicate `disabilityPercentageItems` memoization.
    - [x] Remove duplicate `disabilityPickerData` memoization.
    - [x] Remove duplicate `isTspCalculatorVisible` effect.
    - [x] Remove duplicate `mhaDisplayName` memoization.
    - [x] Remove duplicate `disabilityDisplayName` memoization.
    - [x] Remove duplicate `handleMhaChange` function.
    - [x] Remove duplicate `handleDisabilityChange` function.
    - [x] Remove duplicate `percentageItems` list.
    - [x] Remove duplicate `statusItems` memoization.
- [x] **Phase 2: Validation**
    - [x] Run `pnpm lint` to ensure no errors.
    - [x] Run `pnpm build` to ensure no build regressions.

## ⚡ usePayCalculatorState Refactor
- [x] **Phase 1: Performance Refactor**
    - [x] Remove `useState` for `calculatedTaxes`, `paySource`, and `vaDisabilityPay` in `usePayCalculatorState`.
    - [x] Replace `useEffect` that calls `calculateAll` with a synchronous `useMemo`.
    - [x] Remove `setPaySource` and related state resets from `resetState` function.
- [x] **Phase 2: Validation**
    - [x] Run `pnpm lint --fix` and `pnpm lint` to ensure no errors.
    - [x] Run `pnpm build` to ensure no build regressions.

## ⚡ useBestScoreState Refactor
- [x] **Phase 1: Query Extraction**
    - [x] Import `useQuery` from `@tanstack/react-query` in `useBestScoreState.ts`.
    - [x] Convert `fetchStandards` in `useEffect` into a `useQuery` hook to load PT standards based solely on age and gender.
- [x] **Phase 2: Calculation Memoization**
    - [x] Remove `useState` for `scores` and `bestScore`.
    - [x] Use `useMemo` to synchronously derive `scores` and `bestScore` based strictly on API `ptData` and active input properties.
- [x] **Phase 3: Validation**
    - [x] Run `pnpm lint` to verify dependencies.
    - [x] Run `pnpm build` to ensure no build regressions.

## ⚡ usePtCalculatorState Refactor
- [x] **Phase 1: Performance Refactor**
    - [x] Remove `useState` for `score` in `usePtCalculatorState`.
    - [x] Replace `useEffect` that calls `calculatePtScore` and `setScore` with a synchronous `useMemo`.
    - [x] Ensure `isLoading` fallback logic is maintained accurately inside `useMemo`.
- [x] **Phase 2: Validation**
    - [x] Run `pnpm lint` to ensure no errors.
    - [x] Run `pnpm build` to ensure no build regressions.

## 🧹 Retirement Calculator UI Cleanup & Fix
- [x] **Phase 1: Prop & Hook Alignment**
    - [x] Add `qualifyingDeploymentDays` to `RetirementDemographicsProps`.
    - [x] Move `servicePoints` and `goodYears` from `RetirementAgeProps` to `RetirementDemographicsProps`.
    - [x] Update `useRetirementCalculatorState.ts` to ensure all fields are correctly exported.
- [x] **Phase 2: UI Consolidation**
    - [x] Refactor `RetirementDemographics.tsx`:
        - [x] Add `Qualifying Deployment Days` input (Reserve/Guard only).
        - [x] Add `Service Points` and `Good Years` inputs.
    - [x] Refactor `RetirementAge.tsx`:
        - [x] Remove `Service Points` and `Good Years`.
        - [x] Ensure Retirement Age display is clear and distinct.
- [x] **Phase 3: Layout Polish & Neumorphic Audit**
    - [x] Standardize row/field spacing across retirement sub-components.
    - [x] Audit Neumorphic constraints for all retirement inputs.
- [x] **Phase 4: Verification & Haptics**
    - [x] Implement haptic feedback for new retirement inputs.
    - [x] Run `pnpm lint` and `pnpm build`.

## 🐛 Retirement Screen Layout Regression Fix

- [x] **Phase 1: Fix `RetirementDemographics.tsx` Layout**
    - [x] Remove `flexDirection: "row"` from `fieldRow` (revert to vertical block).
    - [x] Fix Years of Service — label above, full-width `NumberInput` below.
    - [x] Fix Filing Status — label above, full-width `SegmentedSelector` below.
    - [x] Fix MHA — label above, full-width `TwoColumnPicker` below.
    - [x] Fix VA Disability — label above, full-width `TwoColumnPicker` below.
    - [x] Fix Service Points / Good Years / Qualifying Deployment Days — vertical stack.
    - [x] Wrap `StyleSheet.create` in `useMemo`.
- [x] **Phase 2: Fix `RetirementTsp.tsx` Layout**
    - [x] Split TSP row into: Row 1 (label + Roth/Traditional toggle), Row 2 (full-width input + pill).
    - [x] Ensure `CurrencyInput` and "Calculate TSP" pill button are visible.
    - [x] Fix `fieldRow` style to not crush child elements.
    - [x] Wrap `StyleSheet.create` in `useMemo`.
- [x] **Phase 3: Verify `RetirementAge.tsx`**
    - [x] Confirm no changes needed — `flexDirection: row` is intentional here.
- [x] **Phase 4: Lint & Build Verification**
    - [x] Run `pnpm lint` — mobile: 0 errors.
    - [x] Run `pnpm build` — iOS/Android bundles exported. TypeScript: 0 errors.

## 🔍 Retirement Help & Layout Audit (Additional Fixes)
- [x] **Help Content Key Audit**
    - [x] Confirmed `getHelpContentFromSource` queries `content_key` column for retirement.
    - [x] Fixed `Qualifying Deployment Days` contentKey from `"Retirement Age"` → `"Qualifying Deployment Days"`.
    - [x] Confirmed `TSP`, `High-3`, `Service Points`, `Good Years`, `Retirement Age` are valid keys.
- [x] **RetirementAge Layout Fix**
    - [x] Separated header row (label+help left, pill button right) from calculated age display.
    - [x] Age result now shown below header row, right-aligned in primary color.
    - [x] Wrapped `StyleSheet.create` in `useMemo`.
- [x] **Props Cleanup**
    - [x] Removed `showServicePoints` / `showGoodYears` from `RetirementDemographicsProps` (component now uses `component` value directly).
    - [x] Removed from screen destructuring and JSX props.
