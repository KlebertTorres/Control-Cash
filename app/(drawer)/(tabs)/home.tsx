import { DashboardCard } from "@/src/components/DashboardCard";
import { ProgressBar } from "@/src/components/ProgressBar";
import { TransactionList } from "@/src/components/TransactionList";
import { TransactionModal } from "@/src/components/TransactionModal";
import { useAuth } from "@/src/hooks/useAuth";
import { useReport } from "@/src/hooks/useReport";
import { useTheme } from "@/src/hooks/useTheme";
import { useTransaction } from "@/src/hooks/useTransaction";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { Transaction } from "@/src/types/TransactionType";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MenuButton } from "@/src/components/MenuButton";

export default function HomeScreen() {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkMode : LightMode;

  const { user } = useAuth();
  const { transactions, getTotalIncome, getTotalExpense } = useTransaction();
  const { dashboardData, getDashboardData } = useReport();
  const router = useRouter();

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const currentMonth = new Date().toISOString().substring(0, 7);
  const monthlyIncome = getTotalIncome(currentMonth);
  const monthlyExpense = getTotalExpense(currentMonth);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      const today = new Date();
      let startDate = "";
      let endDate = today.toISOString().split("T")[0];

      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      startDate = monthStart.toISOString().split("T")[0];

      await getDashboardData(user.uid, startDate, endDate);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const income = dashboardData?.periodIncome ?? 0;
  const expense = dashboardData?.periodExpense ?? 0;

  const balance = income - expense;
  const balanceColor = balance >= 0 ? Colors.cardBackground : "#FF6B6B";

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const recentTransactions = transactions?.slice(0, 5);

  return (
    <View style={[styles.container, { backgroundColor: Colors.backgroundColor }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: Colors.cardBackground }]}>
          <MenuButton/>
          <Text
            style={[styles.headerTitle, {color: Colors.textColorPrimary}]}
          >
            Menu inicial
          </Text>
        </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadDashboardData}
          />
        }
      >
        <Text style={[styles.welcome, { color: Colors.textColorPrimary }]}>
            Bem vindo, {user?.name || "Usuário"}! 👋
        </Text>

        {/* Main Balance Card */}
        <View style={[styles.mainCard, { backgroundColor: balanceColor }]}>
          <Text style={styles.mainCardLabel}>Saldo Atual</Text>
          <Text style={styles.mainCardValue}>R$ {balance.toFixed(2)}</Text>
          <Text style={styles.mainCardSubtitle}>
            {balance >= 0 ? "✓ Balanço positivo" : "⚠ Balanço negativo"}
          </Text>
        </View>

        {/* Monthly Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.textColorPrimary }]}>Resumo do Mês</Text>
          
          <DashboardCard
            title="Receitas"
            value={`R$ ${monthlyIncome.toFixed(2)}`}
            icon="📈"
            color={Colors.cardBackground}
          />
          
          <DashboardCard
            title="Despesas"
            value={`R$ ${Math.abs(monthlyExpense).toFixed(2)}`}
            icon="📉"
            color={Colors.cardBackground}
          />

          <DashboardCard
            title="Economizado"
            value={`R$ ${Math.max(0, monthlyIncome + monthlyExpense).toFixed(2)}`}
            icon="💰"
            color={Colors.cardBackground}
          />
        </View>

        {/* Expense Percentage */}
        <View style={styles.section}>
          <ProgressBar
            label="Gasto do Mês"
            value={monthlyExpense}
            total={monthlyIncome}
            color="#FF6B6B"
            showPercentage
          />
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: Colors.cardBackground }]}>
            <Text style={styles.metricIcon}>📅</Text>
            <Text style={styles.metricValue}>{dashboardData?.overdueAccounts || 0}</Text>
            <Text style={styles.metricLabel}>Contas Vencidas</Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: Colors.cardBackground }]}>
            <Text style={styles.metricIcon}>⏰</Text>
            <Text style={[styles.metricValue, { color: "#FFA500" }]}>{dashboardData?.upcomingAccounts || 0}</Text>
            <Text style={styles.metricLabel}>Próximas</Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: Colors.cardBackground }]}>
            <Text style={styles.metricIcon}>📤</Text>
            <Text style={[styles.metricValue, { color: "#2196F3" }]}>R$ {(dashboardData?.receivables || 0).toFixed(0)}</Text>
            <Text style={styles.metricLabel}>A Receber</Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: Colors.textColorPrimary }]}>
              Últimas Movimentações
            </Text>

            <TouchableOpacity onPress={() => router.push("/(drawer)/(tabs)/stats")}>
              <Text style={[styles.viewAll, { color: Colors.textColorPrimary }]}>Ver Mais →</Text>
            </TouchableOpacity>
          </View>
          <TransactionList 
            transactions={recentTransactions}
            onTransactionPress={handleTransactionPress}
            maxItems={5}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.textColorPrimary }]}>Ações Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: Colors.cardBackground }]}
              onPress={() => router.push("/add-transaction")}
            >
              <Text style={styles.quickActionIcon}>➕</Text>
              <Text style={styles.quickActionLabel}>Adicionar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: Colors.cardBackground }]}
              onPress={() => router.push("/(drawer)/(tabs)/stats")}
            >
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionLabel}>Relatórios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: Colors.cardBackground }]}
              onPress={() => router.push("/(drawer)/(tabs)/calendar")}
            >
              <Text style={styles.quickActionIcon}>📅</Text>
              <Text style={styles.quickActionLabel}>Calendário</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: Colors.cardBackground }]}
              onPress={() => router.push("/(drawer)/settings")}
            >
              <Text style={styles.quickActionIcon}>⚙️</Text>
              <Text style={styles.quickActionLabel}>Config</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <TransactionModal
        visible={modalVisible}
        transaction={selectedTransaction}
        onClose={() => setModalVisible(false)}
        onSave={loadDashboardData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 10
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
  },
    headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  welcome: {
    fontSize: 26,
    fontWeight: "700",
  },
  mainCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainCardLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  mainCardValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  mainCardSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  section: {
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  viewAll: {
    fontSize: 12,
    fontWeight: "600",
  },
  metricsGrid: {
    flexDirection: "row",
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  metricCard: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  metricLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
    textAlign: "center",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
  },
  quickAction: {
    width: "48%",
    marginHorizontal: "1%",
    marginVertical: 8,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  bottomPadding: {
    height: 40,
  },
});
