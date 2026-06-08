import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { UpdateUserDoc } from "../services/userService";
import { DarkMode, LightMode } from "../styles/cores";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  darkMode,
}) => {
  const Colors = darkMode ? DarkMode : LightMode;
  const { user, setUser } = useAuth();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
    }
  }, [visible, user]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "O nome não pode estar vazio.");
      return;
    }

    if (!user) return;

    try {
      setLoading(true);
      await UpdateUserDoc(user.uid, { name });
      setUser({ ...user, name });
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      onClose();
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.overlay,
          { backgroundColor: "rgba(0, 0, 0, 0.7)" },
        ]}
      >
        <View
          style={[
            styles.modal,
            { backgroundColor: Colors.cardBackground },
          ]}
        >
          <View
            style={[
              styles.header,
              { borderBottomColor: Colors.borderColor },
            ]}
          >
            <Text style={[styles.title, { color: Colors.text }]}>
              Editar Perfil
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Ionicons
                name="close-outline"
                size={24}
                color={Colors.textColorPrimary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={[styles.label, { color: Colors.text }]}>
              Nome
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: Colors.backgroundColor,
                  color: Colors.text,
                  borderColor: Colors.borderColor,
                },
              ]}
              placeholder="Seu nome"
              placeholderTextColor={Colors.textColorSecondary}
              value={name}
              onChangeText={setName}
              editable={!loading}
            />

            <Text style={[styles.info, { color: Colors.textColorPrimary }]}>
              Email e Senha não podem ser alterados por motivos de segurança.
            </Text>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: loading ? Colors.textColorSecondary : Colors.backgroundColor,
                  borderColor: Colors.borderColor,
                },
              ]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.textColorPrimary} />
              ) : (
                <Text style={styles.buttonText}>Salvar Alterações</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={[styles.cancelButtonText, { color: Colors.text }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    borderRadius: 12,
    width: "85%",
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  info: {
    paddingLeft: 10,
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  cancelButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },
});
