import { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

export function Card({ children }: { children: ReactNode }): JSX.Element {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
});
