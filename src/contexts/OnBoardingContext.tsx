import { createContext, ReactNode, useState } from "react";
import { OnBoardingContextType, InitialData } from "../types/OnBoardingType";

export const OnBoardingContext = createContext<OnBoardingContextType | undefined>(
  undefined,
);

export const OnBoardingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [initialData, setInitialData] = useState<InitialData | null>(null);

  const completeOnboarding = (data: InitialData) => {
    setHasCompletedOnboarding(true);
    setInitialData(data);
  };

  return (
    <OnBoardingContext.Provider
      value={{
        hasCompletedOnboarding,
        initialData,
        completeOnboarding,
      }}
    >
      {children}
    </OnBoardingContext.Provider>
  );
};