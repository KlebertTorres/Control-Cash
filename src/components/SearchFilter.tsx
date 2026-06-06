import React, { useState, useCallback } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  Text,
  ScrollView,
} from "react-native";
import { Category } from "../types/CategoryType";
import { Transaction } from "../types/TransactionType";
import { DarkMode, LightMode } from "../styles/cores";

interface SearchFilterProps {
  transactions: Transaction[];
  categories: Category[];
  onFilteredResults: (results: Transaction[]) => void;
  darkMode: boolean;
  showCategoryFilter?: boolean;
  showTypeFilter?: boolean;
  showDateRangeFilter?: boolean;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  transactions,
  categories,
  onFilteredResults,
  darkMode,
  showCategoryFilter = true,
  showTypeFilter = true,
  showDateRangeFilter = true,
}) => {
  const Colors = darkMode ? DarkMode : LightMode;

  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filterTransactions = useCallback(() => {
    let filtered = transactions;

    // Filter by search text (description)
    if (searchText.trim()) {
      filtered = filtered.filter((t) =>
        t.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((t) =>
        selectedCategories.includes(t.categoryId)
      );
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((t) => t.type === selectedType);
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter((t) => t.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((t) => t.date <= endDate);
    }

    onFilteredResults(filtered);
  }, [searchText, selectedCategories, selectedType, startDate, endDate, transactions, onFilteredResults]);

  React.useEffect(() => {
    filterTransactions();
  }, [filterTransactions]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedCategories([]);
    setSelectedType("all");
    setStartDate("");
    setEndDate("");
  };

  const hasActiveFilters =
    searchText ||
    selectedCategories.length > 0 ||
    selectedType !== "all" ||
    startDate ||
    endDate;

  return (
    <View style={[styles.container, { backgroundColor: Colors.cardBackground }]}>
      {/* Search Input */}
      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: Colors.backgroundColor,
            color: Colors.text,
            borderColor: Colors.borderColor,
          },
        ]}
        placeholder="Buscar por descrição..."
        placeholderTextColor={Colors.secondary}
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Type Filter */}
      {showTypeFilter && (
        <View style={styles.filterSection}>
          <Text style={[styles.filterLabel, { color: Colors.text }]}>Tipo:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["all", "income", "expense"].map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      selectedType === type
                        ? Colors.primary
                        : Colors.backgroundColor,
                    borderColor: Colors.primary,
                  },
                ]}
                onPress={() =>
                  setSelectedType(type as "all" | "income" | "expense")
                }
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    {
                      color: selectedType === type ? "#fff" : Colors.text,
                    },
                  ]}
                >
                  {type === "all" ? "Todos" : type === "income" ? "Receitas" : "Despesas"}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Category Filter */}
      {showCategoryFilter && (
        <View style={styles.filterSection}>
          <Text style={[styles.filterLabel, { color: Colors.text }]}>
            Categorias:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories
              .filter((cat) => !cat.parentId)
              .map((category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.filterButton,
                    {
                      backgroundColor: selectedCategories.includes(
                        category.id
                      )
                        ? category.color
                        : Colors.backgroundColor,
                      borderColor: category.color,
                    },
                  ]}
                  onPress={() => toggleCategory(category.id)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      {
                        color: selectedCategories.includes(category.id)
                          ? "#fff"
                          : Colors.text,
                      },
                    ]}
                  >
                    {category.icon} {category.name}
                  </Text>
                </Pressable>
              ))}
          </ScrollView>
        </View>
      )}

      {/* Date Range Filter */}
      {showDateRangeFilter && (
        <View style={styles.filterSection}>
          <Text style={[styles.filterLabel, { color: Colors.text }]}>
            Período:
          </Text>
          <View style={styles.dateInputContainer}>
            <TextInput
              style={[
                styles.dateInput,
                {
                  backgroundColor: Colors.backgroundColor,
                  color: Colors.text,
                  borderColor: Colors.borderColor,
                },
              ]}
              placeholder="De (YYYY-MM-DD)"
              placeholderTextColor={Colors.secondary}
              value={startDate}
              onChangeText={setStartDate}
            />
            <TextInput
              style={[
                styles.dateInput,
                {
                  backgroundColor: Colors.backgroundColor,
                  color: Colors.text,
                  borderColor: Colors.borderColor,
                },
              ]}
              placeholder="Até (YYYY-MM-DD)"
              placeholderTextColor={Colors.secondary}
              value={endDate}
              onChangeText={setEndDate}
            />
          </View>
        </View>
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Pressable
          style={[styles.clearButton, { backgroundColor: Colors.primary }]}
          onPress={clearFilters}
        >
          <Text style={styles.clearButtonText}>Limpar Filtros</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  filterButton: {
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dateInputContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});
