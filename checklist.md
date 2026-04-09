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
