import { Slot } from "expo-router";
import { QueryClient, QueryClientProvider, ThemeProvider } from "@repo/ui";
import DismissKeyboardView from "./components/DismissKeyboardView";

// Create a client
const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
