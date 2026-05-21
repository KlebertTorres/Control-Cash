import { Platform } from "react-native";

export const DarkMode = {
  darkest: "#051F20",
  deepGreen: "#0B2B26",
  mediumGreen: "#163832",
  accentGreen: "#235347",
  lightGreen: "#8EB69B",
  softGreen: "#DAF1DE",
  textColorPrimary: "#FFFFFF",
};

export const LightMode = {
  darkest: "#9bc6c8",
  deepGreen: "#457c73",
  mediumGreen: "#436f67",
  accentGreen: "#7a8f8a",
  lightGreen: "#52715c",
  softGreen: "#353a36",
  textColorPrimary: "#000000",
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