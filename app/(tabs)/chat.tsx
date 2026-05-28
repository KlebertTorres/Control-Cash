import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/src/hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores";

export default function AgendaScreen() {

  const { darkMode } = useTheme();
  const Colors = darkMode? DarkMode: LightMode;

  return (
    <View style={[styles.container, {backgroundColor: Colors.lightGreen}]}>
      <Text style={styles.title}>Chat</Text>
        <Text style={styles.message}>Funcionalidade em desenvolvimento</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    color: "#000",
  },
    message: {
    fontSize: 16,
    color: "#666",
  }
});
