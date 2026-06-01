import { createContext, ReactNode, useState } from "react";
import { Transaction, TransactionContextType } from "../types/TransactionsType";

export const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

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