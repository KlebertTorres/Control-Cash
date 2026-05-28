import { StyleSheet, Text, Pressable } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { DarkMode, LightMode } from "../styles/cores";

export const SimpleButton = ({ onPress, text }: any) => {

    const { darkMode } = useTheme();
    const Colors = darkMode? DarkMode: LightMode;

    return(
        <Pressable
            style={[styles.smallButton , {backgroundColor: Colors.darkest}]}
            onPress={onPress}
        >
            <Text style={[styles.buttonText, {color: Colors.textColorPrimary}]}>
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
  }
})