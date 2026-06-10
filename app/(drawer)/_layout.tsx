import CustomDrawerContent from "@/src/components/CustomDrawerContent";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { useTheme } from "@/src/hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores";

export default function DrawerLayout() {

    const { darkMode } = useTheme();
    const Colors = darkMode? DarkMode: LightMode;

  return (
        <Drawer
          drawerContent={(props) => (
            <CustomDrawerContent {...props} />
            )}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: Colors.cardBackground,
                },
                drawerInactiveTintColor: Colors.textColorPrimary,
                drawerActiveTintColor: Colors.cardBackground,
                drawerActiveBackgroundColor: Colors.textColorPrimary,
                
                headerStyle:{
                    backgroundColor: Colors.cardBackground
                },
                headerTintColor: Colors.textColorPrimary,
                
                headerTitleStyle: {
                    color: Colors.textColorPrimary,
                    fontSize: 24,
                    fontWeight: "bold",
                },

                drawerLabelStyle:{
                        fontSize: 20
                },
            }}
        >
            <Drawer.Screen
                name="(tabs)"
                options={{
                    drawerIcon: ({ color }) => (
                        <Ionicons name="close-outline" size={28} color={color} />
                    ),
                    title: "Fechar",
                    drawerActiveTintColor: Colors.textColorPrimary,
                    drawerActiveBackgroundColor: Colors.cardBackground,
                }}
            />

            <Drawer.Screen
                name="reports"
                options={{
                    drawerIcon: ({ color }) => (
                        <Ionicons name="paper-plane-outline" size={28} color={color} />
                    ),
                    title: "Relatórios",
                    headerShown: true,
                }}
            />
            <Drawer.Screen
                name="search"
                options={{
                    drawerIcon: ({ color }) => (
                        <Ionicons name="search-outline" size={28} color={color} />
                    ),
                    title: "Buscar transações",
                    headerShown: true,
                }}
            />
            <Drawer.Screen
                name="settings"
                options={{
                    drawerIcon: ({ color }) => (
                        <Ionicons name="settings-outline" size={28} color={color} />
                    ),
                    title: "Configurações",
                    headerShown: true,
                }}
            />
        </Drawer>
  );
}