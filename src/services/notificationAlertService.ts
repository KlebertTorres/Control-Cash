import { Transaction } from '@/src/types/TransactionType';
import * as Notifications from 'expo-notifications';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Solicita permissão para enviar notificações
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const permission = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    return permission.granted;
  } catch (error) {
    console.error('Erro ao solicitar permissões de notificação:', error);
    return false;
  }
};

/**
 * Envia notificação imediata
 */
export const sendLocalNotification = async (
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<string | null> => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        badge: 1,
        sound: 'default',
      },
      trigger: null, // Envia imediatamente
    });
    return notificationId;
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return null;
  }
};

/**
 * Agenda notificação para um momento específico
 */
export const scheduleNotification = async (
  title: string,
  body: string,
  date: Date,
  data?: Record<string, any>
): Promise<string | null> => {
  try {
    const now = new Date();
    const delayInSeconds = Math.max(
      Math.floor((date.getTime() - now.getTime()) / 1000),
      1
    );

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        badge: 1,
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: delayInSeconds,
      },
    });
    return notificationId;
  } catch (error) {
    console.error('Erro ao agendar notificação:', error);
    return null;
  }
};

/**
 * Cancela uma notificação agendada
 */
export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Erro ao cancelar notificação:', error);
  }
};

/**
 * Cancela todas as notificações agendadas
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Erro ao cancelar todas as notificações:', error);
  }
};

/**
 * Verifica contas vencidas e envia notificações
 */
export const checkOverdueAccounts = async (transactions: Transaction[]): Promise<void> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueTransactions = transactions.filter((t) => {
    if (!t.dueDate || t.status === 'paid') return false;
    const dueDate = new Date(t.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  });

  if (overdueTransactions.length > 0) {
    await sendLocalNotification(
      '⚠️ Contas Vencidas',
      `Você tem ${overdueTransactions.length} conta(s) vencida(s)`,
      { type: 'overdue', count: overdueTransactions.length }
    );
  }
};

/**
 * Verifica contas próximas do vencimento e envia notificações
 */
export const checkUpcomingDue = async (
  transactions: Transaction[],
  daysThreshold: number = 7
): Promise<void> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureDate = new Date(today);
  futureDate.setDate(futureDate.getDate() + daysThreshold);

  const upcomingTransactions = transactions.filter((t) => {
    if (!t.dueDate || t.status === 'paid') return false;
    const dueDate = new Date(t.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return (
      dueDate.getTime() > today.getTime() &&
      dueDate.getTime() <= futureDate.getTime()
    );
  });

  if (upcomingTransactions.length > 0) {
    const firstDueDate = upcomingTransactions[0].dueDate;

    if (!firstDueDate) return;

    const daysRemaining = Math.ceil(
      (new Date(firstDueDate).getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
    );
    
    await sendLocalNotification(
      '📅 Contas Próximas',
      `${upcomingTransactions.length} conta(s) vencerá(ão) em ${daysRemaining} dia(s)`,
      { type: 'upcoming', count: upcomingTransactions.length, daysRemaining }
    );
  }
};

/**
 * Verifica valores a receber
 */
export const checkPendingIncome = async (transactions: Transaction[]): Promise<void> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pendingIncome = transactions.filter((t) => {
    if (t.type !== 'income' || t.status === 'paid') return false;
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate >= today;
  });

  if (pendingIncome.length > 0) {
    const totalAmount = pendingIncome.reduce((sum, t) => sum + t.amount, 0);
    
    await sendLocalNotification(
      '💰 Valores a Receber',
      `Você tem R$ ${totalAmount.toFixed(2)} a receber`,
      { type: 'income', total: totalAmount, count: pendingIncome.length }
    );
  }
};

/**
 * Agenda notificações diárias para alertas
 */
export const scheduleDailyAlert = async (): Promise<void> => {
  try {
    // Cancela alertas anteriores
    await cancelAllNotifications();

    // Agenda para 8:00 AM todo dia
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);

    const trigger = {
      hour: 8,
      minute: 0,
      repeats: true,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📊 Resumo Financeiro',
        body: 'Veja seu resumo financeiro do dia',
        badge: 1,
      },
      trigger: trigger as any,
    });
  } catch (error) {
    console.error('Erro ao agendar alerta diário:', error);
  }
};

/**
 * Remove notificações não lidas
 */
export const clearNotifications = async (): Promise<void> => {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch (error) {
    console.error('Erro ao limpar notificações:', error);
  }
};
