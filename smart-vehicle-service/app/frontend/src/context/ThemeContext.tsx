"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext<{
  isLightMode: boolean;
  toggleTheme: () => void;
}>({
  isLightMode: true, // Default to true
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Lazy initialization: Check localStorage, default to 'true' (Light mode) if not set
  const [isLightMode, setIsLightMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("autocare_theme");
      if (savedTheme !== null) {
        return savedTheme === "light";
      }
    }
    return true; // Default default state is Light Mode
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