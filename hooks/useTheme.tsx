import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

// Інтерфейс для опису структури кольорів теми
export interface ColorScheme {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  success: string;
  warning: string;
  danger: string;
  shadow: string;
  dangerLight: string;
  error: string;
  gradients: {
    background: [string, string];
    surface: [string, string];
    primary: [string, string];
    success: [string, string];
    warning: [string, string];
    danger: [string, string];
    muted: [string, string];
    empty: [string, string];
  };
  backgrounds: {
    input: string;
    editInput: string;
  };
  statusBarStyle: "light-content" | "dark-content";
}

// Налаштування світлої теми
const lightColors: ColorScheme = {
  bg: "#F9FAFB",
  surface: "#FFFFFF",
  text: "#111827",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  primary: "#4F46E5", // Modern Indigo
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  shadow: "rgba(0, 0, 0, 0.05)",
  dangerLight: "#fee2e2",
  error: "#f87171",
  gradients: {
    background: ["#F9FAFB", "#F3F4F6"],
    surface: ["#FFFFFF", "#F9FAFB"],
    primary: ["#4F46E5", "#4338CA"],
    success: ["#10B981", "#059669"],
    warning: ["#F59E0B", "#D97706"],
    danger: ["#EF4444", "#DC2626"],
    muted: ["#9CA3AF", "#6B7280"],
    empty: ["#F3F4F6", "#E5E7EB"],
  },
  backgrounds: {
    input: "#F3F4F6",
    editInput: "#FFFFFF",
  },
  statusBarStyle: "dark-content" as const,
};

// Налаштування темної теми
const darkColors: ColorScheme = {
  bg: "#09090B", // Zinc 950
  surface: "#18181B", // Zinc 900
  text: "#FAFAFA",
  textMuted: "#A1A1AA",
  border: "#27272A", // Zinc 800
  primary: "#6366F1", // Indigo 500
  success: "#34D399",
  warning: "#FBBF24",
  danger: "#F87171",
  shadow: "rgba(0, 0, 0, 0.5)",
  dangerLight: "#f8717133",
  error: "#f87171",
  gradients: {
    background: ["#09090B", "#18181B"],
    surface: ["#18181B", "#27272A"],
    primary: ["#4F46E5", "#3730A3"],
    success: ["#059669", "#047857"],
    warning: ["#D97706", "#B45309"],
    danger: ["#DC2626", "#B91C1C"],
    muted: ["#3F3F46", "#52525B"],
    empty: ["#27272A", "#3F3F46"],
  },
  backgrounds: {
    input: "#27272A",
    editInput: "#18181B",
  },
  statusBarStyle: "light-content" as const,
};

interface ThemeContexType {
  isDarkMode: boolean;
  colors: ColorScheme;
  toggleDarkMode: () => void;
}

// Створення контексту
export const ThemeContext = createContext<undefined | ThemeContexType>(
  undefined,
);

// Провайдер теми, який обгортає компоненти додатку
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Зчитування збереженого стану під час запуску додатку
  useEffect(() => {
    AsyncStorage.getItem("darkMode").then((value) => {
      if (value) setIsDarkMode(JSON.parse(value));
    });
  }, []);

  // Перемикач теми із записом у AsyncStorage
  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  const theme = {
    isDarkMode,
    toggleDarkMode,
    colors: isDarkMode ? darkColors : lightColors,
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

// Створення кастомного хука для зручного використання теми в компонентах
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default useTheme;
