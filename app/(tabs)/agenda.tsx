import { CalendarView } from "@/src/components/CalendarView";
import { useTheme } from "@/src/hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function AgendaScreen() {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkMode : LightMode;

  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
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
    paddingTop: 10,
  },
});
