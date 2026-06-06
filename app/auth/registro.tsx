import { ErrorText } from "@/src/components/ErrorText";
import { InputField } from "@/src/components/InputField";
import { SimpleButton } from "@/src/components/SimpleButton";
import { useTheme } from "@/src/hooks/useTheme";
import { Registrar } from "@/src/services/authService";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { validarRegistro } from "@/src/utils/validar";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RegistroScreen() {
  const router = useRouter();

  const { darkMode } = useTheme();
  const Colors = darkMode? DarkMode: LightMode;

  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const [erros, setErros] = useState({
    email: false,
    usuario: false,
    senha: false,
    confSenha: false,
  });

  const registrar = async () => {
    try{
      const user = await Registrar( email, usuario, senha )

      if (user) {
        alert('Registro bem sucedido! ')
        router.replace("/");}

      } catch(erro: any){
        console.log(erro)
        alert('Registro falho: ' + erro.message)
      } finally {
        setLoading(false);
      }
  }

  async function validandoRegistro() {
    if (loading) return false;

    const novosErros = validarRegistro(email, usuario, senha, confSenha);

    setErros(novosErros);

    const temErro = Object.values(novosErros).includes(true);

    if (temErro) return false;

    setLoading(true);
    console.log("Novo registro: ", email, usuario, senha);
    await registrar();
    return true;
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.accentGreen }]}>
      <Text style={[styles.title, { color: Colors.textColorPrimary }]}>
        Cadastrar-se:
      </Text>

      <InputField
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        erros={erros.email}
      />

      <ErrorText 
      text="O email é inválido." 
      erro={erros.email}
      />  

      <InputField
        placeholder="Usuário"
        onChangeText={setUsuario}
        value={usuario}
        erros={erros.usuario}
      />

      <ErrorText 
        text="O usuário é inválido." 
        erro={erros.usuario}
      />  

      <InputField
        placeholder="Senha"
        onChangeText={setSenha}
        value={senha}
        erros={erros.senha}
        secureTextEntry={true}
      />

      <ErrorText 
        text="A senha deve ter 6 ou mais caracteres." 
        erro={erros.senha}
      />  

      <InputField
        placeholder="Confirmar senha"
        onChangeText={setConfSenha}
        value={confSenha}
        erros={erros.confSenha}
        secureTextEntry={true}
      />

      <ErrorText 
        text="As senhas não conferem." 
        erro={erros.confSenha}
      />  

      <View style={styles.buttonRow}>
        <SimpleButton
          onPress={() => router.back()}
          text="Voltar"
          disabled={loading}
        ></SimpleButton>

        <SimpleButton
          onPress={() => validandoRegistro()}
          text={loading ? "Criando..." : "Criar Conta"}
          disabled={loading}
        ></SimpleButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "400",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
