import { useTheme } from "@/src/hooks/useTheme";
import { useTransaction } from "@/src/hooks/useTransaction";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function AgendaScreen() {

  const { darkMode } = useTheme();
  const Colors = darkMode? DarkMode: LightMode;

  const { transactions } = useTransaction();

  // Group transactions by date
  const transactionsByDate = transactions.reduce(
    (acc, transaction) => {
      const date = transaction.date.split("T")[0]; // Get YYYY-MM-DD
      if (!acc[date]) acc[date] = [];
      acc[date].push(transaction);
      return acc;
    },
    {} as Record<string, typeof transactions>,
  );

  return (
    <ScrollView style={[styles.container, {backgroundColor: Colors.lightGreen}]}>
      <Text style={styles.title}>Agenda</Text>
      <View style={styles.line} />

      <View style={styles.calendarContainer}>
        <Text style={styles.calendarText}>Calendário</Text>
        <View style={styles.calendarBox} />
      </View>

      {Object.keys(transactionsByDate).length > 0 ? (
        Object.entries(transactionsByDate).map(([date, dayTransactions]) => (
          <View key={date} style={styles.infoBox}>
            <Text style={styles.dateText}>
              {new Date(date).toLocaleDateString("pt-BR")} - R${" "}
              {dayTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
            </Text>
            {dayTransactions.map((transaction) => (
              <Text key={transaction.id} style={styles.detailText}>
                • {transaction.description} - R$ {transaction.amount.toFixed(2)}
              </Text>
            ))}
          </View>
        ))
      ) : (
        <View style={styles.infoBox}>
          <Text style={styles.dateText}>Nenhuma transação ainda</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    color: "#000",
  },
  line: {
    height: 1,
    backgroundColor: "#000",
    marginVertical: 10,
  },
  calendarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  calendarText: {
    fontSize: 18,
    marginBottom: 10,
  },
  calendarBox: {
    width: "100%",
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  infoBox: {
    marginBottom: 25,
  },
  dateText: {
    fontSize: 22,
    fontWeight: "500",
    color: "#000",
  },
  detailText: {
    fontSize: 18,
    marginLeft: 20,
    color: "#333",
  },
});
