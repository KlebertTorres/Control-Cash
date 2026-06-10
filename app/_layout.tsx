import { CategoryProvider } from "@/src/contexts/CategoryContext";
import { InstallmentProvider } from "@/src/contexts/InstallmentContext";
import { NotificationProvider } from "@/src/contexts/NotificationContext";
import { ReportProvider } from "@/src/contexts/ReportContext";
import { TransactionProvider } from "@/src/contexts/TransactionContext";
import { ChatProvider } from "@/src/contexts/ChatContext";
import { BudgetProvider } from "@/src/contexts/BudgetContext";
import { AuthProvider } from "../src/contexts/AuthContext";
import { ThemeProvider } from "../src/contexts/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { requestNotificationPermissions } from "@/src/services/notificationAlertService";

export default function Layout() {

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CategoryProvider>
          <TransactionProvider>
            <InstallmentProvider>
              <NotificationProvider>
                <ReportProvider>
                  <ChatProvider>
                    <BudgetProvider>
                      <ThemeProvider>
                        <Stack screenOptions={{ headerShown: false }} />
                      </ThemeProvider>
                    </BudgetProvider>
                  </ChatProvider>
                </ReportProvider>
              </NotificationProvider>
            </InstallmentProvider>
          </TransactionProvider>
        </CategoryProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}