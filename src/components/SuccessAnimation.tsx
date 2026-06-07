import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  useAnimatedReaction,
} from "react-native-reanimated";
import { DarkMode, LightMode } from "../styles/cores";

interface SuccessAnimationProps {
  darkMode: boolean;
  size?: number;
  onComplete?: () => void;
  autoHide?: boolean;
  autoHideDuration?: number;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  darkMode,
  size = 80,
  onComplete,
  autoHide = true,
  autoHideDuration = 2000,
}) => {
  const Colors = darkMode ? DarkMode : LightMode;
  const animationValue = useSharedValue(0);

  useEffect(() => {
    animationValue.value = withTiming(1, { duration: 600 });

    if (autoHide) {
      const timer = setTimeout(() => {
        animationValue.value = withTiming(0, { duration: 400 }, () => {
          if (onComplete) onComplete();
        });
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, []);

  const containerStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationValue.value,
      [0, 1],
      [0.5, 1],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      animationValue.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      animationValue.value,
      [0, 1],
      [-45, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          containerStyle,
          {
            width: size,
            height: size,
            backgroundColor: Colors.backgroundColor,
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.checkmark,
            checkmarkStyle,
            { fontSize: size * 0.6, color: "#fff" },
          ]}
        >
          ✓
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  circle: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
