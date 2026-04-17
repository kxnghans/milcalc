/**
 * @file index.ts
 * @description This file serves as the main entry point for the `@repo/ui` package.
 * It exports all the shared components, theme configuration, icons, contexts, and hooks,
 * making them easily accessible to the mobile application.
 */

export * from "./assets";
export * from "./components";
export * from "./contexts/CalculatorStateContext";
export * from "./contexts/ThemeContext";
export * from "./hooks/useBestScoreState";
export * from "./hooks/useCardioState";
export * from "./hooks/useCoreState";
export * from "./hooks/useDebounce";
export * from "./hooks/useDemographicsState";
export * from "./hooks/useNumericInput";
export * from "./hooks/usePayCalculatorState";
export * from "./hooks/usePtCalculatorState";
export * from "./hooks/useRetirementCalculatorState";
export * from "./hooks/useScoreColors";
export * from "./hooks/useStrengthState";
export * from "./hooks/useTimeInput";
export * from "./icons";
export * from "./theme";
export { QueryClient, QueryClientProvider } from "@tanstack/react-query";
