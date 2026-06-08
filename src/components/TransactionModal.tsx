import { useCategories } from "@/src/hooks/useCategories";
import { useTheme } from "@/src/hooks/useTheme";
import { useTransaction } from "@/src/hooks/useTransaction";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { Transaction } from "@/src/types/TransactionType";
import React, { useEffect, useState } from "react";
import { CategoryDropdown } from "./CategoryDropdown";
import { SimpleButton } from "./SimpleButton";
import { formatLocalDate, parseLocalDate } from "@/src/utils/formatarData";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";

interface TransactionModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onSave: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  visible,
  transaction,
  onClose,
  onSave,
}) => {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkMode : LightMode;
  const { updateTransaction, removeTransaction } = useTransaction();
  const { categories } = useCategories();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDataPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      selectedDate.setHours(0, 0, 0, 0); // Normaliza a data para evitar problemas de fuso horário
      setDate(selectedDate);
      console.log("Data selecionada: ", selectedDate);
    }
    setShowDataPicker(false);
  };

  useEffect(() => {
    if (visible && transaction) {
      const date = parseLocalDate(transaction.date)
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setDate(date);
      setCategoryId(transaction.categoryId);
    }
  }, [visible, transaction]);

  const handleSave = async () => {

    const newDate = date.toISOString();
    if (!description || !amount || !newDate || !categoryId) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Erro", "O valor deve ser maior que zero");
      return;
    }

    try {
      setLoading(true);
      if (transaction) {
        await updateTransaction(transaction.id, {
          description,
          amount: amountNum,
          date: formatLocalDate(date),
          categoryId,
        });
      }
      Alert.alert("Sucesso", "Transação atualizada com sucesso!");
      onSave();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Não foi possível salvar a transação");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;

    Alert.alert(
      "Confirmar exclusão",
      "Deseja realmente deletar esta transação? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", onPress: () => {} },
        {
          text: "Deletar",
          onPress: async () => {
            try {
              setLoading(true);
              await removeTransaction(transaction.id);
              Alert.alert("Sucesso", "Transação deletada!");
              onSave();
              onClose();
            } catch (error) {
              console.error("Erro ao deletar:", error);
              Alert.alert("Erro", "Não foi possível deletar a transação");
            } finally {
              setLoading(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={[styles.container, { backgroundColor: Colors.cardBackground }]}>
        <View style={[styles.header, { backgroundColor: Colors.backgroundColor }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeButton, {color: Colors.textColorPrimary}]}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.title, {color: Colors.textColorPrimary}]}>
            {transaction ? "Editar Transação" : "Nova Transação"}
          </Text>
          <View style={{ width: 30 }} />
        </View>

        <ScrollView style={styles.content}>
          <Text style={[styles.label, { color: Colors.textColorPrimary }]}>Descrição</Text>
          <TextInput
            style={[styles.input, { color: Colors.textColorPrimary, borderColor: Colors.borderColor }]}
            placeholder="Descrição"
            placeholderTextColor={"#4f6d5e"}
            value={description}
            onChangeText={setDescription}
            editable={!loading}
          />

          <Text style={[styles.label, { color: Colors.textColorPrimary }]}>Valor (R$)</Text>
          <TextInput
            style={[styles.input, { color: Colors.textColorPrimary, borderColor: Colors.borderColor }]}
            placeholder="0.00"
            placeholderTextColor={"#4f6d5e"}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            editable={!loading}
          />

          <Text style={[styles.label, { color: Colors.textColorPrimary }]}>
            Data (YYYY-MM-DD)
          </Text>
          <TouchableOpacity 
            style={[styles.dateButton,{ borderColor: Colors.borderColor }]}
            onPress={() => setShowDataPicker(true)}
          >
            <Text style={[styles.dateButtonText, { color: Colors.textColorPrimary }]}>
              📅 {formatLocalDate(date)}
            </Text>
          </TouchableOpacity>

          {showDatePicker &&
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          }

          <Text style={[styles.label, { color: Colors.textColorPrimary }]}>Categoria</Text>
          <CategoryDropdown
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategoryId}
            darkMode={darkMode}
            transactionType={transaction?.type || "expense"}
          />

          <View style={styles.buttonGroup}>
            <SimpleButton
              text={loading? <ActivityIndicator color={Colors.textColorPrimary} />: "Salvar"}
              onPress={handleSave}
              disabled={loading}
              color={Colors.backgroundColor}
            />
            {transaction && (
              <SimpleButton
                text="Deletar"
                onPress={handleDelete}
                disabled={loading}
                color="red"
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  buttonGroup: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
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
});
