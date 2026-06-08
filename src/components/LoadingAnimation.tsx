import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { DarkMode, LightMode } from "../styles/cores";

interface LoadingAnimationProps {
  darkMode: boolean;
  size?: number;
  color?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  darkMode,
  size = 60,
  color,
}) => {
  const Colors = darkMode ? DarkMode : LightMode;
  const animationValue = useSharedValue(0);
  const finalColor = color || Colors.cardBackground;

  useEffect(() => {
    animationValue.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      animationValue.value,
      [0, 1],
      [0, 360],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationValue.value,
      [0, 0.5, 1],
      [1, 1.2, 1],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      animationValue.value,
      [0, 0.5, 1],
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pulseCircle,
          pulseStyle,
          {
            width: size * 1.5,
            height: size * 1.5,
            backgroundColor: finalColor,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.spinnerCircle,
          animatedStyle,
          {
            width: size,
            height: size,
            borderWidth: size / 6,
            borderColor: `${finalColor}30`,
            borderTopColor: finalColor,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pulseCircle: {
    position: "absolute",
    borderRadius: 100,
  },
  spinnerCircle: {
    borderRadius: 100,
  },
});
