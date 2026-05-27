import { createContext, ReactNode, useContext, useState } from "react";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string; // ISO date string
  category: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  removeTransaction: (id: string) => void;
  getBalance: () => number;
  getTransactionsByDate: (date: string) => Transaction[];
  getMonthlyBalance: (month: string) => number; // YYYY-MM
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

export const useTransactionStore = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactionStore must be used within a TransactionProvider",
    );
  }
  return context;
};

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const removeTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const getBalance = () => {
    return transactions.reduce((balance, transaction) => {
      return transaction.type === "income"
        ? balance + transaction.amount
        : balance - transaction.amount;
    }, 0);
  };

  const getTransactionsByDate = (date: string) => {
    return transactions.filter((t) => t.date.startsWith(date));
  };

  const getMonthlyBalance = (month: string) => {
    return transactions
      .filter((t) => t.date.startsWith(month))
      .reduce((balance, transaction) => {
        return transaction.type === "income"
          ? balance + transaction.amount
          : balance - transaction.amount;
      }, 0);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        removeTransaction,
        getBalance,
        getTransactionsByDate,
        getMonthlyBalance,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
