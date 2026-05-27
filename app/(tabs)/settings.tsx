import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/colors";
import { useAuth } from "../../src/context/AuthContext";
import { useTheme } from "../../src/context/ThemeContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#333" : Colors.lightGreen },
      ]}
    >
      <View style={[styles.header, { backgroundColor: Colors.accentGreen }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatar} />
        <Text
          style={[
            styles.username,
            { color: theme === "dark" ? "#fff" : "#000" },
          ]}
        >
          {user?.name || "Usuário"}
        </Text>
        <TouchableOpacity>
          <Text style={styles.editText}>✎ Editar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menu}>
        <View style={styles.menuItem}>
          <Ionicons
            name="moon-outline"
            size={24}
            color={theme === "dark" ? "#fff" : "black"}
          />
          <Text
            style={[
              styles.menuText,
              { color: theme === "dark" ? "#fff" : "#000" },
            ]}
          >
            Modo escuro
          </Text>
          <Switch
            value={theme === "dark"}
            onValueChange={toggleTheme}
            trackColor={{ true: Colors.accentGreen }}
          />
        </View>

        <View style={styles.menuItem}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={theme === "dark" ? "#fff" : "black"}
          />
          <Text
            style={[
              styles.menuText,
              { color: theme === "dark" ? "#fff" : "#000" },
            ]}
          >
            Notificações
          </Text>
          <Switch value={true} trackColor={{ true: Colors.accentGreen }} />
        </View>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons
            name="mail-outline"
            size={24}
            color={theme === "dark" ? "#fff" : "black"}
          />
          <Text
            style={[
              styles.menuText,
              { color: theme === "dark" ? "#fff" : "#000" },
            ]}
          >
            Contato
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons
            name="alert-circle-outline"
            size={24}
            color={theme === "dark" ? "#fff" : "black"}
          />
          <Text
            style={[
              styles.menuText,
              { color: theme === "dark" ? "#fff" : "#000" },
            ]}
          >
            Relatar erros
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons
          name="exit-outline"
          size={24}
          color={theme === "dark" ? "#fff" : "black"}
        />
        <Text
          style={[
            styles.logoutText,
            { color: theme === "dark" ? "#fff" : "#000" },
          ]}
        >
          Sair
        </Text>
      </TouchableOpacity>
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
