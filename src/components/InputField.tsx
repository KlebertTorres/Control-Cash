import { StyleSheet, TextInput } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { DarkMode, LightMode } from "../styles/cores";

export const InputField = ({ style, placeholder, onChangeText, value, erros, keyboardType, secureTextEntry, Key }:any) => {

    const { darkMode } = useTheme();
    const Colors = darkMode? DarkMode: LightMode;

    return(
        <TextInput
                style={[
                    styles.input, style,
                    {borderColor: Colors.borderColor}, 
                    erros && styles.inputError
                ]}
                placeholder= {placeholder}
                placeholderTextColor="#4f6d5e"
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
                value={value}
                key={Key}
                keyboardType={keyboardType}
        />
    );
} 

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#b5cdbd",
    borderWidth: 2,
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#f65151",
  },
});