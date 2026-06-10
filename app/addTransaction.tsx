import { CategoryDropdown } from "@/src/components/CategoryDropdown";
import { InputField } from "@/src/components/InputField";
import { SimpleButton } from "@/src/components/SimpleButton";
import { useCategories } from "@/src/hooks/useCategories";
import { useTheme } from "@/src/hooks/useTheme";
import { useTransaction } from "@/src/hooks/useTransaction";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { formatLocalDate } from "@/src/utils/formatarData";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
      selectedDate.setHours(0, 0, 0, 0); // Normaliza a data para evitar problemas de fuso horário
      setDate(selectedDate);
      console.log("Data selecionada: ", selectedDate);
    }
    setShowDatePicker(false);
  };

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
      date: formatLocalDate(date),
      categoryId: category,
    });

    Alert.alert("Sucesso", "Transação adicionada!");
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.cardBackground }]}>
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

      <TouchableOpacity
        style={[
          styles.dateButton,
          { backgroundColor: Colors.cardBackground, borderColor: Colors.borderColor },
        ]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={[styles.dateButtonText, { color: Colors.textColorPrimary }]}>
          📅 Data: {formatLocalDate(date)}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <CategoryDropdown
        categories={categories}
        selectedId={category}
        onSelect={setCategory}
        darkMode={darkMode}
        transactionType={type}
      />

      <TouchableOpacity 
      style=
      {[styles.saveButton, {backgroundColor: Colors.backgroundColor, borderColor: Colors.borderColor }]} 
      onPress={handleSave}>
        
        <Text style={[styles.saveButtonText, { color: Colors.text }]}>
          Salvar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={[styles.cancelButtonText, { color: Colors.textColorPrimary }]}>Cancelar</Text>
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
    borderWidth: 1,
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
