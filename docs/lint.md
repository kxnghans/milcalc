# Linting & Quality Manifest

The MilCalc monorepo adheres to a **Zero-Tolerance Quality Policy**.

## The Standard
*   **Target**: Zero Errors. Zero Warnings.
*   **Restriction**: Use of `--fix` is **strictly prohibited**.
*   **Action**: All violations must be manually reviewed and resolved.

## High-Stakes Type Safety (`no-explicit-any`)
Following mission-critical industry standards (Fintech/Military), `any` is treated as a **Production Blocker**.

| Risk | Rationale |
| :--- | :--- |
| **Logic Infection** | `any` bypasses the compiler, leading to silent `NaN` or math errors in pay calculations. |
| **Refactor Fragility** | Untyped code breaks "Find References" and "Rename" tools, causing hidden debt. |
| **Silent Crashes** | API changes won't be caught until runtime. Use `unknown` + Type Guards instead. |

## Design System Integrity
*   **No Inline Styles**: Adhere strictly to `@repo/ui` primitives.
*   **No Color Literals**: Use `ThemeContext` and `getAlphaColor`. Hardcoded hexes break Dark Mode.

## Active Configs
*   `base.js`: Strict TS + Auto-sorted Imports.
*   `react-native.js`: Design System enforcement.

## Maintenance Strategy (The Fix-and-Check Loop)

The codebase has achieved a **Zero Error/Zero Warning** state. Use this iterative workflow to maintain it:

### Step 1: Execute & Redirect
Run the validation suite non-interactively, passing the `CI` variable to suppress prompts, and redirect output to a temporary file:
```powershell
$env:CI='true'; pnpm lint > lint-results.txt 2>&1
```

### Step 2: Analyze & Iterate
Identify failures from the generated file. Apply targeted fixes and repeat Step 1 until the output confirms success:

### Step 3: Cleanup
Once all checks (Linting, Type-Checking, Testing, Building) pass, delete all temporary log files:
