import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../constants/colors";

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat</Text>
      <Text style={styles.message}>Funcionalidade em desenvolvimento</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    color: "#000",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: "#666",
  },
});
