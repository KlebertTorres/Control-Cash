import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DarkMode, LightMode } from "../styles/cores";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  darkMode: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  darkMode,
}) => {
  const Colors = darkMode ? DarkMode : LightMode;
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors.cardBackground, borderColor: Colors.borderColor },
      ]}
    >
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: Colors.backgroundColor,
            color: Colors.text,
            borderColor: Colors.borderColor,
          },
        ]}
        placeholder="Digite sua mensagem..."
        placeholderTextColor={Colors.secondary}
        value={message}
        onChangeText={setMessage}
        editable={!isLoading}
        multiline
        maxHeight={100}
      />

      <Pressable
        style={[
          styles.sendButton,
          {
            backgroundColor: isLoading ? Colors.secondary : Colors.primary,
          },
        ]}
        onPress={handleSend}
        disabled={isLoading || !message.trim()}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons name="send" size={20} color="#fff" />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
