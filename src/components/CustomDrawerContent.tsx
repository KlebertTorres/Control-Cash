import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/src/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { Logout } from "../services/authService";
import { useTheme } from "../hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores"
import { router } from "expo-router";

export default function CustomDrawerContent(props: any) {
    const { user } = useAuth();
    const { darkMode } = useTheme();
    const Colors = darkMode? DarkMode: LightMode;

      const deslogar = async () => {
        try {
          await Logout();
          // O onAuthStateChanged em seu index.tsx detectará que o usuário foi deslogado
          // e automaticamente redirecionará para a tela de login.
          Alert.alert("Sucesso", "Você foi deslogado com sucesso!");
          router.replace("/auth/login")
        } catch (error: any) {
          console.error("Erro ao deslogar:", error.message);
          Alert.alert("Erro", "Não foi possível deslogar. Tente novamente.");
        }
      };

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View
                    style={{
                        flexDirection: "row",
                        paddingVertical: 15,
                        paddingBottom: 20,
                        borderBottomColor: Colors.borderColor,
                        borderBottomWidth: 1,
                        marginBottom: 10,
                        marginTop: 15,
                    }}
                >
                    <Image
                        source={
                            {uri: user?.photoURL,}
                        }
                        style={{
                            marginLeft: 10,
                            backgroundColor: "#D1C4E9",
                            width: 30,
                            height: 30,
                            borderRadius: 40,
                        }}
                    />

                    <Text style={{ fontSize: 20, paddingHorizontal: 20, paddingTop: 5, color: Colors.textColorPrimary}}>
                        {user?.name}
                    </Text>
                </View>

            <DrawerItemList {...props} />

            </DrawerContentScrollView>

            <View 
                style=
                    {{
                    flexDirection:"row", 
                    alignItems: "center", 
                    justifyContent:"center",
                    marginBottom: 70
                    }}
            >
                <TouchableOpacity
                    onPress={() => deslogar()}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={24}
                        color={Colors.textColorPrimary}
                    />

                    <Text
                    style={{
                        color: Colors.textColorPrimary,
                        fontSize: 18,
                        fontWeight: "600",
                    }}
                    >
                        Sair
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}