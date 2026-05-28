import { Stack } from "expo-router";
import { AuthProvider } from "../src/contexts/AuthContext";
import { ThemeProvider } from "../src/contexts/ThemeContext";
import { TransactionProvider } from "@/src/stores/transactionStore";

export default function Layout() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </TransactionProvider>
    </AuthProvider>
  );
}