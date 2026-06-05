import { InputField } from "@/src/components/InputField";
import { SimpleButton } from "@/src/components/SimpleButton";
import { useTheme } from "@/src/hooks/useTheme";
import { useTransaction } from "@/src/hooks/useTransaction";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function AddTransaction() {
  const router = useRouter();

  const { darkMode } = useTheme();
  const Colors = darkMode? DarkMode: LightMode;

  const { addTransaction } = useTransaction();

  const [type, setType] = useState<"income" | "expense">("expense");
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
      date: new Date().toISOString().split("T")[0],
      categoryId: category,
    });

    Alert.alert("Sucesso", "Transação adicionada!");
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.accentGreen }]}>
      <Text style={styles.title}>Adicionar Transação</Text>

      <View style={styles.typeContainer}>
        <SimpleButton
          onPress={() => setType("expense")}
          text="Gasto"
          type="income"
          currentType={type}
        /> 
        <SimpleButton
          onPress={() => setType("income")}
          text="Ganho"
          type="expense"
          currentType={type}
        /> 
      </View>

      <InputField
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
      />

      <InputField
        placeholder="Valor (R$)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <InputField
        placeholder="Categoria"
        value={category}
        onChangeText={setCategory}
      />

      <Pressable style={[styles.saveButton, {backgroundColor: Colors.deepGreen}]} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </Pressable>

      <Pressable
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </Pressable>
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
