import { InputField } from "@/src/components/InputField";
import { SimpleButton } from "@/src/components/SimpleButton";
import { CategoryDropdown } from "@/src/components/CategoryDropdown";
import { useTheme } from "@/src/hooks/useTheme";
import { useTransaction } from "@/src/hooks/useTransaction";
import { useCategories } from "@/src/hooks/useCategories";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddTransaction() {
  const router = useRouter();

  const { darkMode } = useTheme();
  const Colors = darkMode? DarkMode: LightMode;

  const { addTransaction } = useTransaction();
  const { categories } = useCategories();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

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
      date: formatDate(date),
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

      <Pressable
        style={[
          styles.dateButton,
          { backgroundColor: Colors.primary, borderColor: Colors.borderColor },
        ]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={[styles.dateButtonText, { color: "#fff" }]}>
          📅 Data: {formatDate(date)}
        </Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <InputField
        placeholder="Valor (R$)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <CategoryDropdown
        categories={categories}
        selectedId={category}
        onSelect={setCategory}
        darkMode={darkMode}
        transactionType={type}
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
  dateButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: 14,
    fontWeight: "600",
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
