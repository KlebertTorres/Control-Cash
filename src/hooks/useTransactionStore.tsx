import { useContext } from "react";
import { TransactionStoreContext } from "../contexts/TransactionContext";

export const useTransactionStore = () => {
  const context = useContext(TransactionStoreContext);
  if (!context) {
    throw new Error(
      "useTransactionStore must be used within a TransactionProvider",
    );
  }
  return context;
};