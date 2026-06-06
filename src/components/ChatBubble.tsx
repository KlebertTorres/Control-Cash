import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ChatMessage } from "../contexts/ChatContext";
import { DarkMode, LightMode } from "../styles/cores";

interface ChatBubbleProps {
  message: ChatMessage;
  darkMode: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, darkMode }) => {
  const Colors = darkMode ? DarkMode : LightMode;
  const isUser = message.role === "user";

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isUser ? Colors.primary : Colors.cardBackground,
            borderColor: Colors.borderColor,
          },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            {
              color: isUser ? "#fff" : Colors.text,
            },
          ]}
        >
          {message.content}
        </Text>
        <Text
          style={[
            styles.timestamp,
            {
              color: isUser ? "#fff" : Colors.secondary,
            },
          ]}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 10,
  },
  userContainer: {
    alignItems: "flex-end",
  },
  assistantContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    fontStyle: "italic",
  },
});
