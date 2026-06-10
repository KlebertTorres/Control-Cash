import { CreateTransactionDoc, DeleteTransactionDoc, GetTransactionsDoc, UpdateTransactionDoc } from "@/src/services/transactionService";
import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Transaction, TransactionContextType } from "../types/TransactionType";
import { checkOverdueAccounts, checkPendingIncome, checkUpcomingDue } from "../services/notificationAlertService";
import { CreateNotificationFromTransaction } from "../services/notificationService";

export const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  const loadTransactions = useCallback(async () => {
    try{
      if (!user?.uid) return;

      setLoadingTransactions(true);
      
      const transactionsData = await GetTransactionsDoc(user?.uid);
      
      setTransactions(transactionsData);

      await checkOverdueAccounts(transactionsData);

      await checkUpcomingDue(
        transactionsData,
        7
      );

      await checkPendingIncome(
        transactionsData
      );

    }catch(error){
      console.log(error);
    }finally {
      setLoadingTransactions(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) {
      setTransactions([]);
      setLoadingTransactions(false);
      return;
    }

    loadTransactions();
  }, [user?.uid, loadTransactions]);

  const addTransaction = async (transactionData: Omit<Transaction, "id">) => {
    const newTransaction = await CreateTransactionDoc(user.uid, transactionData);
    setTransactions((prev) => [...prev, newTransaction]);

    await CreateNotificationFromTransaction(
      user.uid,
      newTransaction
    );

    await checkUpcomingDue(
      [newTransaction],
      7
    );
  };

  const removeTransaction = async (id: string) => {
    await DeleteTransactionDoc(user.uid, id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTransaction = async (id:string, transactionData: Partial<Transaction>) => {
    await  UpdateTransactionDoc(user.uid, id, transactionData);

    setTransactions(
      (prev) => (prev.map((transaction) =>
        transaction.id === id ?
        {
          ...transaction,
          ...transactionData
        }
        : transaction
        )
      )
    );
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
        updateTransaction,
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