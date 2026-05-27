import { createContext, ReactNode, useContext, useState } from "react";

interface InitialData {
  salary: number;
  extraIncome: number;
  waterBill: number;
  electricityBill: number;
  internetBill: number;
}

interface OnboardingContextType {
  hasCompletedOnboarding: boolean;
  initialData: InitialData | null;
  completeOnboarding: (data: InitialData) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export const useOnboardingStore = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error(
      "useOnboardingStore must be used within an OnboardingProvider",
    );
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [initialData, setInitialData] = useState<InitialData | null>(null);

  const completeOnboarding = (data: InitialData) => {
    setHasCompletedOnboarding(true);
    setInitialData(data);
  };

  return (
    <OnboardingContext.Provider
      value={{
        hasCompletedOnboarding,
        initialData,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
