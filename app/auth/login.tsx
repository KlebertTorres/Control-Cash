import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, } from "react-native";
import { useAuth } from "@/src/hooks/useAuth"
import { useTheme } from "@/src/hooks/useTheme"
import { Login } from "@/src/services/authService"
import { DarkMode, LightMode } from "@/src/styles/cores";

export default function paginaLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const { setUser } = useAuth();

  const { darkMode } = useTheme();
  const Colors = darkMode? DarkMode: LightMode;

  const logar = async () => {
    try{
      const resposta = await Login(email, senha)

      if (resposta){
        router.replace('../(tabs)/home');
        
        setUser(resposta.user)
        alert('Login bem sucedido! ')
      } 

    } catch(erro: any){
      console.log(erro)
      alert('Login falho: ' + erro.message)
    }
  } 

  return (
    <View style={[styles.container, {backgroundColor: Colors.accentGreen}]}>
      <Text style={styles.emoji}>💸</Text>
      <Text style={styles.title}>Control Cash</Text>
      <Text style={styles.subtitle}>Mais dinheiro na sua mão</Text>
      <Text style={styles.login}>Login</Text>

      <TextInput
        placeholder="Usuário"
        placeholderTextColor="#333"
        style={[styles.input, {borderColor: Colors.darkest}]}
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#333"
        secureTextEntry
        style={[styles.input, {borderColor: Colors.darkest}]}
        onChangeText={setSenha}
        value={senha}
      />

      <Pressable style={[styles.button, {backgroundColor: Colors.deepGreen}]}
        onPress = {() => logar() }>
        <Text style={styles.buttonText}>Entrar</Text>
      </Pressable>

      <Text style={styles.footer}>
        Ainda não possui conta?{" "}
        <Text style={styles.link} onPress={() => router.push("./registro")}>
          Criar conta
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: "#b5cdbd",
    borderWidth: 2,
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
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
