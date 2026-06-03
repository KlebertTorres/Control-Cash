import { Redirect } from "expo-router";

import { useAuth } from "@/src/hooks/useAuth";
import { useTransaction } from "@/src/hooks/useTransaction";

export default function Index() {

  const { user, loading, } = useAuth();

  const { loadingTransactions } = useTransaction();

  console.log({
  user,
  loading,
  loadingTransactions
  });

  if (loading || loadingTransactions) {
    return null;
  }

  if (!user) {
    return (
      <Redirect href="/auth/login" />
    );
  }

  if (!user.tutorialComplete) {
    return (
      <Redirect href="/onboarding" />
    );
  }

  return (
    <Redirect href="/(tabs)/home" />
  );
}