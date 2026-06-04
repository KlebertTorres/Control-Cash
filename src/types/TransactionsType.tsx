export interface Transaction {
  id?: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string; // ISO date string
  categoryId: string;
}

export interface TransactionContextType {
  transactions: Transaction[];
  loadingTransactions: boolean;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  removeTransaction: (id: string) => void;
  getBalance: () => number;
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getTransactionsByDate: (date: string) => Transaction[];
  getMonthlyBalance: (month: string) => number; // YYYY-MM
  getCategoryBalance: (categoryId: string) => number;
  getTotalIncome: (month: string) => number;
  getTotalExpense: (month: string) => number;
}