import { useContext } from "react";
import { OnBoardingContext } from "../contexts/OnBoardingContext";

export const useOnBoarding = () => {
  const context = useContext(OnBoardingContext);
  if (!context) {
    throw new Error(
      "useOnboardingStore must be used within an OnboardingProvider",
    );
  }
  return context;
};