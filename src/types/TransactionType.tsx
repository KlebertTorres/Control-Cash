export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string; // ISO date string
  categoryId: string;
  subcategoryId?: string;
  installmentId?: string;
  proofImage?: string; // URL da imagem de comprovante
  dueDate?: string; // Data de vencimento (para contas a pagar)
  status?: "pending" | "paid" | "overdue"; // Status da transação
  tags?: string[]; // Tags adicionais
}

export interface TransactionContextType {
  transactions: Transaction[];
  loadingTransactions: boolean;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (id:string, transaction: Partial<Transaction>) => void;
  getBalance: () => number;
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getTransactionsByDate: (date: string) => Transaction[];
  getMonthlyBalance: (month: string) => number; // YYYY-MM
  getCategoryBalance: (categoryId: string) => number;
  getTotalIncome: (month: string) => number;
  getTotalExpense: (month: string) => number;
}