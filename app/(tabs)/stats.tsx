import { BarChart, LineChart, PieChart } from "@/src/components/Charts";
import { useCategories } from "@/src/hooks/useCategories";
import { useTheme } from "@/src/hooks/useTheme";
import { useTransaction } from "@/src/hooks/useTransaction";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { useMemo, useState } from "react";
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function StatsScreen() {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkMode : LightMode;

  const { transactions } = useTransaction();
  const { categories } = useCategories();

  const [refreshing, setRefreshing] = useState(false);
  const [monthView, setMonthView] = useState<"month" | "year">("month");

  // Get current month/year (memoized to avoid recreation)
  const now = useMemo(() => new Date(), []);
  const currentMonth = now.toISOString().substring(0, 7);
  const currentYear = now.getFullYear();

  // Filter transactions for current period
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (monthView === "month") {
        return t.date.startsWith(currentMonth);
      } else {
        return t.date.startsWith(String(currentYear));
      }
    });
  }, [transactions, monthView, currentMonth, currentYear]);

  // Calculate monthly trends (last 12 months)
  const monthlyTrends = useMemo(() => {
    const trends: Record<
      string,
      { income: number; expense: number; balance: number }
    > = {};

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now);
      d.setMonth(d.getMonth() - i);
      const key = d.toISOString().substring(0, 7);
      trends[key] = { income: 0, expense: 0, balance: 0 };
    }

    // Aggregate transactions
    transactions.forEach((t) => {
      const key = t.date.substring(0, 7);
      if (trends[key]) {
        if (t.type === "income") {
          trends[key].income += t.amount;
        } else if (t.type === "expense") {
          trends[key].expense += t.amount;
        }
      }
    });

    // Calculate balance
    Object.keys(trends).forEach((key) => {
      trends[key].balance = trends[key].income - trends[key].expense;
    });

    return Object.entries(trends).map(([month, data]) => ({
      month,
      label: new Date(month + "-01").toLocaleDateString("pt-BR", {
        month: "short",
      }),
      income: data.income,
      expense: data.expense,
      balance: data.balance,
    }));
  }, [transactions, now]);

  // Calculate category breakdown
  const categoryBreakdown = useMemo(() => {
    return categories
      .map((cat) => {
        const catTransactions = filteredTransactions.filter(
          (t) => t.categoryId === cat.id
        );
        const income = catTransactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = catTransactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          id: cat.id,
          name: cat.name,
          color: cat.color || Colors.accentGreen,
          income,
          expense,
          net: income - expense,
        };
      })
      .filter((c) => c.income > 0 || c.expense > 0)
      .sort((a, b) => b.expense - a.expense);
  }, [categories, filteredTransactions, Colors.accentGreen]);

  // Calculate totals
  const totals = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRefreshing(false);
  };

  // Chart data preparations
  const expenseCategoryData = categoryBreakdown
    .filter((c) => c.expense > 0)
    .slice(0, 5)
    .map((c) => ({
      label: c.name.substring(0, 10),
      value: c.expense,
      color: c.color,
    }));

  const incomeCategoryData = categoryBreakdown
    .filter((c) => c.income > 0)
    .slice(0, 5)
    .map((c) => ({
      label: c.name.substring(0, 10),
      value: c.income,
      color: c.color,
    }));

  const incomeExpenseData = [
    { label: "Receita", value: totals.income, color: Colors.lightGreen },
    { label: "Despesa", value: totals.expense, color: "#FF6B6B" },
  ];

  const balanceTrendData = monthlyTrends.map((t) => ({
    label: t.label,
    value: t.balance,
  }));

  return (
    <View style={[styles.container, { backgroundColor: Colors.deepGreen }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: Colors.deepGreen }]}>
        <Text style={styles.headerTitle}>Estatísticas</Text>
      </View>

      {/* Period Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            monthView === "month" && { backgroundColor: Colors.mediumGreen },
          ]}
          onPress={() => setMonthView("month")}
        >
          <Text
            style={[
              styles.toggleText,
              { color: Colors.lightGreen },
              monthView === "month" && { color: Colors.textColorPrimary },
            ]}
          >
            Mês
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            monthView === "year" && { backgroundColor: Colors.mediumGreen },
          ]}
          onPress={() => setMonthView("year")}
        >
          <Text
            style={[
              styles.toggleText,
              { color: Colors.lightGreen },
              monthView === "year" && { color: Colors.textColorPrimary },
            ]}
          >
            Ano
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.textColorPrimary}
          />
        }
      >
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View
            style={[
              styles.summaryCard,
              { backgroundColor: Colors.accentGreen, opacity: 0.95 },
            ]}
          >
            <Text style={styles.summaryLabel}>Receitas</Text>
            <Text style={[styles.summaryAmount, { color: Colors.textColorPrimary }]}>R$ {totals.income.toFixed(2)}</Text>
          </View>
          <View
            style={[
              styles.summaryCard,
              { backgroundColor: Colors.accentGreen, opacity: 0.95 },
            ]}
          >
            <Text style={styles.summaryLabel}>Despesas</Text>
            <Text style={[styles.summaryAmount, { color: "#FF6B6B" }]}>R$ {totals.expense.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor:
                  totals.balance >= 0 ? Colors.accentGreen : "#FF6B6B",
                opacity: 0.95,
              },
            ]}
          >
            <Text style={styles.summaryLabel}>Saldo</Text>
            <Text style={[styles.summaryAmount, { color: Colors.textColorPrimary }]}>R$ {totals.balance.toFixed(2)}</Text>
          </View>
          <View
            style={[
              styles.summaryCard,
              { backgroundColor: Colors.accentGreen, opacity: 0.95 },
            ]}
          >
            <Text style={styles.summaryLabel}>Taxa Economia</Text>
            <Text style={[styles.summaryAmount, { color: "#FFD700" }]}>
              {totals.income > 0
                ? (((totals.income - totals.expense) / totals.income) * 100).toFixed(
                    1
                  )
                : "0"}
              %
            </Text>
          </View>
        </View>

        {/* Charts */}
        {expenseCategoryData.length > 0 && (
          <BarChart
            data={expenseCategoryData}
            title="Despesas por Categoria (Top 5)"
            maxValue={Math.max(
              ...expenseCategoryData.map((d) => d.value),
              1
            )}
          />
        )}

        {incomeCategoryData.length > 0 && (
          <BarChart
            data={incomeCategoryData}
            title="Receitas por Categoria (Top 5)"
            maxValue={Math.max(
              ...incomeCategoryData.map((d) => d.value),
              1
            )}
          />
        )}

        {incomeExpenseData.some((d) => d.value > 0) && (
          <PieChart
            data={incomeExpenseData.filter((d) => d.value > 0)}
            title="Distribuição Receita vs Despesa"
          />
        )}

        {balanceTrendData.length > 0 && (
          <LineChart
            data={balanceTrendData}
            title="Evolução do Saldo (últimos 12 meses)"
            lineColor={Colors.textColorPrimary}
          />
        )}

        {/* Category Detailed Breakdown */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.textColorPrimary }]}>
            Detalhamento por Categoria
          </Text>
          {categoryBreakdown.length > 0 ? (
            categoryBreakdown.map((cat) => (
              <View
                key={cat.id}
                style={[
                  styles.categoryRow,
                  { borderBottomColor: Colors.darkest },
                ]}
              >
                <View style={styles.categoryLeft}>
                  <View
                    style={[
                      styles.categoryDot,
                      { backgroundColor: cat.color },
                    ]}
                  />
                  <Text style={[styles.categoryName, { color: Colors.textColorPrimary }]}>
                    {cat.name}
                  </Text>
                </View>
                <View style={styles.categoryRight}>
                  {cat.income > 0 && (
                    <Text
                      style={[
                        styles.categoryValue,
                        { color: Colors.lightGreen },
                      ]}
                    >
                      +R$ {cat.income.toFixed(2)}
                    </Text>
                  )}
                  {cat.expense > 0 && (
                    <Text style={[styles.categoryValue, { color: "#FF6B6B" }]}>
                      -R$ {cat.expense.toFixed(2)}
                    </Text>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: "#4f6d5e" }]}>
              Sem movimentações neste período
            </Text>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  toggleContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
    fontWeight: "500",
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  section: {
    paddingHorizontal: 12,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
  },
  categoryRight: {
    alignItems: "flex-end",
  },
  categoryValue: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  emptyText: {
    textAlign: "center",
    paddingVertical: 20,
    fontSize: 14,
  },
  bottomPadding: {
    height: 20,
  },
});