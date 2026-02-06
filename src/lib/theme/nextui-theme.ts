export const customTheme = {
  colors: {
    // Backgrounds
    background: "#0a0a0a",
    foreground: "#f5f5f5",
    // Primary (Blue)
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      DEFAULT: "#2563eb",
      foreground: "#ffffff",
    },
    // Grays for dark theme
    default: {
      50: "#fafafa",
      100: "#f4f4f5",
      200: "#e4e4e7",
      300: "#d4d4d8",
      400: "#a1a1aa",
      500: "#71717a",
      600: "#52525b",
      700: "#3f3f46",
      800: "#27272a",
      900: "#18181b",
      DEFAULT: "#27272a",
      foreground: "#a1a1aa",
    },
    // Content/Card backgrounds
    content1: {
      DEFAULT: "#18181b",
      foreground: "#f5f5f5",
    },
    content2: {
      DEFAULT: "#27272a",
      foreground: "#e4e4e7",
    },
    content3: {
      DEFAULT: "#3f3f46",
      foreground: "#d4d4d8",
    },
    // Semantic colors
    danger: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
      DEFAULT: "#dc2626",
      foreground: "#ffffff",
    },
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
      DEFAULT: "#16a34a",
      foreground: "#ffffff",
    },
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
      DEFAULT: "#d97706",
      foreground: "#ffffff",
    },
  },
  font: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
};

// Utility to merge with default NextUI theme
export const getThemeConfig = () => ({
  themes: {
    dark: customTheme,
    light: customTheme,
  },
  defaultTheme: "dark",
});
