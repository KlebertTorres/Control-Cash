import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
    CreateInstallmentDoc,
    DeleteInstallmentDoc,
    GetInstallmentsDoc,
    UpdateInstallmentDoc
} from "../services/installmentService";
import { Installment, InstallmentContextType } from "../types/InstallmentType";

export const InstallmentContext = createContext<InstallmentContextType | undefined>(undefined);

export const InstallmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [loadingInstallments, setLoadingInstallments] = useState(true);

  const loadInstallments = useCallback(async () => {
    try {
      setLoadingInstallments(true);
      const installmentsData = await GetInstallmentsDoc(user.uid);
      setInstallments(installmentsData);
    } catch (error) {
      console.error("Erro ao carregar parcelamentos:", error);
    } finally {
      setLoadingInstallments(false);
    }
  }, [user.uid]);

  useEffect(() => {
    if (!user?.uid) {
      setInstallments([]);
      setLoadingInstallments(false);
      return;
    }

    loadInstallments();
  }, [user?.uid, loadInstallments]);

  const addInstallment = async (installmentData: Omit<Installment, "id" | "transactions">) => {
    const newInstallment = await CreateInstallmentDoc(user.uid, installmentData);
    setInstallments((prev) => [...prev, newInstallment]);
  };

  const removeInstallment = async (id: string) => {
    await DeleteInstallmentDoc(user.uid, id);
    setInstallments((prev) => prev.filter((inst) => inst.id !== id));
  };

  const updateInstallment = async (id: string, installmentData: Partial<Installment>) => {
    await UpdateInstallmentDoc(user.uid, id, installmentData);
    setInstallments((prev) =>
      prev.map((installment) =>
        installment.id === id ? { ...installment, ...installmentData } : installment
      )
    );
  };

  const getActiveInstallments = (): Installment[] => {
    return installments.filter((inst) => inst.status === "active");
  };

  const getInstallmentsByMonth = (month: string): Installment[] => {
    return installments.filter((inst) => inst.startDate.startsWith(month));
  };

  return (
    <InstallmentContext.Provider
      value={{
        installments,
        loadingInstallments,
        addInstallment,
        removeInstallment,
        updateInstallment,
        getActiveInstallments,
        getInstallmentsByMonth,
      }}
    >
      {children}
    </InstallmentContext.Provider>
  );
};
