import { useContext } from "react";
import { BudgetContext, BudgetContextType } from "../contexts/BudgetContext";

export const useBudget = (): BudgetContextType => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};
