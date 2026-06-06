import { CategoryProvider } from "@/src/contexts/CategoryContext";
import { InstallmentProvider } from "@/src/contexts/InstallmentContext";
import { NotificationProvider } from "@/src/contexts/NotificationContext";
import { ReportProvider } from "@/src/contexts/ReportContext";
import { TransactionProvider } from "@/src/contexts/TransactionContext";
import { ChatProvider } from "@/src/contexts/ChatContext";
import { BudgetProvider } from "@/src/contexts/BudgetContext";
import { Stack } from "expo-router";
import { AuthProvider } from "../src/contexts/AuthContext";
import { ThemeProvider } from "../src/contexts/ThemeContext";

export default function Layout() {
  return (
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
  );
}