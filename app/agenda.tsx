import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function AgendaScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Agenda</Text>
      <View style={styles.line} />

      {/* Placeholder do Calendário */}
      <View style={styles.calendarContainer}>
        <Text style={styles.calendarText}>Agosto 2025</Text>
        <View style={styles.calendarBox} />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.dateText}>Dia 21 - R$ 670,00</Text>
        <Text style={styles.detailText}>• Aluguel - R$ 600,00</Text>
        <Text style={styles.detailText}>• Água - R$ 70,00</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.dateText}>Dia 22 - R$ 100,00</Text>
        <Text style={styles.detailText}>• Energia - R$ 100,00</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#98b8a0",
    padding: 25,
    paddingTop: 50,
  },
  title: { fontSize: 32, color: "#000" },
  line: { height: 1, backgroundColor: "#000", marginVertical: 10 },
  calendarContainer: { alignItems: "center", marginBottom: 20 },
  calendarText: { fontSize: 18, marginBottom: 10 },
  calendarBox: {
    width: "100%",
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  infoBox: { marginBottom: 25 },
  dateText: { fontSize: 22, fontWeight: "500", color: "#000" },
  detailText: { fontSize: 18, marginLeft: 20, color: "#333" },
});
