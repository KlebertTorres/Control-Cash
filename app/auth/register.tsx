import { useRouter } from "expo-router";
import { useState } from 'react';
import { StyleSheet, Text, TextInput, Pressable, View, } from "react-native";
import { Colors } from '../../src/styles/colors';
import { validateRegister } from '../../src/utils/validate';

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const [errors, setErrors] = useState({
    email: false,
    user: false,
    password: false,
    confPassword: false
  });

  function validateRegist(){
    const newErrors = validateRegister(email, user, password, confPassword)

    setErrors(newErrors)

    const haveError = Object.values(newErrors).includes(true)

    if (haveError) return false;

    console.log("Novo registro: ", email, user, password)
    return true
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.accentGreen }]}>
      <Text style={[styles.title, { color: Colors.textColorPrimary }]}>Cadastrar-se:</Text>

      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email"
        placeholderTextColor="#4f6d5e"
        onChangeText={setEmail}
        value={email}
      />
      {errors.email &&
        <Text style = {styles.errorText}>
        O email é inválido.
        </Text>
      }
      <TextInput
        style={[styles.input, errors.user && styles.inputError]}
        placeholder="Usuário"
        placeholderTextColor="#4f6d5e"
        onChangeText={setUser}
        value={user}
      />
      {errors.user && 
        <Text style = {styles.errorText}>
          O usuário é inválido.
        </Text>
      }
      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Senha"
        secureTextEntry
        placeholderTextColor="#4f6d5e"
        onChangeText={setPassword}
        value={password}
      />
      {errors.password && (
        <Text style={styles.errorText}>
          A senha deve ter 4 ou mais caracteres.
        </Text>
      )}
      <TextInput
        style={[styles.input, errors.confPassword && styles.inputError]}
        placeholder="Confirmar senha"
        secureTextEntry
        placeholderTextColor="#4f6d5e"
        onChangeText={setConfPassword}
        value={confPassword}
      />
      {errors.confPassword &&
      <Text style = {styles.errorText}>
        As senhas não conferem.
      </Text>
      }

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.smallButton, { backgroundColor: Colors.darkest}]}
          onPress={() => router.back()}
        >
          <Text style={[styles.buttonText, { color: Colors.textColorPrimary }]}>Voltar</Text>
        </Pressable>

        <Pressable 
          style={[styles.smallButton, { backgroundColor: Colors.darkest}]}
          onPress={() => validateRegist()}
        >
          <Text style={[styles.buttonText, { color: Colors.textColorPrimary }]}>Criar Conta</Text>
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
    borderColor: Colors.darkest,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#f65151',
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
    fontWeight: "bold" 
  },
  errorText: {
    color: '#f65151',
    fontSize: 16,
    paddingLeft: 18,
    marginTop: -10,
    marginBottom: 5,
  },
});
