import { collection, getDocs } from "firebase/firestore";
import { Category } from "../types/CategoryType";
import { CategoryReport, DashboardData, MonthlyTrend, Report } from "../types/ReportType";
import { Transaction } from "../types/TransactionType";
import { db } from "./firebaseconfig";
import { GetTransactionsDoc } from "./transactionService";
import { GetCategoriesDoc } from "./categoryService";

const TRANSACTIONS_COLLECTION = "transactions";

export async function GenerateReport(
  userId: string,
  period: "daily" | "weekly" | "monthly" | "annual",
  startDate: string,
  endDate: string
): Promise<Report> {
  try {
    const transactions = await GetTransactionsForPeriod(userId, startDate, endDate);
    const categories = await GetCategoriesDoc(userId);

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const byCategory = GroupTransactionsByCategory(transactions, categories);

    return {
      id: `${userId}-${startDate}-${endDate}`,
      period,
      startDate,
      endDate,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      byCategory,
      byType: {
        income: totalIncome,
        expense: totalExpense,
      },
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    throw error;
  }
}

export async function GetDashboardData(userId: string, startDate: string, endDate: string): Promise<DashboardData> {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();

    const transactionsPeriod =
      await GetTransactionsForPeriod(
        userId,
        startDate,
        endDate
      );
    const categories = await GetCategoriesDoc(userId);

    // Cálculos do mês atual
    const periodIncome = transactionsPeriod
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const periodExpense = transactionsPeriod
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // Saldo atual (total de todas as transações)
    const currentBalance = transactionsPeriod.reduce((balance, t) => {
      return t.type === "income" ? balance + t.amount : balance - t.amount;
    }, 0);

    // Valor economizado (mês atual)
    const savedAmount = Math.max(0, periodIncome - periodExpense);

    // Contas vencidas e próximas
    const today = new Date();
    const overdueAccounts = transactionsPeriod.filter(
      (t) => t.status === "overdue" || (t.dueDate && new Date(t.dueDate) < today)
    ).length;

    const upcomingAccounts = transactionsPeriod.filter(
      (t) =>
        t.status === "pending" &&
        t.dueDate &&
        new Date(t.dueDate) >= today &&
        new Date(t.dueDate) <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    ).length;

    // Valores a receber
    const receivables = transactionsPeriod
      .filter((t) => t.type === "income" && t.status === "pending")
      .reduce((sum, t) => sum + t.amount, 0);

    // Tendência mensal (últimos 12 meses)
    const allTransactions = await GetTransactionsDoc(userId);
    const monthlyTrend = GetMonthlyTrend(allTransactions, currentYear);
      
    // Top categorias
    const allCategoryBreakdown = GroupTransactionsByCategory(transactionsPeriod, categories);
    const topExpenseCategories = allCategoryBreakdown
      .filter((c) => {
        const catData = categories.find((cat) => cat.id === c.categoryId);
        return catData?.type !== "income";
      })
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5);

    const topIncomeCategories = allCategoryBreakdown
      .filter((c) => {
        const catData = categories.find((cat) => cat.id === c.categoryId);
        return catData?.type === "income";
      })
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5);

    return {
      currentBalance,
      periodIncome,
      periodExpense,
      savedAmount,
      overdueAccounts,
      upcomingAccounts,
      receivables,
      monthlyTrend,
      topExpenseCategories,
      topIncomeCategories,
    };
  } catch (error) {
    console.error("Erro ao gerar dados do dashboard:", error);
    throw error;
  }
}

async function GetTransactionsForPeriod(
  userId: string,
  startDate: string,
  endDate: string
): Promise<Transaction[]> {
  try {
    const querySnapshot = await getDocs(collection(db, `users/${userId}/${TRANSACTIONS_COLLECTION}`));
    const transactions: Transaction[] = [];

    querySnapshot.forEach((doc) => {
      const t = doc.data() as any;
      if (t.date >= startDate && t.date <= endDate) {
        transactions.push({
          id: doc.id,
          ...t,
        });
      }
    });

    return transactions;
  } catch (error) {
    console.error("Erro ao buscar transações para período:", error);
    throw error;
  }
}

function GroupTransactionsByCategory(
  transactions: Transaction[],
  categories: Category[]
): CategoryReport[] {
  const categoryMap: { [key: string]: CategoryReport } = {};

  transactions.forEach((t) => {
    if (!categoryMap[t.categoryId]) {
      const category = categories.find((c) => c.id === t.categoryId);
      categoryMap[t.categoryId] = {
        categoryId: t.categoryId,
        categoryName: category?.name || "Desconhecida",
        totalAmount: 0,
        percentage: 0,
        transactionCount: 0,
      };
    }

    categoryMap[t.categoryId].totalAmount += t.type === "income" ? t.amount : -t.amount;
    categoryMap[t.categoryId].transactionCount += 1;
  });

  // Calcular percentuais
  const totalExpense = Object.values(categoryMap).reduce((sum, cat) => sum + Math.abs(cat.totalAmount), 0);
  Object.values(categoryMap).forEach((cat) => {
    cat.percentage = totalExpense > 0 ? (Math.abs(cat.totalAmount) / totalExpense) * 100 : 0;
  });

  return Object.values(categoryMap);
}

function GetMonthlyTrend(transactions: Transaction[], year: number): MonthlyTrend[] {
  const trends: { [key: string]: MonthlyTrend } = {};
  const now = new Date();
  const currentMonth = now.getMonth();

  // Criar entrada para últimos 12 meses
  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(year, currentMonth - i, 1);
    const monthStr = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;

    trends[monthStr] = {
      month: monthStr,
      income: 0,
      expense: 0,
      balance: 0,
    };
  }

  // Preencher dados das transações
  transactions.forEach((t) => {
    const month = t.date.substring(0, 7);
    if (trends[month]) {
      if (t.type === "income") {
        trends[month].income += t.amount;
      } else {
        trends[month].expense += t.amount;
      }
    }
  });

  // Calcular balanço
  Object.values(trends).forEach((trend) => {
    trend.balance = trend.income - trend.expense;
  });

  return Object.values(trends);
}

export function FilterReportByCategory(report: Report, categoryId: string): Report {
  return {
    ...report,
    byCategory: report.byCategory.filter((c) => c.categoryId === categoryId),
  };
}
