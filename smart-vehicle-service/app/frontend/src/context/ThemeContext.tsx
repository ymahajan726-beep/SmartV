"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext<{
  isLightMode: boolean;
  toggleTheme: () => void;
}>({
  isLightMode: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Lazy initialization taaki initial render par hi correct theme mil jaye (no delay/flash)
  const [isLightMode, setIsLightMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("autocare_theme") === "light";
    }
    return false;
  });

  const toggleTheme = () => {
    const nextMode = !isLightMode;
    setIsLightMode(nextMode);
    localStorage.setItem("autocare_theme", nextMode ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ isLightMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);