import { Platform } from "react-native";

export const DarkMode = {
  // Background & Base Colors
  darkest: "#0a0e27",
  backgroundColor: "#121626",
  cardBackground: "#1a1f3a",
  overlay: "rgba(0, 0, 0, 0.7)",

  // Primary Colors (Green Theme)
  deepGreen: "#1e4d44",
  mediumGreen: "#2a6b5c",
  accentGreen: "#3dd68e",
  lightGreen: "#a8f0d9",
  softGreen: "#e8fdf6",

  // Text Colors
  textColorPrimary: "#ffffff",
  text: "#e8eef2",
  secondary: "#a0aab5",

  // UI Elements
  borderColor: "#2a3f42",
  primary: "#3dd68e",
};

export const LightMode = {
  // Background & Base Colors
  darkest: "#f5f5f5",
  backgroundColor: "#fafbfc",
  cardBackground: "#ffffff",
  overlay: "rgba(0, 0, 0, 0.5)",

  // Primary Colors (Green Theme)
  deepGreen: "#1b5e54",
  mediumGreen: "#2a8b7f",
  accentGreen: "#3dd68e",
  lightGreen: "#e8fdf6",
  softGreen: "#f0fdf9",

  // Text Colors
  textColorPrimary: "#000000",
  text: "#1f2937",
  secondary: "#6b7280",

  // UI Elements
  borderColor: "#e5e7eb",
  primary: "#3dd68e",
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