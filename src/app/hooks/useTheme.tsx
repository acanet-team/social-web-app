"use client";
import React, { useState, useEffect } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "theme-light",
  );

  useEffect(() => {
    const handleThemeChange = () => {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        setTheme(storedTheme);
      }
    };
    window.addEventListener("themeChange", handleThemeChange);
    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, [theme]);

  return theme;
}
