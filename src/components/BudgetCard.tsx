import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DarkMode, LightMode } from "../styles/cores";
import { Budget } from "../contexts/BudgetContext";

interface BudgetCardProps {
  budget: Budget;
  usage: number;
  darkMode: boolean;
  onPress?: () => void;
  onDelete?: () => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  usage,
  darkMode,
  onPress,
  onDelete,
}) => {
  const Colors = darkMode ? DarkMode : LightMode;
  const percentage = (usage / budget.limit) * 100;
  const exceeded = usage > budget.limit;
  const remaining = budget.limit - usage;

  const getStatusColor = () => {
    if (exceeded) return "#ff6b6b";
    if (percentage >= 80) return "#ffd43b";
    return Colors.primary;
  };

  const getStatusText = () => {
    if (exceeded) return "Limite excedido";
    if (percentage >= 80) return "Perto do limite";
    return "Sob controle";
  };

  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: Colors.cardBackground,
          borderColor: Colors.borderColor,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.categoryName, { color: Colors.text }]}>
            {budget.categoryName}
          </Text>
          <Text style={[styles.period, { color: Colors.secondary }]}>
            Limite {budget.period === "monthly" ? "Mensal" : "Anual"}
          </Text>
        </View>

        {onDelete && (
          <Pressable onPress={onDelete} hitSlop={8}>
            <Ionicons
              name="trash-outline"
              size={20}
              color={Colors.secondary}
            />
          </Pressable>
        )}
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: Colors.backgroundColor,
              borderColor: Colors.borderColor,
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(100, percentage)}%`,
                backgroundColor: getStatusColor(),
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: Colors.secondary }]}>
            Gasto
          </Text>
          <Text style={[styles.statValue, { color: Colors.text }]}>
            R$ {usage.toFixed(2)}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: Colors.secondary }]}>
            Limite
          </Text>
          <Text style={[styles.statValue, { color: Colors.text }]}>
            R$ {budget.limit.toFixed(2)}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: Colors.secondary }]}>
            {exceeded ? "Acima" : "Restante"}
          </Text>
          <Text
            style={[
              styles.statValue,
              {
                color: exceeded ? "#ff6b6b" : Colors.primary,
              },
            ]}
          >
            R$ {Math.abs(remaining).toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor() + "20" },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor() },
            ]}
          >
            {getStatusText()} ({Math.round(Math.min(100, percentage))}%)
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  period: {
    fontSize: 12,
  },
  progressContainer: {
    paddingVertical: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    alignItems: "flex-start",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
