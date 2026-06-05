export interface Installment {
  id: string;
  totalAmount: number;
  numberOfInstallments: number;
  currentInstallment: number;
  installmentAmount: number;
  description: string;
  categoryId: string;
  startDate: string; // ISO date string
  frequency: "monthly" | "weekly" | "custom"; // Frequência das parcelas
  completedInstallments: number; // Número de parcelas pagas
  transactions: string[]; // IDs das transações geradas
  status: "active" | "completed" | "cancelled";
}

export interface InstallmentContextType {
  installments: Installment[];
  loadingInstallments: boolean;
  addInstallment: (installment: Omit<Installment, "id" | "transactions">) => void;
  removeInstallment: (id: string) => void;
  updateInstallment: (id: string, installment: Partial<Installment>) => void;
  getActiveInstallments: () => Installment[];
  getInstallmentsByMonth: (month: string) => Installment[];
}
