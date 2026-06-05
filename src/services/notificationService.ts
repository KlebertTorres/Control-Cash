import { addDoc, collection, deleteDoc, doc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { Notification, NotificationSettings } from "../types/NotificationType";
import { db } from "./firebaseconfig";

const NOTIFICATIONS_COLLECTION = "notifications";
const NOTIFICATION_SETTINGS_DOC = "settings";

export async function CreateNotificationDoc(
  userId: string,
  notificationData: Omit<Notification, "id">
): Promise<Notification> {
  try {
    const docRef = await addDoc(collection(db, `users/${userId}/${NOTIFICATIONS_COLLECTION}`), {
      ...notificationData,
      createdAt: Timestamp.now(),
    });

    return {
      ...notificationData,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Erro ao criar notificação:", error);
    throw error;
  }
}

export async function GetNotificationsDoc(userId: string): Promise<Notification[]> {
  try {
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/${NOTIFICATIONS_COLLECTION}`)
    );

    const notifications: Notification[] = [];
    querySnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      } as Notification);
    });

    return notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
    throw error;
  }
}

export async function GetUnreadNotificationsDoc(userId: string): Promise<Notification[]> {
  try {
    const q = query(
      collection(db, `users/${userId}/${NOTIFICATIONS_COLLECTION}`),
      where("read", "==", false)
    );
    const querySnapshot = await getDocs(q);

    const notifications: Notification[] = [];
    querySnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      } as Notification);
    });

    return notifications;
  } catch (error) {
    console.error("Erro ao buscar notificações não lidas:", error);
    throw error;
  }
}

export async function MarkNotificationAsRead(userId: string, notificationId: string): Promise<void> {
  try {
    const docRef = doc(db, `users/${userId}/${NOTIFICATIONS_COLLECTION}/${notificationId}`);
    await updateDoc(docRef, { read: true });
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    throw error;
  }
}

export async function MarkAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/${NOTIFICATIONS_COLLECTION}`)
    );

    const batch = [];
    querySnapshot.forEach((doc) => {
      batch.push(updateDoc(doc.ref, { read: true }));
    });

    await Promise.all(batch);
  } catch (error) {
    console.error("Erro ao marcar todas as notificações como lidas:", error);
    throw error;
  }
}

export async function DeleteNotificationDoc(userId: string, notificationId: string): Promise<void> {
  try {
    const docRef = doc(db, `users/${userId}/${NOTIFICATIONS_COLLECTION}/${notificationId}`);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Erro ao deletar notificação:", error);
    throw error;
  }
}

export async function GetNotificationSettings(userId: string): Promise<NotificationSettings> {
  try {
    const docSnapshot = await getDocs(collection(db, `users/${userId}`));

    let settings: NotificationSettings | null = null;
    docSnapshot.forEach((doc) => {
      if (doc.id === NOTIFICATION_SETTINGS_DOC) {
        settings = doc.data() as NotificationSettings;
      }
    });

    return settings || {
      enableOverdueNotifications: true,
      enableUpcomingNotifications: true,
      enableReceivedNotifications: true,
      enableInstallmentNotifications: true,
      daysBeforeNotify: 3,
      enableSound: true,
      enableVibration: true,
    };
  } catch (error) {
    console.error("Erro ao buscar configurações de notificação:", error);
    throw error;
  }
}

export async function UpdateNotificationSettings(
  userId: string,
  settings: Partial<NotificationSettings>
): Promise<void> {
  try {
    const docRef = doc(db, `users/${userId}`, NOTIFICATION_SETTINGS_DOC);
    await updateDoc(docRef, {
      ...settings,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Erro ao atualizar configurações de notificação:", error);
    throw error;
  }
}
