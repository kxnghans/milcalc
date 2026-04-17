# MilCalc: Execution & Context Tracker

## Summary of Completed Milestones
*   **Monorepo Foundation**: Established Turborepo/pnpm structure with strict workspace boundaries (`@repo/ui`, `@repo/utils`, `apps/mobile`).
*   **Core Logic Unification**: Migrated PT scoring, Pay, and Tax calculations into side-effect-free utilities in `@repo/utils` with 180+ exhaustive tests.
*   **Neumorphic Design System**: Established a comprehensive Soft-UI kit in `@repo/ui` with standardized theme-aware primitives and depth hierarchies.
*   **Hybrid Persistence Engine**: Implemented `PersistenceProvider` using `expo-sqlite` and TanStack Query for a robust, offline-first "Smart Cache" system.
*   **Context-Driven UI**: Centralized global overlays (Help, Documents, Bug Reports) into a memoized `OverlayContext` for consistent UX and lean screens.
*   **Statutory Accuracy Refinement**: Integrated 2025 PT standards and 2026 BAH rates with support for BRS, TSP, CRDP offsets, and Senior Officer pay caps.
*   **Performance Optimization**: Refactored PT scoring logic to use pre-parsed numeric ranges, eliminating real-time string manipulation.
*   **Security & RLS Hardening**: Verified Row-Level Security on Supabase `bug_reports` and enforced restricted `anon` key scoping for client-side API calls.
*   **Input & Keyboard UX**: Refactored complex input screens with `KeyboardAwareScrollView` and auto-collapsing sections to maintain field visibility.
*   **Standardized Bootstrap**: Isolated app-level initialization, data seeding, and background sync logic into the `useAppBootstrap` hook.
*   **WHtR Scoring Integration**: Integrated `getWhtrScore` with `toFixed(2)` rounding guards and updated RPCs for 'Both' gender standards.

---

## Active Roadmap: To-Do Items

### Phase 1: Quality Assurance & Performance
- [ ] **Physical Device Audit**: Conduct performance profiling on React 19 / Bridgeless architecture (Android/iOS).
- [ ] **Expand E2E Validation**: Build out full Maestro suites for Pay and Retirement "Golden Paths" (beyond `pt_flow.yaml`).
- [x] **UI Fallback States**: Implement error/empty states for missing cardio risk categories in performance reports.
- [x] **TypeScript Stability Pass**: Final cleanup of unused imports and corrected profile save types across all calculator screens.

### Phase 2: DevOps & Automation
- [ ] **CI/CD Pipeline**: Automate linting, type-checking, and unit tests for all packages via GitHub Actions.
- [ ] **Automated Standards Validation**: Integrate `validate-standards.ts` into the CI pipeline to catch CSV drift vs. DAFMAN 36-2905.
- [ ] **EAS Build Strategy**: Configure profiles for internal testing and production App Store/Google Play submissions.

### Phase 3: Product Refinement
- [ ] **Dynamic Help Expansion**: Complete the help documentation for "Advanced Pay" scenarios (Disability, CRDP, and Reserve points).
- [ ] **Smart Cache TTL Tuning**: Refine background sync intervals based on data volatility (e.g., annual pay raises vs. static PT standards).
- [ ] **Accessibility Audit**: Verify WCAG contrast ratios and touch target sizes for Neumorphic components in both light and dark modes.
