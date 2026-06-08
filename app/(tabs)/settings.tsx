import { EditProfileModal } from "@/src/components/EditProfileModal";
import { HelpCenter } from "@/src/components/HelpCenter";
import { useAuth } from "@/src/hooks/useAuth";
import { useCategories } from "@/src/hooks/useCategories";
import { useTheme } from "@/src/hooks/useTheme";
import { useTransaction } from "@/src/hooks/useTransaction";
import { DeletarConta, Logout } from "@/src/services/authService";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const { darkMode, toggleTheme } = useTheme();
  const { categories } = useCategories();
  const { transactions } = useTransaction();
  const { user } = useAuth();
  const [helpVisible, setHelpVisible] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);

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
      DeletarConta(transactions, categories);

      Alert.alert("Sucesso", "A conta foi deletada com sucesso!");
      router.replace("/auth/login")
    } catch (error: any) {
      console.error("Erro ao deletar:", error.message);
      Alert.alert("Erro", "Não foi possível deletar. Tente novamente.");
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: Colors.backgroundColor}]}>
      <View style={[styles.header, { backgroundColor: Colors.cardBackground }]}>
        <Text style={[styles.headerTitle, { color: Colors.textColorPrimary }]}>Configurações</Text>
      </View>

      <ScrollView>
      <View style={[styles.profileSection, { backgroundColor: Colors.cardBackground, borderRadius: 10 }]}>
        <View style={[styles.avatar, {borderColor: Colors.borderColor}]} />
        <Text style={[styles.username, { color: Colors.textColorPrimary }]}>
          {user?.name || "Usuário"}
        </Text>
        <TouchableOpacity onPress={() => setEditProfileVisible(true)}>
          <Text style={[styles.editText, {color: Colors.textColorPrimary}]}>✎ Editar</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.menu, { backgroundColor: Colors.cardBackground, borderRadius: 10 }]}>
        <View style={styles.menuItem}>
          <Ionicons name="moon-outline" size={24} color={ Colors.textColorPrimary } />
          <Text style={[styles.menuText, { color: Colors.textColorPrimary }]}>Modo escuro</Text>
          <Switch 
            style={styles.switch}
            trackColor={{ true: Colors.borderColor, false: Colors.borderColor }}
            value={darkMode} 
            onValueChange={toggleTheme}
          />
        </View>

          <View style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={24} color={ Colors.textColorPrimary } />
            <Text style={[styles.menuText, { color: Colors.textColorPrimary }]}>Notificações</Text>
            <Switch
              style={styles.switch}
              value={true} 
            />
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="mail-outline" size={24} color={ Colors.textColorPrimary } />
            <Text style={[styles.menuText, { color: Colors.textColorPrimary }]}>Contato</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="alert-circle-outline" size={24} color={ Colors.textColorPrimary } />
            <Text style={[styles.menuText, { color: Colors.textColorPrimary }]}>Relatar erros</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setHelpVisible(true)}>
            <Ionicons name="help" size={24} color={ Colors.textColorPrimary } />
            <Text style={[styles.menuText, { color: Colors.textColorPrimary }]}>Ajuda</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: Colors.cardBackground } ]}
          onPress = {() => deslogar()}
        >
          <Ionicons name="exit-outline" size={24} color={ Colors.textColorPrimary } />
          <Text style={[styles.logoutText, { color: Colors.textColorPrimary }]}>Sair</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: Colors.cardBackground } ]}
          onPress = {() => deletarUsuario()}
        >
          <Ionicons name="trash-outline" size={24} color={ Colors.textColorPrimary } />
          <Text style={[styles.logoutText, { color: Colors.textColorPrimary }]}>Deletar Conta</Text>
        </TouchableOpacity>
      </ScrollView>

      <HelpCenter
        darkMode={darkMode}
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
      />

      <EditProfileModal
        visible={editProfileVisible}
        onClose={() => setEditProfileVisible(false)}
        darkMode={darkMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileSection: {
    alignItems: "center",
    padding: 10,
    marginVertical: 30,
    marginHorizontal: 90,
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
    marginBottom: 30,
  },
  menu: {
    marginHorizontal: 20,
    paddingHorizontal: 60,
    paddingVertical: 20
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
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
    marginTop: 30,
    padding: 20,
    marginHorizontal: 90,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 18,
    marginLeft: 10,
  },
  switch: {
    marginTop: -30,
    marginBottom: -30,
  }
});
