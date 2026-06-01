export interface Transaction {
  id?: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string; // ISO date string
  categoryId: string;
  categoryName: string;
}

export interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  removeTransaction: (id: string) => void;
  getBalance: () => number;
  getTransactionsByDate: (date: string) => Transaction[];
  getMonthlyBalance: (month: string) => number; // YYYY-MM
}