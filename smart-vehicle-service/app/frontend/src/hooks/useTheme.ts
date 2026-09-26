"use client";
import { useState, useEffect } from "react";

export function useTheme() {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("autocare_theme");
    if (saved) setIsLightMode(saved === "light");
  }, []);

  const toggleTheme = () => {
    const nextMode = !isLightMode;
    setIsLightMode(nextMode);
    localStorage.setItem("autocare_theme", nextMode ? "light" : "dark");
  };

  return { isLightMode, toggleTheme };
}