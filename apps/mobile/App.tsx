import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "@repo/ui/card";

export default function App() {
  return (
    <View style={styles.container}>
      <Card>
        <Text>Hello from Mobile!</Text>
      </Card>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});