import { useContext } from "react";
import { ReportContext } from "../contexts/ReportContext";
import { ReportContextType } from "../types/ReportType";

export function useReport(): ReportContextType {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReport deve ser usado dentro de ReportProvider");
  }
  return context;
}
