import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
    CreateNotificationDoc,
    DeleteNotificationDoc,
    GetNotificationsDoc,
    GetNotificationSettings,
    MarkAllNotificationsAsRead,
    MarkNotificationAsRead,
    UpdateNotificationSettings
} from "../services/notificationService";
import { Notification, NotificationContextType, NotificationSettings } from "../types/NotificationType";

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    enableOverdueNotifications: true,
    enableUpcomingNotifications: true,
    enableReceivedNotifications: true,
    enableInstallmentNotifications: true,
    daysBeforeNotify: 3,
    enableSound: true,
    enableVibration: true,
  });
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const loadNotifications = useCallback(async () => {
    try {
      setLoadingNotifications(true);
      const notificationsData = await GetNotificationsDoc(user?.uid);
      const settingsData = await GetNotificationSettings(user?.uid);
      setNotifications(notificationsData);
      setSettings(settingsData);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoadingNotifications(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) {
      setNotifications([]);
      setLoadingNotifications(false);
      return;
    }

    loadNotifications();
  }, [user?.uid, loadNotifications]);

  const addNotification = async (notificationData: Omit<Notification, "id">) => {
    const newNotification = await CreateNotificationDoc(user?.uid, notificationData);
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const removeNotification = async (id: string) => {
    await DeleteNotificationDoc(user?.uid, id);
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const markAsRead = async (id: string) => {
    await MarkNotificationAsRead(user?.uid, id);
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = async () => {
    await MarkAllNotificationsAsRead(user?.uid);
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    await UpdateNotificationSettings(user?.uid, newSettings);
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const getUnreadCount = (): number => {
    return notifications.filter((notif) => !notif.read).length;
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        settings,
        loadingNotifications,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        updateSettings,
        getUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
