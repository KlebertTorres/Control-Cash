import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View, } from "react-native";
import { InputField } from "@/src/components/InputField";
import { SimpleButton } from "@/src/components/SimpleButton";
import { ErrorText } from "@/src/components/ErrorText";
import { useAuth } from "@/src/hooks/useAuth"
import { useTheme } from "@/src/hooks/useTheme"
import { Login } from "@/src/services/authService"
import { validarLogin } from "@/src/utils/validar";
import { DarkMode, LightMode } from "@/src/styles/cores";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false);

  const [erros, setErros] = useState({
  email: false,
  senha: false,
  });

  const { darkMode } = useTheme();
  const Colors = darkMode? DarkMode: LightMode;

  const logar = async () => {
    try{
      const resposta = await Login(email, senha)

      if (resposta !== null){
        alert('Login bem sucedido! ')
        router.replace("/");
      }

    } catch(erro: any){
      console.log(erro)
      alert('Login falho: ' + erro.message)
    } finally {
      setLoading(false);
    }
  }

  async function validandoLogin() {
    if (loading) return false;

    const novosErros = validarLogin(email, senha);

    setErros(novosErros);

    const temErro = Object.values(novosErros).includes(true);

    if (temErro) return false;

    setLoading(true);
    console.log("Novo Login: ", email, senha);
    await logar();
    return true;
  }

  return (
    <View style={[styles.container, {backgroundColor: Colors.accentGreen}]}>
      <Text style={styles.emoji}>💸</Text>
      <Text style={styles.title}>Control Cash</Text>
      <Text style={styles.subtitle}>Mais dinheiro na sua mão</Text>
      <Text style={styles.login}>Login</Text>

      <InputField
        style={{width: "85%"}}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        erros={erros.email}
      />

      <ErrorText 
        text="O email é inválido." 
        erro={erros.email}
        padding="30"
      />  
      
      <InputField
        style={{width: "85%"}}
        placeholder="Senha"
        onChangeText={setSenha}
        secureTextEntry={true}
        value={senha}
        erros={erros.senha}
      />

      <ErrorText 
        text="A senha é inválida." 
        erro={erros.senha}
        padding="30"
      />  

      <SimpleButton
        onPress={() => validandoLogin()}
        text={loading ? "Carregando..." : "Entrar"}
        disabled={loading}
      />

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
  footer: {
    color: "#ccc",
    marginTop: 20,
  },
  link: {
    color: "#9FE3C3",
  },
});
