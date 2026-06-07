import { View, StyleSheet, FlatList, Text, ScrollView } from "react-native";
import { useTheme } from "@/src/hooks/useTheme";
import { useTransaction } from "@/src/hooks/useTransaction";
import { useCategories } from "@/src/hooks/useCategories";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { SearchFilter } from "@/src/components/SearchFilter";
import { TransactionList } from "@/src/components/TransactionList";
import { useState } from "react";
import { Transaction } from "@/src/types/TransactionType";

export default function SearchTab() {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkMode : LightMode;
  const { transactions } = useTransaction();
  const { categories } = useCategories();
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(
    transactions
  );

  const handleFilteredResults = (results: Transaction[]) => {
    setFilteredTransactions(results);
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: Colors.cardBackground }]}>
        <Text style={styles.headerTitle}>Buscar Transação</Text>
      </View>
      <SearchFilter
        transactions={transactions}
        categories={categories}
        onFilteredResults={handleFilteredResults}
        darkMode={darkMode}
        showCategoryFilter
        showTypeFilter
        showDateRangeFilter
      />

      {filteredTransactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: Colors.textColorPrimary }]}>
            Nenhuma transação encontrada
          </Text>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <Text
            style={[
              styles.resultCount,
              { color: Colors.textColorPrimary, backgroundColor: Colors.cardBackground },
            ]}
          >
            {filteredTransactions.length} transações encontradas
          </Text>
          <ScrollView>
            <FlatList
              data={filteredTransactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionList transactions={[item]} />}
              scrollEnabled={false}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
  },
  resultContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  resultCount: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginHorizontal: 10,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
