export interface Notification {
  id: string;
  type: "overdue" | "upcoming" | "received" | "installment" | "reminder" | "alert";
  title: string;
  message: string;
  relatedTransactionId?: string;
  relatedInstallmentId?: string;
  createdAt: string; // ISO date string
  read: boolean;
  actionType?: "pay" | "view" | "edit"; // Tipo de ação sugerida
}

export interface NotificationSettings {
  enableOverdueNotifications: boolean;
  enableUpcomingNotifications: boolean;
  enableReceivedNotifications: boolean;
  enableInstallmentNotifications: boolean;
  daysBeforeNotify?: number; // Dias antes do vencimento para notificar
  enableSound: boolean;
  enableVibration: boolean;
}

export interface NotificationContextType {
  notifications: Notification[];
  settings: NotificationSettings;
  loadingNotifications: boolean;
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  getUnreadCount: () => number;
}
