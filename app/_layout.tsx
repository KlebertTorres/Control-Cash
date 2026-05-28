import { Stack } from "expo-router";
import { AuthProvider } from "../src/contexts/AuthContext";
import { ThemeProvider } from "../src/contexts/ThemeContext";
import { TransactionStoreProvider } from "@/src/contexts/TransactionContext";
import { OnBoardingProvider } from "@/src/contexts/OnBoardingContext";

export default function Layout() {
  return (
    <AuthProvider>
      <OnBoardingProvider>
        <TransactionStoreProvider>
          <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </ThemeProvider>
        </TransactionStoreProvider>
      </OnBoardingProvider>
    </AuthProvider>
  );
}