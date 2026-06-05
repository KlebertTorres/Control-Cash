import { Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { DarkMode, LightMode } from "../styles/cores";

export const SimpleButton = ({ styleButton, styleText, onPress, text, currentType, type }: any) => {

    const { darkMode } = useTheme();
    const Colors = darkMode? DarkMode: LightMode;

    const isSelectable = !!type;
    const isActive = currentType === type;

    return(
        <Pressable
            style={[styles.smallButton, styleButton, {backgroundColor: Colors.darkest}, 
                isSelectable && isActive && {backgroundColor: Colors.lightGreen}]}
            onPress={onPress}
        >
            <Text style={[styles.buttonText, styleText, {color: Colors.textColorPrimary},
                isSelectable && isActive? {color: "#000000"} : null
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
})