import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { useTheme } from "@/src/hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores";

export default function TabLayout() {
  const router = useRouter();

  const { darkMode } = useTheme();
  const Colors = darkMode? DarkMode: LightMode;

  const handleAddPress = () => {
    router.push("../add-transaction/index");
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.accentGreen,
          height: 70,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: Colors.lightGreen,
      }}
    >
      <Tabs.Screen
        name="agenda"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Ionicons name="bar-chart-outline" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: "",
          tabBarIcon: () => (
            <TouchableOpacity
              onPress={handleAddPress}
              style={{
                backgroundColor: "#e0e0e0",
                width: 55,
                height: 55,
                borderRadius: 28,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
                borderWidth: 3,
                borderColor: Colors.accentGreen,
              }}
            >
              <Ionicons name="add" size={35} color={Colors.accentGreen} />
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbox-ellipses-outline" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="configuracoes"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
