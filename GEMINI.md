# Gemini Project Context: MilCalc

This document defines the foundational mandates and operational boundaries for AI agents contributing to the MilCalc monorepo.

## 🛠 Tech Stack & Environment Mandates

*   **Package Manager**: `pnpm` (v10+). Never use `npm` or `yarn`.
*   **Monorepo**: Turborepo. All cross-package dependencies must use workspace protocols (e.g., `"@repo/utils": "workspace:*"`).
*   **Mobile Stack**: Expo SDK 54 (React Native 0.81), Expo Router, New Architecture (Bridgeless) enabled.
*   **State**: React Query (TanStack) v5 with `expo-sqlite` persistence.
*   **Logic**: Pure TypeScript in `packages/utils`. No side-effects in calculation engines.
*   **UI Style**: Neumorphism (Soft UI). Use `@repo/ui` primitives. Avoid hardcoded RGBA strings; use `getAlphaColor(hex, alpha)` from `ThemeContext`.

## 📋 Interaction & Execution Guidelines

*   **Surgical Edits**: When modifying logic in `packages/utils`, always check for corresponding tests in `__tests__`. A logic change without a test update is a failure.
*   **Type Safety**: Strict TypeScript is non-negotiable. Avoid `any`. If a Supabase type is missing, run the type generation tool or update `packages/utils/src/types.ts` manually with precision.
*   **Offline First**: Every new feature must be evaluated for its "Airplane Mode" behavior. If it requires data, ensure it is integrated into the "Smart Cache" (React Query + SQLite) and the `seed-data.json` hydration logic.
*   **Case Sensitivity**: Be vigilant with Supabase queries. Table and column names are often snake_case, while UI values may be PascalCase or camelCase. Transform data explicitly.
*   **Neumorphic Constraints**: Do not introduce generic "Material" or "Tailwind" styles. Adhere to the `NeumorphicOutset` and `NeumorphicInset` depth hierarchies.

## 🏗 Logical Domain Boundaries

1.  **UI Domain (`@repo/ui`)**: Stateless primitives and feature-level state hooks. No direct API calls; hooks must consume `@repo/utils` APIs.
2.  **Logic Domain (`@repo/utils`)**: Pure math and data-fetching definitions. This package is the "Single Source of Truth" for military standards. It consumes pre-parsed and sanitized data from the API layer.
3.  **API Layer (`@repo/utils/src/*-api.ts`)**: The bridge between Supabase and the client. Responsible for fetching, shaping, and **pre-parsing** raw data (e.g., converting performance strings to numeric ranges) before it enters the application's state.
4.  **Delivery Domain (`apps/mobile`)**: Composition of UI primitives and routing. Screens should be thin wrappers around state hooks.

### 🎨 Interaction & Layout Mandates
- **Context-Driven UI**: All interactive overlays (Help, Documents, Bug Reports) MUST be triggered via global `OverlayContext` hooks. Never declare local modal state (`isVisible`, `contentKey`) within screen files.
- **Structural Standardization**: Primary calculator screens MUST use the `MainCalculatorLayout` and `SmartIconRow` components. Inline `IconRow` configurations with manual theme/reset logic are prohibited.
- **Stability & Performance**: All context providers MUST memoize their value objects and functions (`useMemo`, `useCallback`). Inside components, `StyleSheet.create` MUST be moved outside the component body OR wrapped in `useMemo` if it depends on the `theme` to prevent "Maximum update depth exceeded" errors.

## 🚦 Operational Constraints

*   **Linting**: ESLint Zero-Tolerance. Run `pnpm lint` before finishing any task.
*   **Build Pipeline**: Use `turbo run build` to verify that cross-package dependencies are correctly resolved.
*   **Documentation**: If a change alters the "Core Loop" or data schema, update `PRD.md`, `milcalc.md`, and `backend.md` immediately.

---

## 📝 Historical Context (Milestones)

- [x] Monorepo scaffolded with Turborepo/pnpm.
- [x] Neumorphic UI library established in `@repo/ui`.
- [x] PT, Pay, and Retirement logic validated with 100% test coverage.
- [x] Persistent "Smart Cache" (SQLite) implemented for offline reliability.
- [x] Background Metadata Sync engine deployed with 24-hour TTL caching.
- [x] iOS/Android standardization to `dev.milcalc.mobile`.
- [x] Context-Driven UI pattern (Global Overlays) established.
- [x] Advanced PT Performance Parsing & Health Risk Tracking implemented.
- [x] **Performance Optimization**: PT scoring logic refactored to use pre-parsed numeric ranges, eliminating real-time string manipulation.
- [x] **Statutory Accuracy Refinement**: Implemented BRS tiered matching, monthly TSP compounding, CRDP offsets, Reserve point caps, and Senior Officer pay caps.
- [x] Hybrid Seeding (Offline First-Launch) logic implemented using `seed-data.json`.
- [x] Integrated 2025 PT standards and 2026 BAH rates into simplified Supabase schema (4-table model).
- [x] **Script Standardization**: Unified development workflow under `milcalc:*` namespace.
- [x] **Workspace Environment Audit**: Deep clean of build artifacts, caches (.turbo, .expo, .gradle), and log files completed to ensure environment parity.
- [x] **WHtR WHtR Scoring Integration**: `getWhtrScore` integrated into `calculatePtScore` with `toFixed(2)` rounding guard; RPC updated to include `gender='Both'` standards.
- [x] **Bug Report Keyboard UX**: `BugReportView` refactored with `KeyboardAwareScrollView` for reliable field visibility above the keyboard.
- [x] **PT Standards CSV Audit (2025/2026)**: All 6 CSV source tables audited against DAFMAN 36-2905 and PFRA charts; 180 exhaustive tests pass.
- [x] **Retirement Calculator Layout Refinement**: "Retirement Age" calculator relocated into the input section; `isPayDisplayExpanded` auto-collapses on keyboard to prevent scroll issues.
- [x] **Document Modal Fix**: `openDocument` flow audited; storage bucket paths and page navigation confirmed functional for both local and remote PDFs.
- [x] **TypeScript Stability Pass**: Profile data save types corrected in PT and Pay calculator state hooks; unused imports cleaned to satisfy strict linting.

## 🚀 Active To-Do

- [ ] Conduct physical device performance audit (React 19 / New Architecture).
- [ ] Configure Maestro E2E test suite for Golden Path validation.
- [ ] Implement UI fallback logic for missing Cardio Risk Categories.
- [ ] Extract shared `calculateFederalTax` / `calculateStateTax` into `packages/utils/src/tax-utils.ts` (DRY violation between `pay-calculator.ts` and `retirement-calculator.ts`).
- [x] Finalize RLS security policies in Supabase production.