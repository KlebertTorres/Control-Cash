import { useTheme } from "@/src/hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProgressBarProps {
  label: string;
  value: number;
  total: number;
  color?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  total,
  color,
  showPercentage = true,
}) => {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkMode : LightMode;

  const percentage = total > 0 ? (value / total) * 100 : 0;
  const displayPercentage = Math.abs(Math.min(percentage, 100));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: Colors.text }]}>{label}</Text>
        {showPercentage && (
          <Text style={[styles.percentage, { color: Colors.accentGreen }]}>
            {Math.round(displayPercentage)}%
          </Text>
        )}
      </View>
      <View style={[styles.backgroundBar, { backgroundColor: Colors.cardBackground }]}>
        <View
          style={[
            styles.filledBar,
            {
              width: `${displayPercentage}%`,
              backgroundColor: color || Colors.accentGreen,
            },
          ]}
        />
      </View>
      <Text style={[styles.value, { color: Colors.accentGreen }]}>
        R$ {Math.abs(value).toFixed(2)} de R$ {total.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  percentage: {
    fontSize: 14,
    fontWeight: "bold",
  },
  backgroundBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  filledBar: {
    height: "100%",
    borderRadius: 4,
  },
  value: {
    fontSize: 12,
    textAlign: "right",
  },
});
