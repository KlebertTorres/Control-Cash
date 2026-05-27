import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { ThemeProvider } from "../src/context/ThemeContext";
import {
  OnboardingProvider,
  useOnboardingStore,
} from "../src/stores/onboardingStore";
import { TransactionProvider } from "../src/stores/transactionStore";

function RootLayoutContent() {
  const { isAuthenticated } = useAuth();
  const { hasCompletedOnboarding } = useOnboardingStore();
  const router = useRouter();

  useEffect(() => {
    // Route based on auth and onboarding state.
    // Defer navigation slightly to ensure the Root Layout's navigator mounts first
    const t = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace("/auth/login");
      } else if (!hasCompletedOnboarding) {
        router.replace("/onboarding");
      } else {
        router.replace("/(tabs)");
      }
    }, 50);

    return () => clearTimeout(t);
  }, [isAuthenticated, hasCompletedOnboarding, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <Stack.Screen name="auth" options={{ animationEnabled: false }} />
      <Stack.Screen name="onboarding" options={{ animationEnabled: false }} />
      <Stack.Screen name="(tabs)" options={{ animationEnabled: false }} />
      <Stack.Screen
        name="add-transaction"
        options={{ animationEnabled: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TransactionProvider>
          <OnboardingProvider>
            <RootLayoutContent />
          </OnboardingProvider>
        </TransactionProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
