import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { GetUserDoc, UpdateUserDoc } from "../services/userService";
import { InitialData, OnBoardingContextType } from "../types/OnBoardingType";

export const OnBoardingContext =
  createContext<OnBoardingContextType | undefined>(undefined);

export const OnBoardingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  const [hasCompletedOnboarding, setHasCompletedOnboarding] =
    useState(false);

  const [loadingOnboarding, setLoadingOnboarding] =
    useState(true);

  const [initialData, setInitialData] =
    useState<InitialData | null>(null);

  async function carregarOnBoarding() {
    try {
      const onboarding =
        await AsyncStorage.getItem(`@onboarding_${user?.uid}`);

      if (onboarding) {
        const userOnboarding = await GetUserDoc(user?.uid);
        
        if(userOnboarding?.tutorialComplete){
          setHasCompletedOnboarding(true);
        }else{
          setHasCompletedOnboarding(false);
        }

      }else{
        setHasCompletedOnboarding(false);
      }
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingOnboarding(false);
    }
  }

  useEffect(() => {
    if (user?.uid) {
      carregarOnBoarding();
    }
  }, [user?.uid]);

  async function completeOnboarding(data: InitialData) {
    await AsyncStorage.setItem(
      `@onboarding_${user?.uid}`,
      "true"
    );
    user.tutorialComplete = true;
    await UpdateUserDoc(user.uid, {tutorialComplete: true});

    setHasCompletedOnboarding(true);
    setInitialData(data);
  }

  return (
    <OnBoardingContext.Provider
      value={{
        hasCompletedOnboarding,
        loadingOnboarding,
        initialData,
        completeOnboarding,
      }}
    >
      {children}
    </OnBoardingContext.Provider>
  );
};