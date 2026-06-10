import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { Notification, NotificationSettings } from "../types/NotificationType";
import { db } from "./firebaseconfig";
import { Transaction } from "../types/TransactionType";

export async function CreateNotificationDoc(
  userId: string,
  notificationData: Omit<Notification, "id">
): Promise<Notification> {
  try {

    console.log("Criando notificação...")
    
    const docRef = await addDoc(collection(db, `users/${userId}/notifications`), {
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

export async function CreateNotificationFromTransaction(
  userId: string,
  transaction: Transaction
): Promise<void> {
  try {
    let notificationType:
      | "overdue"
      | "upcoming"
      | "received"
      | "installment"
      | "reminder"
      | "alert";

    let title = "";
    let message = "";

    const today = new Date();

    if (transaction.type === "expense") {
      if (transaction.dueDate) {
        const dueDate = new Date(transaction.dueDate);

        const diffDays = Math.ceil(
          (dueDate.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24)
        );

        if (diffDays < 0) {
          notificationType = "overdue";

          title = "Conta vencida";

          message =
            `${transaction.description} está vencida desde ` +
            `${Math.abs(diffDays)} dia(s).`;
        } else if (diffDays <= 7) {
          notificationType = "upcoming";

          title = "Conta próxima do vencimento";

          message =
            `${transaction.description} vence em ` +
            `${diffDays} dia(s).`;
        } else {
          notificationType = "reminder";

          title = "Nova despesa cadastrada";

          message =
            `${transaction.description} foi cadastrada com vencimento em ` +
            `${diffDays} dia(s).`;
        }
      } else {
        notificationType = "alert";

        title = "Nova despesa cadastrada";

        message =
          `${transaction.description} no valor de ` +
          `R$ ${transaction.amount.toFixed(2)}.`;
      }
    } else {
      notificationType = "received";

      title = "Nova receita cadastrada";

      message =
        `${transaction.description} no valor de ` +
        `R$ ${transaction.amount.toFixed(2)}.`;
    }

    const notification = await CreateNotificationDoc(userId, {
      type: notificationType,
      title,
      message,
      relatedTransactionId: transaction.id,
      createdAt: new Date().toISOString(),
      read: false,
      actionType: "view",
    });

    console.log("Notificação criada com sucesso");

  } catch (error) {
    console.error("Erro ao criar notificação da transação:", error);
  }
}

export async function GetNotificationsDoc(userId: string): Promise<Notification[]> {
  try {
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/notifications`)
    );

    const notifications: Notification[] = [];
    querySnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      } as Notification);
    });

    return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
    throw error;
  }
}

export async function GetUnreadNotificationsDoc(userId: string): Promise<Notification[]> {
  try {
    const q = query(
      collection(db, `users/${userId}/notifications`),
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
    const docRef = doc(db, `users/${userId}/notifications/${notificationId}`);
    await updateDoc(docRef, { read: true });
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    throw error;
  }
}

export async function MarkAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/notifications`)
    );

    const batch:any = [];
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
    const docRef = doc(db, `users/${userId}/notifications/${notificationId}`);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Erro ao deletar notificação:", error);
    throw error;
  }
}

export async function GetNotificationSettings(userId: string): Promise<NotificationSettings> {
  try {
    const userDoc = await getDoc(
      doc(db, "users", userId)
    );

    const data = userDoc.data();

    return data?.notificationSettings || {
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
    const userRef = doc(db, "users", userId);

    const userDoc = await getDoc(userRef);

    const currentSettings =
      userDoc.data()?.notificationSettings || {};

    await updateDoc(userRef, {
      notificationSettings: {
        ...currentSettings,
        ...settings,
      },
      updatedAt: Timestamp.now(),
    });

  } catch (error) {
    console.error("Erro ao atualizar configurações de notificação:", error);
    throw error;
  }
}
