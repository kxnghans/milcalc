# MilCalc Execution Checklist

## ✅ Completed Milestones
*Historical context and stabilized features.*

- **Monorepo Architecture**: Turborepo, pnpm workspaces, and shared config packages (ESLint, TS) are fully operational.
- **Pure Logic Engines**: PT, Pay, and Retirement calculators in `@repo/utils` have 100% unit test coverage.
- **Neumorphic Design System**: Core primitives (`Card`, `ProgressBar`, `StyledInputs`) are stabilized in `@repo/ui`.
- **Persistent Smart Cache**: Integration of `expo-sqlite` and TanStack Query ensures the app functions in Airplane Mode.
- **Contextual Help CMS**: Markdown-enabled `DetailModal` is integrated across all primary screens.
- **Production Config**: Standardized `app.config.ts`, unified bundle IDs (`dev.milcalc.mobile`), and secure env injection.
- **Metadata Sync Engine**: Background invalidation logic using Supabase `sync_metadata` is deployed.
- **Retirement Age Logic**: Integration of qualifying deployment days (reduced age) and break-in-service logic is finalized.

---

## 🚀 Active To-Do
*Granular tasks for the current implementation phase.*

### 1. Hybrid Seeding (Offline First-Launch)
- [ ] Generate a comprehensive `seed-data.json` from the current Supabase production snapshot.
- [ ] Implement the `seed-data` hydration logic in `_layout.tsx` for empty-cache scenarios.
- [ ] Verify hydration speed on a physical low-end Android device.

### 2. Security & Integrity Audit
- [ ] Conduct a final review of Supabase RLS policies for `anon` role access.
- [ ] Verify that the `sync_metadata` PostgreSQL triggers are firing on all financial tables.
- [ ] Draft the Privacy Policy for the "About" screen (emphasizing local calculation).

### 3. Store Readiness & E2E
- [ ] Run `expo-optimize` on `3d_splash.png` to generate all adaptive icons.
- [ ] Script the Maestro "Golden Path" E2E tests for the PT and Pay calculators.
- [ ] Configure GitHub Actions to run the validation suite (`lint`, `check-types`, `test`) on every PR.

### 4. Polish & Interactive Physics
- [ ] Implement `react-native-haptic-feedback` on neumorphic button presses.
- [ ] Fine-tune the bezier easing for the `NeumorphicOutset` -> `NeumorphicInset` transition.
- [ ] Resolve minor layout overflow on small-screen devices (iPhone SE).