/* eslint-disable */
import React, { useEffect, useState } from "react";
type ThemeMode = "theme-light" | "theme-dark";
const DarkMode = () => {
  let clickedClass = "clicked";
  const [theme, setTheme] = useState<ThemeMode>("theme-dark");

  useEffect(() => {
    setTheme(localStorage.getItem("theme") as ThemeMode);
  }, []);

  useEffect(() => {
    document.body.classList.add(theme);
  }, [theme]);

  const switchTheme = (e: any) => {
    if (theme === 'theme-dark') {
      document.body.classList.replace('theme-dark', 'theme-light');
      e.target.classList.remove(clickedClass);
      localStorage.setItem("theme", "theme-light");
    } else {
      document.body.classList.replace('theme-light', 'theme-dark');
      e.target.classList.add(clickedClass);
      localStorage.setItem("theme", "theme-dark");
    }
  };

  return (
    <span
      className={`pointer p-2 text-center ms-3 menu-icon chat-active-btn ${theme === "theme-dark" ? clickedClass : ""}`}
      onClick={(e) => switchTheme(e)}
    >
      <i className="feather-moon font-xl text-current"></i>
    </span>
  );
};

export default DarkMode;
