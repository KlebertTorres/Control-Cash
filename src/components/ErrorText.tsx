import { StyleSheet, View, Text } from "react-native";

export const ErrorText = ({text, erro, padding}: any) => {
    return(
        (erro &&
            <View style={[styles.errorText, padding && {paddingLeft: padding}]}>
                <Text style={styles.errorText}>
                    {text}
                </Text>
            </View>
        )
    );
}

const styles = StyleSheet.create({
  container: {
    alignSelf:"flex-start"
  },
  errorText: {
    alignSelf:"flex-start",
    color: "#f65151",
    fontSize: 16,
    paddingLeft: 8,
    marginTop: -8,
    marginBottom: 5,
  }
})