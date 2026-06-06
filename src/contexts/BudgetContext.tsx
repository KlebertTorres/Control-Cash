import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTransaction } from "../hooks/useTransaction";

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  limit: number;
  period: "monthly" | "yearly"; // "monthly" or "yearly"
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetContextType {
  budgets: Budget[];
  loading: boolean;
  addBudget: (budget: Omit<Budget, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  removeBudget: (id: string) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  getBudgetUsage: (categoryId: string, period: string) => number;
  getBudgetAlert: (categoryId: string, categoryName: string, period: string) => {
    percentage: number;
    exceeded: boolean;
    remaining: number;
  } | null;
}

export const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

// Mock storage - in production, this would be Firebase
const budgetStorage: Record<string, Budget[]> = {};

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { transactions } = useTransaction();

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBudgets = useCallback(async () => {
    try {
      if (!user?.uid) {
        setBudgets([]);
        return;
      }

      setLoading(true);
      // Load from storage or Firebase in production
      const stored = budgetStorage[user.uid] || [];
      setBudgets(stored);
    } catch (error) {
      console.error("Erro ao carregar budgets:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) {
      setBudgets([]);
      setLoading(false);
      return;
    }

    loadBudgets();
  }, [user?.uid, loadBudgets]);

  const addBudget = useCallback(
    async (budget: Omit<Budget, "id" | "createdAt" | "updatedAt">) => {
      if (!user?.uid) return;

      const newBudget: Budget = {
        ...budget,
        id: `${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updated = [...budgets, newBudget];
      budgetStorage[user.uid] = updated;
      setBudgets(updated);
    },
    [user?.uid, budgets]
  );

  const removeBudget = useCallback(
    async (id: string) => {
      if (!user?.uid) return;

      const updated = budgets.filter((b) => b.id !== id);
      budgetStorage[user.uid] = updated;
      setBudgets(updated);
    },
    [user?.uid, budgets]
  );

  const updateBudget = useCallback(
    async (id: string, budget: Partial<Budget>) => {
      if (!user?.uid) return;

      const updated = budgets.map((b) =>
        b.id === id
          ? {
              ...b,
              ...budget,
              updatedAt: new Date(),
            }
          : b
      );

      budgetStorage[user.uid] = updated;
      setBudgets(updated);
    },
    [user?.uid, budgets]
  );

  const getBudgetUsage = useCallback(
    (categoryId: string, period: string): number => {
      const now = new Date();
      const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const yearKey = `${now.getFullYear()}`;

      let targetPeriod = period;
      if (period === "monthly") {
        targetPeriod = monthKey;
      } else if (period === "yearly") {
        targetPeriod = yearKey;
      }

      return transactions
        .filter(
          (t) =>
            t.categoryId === categoryId &&
            t.type === "expense" &&
            t.date.startsWith(targetPeriod)
        )
        .reduce((sum, t) => sum + t.amount, 0);
    },
    [transactions]
  );

  const getBudgetAlert = useCallback(
    (categoryId: string, categoryName: string, period: string) => {
      const budget = budgets.find(
        (b) => b.categoryId === categoryId && b.period === (period as "monthly" | "yearly")
      );

      if (!budget) return null;

      const spent = getBudgetUsage(categoryId, period);
      const percentage = (spent / budget.limit) * 100;
      const remaining = budget.limit - spent;

      return {
        percentage: Math.min(100, Math.round(percentage)),
        exceeded: spent > budget.limit,
        remaining: Math.max(0, remaining),
      };
    },
    [budgets, getBudgetUsage]
  );

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        loading,
        addBudget,
        removeBudget,
        updateBudget,
        getBudgetUsage,
        getBudgetAlert,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
