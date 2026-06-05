import { CategoryProvider } from "@/src/contexts/CategoryContext";
import { InstallmentProvider } from "@/src/contexts/InstallmentContext";
import { NotificationProvider } from "@/src/contexts/NotificationContext";
import { ReportProvider } from "@/src/contexts/ReportContext";
import { TransactionProvider } from "@/src/contexts/TransactionContext";
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
                <ThemeProvider>
                  <Stack screenOptions={{ headerShown: false }} />
                </ThemeProvider>
              </ReportProvider>
            </NotificationProvider>
          </InstallmentProvider>
        </TransactionProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}