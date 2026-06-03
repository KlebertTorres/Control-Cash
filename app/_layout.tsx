import { Stack } from "expo-router";
import { AuthProvider } from "../src/contexts/AuthContext";
import { ThemeProvider } from "../src/contexts/ThemeContext";
import { CategoryProvider } from "@/src/contexts/CategoryContext";
import { TransactionProvider } from "@/src/contexts/TransactionContext";

export default function Layout() {
  return (
    <AuthProvider>
      <CategoryProvider>
        <TransactionProvider>
          <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </ThemeProvider>
        </TransactionProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}