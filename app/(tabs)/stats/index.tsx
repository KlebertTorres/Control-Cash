import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../constants/colors";
import { useTransactionStore } from "../../../src/stores/transactionStore";

export default function StatsScreen() {
  const { transactions, getBalance } = useTransactionStore();

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = getBalance();

  const maxValue = Math.max(totalIncome, totalExpense, Math.abs(balance), 1);
  const getBarWidth = (value: number) => `${(value / maxValue) * 100}%`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estatísticas</Text>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Total de Ganhos</Text>
        <Text style={[styles.statValue, { color: Colors.accentGreen }]}>
          R$ {totalIncome.toFixed(2)}
        </Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Total de Gastos</Text>
        <Text style={[styles.statValue, { color: "red" }]}>
          R$ {totalExpense.toFixed(2)}
        </Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Saldo Atual</Text>
        <Text
          style={[
            styles.statValue,
            { color: balance >= 0 ? Colors.accentGreen : "red" },
          ]}
        >
          R$ {balance.toFixed(2)}
        </Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Total de Transações</Text>
        <Text style={styles.statValue}>{transactions.length}</Text>
      </View>

      <Text style={styles.graphTitle}>Gráfico do mês</Text>
      <View style={styles.graphContainer}>
        <View style={styles.graphRow}>
          <Text style={styles.graphLabel}>Ganhos</Text>
          <View
            style={[
              styles.graphBar,
              {
                width: getBarWidth(totalIncome),
                backgroundColor: Colors.accentGreen,
              },
            ]}
          />
          <Text style={styles.graphValue}>R$ {totalIncome.toFixed(2)}</Text>
        </View>
        <View style={styles.graphRow}>
          <Text style={styles.graphLabel}>Gastos</Text>
          <View
            style={[
              styles.graphBar,
              { width: getBarWidth(totalExpense), backgroundColor: "red" },
            ]}
          />
          <Text style={styles.graphValue}>R$ {totalExpense.toFixed(2)}</Text>
        </View>
        <View style={styles.graphRow}>
          <Text style={styles.graphLabel}>Saldo</Text>
          <View
            style={[
              styles.graphBar,
              {
                width: getBarWidth(Math.abs(balance)),
                backgroundColor: balance >= 0 ? Colors.accentGreen : "red",
              },
            ]}
          />
          <Text style={styles.graphValue}>R$ {balance.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreen,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    color: "#000",
    textAlign: "center",
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  statLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  graphTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginTop: 20,
    marginBottom: 12,
    textAlign: "center",
  },
  graphContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  graphRow: {
    marginBottom: 14,
  },
  graphLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  graphBar: {
    height: 18,
    borderRadius: 9,
    marginBottom: 6,
  },
  graphValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "700",
  },
});
