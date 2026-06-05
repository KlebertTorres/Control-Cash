import { useContext } from "react";
import { InstallmentContext } from "../contexts/InstallmentContext";
import { InstallmentContextType } from "../types/InstallmentType";

export function useInstallment(): InstallmentContextType {
  const context = useContext(InstallmentContext);
  if (!context) {
    throw new Error("useInstallment deve ser usado dentro de InstallmentProvider");
  }
  return context;
}
