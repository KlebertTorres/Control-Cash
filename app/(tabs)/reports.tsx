import { BarChart, LineChart, PieChart } from "@/src/components/Charts";
import { useCategories } from "@/src/hooks/useCategories";
import { useReport } from "@/src/hooks/useReport";
import { useTheme } from "@/src/hooks/useTheme";
import { useTransaction } from "@/src/hooks/useTransaction";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { useEffect, useState } from "react";
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ReportsScreen() {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkMode : LightMode;

  const { dashboardData, generateReport, loadingReports, getDashboardData } =
    useReport();
  const { transactions } = useTransaction();
  const { categories } = useCategories();

  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "annual">("monthly");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const loadReports = async () => {
    try {
      setRefreshing(true);
      const today = new Date();
      let startDate = "";
      let endDate = today.toISOString().split("T")[0];

      switch (period) {
        case "daily":
          startDate = endDate;
          break;
        case "weekly":
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          startDate = weekStart.toISOString().split("T")[0];
          break;
        case "monthly":
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          startDate = monthStart.toISOString().split("T")[0];
          break;
        case "annual":
          const yearStart = new Date(today.getFullYear(), 0, 1);
          startDate = yearStart.toISOString().split("T")[0];
          break;
      }

      await generateReport(period, startDate, endDate);
      await getDashboardData();
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const currentMonth = new Date().toISOString().substring(0, 7);
  const monthTransactions = transactions.filter((t) =>
    t.date.startsWith(currentMonth)
  );

  const categoryChartData = categories
    .map((cat) => {
      const catTransactions = monthTransactions.filter((t) => t.categoryId === cat.id);
      const amount = catTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        label: cat.name.substring(0, 8),
        value: amount,
        color: cat.color || Colors.accentGreen,
      };
    })
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const monthlyTrendData =
    dashboardData?.monthlyTrend
      .map((trend) => ({
        label: trend.month.split("-")[1],
        value: trend.balance,
      }))
      .slice(-6) || [];

  const incomeCategoryData = categories
    .map((cat) => {
      const catTransactions = monthTransactions.filter((t) => t.categoryId === cat.id);
      const amount = catTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        label: cat.name.substring(0, 8),
        value: amount,
        color: cat.color || Colors.accentGreen,
      };
    })
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const totalIncome = dashboardData?.monthlyIncome || 0;
  const totalExpense = dashboardData?.monthlyExpense || 0;

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: Colors.primary }]}>
        <Text style={styles.headerTitle}>Relatórios</Text>
      </View>

      {/* Period Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.periodSelector}
      >
        {(["daily", "weekly", "monthly", "annual"] as const).map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.periodButton,
              period === p && { backgroundColor: Colors.primary },
            ]}
            onPress={() => setPeriod(p)}
          >
            <Text
              style={[
                styles.periodText,
                period === p && { color: "white" },
              ]}
            >
              {p === "daily"
                ? "Diário"
                : p === "weekly"
                ? "Semanal"
                : p === "monthly"
                ? "Mensal"
                : "Anual"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Reports Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || loadingReports}
            onRefresh={loadReports}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: Colors.accentGreen }]}>
            <Text style={styles.summaryLabel}>Receitas</Text>
            <Text style={styles.summaryValue}>R$ {totalIncome.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: "#FF6B6B" }]}>
            <Text style={styles.summaryLabel}>Despesas</Text>
            <Text style={styles.summaryValue}>R$ {totalExpense.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor:
                  totalIncome - totalExpense >= 0 ? Colors.accentGreen : "#FF6B6B",
              },
            ]}
          >
            <Text style={styles.summaryLabel}>Resultado</Text>
            <Text style={styles.summaryValue}>
              R$ {(totalIncome - totalExpense).toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: "#FFD700" }]}>
            <Text style={styles.summaryLabel}>% Economia</Text>
            <Text style={styles.summaryValue}>
              {totalIncome > 0
                ? ((((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1))
                : "0"}
              %
            </Text>
          </View>
        </View>

        {/* Charts */}
        {categoryChartData.length > 0 && (
          <BarChart
            data={categoryChartData}
            title="Top 5 Despesas por Categoria"
            maxValue={Math.max(...categoryChartData.map((d) => d.value), 1)}
          />
        )}

        {incomeCategoryData.length > 0 && (
          <BarChart
            data={incomeCategoryData}
            title="Top 5 Receitas por Categoria"
            maxValue={Math.max(...incomeCategoryData.map((d) => d.value), 1)}
          />
        )}

        {monthlyTrendData.length > 0 && (
          <LineChart
            data={monthlyTrendData}
            title="Evolução do Saldo (últimos 6 meses)"
            lineColor={Colors.primary}
          />
        )}

        {categoryChartData.length > 0 && (
          <PieChart
            data={categoryChartData}
            title="Distribuição de Despesas"
          />
        )}

        {/* Detailed Breakdown */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>
            Detalhamento por Categoria
          </Text>
          {categories
            .filter((cat) => {
              const amount = monthTransactions
                .filter(
                  (t) =>
                    t.categoryId === cat.id &&
                    (t.type === "expense" || t.type === "income")
                )
                .reduce((sum, t) => sum + t.amount, 0);
              return amount > 0;
            })
            .map((cat) => {
              const amount = monthTransactions
                .filter((t) => t.categoryId === cat.id)
                .reduce(
                  (sum, t) =>
                    sum +
                    (t.type === "expense"
                      ? -t.amount
                      : t.type === "income"
                      ? t.amount
                      : 0),
                  0
                );
              const percentage =
                totalExpense > 0 ? (Math.abs(amount) / totalExpense) * 100 : 0;

              return (
                <View
                  key={cat.id}
                  style={[
                    styles.categoryRow,
                    { borderBottomColor: Colors.border },
                  ]}
                >
                  <View style={styles.categoryInfo}>
                    <View
                      style={[
                        styles.categoryCircle,
                        { backgroundColor: cat.color },
                      ]}
                    />
                    <Text style={[styles.categoryName, { color: Colors.text }]}>
                      {cat.name}
                    </Text>
                  </View>
                  <View style={styles.categoryStats}>
                    <Text
                      style={[
                        styles.categoryAmount,
                        {
                          color: amount >= 0 ? Colors.accentGreen : "#FF6B6B",
                        },
                      ]}
                    >
                      R$ {Math.abs(amount).toFixed(2)}
                    </Text>
                    <Text
                      style={[styles.categoryPercentage, { color: Colors.placeholder }]}
                    >
                      {percentage.toFixed(1)}%
                    </Text>
                  </View>
                </View>
              );
            })}
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
  periodSelector: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  periodText: {
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  section: {
    paddingHorizontal: 12,
    marginVertical: 12,
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
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
  },
  categoryStats: {
    alignItems: "flex-end",
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  categoryPercentage: {
    fontSize: 12,
  },
  bottomPadding: {
    height: 20,
  },
});
