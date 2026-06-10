import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    FlatList, Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
      return colors.accentGreen;
    case "installment":
      return "#748ffc";
    case "alert":
      return "#ff8787";
    default:
      return colors.textColorSecondary;
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
    <TouchableOpacity
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
              color: item.read ? Colors.text : Colors.textColorPrimary,
              fontWeight: item.read ? "500" : "bold",
            },
          ]}
        >
          {item.title}
        </Text>
        <Text 
          style=
          {[styles.notificationMessage, 
            { color: item.read ? Colors.text : Colors.textColorPrimary }]}
        >
          {item.message}
        </Text>
        <Text style={[styles.notificationTime, { color: item.read ? Colors.text : Colors.textColorPrimary }]}>
          {new Date(item.createdAt).toLocaleDateString("pt-BR")}
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

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDeleteNotification(item.id)}
        hitSlop={8}
      >
        <Ionicons
          name="trash-outline"
          size={16}
          color={item.read ? Colors.text : Colors.textColorPrimary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
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
            <Text style={[styles.title, { color: Colors.textColorPrimary }]}>
              Notificações
            </Text>
            {unreadCount > 0 && (
              <View
                style={[
                  styles.badgeContainer,
                  { backgroundColor: Colors.cardBackground },
                ]}
              >
                <Text style={[styles.badgeText, {color: Colors.textColorPrimary}]}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <Ionicons name="close-outline" size={24} color={Colors.textColorPrimary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.tabContainer, { backgroundColor: Colors.cardBackground }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "notifications" && {
                borderBottomColor: Colors.accentGreen,
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
                      ? Colors.textColorPrimary
                      : Colors.accentGreen,
                  fontWeight: activeTab === "notifications" ? "bold" : "600",
                },
              ]}
            >
              Avisos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "settings" && {
                borderBottomColor: Colors.accentGreen,
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
                      ? Colors.textColorPrimary
                      : Colors.accentGreen,
                  fontWeight: activeTab === "settings" ? "bold" : "600",
                },
              ]}
            >
              Configurações
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "notifications" ? (
          <View style={styles.content}>
            {notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="notifications-off-outline"
                  size={48}
                  color={Colors.textColorPrimary}
                />
                <Text style={[styles.emptyText, { color: Colors.textColorPrimary }]}>
                  Nenhuma notificação
                </Text>
              </View>
            ) : (
              <>
                {unreadCount > 0 && (
                  <TouchableOpacity
                    style={[
                      styles.clearButton,
                      { backgroundColor: Colors.cardBackground },
                    ]}
                    onPress={onMarkAllAsRead}
                  >
                    <Text style={[styles.clearButtonText, { color: Colors.textColorPrimary }]}>
                      Marcar tudo como lido
                    </Text>
                  </TouchableOpacity>
                )}
                <FlatList
                  data={notifications}
                  keyExtractor={(item) => item.id}
                  renderItem={renderNotificationItem}
                  scrollEnabled={true}
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
                <Text style={[styles.settingDesc, { color: Colors.text }]}>
                  Alertas para contas vencidas
                </Text>
              </View>
              <Switch
                value={settings.enableOverdueNotifications}
                onValueChange={(value) =>
                  onUpdateSettings({ enableOverdueNotifications: value })
                }
                trackColor={{ false: Colors.textColorSecondary, true: Colors.mediumGreen }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, { color: Colors.text }]}>
                  Notificações Próximas
                </Text>
                <Text style={[styles.settingDesc, { color: Colors.text }]}>
                  Alertas para contas próximas do vencimento
                </Text>
              </View>
              <Switch
                value={settings.enableUpcomingNotifications}
                onValueChange={(value) =>
                  onUpdateSettings({ enableUpcomingNotifications: value })
                }
                trackColor={{ false: Colors.textColorSecondary, true: Colors.mediumGreen }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, { color: Colors.text }]}>
                  Notificações de Recebimento
                </Text>
                <Text style={[styles.settingDesc, { color: Colors.text }]}>
                  Alertas para valores recebidos
                </Text>
              </View>
              <Switch
                value={settings.enableReceivedNotifications}
                onValueChange={(value) =>
                  onUpdateSettings({ enableReceivedNotifications: value })
                }
                trackColor={{ false: Colors.textColorSecondary, true: Colors.mediumGreen }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, { color: Colors.text }]}>
                  Notificações de Parcelas
                </Text>
                <Text style={[styles.settingDesc, { color: Colors.text }]}>
                  Alertas para parcelas futuras
                </Text>
              </View>
              <Switch
                value={settings.enableInstallmentNotifications}
                onValueChange={(value) =>
                  onUpdateSettings({ enableInstallmentNotifications: value })
                }
                trackColor={{ false: Colors.textColorSecondary, true: Colors.mediumGreen }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, { color: Colors.text }]}>
                  Som
                </Text>
                <Text style={[styles.settingDesc, { color: Colors.text }]}>
                  Reproduzir som ao receber notificação
                </Text>
              </View>
              <Switch
                value={settings.enableSound}
                onValueChange={(value) =>
                  onUpdateSettings({ enableSound: value })
                }
                trackColor={{ false: Colors.textColorSecondary, true: Colors.mediumGreen }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, { color: Colors.text }]}>
                  Vibração
                </Text>
                <Text style={[styles.settingDesc, { color: Colors.text }]}>
                  Vibrar ao receber notificação
                </Text>
              </View>
              <Switch
                value={settings.enableVibration}
                onValueChange={(value) =>
                  onUpdateSettings({ enableVibration: value })
                }
                trackColor={{ false: Colors.textColorSecondary, true: Colors.mediumGreen }}
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
