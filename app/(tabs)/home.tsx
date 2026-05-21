import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/src/hooks/useAuth";
import { useTheme } from "@/src/hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores";

const { width } = Dimensions.get("window");

export default function HomeScreen() {

  const { darkMode } = useTheme();
  const Colors = darkMode? DarkMode: LightMode;

  const { user } = useAuth();

  return (
    <View style={[styles.container, {backgroundColor: Colors.lightGreen}]}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Bem vindo, {user?.email}!</Text>
        <View style={styles.headerLine} />
      </View>

      {/* Balance Section */}
      <Text style={styles.sectionTitle}>Saldo</Text>
      <View style={[styles.progressBarBg, {backgroundColor: Colors.accentGreen}]}>
        <View style={[styles.progressBarFill, { width: "22%" }]} />
      </View>
      <View style={styles.progressLabels}>
        <Text style={styles.labelRed}>22% utilizado</Text>
        <Text style={[styles.labelGreen, {color: Colors.accentGreen,}]}>78% disponível</Text>
      </View>

      {/* Bills Section */}
      <Text style={styles.sectionTitle}>Contas a Pagar</Text>
      <View style={styles.cardContainer}>
        <Text style={styles.arrow}>{"<"}</Text>
        <View style={[styles.card, {borderColor: Colors.accentGreen}]}>
          <Text style={styles.cardText}>Conta de Energia</Text>
          <Text style={styles.cardText}>Valor: R$ 100,00</Text>
          <Text style={styles.cardText}>Vencimento: 22/04/26</Text>
        </View>
        <Text style={styles.arrow}>{">"}</Text>
      </View>

      {/* Pagination */}
      <View style={styles.pagination}>
        <View style={[styles.dot, {backgroundColor: Colors.accentGreen}]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 60,
  },

  // Header
  header: {
    marginBottom: 30,
  },
  welcome: {
    fontSize: 32,
    fontWeight: "400",
    color: "#000",
  },
  headerLine: {
    height: 1,
    backgroundColor: "#000",
    width: "100%",
    marginTop: 5,
  },

  // Sections
  sectionTitle: {
    fontSize: 28,
    textAlign: "center",
    marginVertical: 20,
    color: "#000",
  },

  // Progress Bar
  progressBarBg: {
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    width: "100%",
  },
  progressBarFill: {
    backgroundColor: "red",
    height: "100%",
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 10,
  },
  labelRed: {
    color: "red",
    fontWeight: "bold",
  },
  labelGreen: {
    fontWeight: "bold",
  },

  // Card
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#d9d9d9",
    padding: 20,
    borderRadius: 25,
    borderWidth: 4,
    width: width * 0.6,
    height: 100,
    justifyContent: "center",
  },
  cardText: {
    fontSize: 14,
    color: "#000",
  },
  arrow: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 15,
  },

  // Pagination
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
    marginHorizontal: 5,
  },
});
