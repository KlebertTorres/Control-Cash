import { useCategories } from "@/src/hooks/useCategories";
import { useTheme } from "@/src/hooks/useTheme";
import { useTransaction } from "@/src/hooks/useTransaction";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { Transaction } from "@/src/types/TransactionType";
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
import { CategoryDropdown } from "./CategoryDropdown";
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
  const { updateTransaction, removeTransaction } = useTransaction();
  const { categories } = useCategories();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && transaction) {
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setDate(transaction.date);
      setCategoryId(transaction.categoryId);
    }
  }, [visible, transaction]);

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
      <View style={[styles.container, { backgroundColor: Colors.backgroundColor }]}>
        <View style={[styles.header, { backgroundColor: Colors.textColorPrimary }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
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

          <Text style={[styles.label, { color: Colors.textColorPrimary }]}>Data (YYYY-MM-DD)</Text>
          <TextInput
            style={[styles.input, { color: Colors.textColorPrimary, borderColor: Colors.borderColor }]}
            placeholder="2024-01-01"
            placeholderTextColor={"#4f6d5e"}
            value={date}
            onChangeText={setDate}
            editable={!loading}
          />

          <Text style={[styles.label, { color: Colors.textColorPrimary }]}>Categoria</Text>
          <CategoryDropdown
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategoryId}
            darkMode={darkMode}
            transactionType={transaction?.type || "expense"}
          />

          <View style={styles.buttonGroup}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.cardBackground} />
              </View>
            ) : (
              <>
                <SimpleButton
                  title="Salvar"
                  onPress={handleSave}
                  disabled={loading}
                  color={Colors.backgroundColor}
                />
                {transaction && (
                  <SimpleButton
                    title="Deletar"
                    onPress={handleDelete}
                    disabled={loading}
                    color="red"
                  />
                )}
              </>
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
  buttonGroup: {
    marginTop: 30,
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
});
