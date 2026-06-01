export interface InitialData {
  salary: number;
  extraIncome: number;
  waterBill: number;
  electricityBill: number;
  internetBill: number;
}

export interface OnBoardingContextType {
  hasCompletedOnboarding: boolean;
  loadingOnboarding: boolean;
  initialData: InitialData | null;
  completeOnboarding: (data: InitialData) => Promise<void>;
}