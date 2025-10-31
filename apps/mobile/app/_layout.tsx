import { Slot } from "expo-router";
import { ThemeProvider } from "@repo/ui";
import DismissKeyboardView from "./components/DismissKeyboardView"; // Import your component

export default function Layout() {
  return (
    <ThemeProvider>
      <DismissKeyboardView>
        <Slot />
      </DismissKeyboardView>
    </ThemeProvider>
  );
}
