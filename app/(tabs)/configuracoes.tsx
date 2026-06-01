import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { Logout, DeletarConta } from "@/src/services/authService";
import { useTheme } from "@/src/hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { DeleteUserDoc } from "@/src/services/userService";
import { useAuth } from "@/src/hooks/useAuth";

export default function SettingsScreen() {
  const router = useRouter();
  const { darkMode, toggleTheme } = useTheme();
  const { user } = useAuth();

  const Colors = darkMode? DarkMode: LightMode;

  const deslogar = async () => {
    try {
      await Logout();
      // O onAuthStateChanged em seu index.tsx detectará que o usuário foi deslogado
      // e automaticamente redirecionará para a tela de login.
      Alert.alert("Sucesso", "Você foi deslogado com sucesso!");
      router.replace("/")
    } catch (error: any) {
      console.error("Erro ao deslogar:", error.message);
      Alert.alert("Erro", "Não foi possível deslogar. Tente novamente.");
    }
  };
  const deletarUsuario = async () => {
    try {
      DeletarConta();
      Alert.alert("Sucesso", "A conta foi deletada com sucesso!");
      router.replace("/auth/login")
    } catch (error: any) {
      console.error("Erro ao deletar:", error.message);
      Alert.alert("Erro", "Não foi possível deletar. Tente novamente.");
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: Colors.lightGreen}]}>
      <View style={[styles.header, {backgroundColor: Colors.accentGreen}]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={[styles.avatar,{borderColor: Colors.accentGreen}]} />
        <Text style={styles.username}>Usuário</Text>
        <Pressable>
          <Text style={[styles.editText, {color: Colors.accentGreen}]}>✎ Editar</Text>
        </Pressable>
      </View>

      <View style={styles.menu}>
        <View style={styles.menuItem}>
          <Ionicons name="moon-outline" size={24} color="black" />
          <Text style={styles.menuText}>Modo escuro</Text>
          <Switch 
            trackColor={{ true: Colors.accentGreen }}
            value={darkMode} 
            onValueChange={toggleTheme}
          />
        </View>

        <View style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color="black" />
          <Text style={styles.menuText}>Notificações</Text>
          <Switch value={true} />
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
        onPress = {() => deletarUsuario()}
      >
        <Ionicons name="trash-outline" size={24} color="black" />
        <Text style={styles.logoutText}>Deletar Conta</Text>
      </Pressable>

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
  },
  header: {
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
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  editText: {
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
