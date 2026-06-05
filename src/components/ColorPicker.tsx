import { useTheme } from "@/src/hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const COLORS = [
  "#FF6B6B", // Vermelho
  "#FF8C00", // Laranja
  "#FFD700", // Ouro
  "#4CAF50", // Verde
  "#00BCD4", // Cyan
  "#2196F3", // Azul
  "#9C27B0", // Roxo
  "#E91E63", // Rosa
  "#795548", // Marrom
  "#607D8B", // Cinza Azulado
  "#1ABC9C", // Turquesa
  "#3498DB", // Azul Claro
];

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorSelect,
  onClose,
}) => {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkMode : LightMode;

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={[styles.header, { backgroundColor: Colors.primary }]}>
        <Text style={styles.title}>Escolher Cor</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.colorGrid}>
        {COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorOption,
              {
                backgroundColor: color,
                borderWidth: selectedColor === color ? 3 : 0,
                borderColor: selectedColor === color ? Colors.text : "transparent",
              },
            ]}
            onPress={() => {
              onColorSelect(color);
              onClose();
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    fontSize: 24,
    color: "white",
  },
  colorGrid: {
    flex: 1,
    padding: 20,
  },
  colorOption: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    margin: "3.33%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
