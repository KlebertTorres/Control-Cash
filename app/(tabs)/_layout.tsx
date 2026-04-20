import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2d5a4c',
          height: 70,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#7ba892',
      }}
    >
      <Tabs.Screen
        name="agenda"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={28} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="stats"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Ionicons name="bar-chart-outline" size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: () => (
            <View style={{
              backgroundColor: '#e0e0e0',
              width: 55,
              height: 55,
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              borderWidth: 3,
              borderColor: '#2d5a4c'
            }}>
              <Ionicons name="add" size={35} color="#2d5a4c" />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Ionicons name="chatbox-ellipses-outline" size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}