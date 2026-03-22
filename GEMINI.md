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
2.  **Logic Domain (`@repo/utils`)**: Pure math and data-fetching definitions. This package is the "Single Source of Truth" for military standards. Features a sophisticated **Range-Based Performance Parser** (`parsePerformanceRange`) that handles ranges, inequalities, and health risk category mapping.
3.  **Delivery Domain (`apps/mobile`)**: Composition of UI primitives and routing. Screens should be thin wrappers around state hooks.

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
- [x] Background Metadata Sync engine deployed.
- [x] iOS/Android standardization to `dev.milcalc.mobile`.
- [x] Context-Driven UI pattern (Global Overlays) established.
- [x] Advanced PT Performance Parsing & Health Risk Tracking implemented.
- [x] Hybrid Seeding (Offline First-Launch) logic implemented using `seed-data.json`.
- [x] Integrated 2025 PT standards into simplified Supabase schema (4-table model).

## 🚀 Active To-Do

- [ ] Conduct physical device performance audit (React 19 / New Architecture).
- [ ] Configure Maestro E2E test suite for Golden Path validation.
- [ ] Implement UI fallback logic for missing Cardio Risk Categories.
- [ ] Finalize RLS security policies in Supabase production.