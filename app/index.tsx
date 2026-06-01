import { Redirect } from "expo-router";

import { useAuth } from "@/src/hooks/useAuth";
import { useOnBoarding } from "@/src/hooks/useOnBoarding";

export default function Index() {

  const {
    user,
    loading,
  } = useAuth();

  const {
    hasCompletedOnboarding,
    loadingOnboarding,
  } = useOnBoarding();

  console.log({
  user,
  hasCompletedOnboarding,
  loading,
  loadingOnboarding,
  });

  if (
    loading ||
    loadingOnboarding
  ) {
    return null;
  }

  if (!user) {
    return (
      <Redirect href="/auth/login" />
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <Redirect href="/onboarding" />
    );
  }

  return (
    <Redirect href="/(tabs)/home" />
  );
}