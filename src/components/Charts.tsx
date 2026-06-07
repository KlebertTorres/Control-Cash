import { useTheme } from "@/src/hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BarChartProps {
  data: { label: string; value: number; color: string }[];
  title?: string;
  maxValue?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  maxValue,
}) => {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkMode : LightMode;

  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  const chartHeight = 200;

  return (
    <View style={[styles.container, { backgroundColor: Colors.cardBackground }]}>
      {title && (
        <Text style={[styles.title, { color: Colors.textColorPrimary }]}>{title}</Text>
      )}
      <View style={styles.chart}>
        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const barHeight = (item.value / max) * chartHeight;
            return (
              <View key={index} style={styles.barWrapper}>
                <Text
                  style={[
                    styles.barValue,
                    { color: Colors.textColorPrimary, fontSize: 10 },
                  ]}
                >
                  {item.value > 0 ? `R$ ${item.value.toFixed(0)}` : "-"}
                </Text>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(barHeight, 10),
                      backgroundColor: item.color,
                    },
                  ]}
                />
                <Text style={[styles.barLabel, { color: Colors.textColorPrimary }]}>
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>
        <View
          style={[styles.axisLine, { backgroundColor: Colors.textColorPrimary }]}
        />
      </View>
    </View>
  );
};

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  title?: string;
}

export const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkMode : LightMode;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={[styles.container, { backgroundColor: Colors.cardBackground }]}>
      {title && (
        <Text style={[styles.title, { color: Colors.textColorPrimary }]}>{title}</Text>
      )}
      <View style={styles.pieContainer}>
        <View style={styles.legend}>
          {data.map((item, index) => {
            const percentage =
              total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
            return (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: item.color },
                  ]}
                />
                <Text
                  style={[styles.legendLabel, { color: Colors.textColorPrimary }]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
                <Text
                  style={[styles.legendPercentage, { color: Colors.textColorPrimary }]}
                >
                  {percentage}%
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

interface LineChartProps {
  data: { label: string; value: number }[];
  title?: string;
  lineColor?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  lineColor = "#2196F3",
}) => {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkMode : LightMode;

  const max = Math.max(...data.map((d) => d.value), 1);
  const width = 320;
  const height = 200;
  const padding = 10;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1 || 1)) * (width - 2 * padding) + padding;
    const y = height - (item.value / max) * (height - 2 * padding) - padding;
    return { x, y, ...item };
  });

  return (
    <View style={[styles.container, { backgroundColor: Colors.cardBackground }]}>
      {title && (
        <Text style={[styles.title, { color: Colors.textColorPrimary }]}>{title}</Text>
      )}
      <View style={[styles.lineContainer, { width }]}>
        {points.map((point, index) => (
          <View key={index} style={styles.pointWrapper}>
            <View
              style={[
                styles.point,
                {
                  left: point.x - 4,
                  top: point.y - 4,
                  backgroundColor: lineColor,
                },
              ]}
            />
          </View>
        ))}
      </View>
      {/* Legend below chart */}
      <View style={styles.chartLegend}>
        {points.map((point, index) => (
          <View key={index} style={styles.chartLegendItem}>
            <Text style={[styles.chartLegendLabel, { color: Colors.textColorPrimary }]}>
              {point.label}
            </Text>
            <Text style={[styles.chartLegendValue, { color: Colors.lightGreen }]}>
              R$ {point.value.toFixed(0)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    marginVertical: 12,
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  chart: {
    height: 240,
    position: "relative",
  },
  barsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  barWrapper: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  bar: {
    width: "30%",
    borderRadius: 4,
    minHeight: 10,
  },
  barValue: {
    marginBottom: 4,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 11,
    textAlign: "center",
    fontWeight: "500",
  },
  axisLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  pieContainer: {
    alignItems: "center",
    minHeight: 200,
  },
  legend: {
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
  },
  legendPercentage: {
    fontSize: 12,
    fontWeight: "bold",
    minWidth: 40,
    textAlign: "right",
  },
  lineContainer: {
    height: 200,
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 12,
  },
  pointWrapper: {
    position: "absolute",
    width: 20,
    height: 20,
  },
  point: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: "absolute",
  },
  pointLabel: {
    position: "absolute",
    bottom: -20,
    width: 40,
    textAlign: "center",
  },
  chartLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  chartLegendItem: {
    alignItems: "center",
    marginVertical: 4,
    minWidth: "25%",
  },
  chartLegendLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  chartLegendValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
