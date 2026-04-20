import { Link } from "expo-router";
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>
        Control <Text style={{ color: "#1a2e26" }}>Cash</Text>
      </Text>
      <Text style={styles.subtitle}>Mais dinheiro na sua mão</Text>

      <Text style={styles.label}>Login</Text>
      <TextInput style={styles.input} placeholder="Usuário" />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Link href="/register" asChild>
        <TouchableOpacity>
          <Text style={styles.footerText}>
            Ainda não possui conta?{" "}
            <Text style={{ color: "#7ba892" }}>Criar conta</Text>
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d5a4c",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: { width: 100, height: 100, marginBottom: 10 },
  title: { fontSize: 32, color: "#fff", fontWeight: "bold" },
  subtitle: { color: "#fff", marginBottom: 40 },
  label: { fontSize: 24, color: "#fff", marginBottom: 20 },
  input: {
    backgroundColor: "#b5cdbd",
    width: "100%",
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#0b1d1a",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  footerText: { color: "#fff", marginTop: 30, fontSize: 12 },
});
