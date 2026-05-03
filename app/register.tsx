import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "../constants/colors";

export default function Register() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Cadastrar-se:</Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#4f6d5e"
      />
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        placeholderTextColor="#4f6d5e"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        placeholderTextColor="#4f6d5e"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        secureTextEntry
        placeholderTextColor="#4f6d5e"
      />

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallButton}>
          <Text style={styles.buttonText}>Criar Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: Colors.accentGreen,
    padding: 30,
    justifyContent: "center",
  },

  // Title
  title: {
    fontSize: 32,
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "400",
  },

  // Inputs
  input: {
    backgroundColor: Colors.lightGreen,
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },

  // Buttons
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  smallButton: {
    backgroundColor: Colors.deepGreen,
    paddingVertical: 12,
    borderRadius: 10,
    width: "47%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
