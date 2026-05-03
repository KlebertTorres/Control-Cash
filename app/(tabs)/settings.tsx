import React from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../constants/colors";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color="white" />
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatar} />
        <Text style={styles.username}>Usuário</Text>
        <TouchableOpacity>
          <Text style={styles.editText}>✎ Editar</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Section */}
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

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="mail-outline" size={24} color="black" />
          <Text style={styles.menuText}>Contato</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="alert-circle-outline" size={24} color="black" />
          <Text style={styles.menuText}>Relatar erros</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Section */}
      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="exit-outline" size={24} color="black" />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreen,
  },

  // Header
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

  // Profile
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

  // Menu
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

  // Logout
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
