import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import tw from "twrnc";

type ThemeMode = "light" | "dark";

type ThemeColors = {
  background: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  primary: string;
  muted: string;
  overlay: string;
};

const lightColors: ThemeColors = {
  background: "#f9fafb",
  card: "#ffffff",
  text: "#111827",
  subtext: "#6b7280",
  border: "#e5e7eb",
  primary: "#0C0932",
  muted: "#9ca3af",
  overlay: "rgba(0,0,0,0.35)",
};

const darkColors: ThemeColors = {
  background: "#0b0b10",
  card: "#14141b",
  text: "#f3f4f6",
  subtext: "#9ca3af",
  border: "#27272a",
  primary: "#8b86ff",
  muted: "#6b7280",
  overlay: "rgba(0,0,0,0.6)",
};

const THEME_STORAGE_KEY = "apostle.theme.mode";

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const applyTwScheme = (nextMode: ThemeMode) => {
  const setter = (tw as unknown as { setColorScheme?: (scheme: ThemeMode) => void })
    .setColorScheme;
  if (setter) {
    setter(nextMode);
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>("light");

  useEffect(() => {
    let mounted = true;
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (!mounted) return;
        if (stored === "light" || stored === "dark") {
          setModeState(stored);
          applyTwScheme(stored);
          return;
        }
        const system = Appearance.getColorScheme();
        if (system === "dark") {
          setModeState("dark");
          applyTwScheme("dark");
        } else {
          applyTwScheme("light");
        }
      } catch {
        // ignore
      }
    };
    loadTheme();
    return () => {
      mounted = false;
    };
  }, []);

  const setMode = (nextMode: ThemeMode) => {
    setModeState(nextMode);
    applyTwScheme(nextMode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode).catch(() => null);
  };

  const toggleMode = () => {
    setModeState((prev) => {
      const nextMode = prev === "light" ? "dark" : "light";
      applyTwScheme(nextMode);
      AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode).catch(() => null);
      return nextMode;
    });
  };

  const colors = useMemo(() => (mode === "dark" ? darkColors : lightColors), [mode]);

  const value = useMemo(
    () => ({ mode, colors, setMode, toggleMode }),
    [mode, colors]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
