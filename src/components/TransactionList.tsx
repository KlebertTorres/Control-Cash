import { useCategories } from "@/src/hooks/useCategories";
import { useTheme } from "@/src/hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { Transaction } from "@/src/types/TransactionType";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionPress?: (transaction: Transaction) => void;
  maxItems?: number;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onTransactionPress,
  maxItems = 5,
}) => {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkMode : LightMode;
  const { categories } = useCategories();

  const getCategory = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  const displayTransactions = transactions.slice(0, maxItems);

  const renderItem = ({ item }: { item: Transaction }) => {
    const category = getCategory(item.categoryId);
    const isIncome = item.type === "income";
    const textColor = isIncome ? Colors.accentGreen : "red";

    return (
      <TouchableOpacity
        style={[styles.item, { borderBottomColor: Colors.borderColor }]}
        onPress={() => onTransactionPress?.(item)}
      >
        <View
          style={[
            styles.colorIndicator,
            { backgroundColor: category?.color || Colors.accentGreen },
          ]}
        />
        <View style={styles.content}>
          <Text style={[styles.description, { color: Colors.textColorPrimary }]}>
            {item.description}
          </Text>
          <Text style={[styles.category, { color: Colors.accentGreen }]}>
            {category?.name || "Desconhecida"}
          </Text>
        </View>
        <Text style={[styles.amount, { color: textColor }]}>
          {isIncome ? "+" : "-"} R$ {item.amount.toFixed(2)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={displayTransactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: "#4f6d5e" }]}>
            Nenhuma transação registrada
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  colorIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
  },
  amount: {
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
  },
});
