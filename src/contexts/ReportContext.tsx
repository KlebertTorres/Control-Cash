import { createContext, ReactNode, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { FilterReportByCategory, GenerateReport, GetDashboardData } from "../services/reportService";
import { DashboardData, Report, ReportContextType } from "../types/ReportType";

export const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loadingReports, setLoadingReports] = useState(false);

  const generateReport = async (
    period: "daily" | "weekly" | "monthly" | "annual",
    startDate: string,
    endDate: string
  ): Promise<Report> => {
    try {
      setLoadingReports(true);
      const report = await GenerateReport(user?.uid, period, startDate, endDate);
      setReports((prev) => [report, ...prev]);
      return report;
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      throw error;
    } finally {
      setLoadingReports(false);
    }
  };

  const getDashboardData = async (userId: string, startDate: string, endDate: string): Promise<DashboardData> => {
    try {
      setLoadingReports(true);
      const data = await GetDashboardData(userId, startDate, endDate);
      setDashboardData(data);
      return data;
    } catch (error) {
      console.error("Erro ao gerar dados do dashboard:", error);
      throw error;
    } finally {
      setLoadingReports(false);
    }
  };

  const getFilteredReport = (categoryId?: string, period?: string): Report | null => {
    let filtered = [...reports];

    if (period) {
      filtered = filtered.filter((r) => r.period === period);
    }

    if (categoryId && filtered.length > 0) {
      return FilterReportByCategory(filtered[0], categoryId);
    }

    return filtered.length > 0 ? filtered[0] : null;
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        dashboardData,
        loadingReports,
        generateReport,
        getDashboardData,
        getFilteredReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
