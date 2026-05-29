import AsyncStorage from "@react-native-async-storage/async-storage"
import { createContext, ReactNode, useState, useEffect } from "react";
import { OnBoardingContextType, InitialData } from "../types/OnBoardingType";

export const OnBoardingContext = createContext<OnBoardingContextType | undefined>(
  undefined,
);

export const OnBoardingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [initialData, setInitialData] = useState<InitialData | null>(null);

  async function carregarOnBoarding(){

    const savedData = await AsyncStorage.getItem("@initialData");
    const onBoarding = await AsyncStorage.getItem("@onboarding")

    if(savedData){
      setInitialData(JSON.parse(savedData));
    }

    if(onBoarding !== null){
      setHasCompletedOnboarding(true)
    }
  }

  useEffect(() => {
      carregarOnBoarding();
  }, []);

  async function completeOnboarding(data: InitialData){
    await AsyncStorage.setItem(
      "@onboarding", "true"
    );

    await AsyncStorage.setItem(
      "@initialData",
      JSON.stringify(data)
    );

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