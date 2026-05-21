import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from 'firebase/auth';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { auth } from '../../src/services/firebaseconfig';

import { Colors } from "../../src/styles/cores";

export default function SettingsScreen() {
  const router = useRouter();

  const deslogar = async () => {
    try {
      await signOut(auth);
      // O onAuthStateChanged em seu index.tsx detectará que o usuário foi deslogado
      // e automaticamente redirecionará para a tela de login.
      router.push("../auth/login")
      Alert.alert("Sucesso", "Você foi deslogado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao deslogar:", error.message);
      Alert.alert("Erro", "Não foi possível deslogar. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatar} />
        <Text style={styles.username}>Usuário</Text>
        <Pressable>
          <Text style={styles.editText}>✎ Editar</Text>
        </Pressable>
      </View>

      <View style={styles.menu}>
        <View style={styles.menuItem}>
          <Ionicons name="moon-outline" size={24} color="black" />
          <Text style={styles.menuText}>Modo escuro</Text>
          <Switch value={false} />
        </View>

        <View style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color="black" />
          <Text style={styles.menuText}>Notificações</Text>
          <Switch value={true} trackColor={{ true: Colors.accentGreen }} />
        </View>

        <Pressable style={styles.menuItem}>
          <Ionicons name="mail-outline" size={24} color="black" />
          <Text style={styles.menuText}>Contato</Text>
        </Pressable>

        <Pressable style={styles.menuItem}>
          <Ionicons name="alert-circle-outline" size={24} color="black" />
          <Text style={styles.menuText}>Relatar erros</Text>
        </Pressable>
      </View>

      <Pressable style={styles.logoutButton}
        onPress = {() => deslogar()}
      >
        <Ionicons name="exit-outline" size={24} color="black" />
        <Text style={styles.logoutText}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreen,
  },
  header: {
    backgroundColor: Colors.accentGreen,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    marginLeft: 15,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#D1C4E9",
    borderWidth: 2,
    borderColor: Colors.accentGreen,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  editText: {
    color: Colors.accentGreen,
    textDecorationLine: "underline",
  },
  menu: {
    paddingHorizontal: 40,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  logoutText: {
    fontSize: 18,
    marginLeft: 10,
  },
});
