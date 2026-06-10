import { Platform } from "react-native";

export const DarkMode = {
  // Background & Base Colors
  backgroundColor: "#0B2B26",
  cardBackground: "#163832",
  overlay: "#051F20",

  // Primary Colors (Green Theme)
  mediumGreen: "#235347",
  accentGreen: "#8EB69B",
  lightGreen: "#a8f0d9",

  // Text Colors
  textColorPrimary: "#FFFFFF",
  text: "#e8eef2",
  textColorSecondary: "#000000",

  // UI Elements
  borderColor: "#8EB69B",
};

export const LightMode = {
  // Background & Base Colors
  backgroundColor: "#DAF1DE",
  cardBackground: "#8EB69B",
  overlay: "#235347",

  // Primary Colors (Green Theme)
  mediumGreen: "#235347",
  accentGreen: "#163832",
  lightGreen: "#0B2B26",
  softGreen: "#051F10",

  // Text Colors
  textColorPrimary: "#e6e6e6",
  text: "#051F10",
  textColorSecondary: "#919191",

  // UI Elements
  borderColor: "#163832",
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});