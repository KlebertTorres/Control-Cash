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
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkMode : LightMode;

  const { user } = useAuth();
  const { getBalance, transactions, getTotalIncome, getTotalExpense } = useTransaction();
  const { dashboardData, getDashboardData, loadingReports } = useReport();
  const router = useRouter();

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const balance = getBalance();
  const currentMonth = new Date().toISOString().substring(0, 7);
  const monthlyIncome = getTotalIncome(currentMonth);
  const monthlyExpense = getTotalExpense(currentMonth);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      await getDashboardData();
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const balanceColor = balance >= 0 ? Colors.accentGreen : "#FF6B6B";
  const utilizationPercentage = monthlyIncome > 0 ? (monthlyExpense / monthlyIncome) * 100 : 0;

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={loadDashboardData}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.welcome, { color: Colors.text }]}>
            Bem vindo, {user?.name || "Usuário"}! 👋
          </Text>
        </View>

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
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Resumo do Mês</Text>
          
          <DashboardCard
            title="Receitas"
            value={`R$ ${monthlyIncome.toFixed(2)}`}
            icon="📈"
            color={Colors.accentGreen}
          />
          
          <DashboardCard
            title="Despesas"
            value={`R$ ${monthlyExpense.toFixed(2)}`}
            icon="📉"
            color="#FF6B6B"
          />

          <DashboardCard
            title="Economizado"
            value={`R$ ${Math.max(0, monthlyIncome - monthlyExpense).toFixed(2)}`}
            icon="💰"
            color="#FFD700"
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
          <View style={[styles.metricCard, { backgroundColor: Colors.accentGreen }]}>
            <Text style={styles.metricIcon}>📅</Text>
            <Text style={styles.metricValue}>{dashboardData?.overdueAccounts || 0}</Text>
            <Text style={styles.metricLabel}>Contas Vencidas</Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: "#FFA500" }]}>
            <Text style={styles.metricIcon}>⏰</Text>
            <Text style={styles.metricValue}>{dashboardData?.upcomingAccounts || 0}</Text>
            <Text style={styles.metricLabel}>Próximas</Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: "#2196F3" }]}>
            <Text style={styles.metricIcon}>📤</Text>
            <Text style={styles.metricValue}>R$ {(dashboardData?.receivables || 0).toFixed(0)}</Text>
            <Text style={styles.metricLabel}>A Receber</Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>Últimas Movimentações</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/stats")}>
              <Text style={[styles.viewAll, { color: Colors.primary }]}>Ver Mais →</Text>
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
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Ações Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: Colors.primary }]}
              onPress={() => router.push("/add-transaction")}
            >
              <Text style={styles.quickActionIcon}>➕</Text>
              <Text style={styles.quickActionLabel}>Adicionar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: Colors.accentGreen }]}
              onPress={() => router.push("/(tabs)/stats")}
            >
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionLabel}>Relatórios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: "#9C27B0" }]}
              onPress={() => router.push("/(tabs)/agenda")}
            >
              <Text style={styles.quickActionIcon}>📅</Text>
              <Text style={styles.quickActionLabel}>Calendário</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: "#FF9800" }]}
              onPress={() => router.push("/(tabs)/configuracoes")}
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
    paddingTop: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
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
    paddingHorizontal: 20,
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
