/* eslint-disable */
import React, { useEffect, useState } from "react";
type ThemeMode = "theme-light" | "theme-dark";
const DarkMode = () => {
  let clickedClass = "clicked";
  const [theme, setTheme] = useState<ThemeMode>("theme-dark");

  useEffect(() => {
    localStorage.setItem("theme", "theme-dark");
    setTheme(localStorage.getItem("theme") as ThemeMode);
  }, []);

  useEffect(() => {
    document.body.classList.add(theme);
  }, [theme]);

  const switchTheme = (e: any) => {
    if (theme === 'theme-dark') {
      document.body.classList.replace('theme-dark', 'theme-light');
      const el = e.target.closest('.theme-btn');
      el.classList.remove(clickedClass);
      setTheme('theme-light');
      localStorage.setItem("theme", "theme-light");
      const event = new CustomEvent("themeChange", { detail: "theme-light" });
      window.dispatchEvent(event);
    } else {
      document.body.classList.replace('theme-light', 'theme-dark');
      const el = e.target.closest('.theme-btn');
      el.classList.add(clickedClass);
      setTheme('theme-dark');
      localStorage.setItem("theme", "theme-dark");
      const event = new CustomEvent("themeChange", { detail: "theme-dark" });
      window.dispatchEvent(event);
    }
  };

  return (
    <span
      className={`theme-btn pointer p-2 text-center ms-3 menu-icon chat-active-btn ${theme === "theme-dark" ? clickedClass : ""}`}
      onClick={(e) => switchTheme(e)}
      style={{cursor: 'pointer'}}
    >
      <i className="feather-moon font-xl"></i>
    </span>
  );
};

export default DarkMode;
