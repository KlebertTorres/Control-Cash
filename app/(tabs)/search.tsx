import { SearchFilter } from "@/src/components/SearchFilter";
import { TransactionList } from "@/src/components/TransactionList";
import { TransactionModal } from "@/src/components/TransactionModal";
import { useCategories } from "@/src/hooks/useCategories";
import { useTheme } from "@/src/hooks/useTheme";
import { useTransaction } from "@/src/hooks/useTransaction";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { Transaction } from "@/src/types/TransactionType";
import { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SearchTab() {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkMode : LightMode;
  const { transactions } = useTransaction();
  const { categories } = useCategories();
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(
    transactions
  );
  const [open, setOpened] = useState(true);

  const [modalVisible,setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleFilteredResults = (results: Transaction[]) => {
    setFilteredTransactions(results);
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const loadSearchData = async () => {
    try {
      setRefreshing(true);
    } catch (error) {
      console.error("Erro ao recarregar pesquisas:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: Colors.cardBackground }]}>
        <Text style={styles.headerTitle}>Buscar Transação</Text>
      </View>
      <View style={[styles.subtittle, { backgroundColor: Colors.cardBackground }]}>
        <TouchableOpacity
          onPress={() => {
          setOpened((prev) => !prev);}
        }>
          <Text style={{ color: Colors.textColorPrimary, fontSize: 20, fontWeight: "bold" }}>Filtros ▼</Text>
        </TouchableOpacity>
      </View>
      
      {open &&
        <SearchFilter
          transactions={transactions}
          categories={categories}
          onFilteredResults={handleFilteredResults}
          darkMode={darkMode}
          showCategoryFilter
          showTypeFilter
          showDateRangeFilter
        />
      }

      {filteredTransactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: Colors.textColorPrimary }]}>
            Nenhuma transação encontrada
          </Text>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadSearchData}
          />
          <Text
            style={[
              styles.resultCount,
              { color: Colors.textColorPrimary, backgroundColor: Colors.cardBackground },
            ]}
          >
            {filteredTransactions.length} 
            {filteredTransactions.length > 1? " transações encontradas" : " transação encontrada"}
          </Text>

          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              <TransactionList 
                onTransactionPress={() => handleTransactionPress}
                transactions={[item]} 
              />}
            scrollEnabled={true}
          />
          <TransactionModal
            visible={modalVisible}
            transaction={selectedTransaction}
            onClose={() => setModalVisible(false)}
            onSave={() => {}}
          />
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
  subtittle: {
    alignItems: "center",
    fontSize: 16,
    paddingLeft: 20,
    paddingBottom: 15
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
