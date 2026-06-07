import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";
import { DarkMode, LightMode } from "../styles/cores";
import { Notification, NotificationSettings } from "../types/NotificationType";

interface NotificationCenterProps {
  darkMode: boolean;
  visible: boolean;
  notifications: Notification[];
  settings: NotificationSettings;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onUpdateSettings: (settings: Partial<NotificationSettings>) => void;
}

const getNotificationIcon = (type: string): string => {
  switch (type) {
    case "overdue":
      return "alert-circle-outline";
    case "upcoming":
      return "calendar-outline";
    case "received":
      return "checkmark-circle-outline";
    case "installment":
      return "layers-outline";
    case "reminder":
      return "notifications-outline";
    case "alert":
      return "warning-outline";
    default:
      return "information-circle-outline";
  }
};

const getNotificationColor = (type: string, colors: typeof DarkMode): string => {
  switch (type) {
    case "overdue":
      return "#ff6b6b";
    case "upcoming":
      return "#ffd43b";
    case "received":
      return Colors.cardBackground;
    case "installment":
      return "#748ffc";
    case "alert":
      return "#ff8787";
    default:
      return colors.secondary;
  }
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  darkMode,
  visible,
  notifications,
  settings,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onUpdateSettings,
}) => {
  const Colors = darkMode ? DarkMode : LightMode;
  const [activeTab, setActiveTab] = useState<"notifications" | "settings">(
    "notifications"
  );
  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <Pressable
      style={[
        styles.notificationItem,
        {
          backgroundColor: item.read ? Colors.backgroundColor : Colors.cardBackground,
          borderLeftColor: getNotificationColor(item.type, Colors),
        },
      ]}
      onPress={() => !item.read && onMarkAsRead(item.id)}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: getNotificationColor(item.type, Colors) + "20",
          },
        ]}
      >
        <Ionicons
          name={getNotificationIcon(item.type) as any}
          size={20}
          color={getNotificationColor(item.type, Colors)}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.notificationTitle,
            {
              color: Colors.text,
              fontWeight: item.read ? "500" : "bold",
            },
          ]}
        >
          {item.title}
        </Text>
        <Text style={[styles.notificationMessage, { color: Colors.secondary }]}>
          {item.message}
        </Text>
        <Text style={[styles.notificationTime, { color: Colors.secondary }]}>
          {new Date(item.date).toLocaleDateString("pt-BR")}
        </Text>
      </View>

      {!item.read && (
        <View
          style={[
            styles.unreadDot,
            { backgroundColor: getNotificationColor(item.type, Colors) },
          ]}
        />
      )}

      <Pressable
        style={styles.deleteButton}
        onPress={() => onDeleteNotification(item.id)}
        hitSlop={8}
      >
        <Ionicons
          name="trash-outline"
          size={16}
          color={Colors.secondary}
        />
      </Pressable>
    </Pressable>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: Colors.backgroundColor }]}
      >
        <View
          style={[
            styles.header,
            { backgroundColor: Colors.cardBackground, borderColor: Colors.borderColor },
          ]}
        >
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: Colors.text }]}>
              Notificações
            </Text>
            {unreadCount > 0 && (
              <View
                style={[
                  styles.badgeContainer,
                  { backgroundColor: Colors.cardBackground },
                ]}
              >
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <Pressable onPress={onClose} hitSlop={8}>
            <Ionicons name="close-outline" size={24} color={Colors.cardBackground} />
          </Pressable>
        </View>

        <View style={[styles.tabContainer, { backgroundColor: Colors.cardBackground }]}>
          <Pressable
            style={[
              styles.tab,
              activeTab === "notifications" && {
                borderBottomColor: Colors.cardBackground,
                borderBottomWidth: 3,
              },
            ]}
            onPress={() => setActiveTab("notifications")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "notifications"
                      ? Colors.cardBackground
                      : Colors.secondary,
                  fontWeight: activeTab === "notifications" ? "bold" : "600",
                },
              ]}
            >
              Avisos
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tab,
              activeTab === "settings" && {
                borderBottomColor: Colors.cardBackground,
                borderBottomWidth: 3,
              },
            ]}
            onPress={() => setActiveTab("settings")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "settings"
                      ? Colors.cardBackground
                      : Colors.secondary,
                  fontWeight: activeTab === "settings" ? "bold" : "600",
                },
              ]}
            >
              Configurações
            </Text>
          </Pressable>
        </View>

        {activeTab === "notifications" ? (
          <View style={styles.content}>
            {notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="notifications-off-outline"
                  size={48}
                  color={Colors.secondary}
                />
                <Text style={[styles.emptyText, { color: Colors.secondary }]}>
                  Nenhuma notificação
                </Text>
              </View>
            ) : (
              <>
                {unreadCount > 0 && (
                  <Pressable
                    style={[
                      styles.clearButton,
                      { backgroundColor: Colors.cardBackground + "20" },
                    ]}
                    onPress={onMarkAllAsRead}
                  >
                    <Text style={[styles.clearButtonText, { color: Colors.cardBackground }]}>
                      Marcar tudo como lido
                    </Text>
                  </Pressable>
                )}
                <FlatList
                  data={notifications}
                  keyExtractor={(item) => item.id}
                  renderItem={renderNotificationItem}
                  scrollEnabled={false}
                  contentContainerStyle={styles.listContent}
                />
              </>
            )}
          </View>
        ) : (
          <ScrollView style={styles.settingsContent}>
            <View style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, { color: Colors.text }]}>
                  Notificações de Vencidos
                </Text>
                <Text style={[styles.settingDesc, { color: Colors.secondary }]}>
                  Alertas para contas vencidas
                </Text>
              </View>
              <Switch
                value={settings.enableOverdueNotifications}
                onValueChange={(value) =>
                  onUpdateSettings({ enableOverdueNotifications: value })
                }
                trackColor={{ false: Colors.secondary, true: Colors.cardBackground }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, { color: Colors.text }]}>
                  Notificações Próximas
                </Text>
                <Text style={[styles.settingDesc, { color: Colors.secondary }]}>
                  Alertas para contas próximas do vencimento
                </Text>
              </View>
              <Switch
                value={settings.enableUpcomingNotifications}
                onValueChange={(value) =>
                  onUpdateSettings({ enableUpcomingNotifications: value })
                }
                trackColor={{ false: Colors.secondary, true: Colors.cardBackground }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, { color: Colors.text }]}>
                  Notificações de Recebimento
                </Text>
                <Text style={[styles.settingDesc, { color: Colors.secondary }]}>
                  Alertas para valores recebidos
                </Text>
              </View>
              <Switch
                value={settings.enableReceivedNotifications}
                onValueChange={(value) =>
                  onUpdateSettings({ enableReceivedNotifications: value })
                }
                trackColor={{ false: Colors.secondary, true: Colors.cardBackground }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, { color: Colors.text }]}>
                  Notificações de Parcelas
                </Text>
                <Text style={[styles.settingDesc, { color: Colors.secondary }]}>
                  Alertas para parcelas futuras
                </Text>
              </View>
              <Switch
                value={settings.enableInstallmentNotifications}
                onValueChange={(value) =>
                  onUpdateSettings({ enableInstallmentNotifications: value })
                }
                trackColor={{ false: Colors.secondary, true: Colors.cardBackground }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, { color: Colors.text }]}>
                  Som
                </Text>
                <Text style={[styles.settingDesc, { color: Colors.secondary }]}>
                  Reproduzir som ao receber notificação
                </Text>
              </View>
              <Switch
                value={settings.enableSound}
                onValueChange={(value) =>
                  onUpdateSettings({ enableSound: value })
                }
                trackColor={{ false: Colors.secondary, true: Colors.cardBackground }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, { color: Colors.text }]}>
                  Vibração
                </Text>
                <Text style={[styles.settingDesc, { color: Colors.secondary }]}>
                  Vibrar ao receber notificação
                </Text>
              </View>
              <Switch
                value={settings.enableVibration}
                onValueChange={(value) =>
                  onUpdateSettings({ enableVibration: value })
                }
                trackColor={{ false: Colors.secondary, true: Colors.cardBackground }}
                thumbColor="#fff"
              />
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
};

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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  badgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
  },
  clearButton: {
    marginHorizontal: 12,
    marginVertical: 10,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 12,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 11,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  deleteButton: {
    padding: 8,
  },
  settingsContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 12,
  },
});
