import type { EmailTheme } from "./email-theme";

/**
 * The app's light theme (`app/globals.css`, taupe) as an emailcn theme.
 * Hex because email clients don't support `oklch`. Square corners like the `base-sera` style.
 * Hand-written, unlike the rest of this folder: update it when the app palette changes.
 */
export const myMoneyTheme = {
  borderRadius: "0px",
  borderRadiusLg: "0px",
  button: {
    primary: {
      backgroundColor: "#c96442",
      borderRadius: "0px",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "500",
      paddingX: "24px",
      paddingY: "12px",
    },
    secondary: {
      backgroundColor: "transparent",
      border: "1px solid #dad9d4",
      borderRadius: "0px",
      color: "#3d3929",
      fontSize: "14px",
      fontWeight: "500",
      paddingX: "24px",
      paddingY: "12px",
    },
  },
  // background, muted, secondary
  colorBackground: "#faf9f5",
  colorBackgroundMuted: "#ede9de",
  colorBackgroundSubtle: "#e9e6dc",
  colorBorder: "#dad9d4",
  colorBorderSubtle: "#ede9de",
  colorDanger: "#ef4444",
  colorPrimary: "#c96442",
  colorPrimaryForeground: "#ffffff",
  colorPrimaryHover: "#b55230",
  colorSuccess: "#298646",
  colorText: "#3d3929",
  colorTextMuted: "#6e6d68",
  colorTextSubtle: "#9b9a94",
  colorWarning: "#f59e0b",
  containerWidth: "600px",
  // Outfit is the app font; clients without it fall back to the system font.
  fontFamily: 'Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontFamilyMono: '"Menlo", "Monaco", "Courier New", monospace',
  fontSizeBase: "14px",
  fontSizeHeading: "28px",
  fontSizeLg: "16px",
  fontSizeSm: "12px",
  fontSizeXl: "20px",
  fontWeightBold: "600",
  fontWeightMedium: "500",
  fontWeightNormal: "400",
  lineHeightBase: "1.6",
  spacingBase: "24px",
  spacingLg: "32px",
  spacingXl: "48px",
} satisfies EmailTheme;
