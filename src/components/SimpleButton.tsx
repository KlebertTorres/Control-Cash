import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { DarkMode, LightMode } from "../styles/cores";

export const SimpleButton = ({ styleButton, styleText, onPress, text, currentType, type, disabled, color }: any) => {

    const { darkMode } = useTheme();
    const Colors = darkMode? DarkMode: LightMode;

    const isSelectable = !!type;
    const isActive = currentType === type;

    return(
        <TouchableOpacity
            style={[
              styles.smallButton,
              styleButton,
              {
                backgroundColor: color || (isActive ? Colors.cardBackground : Colors.backgroundColor),
                opacity: disabled ? 0.6 : 1,
              },
              isSelectable && isActive && { backgroundColor: Colors.cardBackground },
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text
              style={[
                styles.buttonText,
                styleText,
                { color: isActive ? "#fff" : Colors.textColorPrimary },
              ]}
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  smallButton: {
    paddingVertical: 12,
    borderRadius: 12,
    width: "47%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 15,
  },
})