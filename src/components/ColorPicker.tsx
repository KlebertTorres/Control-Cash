import { useTheme } from "@/src/hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
    
const COLORS = [
  "#795548", // Marrom
  "#E91E63", // Rosa
  "#FF6B6B", // Vermelho
  "#FF8C00", // Laranja
  "#FFD700", // Ouro
  "#4CAF50", // Verde
  "#1ABC9C", // Turquesa
  "#00BCD4", // Cyan
  "#3498DB", // Azul Claro
  "#2196F3", // Azul
  "#9C27B0", // Roxo
  "#607D8B", // Cinza Azulado
  "#7c7c7c", // Cinza
  "#000000", // Preto
  "#FFFFFF", // Branco
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
  const [opened, setOpened] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: Colors.cardBackground }]}>
      <View style={[styles.header, { backgroundColor: Colors.backgroundColor }]}>
        <Text style={styles.title}>Escolher Cor</Text>
        <TouchableOpacity 
          onPress={() => {
            setOpened((prev) => !prev);}
        }>
          <Text style={styles.closeButton}>▼</Text>
        </TouchableOpacity>
      </View>

      {opened &&
        <ScrollView style={styles.colorGrid}>
          <View style={styles.colorGridFlex}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  {
                    backgroundColor: color,
                    borderWidth: selectedColor === color ? 3 : 0,
                    borderColor: selectedColor === color ? Colors.textColorPrimary : "transparent",
                  },
                ]}
                onPress={() => {
                  onColorSelect(color);
                  onClose();
                }}
              />
            ))}
          </View>
        </ScrollView>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  colorGridFlex: {
    paddingLeft: 20,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  colorOption: {
    width: "25%",
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
