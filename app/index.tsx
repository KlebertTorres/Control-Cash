import { Redirect } from "expo-router";
import { LoadingScreen } from "@/src/components/LoadingScreen";
import { useAuth } from "@/src/hooks/useAuth";
import { useTransaction } from "@/src/hooks/useTransaction";
import { useCategories } from "@/src/hooks/useCategories";
import { useBudget } from "@/src/hooks/useBudget";
import { useInstallment } from "@/src/hooks/useInstallment";
import { useNotification } from "@/src/hooks/useNotification";
import { useReport } from "@/src/hooks/useReport";

export default function Index() {

  const { user, loading, } = useAuth();

  const { loadingTransactions } = useTransaction();
  const { loadingCategories } = useCategories();
  const { loadingBudgets } = useBudget();
  const { loadingInstallments } = useInstallment();
  const { loadingNotifications } = useNotification();
  const { loadingReports } = useReport();

  console.log({
  user,
  loading,
  loadingTransactions
  });

  if (loading || loadingTransactions || loadingBudgets || loadingCategories || loadingInstallments || loadingNotifications || loadingReports) {
    return <LoadingScreen/>;
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