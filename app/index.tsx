import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Redirect } from 'expo-router'

const { width } = Dimensions.get("window");

export default function HomeScreen() {
    function Index() {
    const logado = false

    if (!logado) {
      return <Redirect href="/auth/register" />
    }
  }
  return (
    Index());
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Bem vindo, usuário!</Text>
        <View style={styles.headerLine} />
      </View>

      <Text style={styles.sectionTitle}>Saldo</Text>

      {/* Barra de progresso */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: "22%" }]} />
      </View>

      <View style={styles.progressLabels}>
        <Text style={styles.labelRed}>22% utilizado</Text>
        <Text style={styles.labelGreen}>78% disponível</Text>
      </View>

      <Text style={styles.sectionTitle}>Contas a Pagar</Text>

      <View style={styles.cardContainer}>
        <Text style={styles.arrow}>{"<"}</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>Conta de Energia</Text>
          <Text style={styles.cardText}>Valor: R$ 100,00</Text>
          <Text style={styles.cardText}>Vencimento: 22/04/26</Text>
        </View>
        <Text style={styles.arrow}>{">"}</Text>
      </View>

      {/* Indicador de páginas (bolinhas) */}
      <View style={styles.pagination}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  ;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#98b8a0",
    paddingHorizontal: 25,
    paddingTop: 60,
  },
  header: { 
    marginBottom: 30 
  },
  welcome: { 
    fontSize: 32, fontWeight: "400", color: "#000" 
  },
  headerLine: {
    height: 1,
    backgroundColor: "#000",
    width: "100%",
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 28,
    textAlign: "center",
    marginVertical: 20,
    color: "#000",
  },

  progressBarBg: {
    backgroundColor: "#2d5a4c",
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    width: "100%",
  },
  progressBarFill: { 
    backgroundColor: "red", height: "100%" 
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 10,
  },
  labelRed: { 
    color: "red", fontWeight: "bold" 
  },
  labelGreen: { 
    color: "#2d5a4c", fontWeight: "bold" 
  },
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
    borderColor: "#2d5a4c",
    width: width * 0.6,
    height: 100,
    justifyContent: "center",
  },
  cardText: { 
    fontSize: 14, color: "#000" 
  },
  arrow: { 
    fontSize: 24, fontWeight: "bold", marginHorizontal: 15 
  },
  pagination: { 
    flexDirection: "row", justifyContent: "center", marginTop: 15 
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
    marginHorizontal: 5,
  },
  dotActive: { 
    backgroundColor: "#2d5a4c" 
  },
});
