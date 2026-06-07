import { CalendarView } from "@/src/components/CalendarView";
import { useTheme } from "@/src/hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";

export default function AgendaScreen() {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkMode : LightMode;

  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  return (
    <View style={[styles.container, { backgroundColor: Colors.backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: Colors.cardBackground }]}>
        <Text style={styles.headerTitle}>Agenda</Text>
      </View>
      <CalendarView 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
    header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  }
});
