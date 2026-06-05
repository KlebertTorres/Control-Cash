import { useCategories } from "@/src/hooks/useCategories";
import { useTheme } from "@/src/hooks/useTheme";
import { useTransaction } from "@/src/hooks/useTransaction";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { Transaction } from "@/src/types/TransactionType";
import React, { useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SimpleButton } from "./SimpleButton";

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
  const { updateTransaction } = useTransaction();
  const { categories } = useCategories();

  const [description, setDescription] = useState(transaction?.description || "");
  const [amount, setAmount] = useState(transaction?.amount.toString() || "");
  const [date, setDate] = useState(transaction?.date || "");
  const [categoryId, setCategoryId] = useState(transaction?.categoryId || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!description || !amount || !date || !categoryId) {
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
          date,
          categoryId,
        });
      }
      onSave();
      onClose();
    } catch (_) {
      Alert.alert("Erro", "Não foi possível salvar a transação");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;

    Alert.alert(
      "Confirmar exclusão",
      "Deseja realmente deletar esta transação?",
      [
        { text: "Cancelar", onPress: () => {} },
        {
          text: "Deletar",
          onPress: async () => {
            try {
              setLoading(true);
              // TODO: implementar deleteTransaction
              onSave();
              onClose();
            } catch (_) {
              Alert.alert("Erro", "Não foi possível deletar a transação");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <View style={[styles.header, { backgroundColor: Colors.primary }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {transaction ? "Editar Transação" : "Nova Transação"}
          </Text>
          <View style={{ width: 30 }} />
        </View>

        <ScrollView style={styles.content}>
          <Text style={[styles.label, { color: Colors.text }]}>Descrição</Text>
          <TextInput
            style={[styles.input, { color: Colors.text, borderColor: Colors.border }]}
            placeholder="Descrição"
            placeholderTextColor={Colors.placeholder}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={[styles.label, { color: Colors.text }]}>Valor</Text>
          <TextInput
            style={[styles.input, { color: Colors.text, borderColor: Colors.border }]}
            placeholder="0.00"
            placeholderTextColor={Colors.placeholder}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          <Text style={[styles.label, { color: Colors.text }]}>Data</Text>
          <TextInput
            style={[styles.input, { color: Colors.text, borderColor: Colors.border }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors.placeholder}
            value={date}
            onChangeText={setDate}
          />

          <Text style={[styles.label, { color: Colors.text }]}>Categoria</Text>
          <ScrollView horizontal style={styles.categoriesContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  { backgroundColor: cat.color },
                  categoryId === cat.id && styles.categoryButtonActive,
                ]}
                onPress={() => setCategoryId(cat.id)}
              >
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.buttonGroup}>
            <SimpleButton
              title="Salvar"
              onPress={handleSave}
              disabled={loading}
              color={Colors.accentGreen}
            />
            {transaction && (
              <SimpleButton
                title="Deletar"
                onPress={handleDelete}
                disabled={loading}
                color="red"
              />
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    fontSize: 24,
    color: "white",
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
  categoriesContainer: {
    marginVertical: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoryButtonActive: {
    borderColor: "white",
  },
  categoryText: {
    color: "white",
    fontWeight: "600",
  },
  buttonGroup: {
    marginTop: 30,
    marginBottom: 20,
  },
});
