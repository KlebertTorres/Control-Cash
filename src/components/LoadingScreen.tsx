import { View, Text, Image, ActivityIndicator } from "react-native";

export function LoadingScreen() {

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#DAF1DE"
      }}
    >
        <Image
            source={require("../../assets/images/splash-icon.png")} 
            style={{
                width: 200,
                height: 200,
                marginBottom: 20,
            }}
            resizeMode="contain"
        />

        <Text style={{ marginTop: 20, color: "black" }}>
            Carregando...
        </Text>
        <ActivityIndicator
            size="large"
            color="black"
        />
    </View>
  );
}