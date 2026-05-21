import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Registrar } from "@/src/services/authService";
import { validarRegistro } from "@/src/utils/validar";
import { useTheme } from "@/src/hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores";

export default function RegistroScreen() {
  const router = useRouter();

  const { darkMode } = useTheme();
  const Colors = darkMode? DarkMode: LightMode;

  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");

  const [erros, setErros] = useState({
    email: false,
    usuario: false,
    senha: false,
    confSenha: false,
  });

  const registrar = async () => {
    try{
      const user = await Registrar( email, senha )
      if (user) alert('Registro bem sucedido! ')
        
    } catch(erro: any){
      console.log(erro)
      alert('Registro falho: ' + erro.message)
    }
  }

  async function validandoRegistro() {
    const novosErros = validarRegistro(email, usuario, senha, confSenha);

    setErros(novosErros);

    const temErro = Object.values(novosErros).includes(true);

    if (temErro) return false;

    console.log("Novo registro: ", email, usuario, senha);
    await registrar();
    return true;
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.accentGreen }]}>
      <Text style={[styles.title, { color: Colors.textColorPrimary }]}>
        Cadastrar-se:
      </Text>

      <TextInput
        style={[styles.input, {borderColor: Colors.darkest}, erros.email && styles.inputError]}
        placeholder="Email"
        placeholderTextColor="#4f6d5e"
        onChangeText={setEmail}
        value={email}
      />
      {erros.email && (
        <Text style={styles.errorText}>O email é inválido.</Text>
      )}
      <TextInput
        style={[styles.input, {borderColor: Colors.darkest}, erros.email && styles.inputError]}
        placeholder="Usuário"
        placeholderTextColor="#4f6d5e"
        onChangeText={setUsuario}
        value={usuario}
      />
      {erros.usuario && (
        <Text style={styles.errorText}>O usuário é inválido.</Text>
      )}
      <TextInput
        style={[styles.input, {borderColor: Colors.darkest}, erros.email && styles.inputError]}
        placeholder="Senha"
        secureTextEntry
        placeholderTextColor="#4f6d5e"
        onChangeText={setSenha}
        value={senha}
      />
      {erros.senha && (
        <Text style={styles.errorText}>
          A senha deve ter 6 ou mais caracteres.
        </Text>
      )}
      <TextInput
        style={[styles.input, {borderColor: Colors.darkest}, erros.email && styles.inputError]}
        placeholder="Confirmar senha"
        secureTextEntry
        placeholderTextColor="#4f6d5e"
        onChangeText={setConfSenha}
        value={confSenha}
      />
      {erros.confSenha && (
        <Text style={styles.errorText}>As senhas não conferem.</Text>
      )}

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.smallButton, { backgroundColor: Colors.darkest }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.buttonText, { color: Colors.textColorPrimary }]}>
            Voltar
          </Text>
        </Pressable>

        <Pressable
          style={[styles.smallButton, { backgroundColor: Colors.darkest }]}
          onPress={() => validandoRegistro()}
        >
          <Text style={[styles.buttonText, { color: Colors.textColorPrimary }]}>
            Criar Conta
          </Text>
        </Pressable>
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
  input: {
    backgroundColor: "#b5cdbd",
    borderWidth: 2,
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#f65151",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  smallButton: {
    paddingVertical: 12,
    borderRadius: 10,
    width: "47%",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
  },
  errorText: {
    color: "#f65151",
    fontSize: 16,
    paddingLeft: 18,
    marginTop: -10,
    marginBottom: 5,
  },
});
