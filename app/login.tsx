import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "../constants/colors";

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Text style={styles.emoji}>💸</Text>

      {/* Title */}
      <Text style={styles.title}>Control Cash</Text>
      <Text style={styles.subtitle}>Mais dinheiro na sua mão</Text>

      {/* Login label */}
      <Text style={styles.login}>Login</Text>

      {/* Inputs */}
      <TextInput
        placeholder="Usuário"
        placeholderTextColor="#333"
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#333"
        secureTextEntry
        style={styles.input}
      />

      {/* Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footer}>
        Ainda não possui conta?{' '}
        <Text style={styles.link} onPress={() => router.push("/register")}>Criar conta</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.accentGreen,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
    color: "#ddd",
    marginBottom: 20,
  },
  login: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 15,
  },
  input: {
    width: "85%",
    backgroundColor: Colors.lightGreen,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 8,
    color: "#000",
  },
  button: {
    backgroundColor: Colors.deepGreen,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    color: "#ccc",
    marginTop: 20,
  },
  link: {
    color: "#9FE3C3",
  },
});