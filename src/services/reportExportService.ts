import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Transaction } from "../types/TransactionType";
import { Category } from "../types/CategoryType";

export interface ExportReport {
  period: string;
  generatedDate: string;
  transactions: Transaction[];
  summary: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    byCategory: Record<string, number>;
  };
}

export const generateJSON = (
  transactions: Transaction[],
  categories: Category[],
  period: string
): ExportReport => {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const byCategory: Record<string, number> = {};
  transactions.forEach((t) => {
    const cat = categories.find((c) => c.id === t.categoryId);
    if (cat) {
      byCategory[cat.name] = (byCategory[cat.name] || 0) + t.amount;
    }
  });

  return {
    period,
    generatedDate: new Date().toISOString(),
    transactions,
    summary: {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      byCategory,
    },
  };
};

export const generateCSV = (
  transactions: Transaction[],
  categories: Category[]
): string => {
  const headers = [
    "Data",
    "Descrição",
    "Tipo",
    "Valor",
    "Categoria",
    "Status",
  ];

  const rows = transactions.map((t) => {
    const category = categories.find((c) => c.id === t.categoryId)?.name || "N/A";
    return [
      t.date,
      `"${t.description}"`,
      t.type === "income" ? "Receita" : "Despesa",
      t.amount.toFixed(2),
      category,
      t.status || "Registrado",
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  return csvContent;
};

export const generatePlainText = (
  transactions: Transaction[],
  categories: Category[],
  period: string
): string => {
  const report = generateJSON(transactions, categories, period);

  let text = "========================================\n";
  text += "         RELATÓRIO FINANCEIRO\n";
  text += "========================================\n\n";

  text += `Período: ${period}\n`;
  text += `Gerado em: ${new Date(report.generatedDate).toLocaleDateString("pt-BR")}\n\n`;

  text += "RESUMO\n";
  text += "-------\n";
  text += `Total de Receitas: R$ ${report.summary.totalIncome.toFixed(2)}\n`;
  text += `Total de Despesas: R$ ${report.summary.totalExpense.toFixed(2)}\n`;
  text += `Saldo: R$ ${report.summary.balance.toFixed(2)}\n\n`;

  text += "DESPESAS POR CATEGORIA\n";
  text += "-------\n";
  Object.entries(report.summary.byCategory).forEach(([category, amount]) => {
    text += `${category}: R$ ${amount.toFixed(2)}\n`;
  });

  text += "\n\nDETALHE DAS TRANSAÇÕES\n";
  text += "-------\n";
  report.transactions.forEach((t) => {
    const category = categories.find((c) => c.id === t.categoryId)?.name || "N/A";
    const type = t.type === "income" ? "RECEITA" : "DESPESA";
    text += `${t.date} | ${type} | ${t.description} | R$ ${t.amount.toFixed(2)} | ${category}\n`;
  });

  text += "\n========================================\n";
  return text;
};

export const exportToJSON = async (
  transactions: Transaction[],
  categories: Category[],
  period: string,
  fileName?: string
): Promise<void> => {
  try {
    const data = generateJSON(transactions, categories, period);
    const json = JSON.stringify(data, null, 2);
    const file =
      fileName || `relatorio_financeiro_${period}.json`;
    const filePath = `${FileSystem.documentDirectory}${file}`;

    await FileSystem.writeAsStringAsync(filePath, json);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: "application/json",
        dialogTitle: "Exportar Relatório",
      });
    }
  } catch (error) {
    console.error("Erro ao exportar JSON:", error);
    throw error;
  }
};

export const exportToCSV = async (
  transactions: Transaction[],
  categories: Category[],
  fileName?: string
): Promise<void> => {
  try {
    const csv = generateCSV(transactions, categories);
    const file = fileName || `relatorio_financeiro_${new Date().getTime()}.csv`;
    const filePath = `${FileSystem.documentDirectory}${file}`;

    await FileSystem.writeAsStringAsync(filePath, csv);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: "text/csv",
        dialogTitle: "Exportar Relatório",
      });
    }
  } catch (error) {
    console.error("Erro ao exportar CSV:", error);
    throw error;
  }
};

export const exportToText = async (
  transactions: Transaction[],
  categories: Category[],
  period: string,
  fileName?: string
): Promise<void> => {
  try {
    const text = generatePlainText(transactions, categories, period);
    const file = fileName || `relatorio_financeiro_${period}.txt`;
    const filePath = `${FileSystem.documentDirectory}${file}`;

    await FileSystem.writeAsStringAsync(filePath, text);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: "text/plain",
        dialogTitle: "Exportar Relatório",
      });
    }
  } catch (error) {
    console.error("Erro ao exportar TXT:", error);
    throw error;
  }
};
