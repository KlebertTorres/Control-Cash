import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeInUp,
  FadeIn,
} from "react-native-reanimated";

interface ScreenTransitionProps {
  children: React.ReactNode;
  type?: "fadeIn" | "slideUp" | "scaleIn";
  duration?: number;
  delay?: number;
}

export const ScreenTransition: React.FC<ScreenTransitionProps> = ({
  children,
  type = "fadeIn",
  duration = 300,
  delay = 0,
}) => {
  const animationValue = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => {
      animationValue.value = withTiming(1, { duration });
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    switch (type) {
      case "slideUp":
        return {
          transform: [
            {
              translateY: animationValue.value === 1 ? 0 : 30,
            },
          ],
          opacity: animationValue.value,
        };
      case "scaleIn":
        return {
          transform: [
            {
              scale: animationValue.value === 1 ? 1 : 0.9,
            },
          ],
          opacity: animationValue.value,
        };
      case "fadeIn":
      default:
        return {
          opacity: animationValue.value,
        };
    }
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
