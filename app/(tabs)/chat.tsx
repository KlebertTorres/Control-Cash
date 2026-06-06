import {
  StyleSheet,
  View,
  FlatList,
  Pressable,
  Text,
  SafeAreaView,
} from "react-native";
import { useTheme } from "@/src/hooks/useTheme";
import { useChat } from "@/src/hooks/useChat";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { ChatBubble } from "@/src/components/ChatBubble";
import { ChatInput } from "@/src/components/ChatInput";
import { Ionicons } from "@expo/vector-icons";

export default function ChatScreen() {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkMode : LightMode;
  const { messages, isLoading, sendMessage, clearChat } = useChat();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors.backgroundColor }]}
    >
      <View style={[styles.header, { backgroundColor: Colors.cardBackground }]}>
        <Text style={[styles.title, { color: Colors.text }]}>Assistente Financeiro</Text>
        <Pressable onPress={clearChat} hitSlop={5}>
          <Ionicons name="trash-outline" size={22} color={Colors.primary} />
        </Pressable>
      </View>

      <FlatList
        data={[...messages].reverse()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatBubble message={item} darkMode={darkMode} />
        )}
        scrollEnabled={true}
        contentContainerStyle={styles.messageList}
      />

      <ChatInput
        onSendMessage={sendMessage}
        isLoading={isLoading}
        darkMode={darkMode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  messageList: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
});
