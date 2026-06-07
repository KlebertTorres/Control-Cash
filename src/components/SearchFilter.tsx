import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text,  TextInput, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DarkMode, LightMode } from "../styles/cores";
import { Category } from "../types/CategoryType";
import { Transaction } from "../types/TransactionType";
import { formatLocalDate } from "@/src/utils/formatarData";

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
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const filterTransactions = useCallback(() => {
    let filtered = transactions;
    const newStartDate = startDate.toISOString().split("T")[0];
    const newEndDate = endDate.toISOString().split("T")[0];

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
      filtered = filtered.filter((t) => t.date >= newStartDate);
    }
    if (endDate) {
      filtered = filtered.filter((t) => t.date <= newEndDate);
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

  const handleStartDateChange = (event:any, selectedDate?: Date) => {
    if (selectedDate) {
      setStartDate(selectedDate);
    }
    setShowStartDatePicker(false);
  };
    const handleEndDateChange = (event:any, selectedDate?: Date) => {
    if (selectedDate) {
      setEndDate(selectedDate);
    }
    setShowEndDatePicker(false);
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedCategories([]);
    setSelectedType("all");
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const hasActiveFilters =
    searchText ||
    selectedCategories.length > 0 ||
    selectedType !== "all" 

  return (
    <View style={[styles.container, { backgroundColor: Colors.cardBackground }]}>
      {/* Search Input */}
      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: Colors.backgroundColor,
            color: Colors.textColorPrimary,
            borderColor: Colors.borderColor,
          },
        ]}
        placeholder="Buscar por descrição..."
        placeholderTextColor={Colors.textColorPrimary}
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Type Filter */}
      {showTypeFilter && (
        <View style={styles.filterSection}>
          <Text style={[styles.filterLabel, { color: Colors.textColorPrimary }]}>Tipo:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["all", "income", "expense"].map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      selectedType === type
                        ? Colors.cardBackground
                        : Colors.backgroundColor,
                    borderColor: Colors.borderColor,
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
                      color: selectedType === type ? Colors.textColorPrimary : Colors.text,
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
          <Text style={[styles.filterLabel, { color: Colors.textColorPrimary }]}>
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
                          ? Colors.textColorPrimary
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
          <Text style={[styles.filterLabel, { color: Colors.textColorPrimary }]}>
            Período:
          </Text>
          <View style={styles.dateInputContainer}>
            <Pressable
              style={[
                styles.dateButton,
                { backgroundColor: Colors.cardBackground, borderColor: Colors.borderColor },
              ]}
              onPress={() => setShowStartDatePicker(prev => !prev)}
            >
              <Text style={[styles.dateButtonText, { color: Colors.textColorPrimary }]}>
                📅 Data: {formatLocalDate(startDate)}
              </Text>
            </Pressable>
      
            {showStartDatePicker && (
              <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
            )}
            <Pressable
              style={[
                styles.dateButton,
                { backgroundColor: Colors.cardBackground, borderColor: Colors.borderColor },
              ]}
              onPress={() => setShowEndDatePicker(prev => !prev)}
            >
              <Text style={[styles.dateButtonText, { color: Colors.textColorPrimary }]}>
                📅 Data: {formatLocalDate(endDate)}
              </Text>
            </Pressable>
      
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
              />
            )}
          </View>
        </View>
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Pressable
          style={[styles.clearButton, { backgroundColor: Colors.cardBackground }]}
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
