import { useTheme } from "@/src/hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function TabLayout() {
  const router = useRouter();

  const { darkMode } = useTheme();
  const Colors = darkMode? DarkMode: LightMode;

  const handleAddPress = () => {
    router.push("/add-transaction");
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.cardBackground,
          height: 80,
          borderTopWidth: 0,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: Colors.lightGreen,
      }}
    >
      <Tabs.Screen
        name="calendar"
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
        name="search"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={28} color={color} />
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
                marginBottom: 40,
                borderWidth: 3,
                borderColor: Colors.backgroundColor,
              }}
            >
              <Ionicons name="add" size={35} color={Colors.cardBackground} />
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
        name="settings"
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
