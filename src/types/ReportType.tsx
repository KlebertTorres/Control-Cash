export interface Report {
  id: string;
  period: "daily" | "weekly" | "monthly" | "annual";
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  totalIncome: number;
  totalExpense: number;
  balance: number;
  byCategory: CategoryReport[];
  byType: {
    income: number;
    expense: number;
  };
  generatedAt: string; // ISO timestamp
}

export interface CategoryReport {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
  percentage: number;
  transactionCount: number;
  subcategoryBreakdown?: CategoryReport[];
}

export interface DashboardData {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  savedAmount: number;
  overdueAccounts: number;
  upcomingAccounts: number;
  receivables: number;
  monthlyTrend: MonthlyTrend[];
  topExpenseCategories: CategoryReport[];
  topIncomeCategories: CategoryReport[];
}

export interface MonthlyTrend {
  month: string; // YYYY-MM
  income: number;
  expense: number;
  balance: number;
}

export interface ReportContextType {
  reports: Report[];
  dashboardData: DashboardData | null;
  loadingReports: boolean;
  generateReport: (period: "daily" | "weekly" | "monthly" | "annual", startDate: string, endDate: string) => Promise<Report>;
  getDashboardData: () => Promise<DashboardData>;
  getFilteredReport: (categoryId?: string, period?: string) => Report | null;
}
