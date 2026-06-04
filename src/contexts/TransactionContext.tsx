import { createContext, ReactNode, useEffect, useState } from "react";
import { Transaction, TransactionContextType } from "../types/TransactionsType";
import { CreateTransactionDoc, GetTransactionsDoc, GetTransactionDoc, DeleteTransactionDoc } from "@/src/services/transactionService"
import { useAuth } from "../hooks/useAuth";

export const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  const loadTransactions = async () => {
    try{
      setLoadingTransactions(true);
      
      const transactionsData = await GetTransactionsDoc(user.uid);
      
      setTransactions(transactionsData);
    }catch(error){
      console.log(error);
    }finally {
      setLoadingTransactions(false);
    }
  }

  useEffect(() => {
    if (!user?.uid) {
      setTransactions([]);
      setLoadingTransactions(false);
      return;
    }

    loadTransactions();
  }, [user?.uid]);

  const addTransaction = async (transactionData: Omit<Transaction, "id">) => {
    const newTransaction = await CreateTransactionDoc(user.uid, transactionData);
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const removeTransaction = async (id: string) => {
    await DeleteTransactionDoc(user.uid, id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const getBalance = () => {
    return transactions.reduce((balance, transaction) => {
      return transaction.type === "income"
        ? balance + transaction.amount
        : balance - transaction.amount;
    }, 0);
  };

  const getTransactionsByCategory = (categoryId: string) => {
    return transactions.filter((t) => t.categoryId === categoryId);
  }

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

  const getCategoryBalance = (categoryId: string) => {
    return getTransactionsByCategory(categoryId)
      .reduce((balance, transaction) => {
        return transaction.type === "income"
          ? balance + transaction.amount
          : balance - transaction.amount;
      }, 0);
  };

  const getTotalIncome = (month: string) => {
    return transactions
      .filter((t) => t.date.startsWith(month))
      .reduce((balance, transaction) => {
        return transaction.type === "income"
          ? balance + transaction.amount
          : balance;
      }, 0);
  };

  const getTotalExpense = (month: string) => {
    return transactions
      .filter((t) => t.date.startsWith(month))
      .reduce((balance, transaction) => {
        return transaction.type === "income"
          ? balance
          : balance - transaction.amount;
      }, 0);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loadingTransactions,
        addTransaction,
        removeTransaction,
        getBalance,
        getTransactionsByCategory,
        getTransactionsByDate,
        getMonthlyBalance,
        getTotalIncome,
        getTotalExpense,
        getCategoryBalance,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};