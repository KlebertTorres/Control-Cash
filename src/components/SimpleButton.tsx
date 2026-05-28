import { StyleSheet, Text, Pressable } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { DarkMode, LightMode } from "../styles/cores";

export const SimpleButton = ({ onPress, text, currentType, type }: any) => {

    const { darkMode } = useTheme();
    const Colors = darkMode? DarkMode: LightMode;

    const isSelectable = !!type;
    const isActive = currentType === type;

    return(
        <Pressable
            style={[styles.smallButton, {backgroundColor: Colors.darkest}, 
                isSelectable === isActive && {backgroundColor: Colors.lightGreen}]}
            onPress={onPress}
        >
            <Text style={[styles.buttonText, {color: Colors.textColorPrimary},
                isSelectable === isActive? {color: "#000000"} : styles.typeTextActive
            ]}>
                {text}
            </Text>
        </Pressable>
        
    );
}

const styles = StyleSheet.create({
    smallButton: {
    paddingVertical: 12,
    borderRadius: 10,
    width: "47%",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
  },
  typeTextActive: {
    color: "#fff",
  },
})