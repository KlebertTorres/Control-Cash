import { useCategories } from "@/src/hooks/useCategories";
import { useTheme } from "@/src/hooks/useTheme";
import { useTransaction } from "@/src/hooks/useTransaction";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { Transaction } from "@/src/types/TransactionType";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TransactionModal } from "./TransactionModal";

interface CalendarViewProps {
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  onDateSelect,
  selectedDate,
}) => {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkMode : LightMode;
  const { transactions } = useTransaction();
  const { categories } = useCategories();

  const [modalVisible,setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calcular dias do mês
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const formatDateBR = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const getDayTransactions = (day: number): Transaction[] => {
    const dateStr =
    `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return transactions.filter((t) => t.date === dateStr);
  };

  const selectedTransactions = transactions.filter(
    (t) => t.date === selectedDate
  );

  const monthDays = useMemo(() => {
    const days: (number | null)[] = [];
    
    // Dias vazios no início
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  }, [daysInMonth, firstDayOfMonth]);

  const formatMonthYear = () => {
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return `${months[currentMonth]} ${currentYear}`;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    const [year, month, date] = selectedDate.split("-").map(Number);
    return date === day && month - 1 === currentMonth && year === currentYear;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleDayPress = (day: number) => {
    const dateStr =
  `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onDateSelect?.(dateStr);
  };

  const renderDayCell = (day: number | null) => {
    if (day === null) {
      return <View style={styles.emptyCell} />;
    }
    
    const today = isToday(day);
    const selected = isSelected(day);
    const dayTransactions = getDayTransactions(day);
    const hasTransactions = dayTransactions.length > 0;

    const totalIncome = dayTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = dayTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return (
      <TouchableOpacity
        style={[
          styles.dayCell,
          {
            backgroundColor: selected
              ? Colors.lightGreen
              : today
              ? Colors.backgroundColor
              : Colors.cardBackground,
            borderColor: today ? Colors.borderColor : Colors.accentGreen,
          },
        ]}
          onPress={() => handleDayPress(day)}
        >
        <Text
          style={[
            styles.dayNumber,
            {
              color: selected ? Colors.textColorPrimary : today ? Colors.lightGreen : Colors.textColorPrimary,
              fontWeight: today || selected ? "bold" : "normal",
            },
          ]}
        >
          {day}
        </Text>
        {hasTransactions && (
          <View style={styles.transactionIndicators}>
            {totalIncome > 0 && (
              <View style={[styles.indicator, { backgroundColor: Colors.accentGreen }]} />
            )}
            {totalExpense > 0 && (
              <View style={[styles.indicator, { backgroundColor: "#FF6B6B" }]} />
            )}
          </View>
        )}
        {hasTransactions && (
          <Text style={[styles.transactionCount, { color: Colors.textColorPrimary }]}>
            {dayTransactions.length}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: Colors.backgroundColor }]}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Text style={styles.navButton}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.monthYear}>{formatMonthYear()}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text style={styles.navButton}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {/* Day labels */}
        <View style={styles.weekHeader}>
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
            <Text
              key={day}
              style={[styles.weekHeaderText, { color: Colors.textColorPrimary }]}
            >
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar cells */}
        <View style={styles.daysGrid}>
          {monthDays.map((day, index) => (
            <View key={index}>{renderDayCell(day)}</View>
          ))}
        </View>
      </View>

      {/* Transaction Details */}
      {selectedDate && (
        <ScrollView style={styles.detailsContainer}>
          <Text style={[styles.detailsTitle, { color: Colors.textColorPrimary }]}>
            Transações de {formatDateBR(selectedDate)}
          </Text>
          {selectedTransactions.map((t) => {
            const category = categories.find((c) => c.id === t.categoryId);
            return (
              <View
                key={t.id}
                style={[styles.transactionItem, { borderBottomColor: Colors.borderColor }]}
              >
                <TouchableOpacity 
                  style={styles.button}
                  onPress={() => handleTransactionPress(t)}
                >
                  <View
                    style={[
                      styles.categoryDot,
                      { backgroundColor: category?.color || Colors.accentGreen },
                    ]}
                  />
                  <View style={styles.transactionInfo}>
                    <Text style={[styles.transactionDesc, { color: Colors.textColorPrimary }]}>
                      {t.description}
                    </Text>
                    <Text style={[styles.transactionCat, { color: Colors.accentGreen }]}>
                      {category?.name}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color:
                        t.type === "income" ? Colors.lightGreen : "#FF6B6B",
                      },
                    ]}
                    >
                    {t.type === "income" ? "+" : "-"} R$ {t.amount.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
      <TransactionModal
        visible={modalVisible}
        transaction={selectedTransaction}
        onClose={() => setModalVisible(false)}
        onSave={() => {}}
      />
    </View>
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
    paddingVertical: 15,
  },
  navButton: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  modeSelector: {
    flexDirection: "row",
    padding: 10,
    marginHorizontal: 12,
    marginVertical: 10,
    borderRadius: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 6,
    alignItems: "center",
  },
  modeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  calendarGrid: {
    paddingHorizontal: 12,
    marginVertical: 10,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  weekHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    width: "14.28%",
    textAlign: "center",
  },
  daysGrid: {
    paddingLeft: 10,
    marginRight: -12,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  emptyCell: {
    width: "14.28%",
    aspectRatio: 1,
  },
  dayCell: {
    padding: 15,
    width: "14.28%",
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  transactionIndicators: {
    flexDirection: "row",
    marginTop: 4,
  },
  indicator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 1,
  },
  transactionCount: {
    fontSize: 10,
    marginTop: 2,
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    marginTop: -10,
  },
  transactionCat: {
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "bold",
  },
  button: {
    flex:1,
    flexDirection:"row",
    marginTop: 10,
  }
});
