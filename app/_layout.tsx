import { OnBoardingProvider } from "@/src/contexts/OnBoardingContext";
import { TransactionProvider } from "@/src/contexts/TransactionContext";
import { Stack } from "expo-router";
import { AuthProvider } from "../src/contexts/AuthContext";
import { ThemeProvider } from "../src/contexts/ThemeContext";

export default function Layout() {
  return (
    <AuthProvider>
      <OnBoardingProvider>
        <TransactionProvider>
          <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </ThemeProvider>
        </TransactionProvider>
      </OnBoardingProvider>
    </AuthProvider>
  );
}