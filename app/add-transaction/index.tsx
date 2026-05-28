import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useTransactionStore } from "../../src/stores/transactionStore";
import { useTheme } from "@/src/hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores";

export default function AddTransaction() {
  const router = useRouter();

  const { darkMode } = useTheme();
  const Colors = darkMode? DarkMode: LightMode;

  const { addTransaction } = useTransactionStore();

  const [type, setType] = useState<"income" | "expense">("income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleSave = () => {
    if (!amount || !description || !category) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Erro", "Valor deve ser um número positivo.");
      return;
    }

    addTransaction({
      type,
      amount: numericAmount,
      description,
      date: new Date().toISOString(),
      category,
    });

    Alert.alert("Sucesso", "Transação adicionada!");
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.accentGreen }]}>
      <Text style={styles.title}>Adicionar Transação</Text>

      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            type === "income" && {backgroundColor: Colors.lightGreen},
          ]}
          onPress={() => setType("income")}
        >
          <Text
            style={[
              styles.typeText,
              type === "income" && styles.typeTextActive,
            ]}
          >
            Ganho
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeButton,
            type === "expense" && {backgroundColor: Colors.deepGreen}
          ]}
          onPress={() => setType("expense")}
        >
          <Text
            style={[
              styles.typeText,
              type === "expense" && styles.typeTextActive,
            ]}
          >
            Gasto
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.input, {backgroundColor: Colors.lightGreen}]}
        placeholder="Valor (R$)"
        placeholderTextColor="#666"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <TextInput
        style={[styles.input, {backgroundColor: Colors.lightGreen}]}
        placeholder="Descrição"
        placeholderTextColor="#666"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={[styles.input, {backgroundColor: Colors.lightGreen}]}
        placeholder="Categoria"
        placeholderTextColor="#666"
        value={category}
        onChangeText={setCategory}
      />

      <TouchableOpacity style={[styles.saveButton, {backgroundColor: Colors.deepGreen}]} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  typeButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  typeText: {
    color: "#000",
    fontWeight: "bold",
  },
  typeTextActive: {
    color: "#fff",
  },
  input: {
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginVertical: 8,
    color: "#000",
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    marginTop: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#ccc",
    fontSize: 16,
  },
});
