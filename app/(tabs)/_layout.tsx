import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

import { Colors } from "../../constants/colors";

export default function TabLayout() {
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
        name="index"
        options={{
          title: "",
          tabBarIcon: () => (
            <View
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
            </View>
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