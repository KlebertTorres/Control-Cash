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
  textColorPrimary: "#ffffff",
  text: "#e8eef2",
  textColorSecondary: "#000000",

  // UI Elements
  borderColor: "#8EB69B",
};

export const LightMode = {
  // Background & Base Colors
  backgroundColor: "#fafbfc",
  cardBackground: "#ffffff",
  overlay: "rgba(0, 0, 0, 0.5)",

  // Primary Colors (Green Theme)
  mediumGreen: "#2a8b7f",
  accentGreen: "#3dd68e",
  lightGreen: "#e8fdf6",
  softGreen: "#f0fdf9",

  // Text Colors
  textColorPrimary: "#000000",
  text: "#1f2937",
  textColorSecondary: "#6b7280",

  // UI Elements
  borderColor: "#e5e7eb",
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