import { ChatBubble } from "@/src/components/ChatBubble";
import { ChatInput } from "@/src/components/ChatInput";
import { useChat } from "@/src/hooks/useChat";
import { useTheme } from "@/src/hooks/useTheme";
import { DarkMode, LightMode } from "@/src/styles/cores";
import { Ionicons } from "@expo/vector-icons";
import {
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";

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
          <Ionicons name="trash-outline" size={22} color={Colors.textColorPrimary} />
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  messageList: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
});
