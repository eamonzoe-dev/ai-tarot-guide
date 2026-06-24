"use client";

import { useEffect, useState } from "react";

type Theme = "day" | "night";

const THEME_STORAGE_KEY = "ora-theme";

function isTheme(value: string | null): value is Theme {
  return value === "day" || value === "night";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === "night" ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("day");

  useEffect(() => {
    queueMicrotask(() => {
      const datasetTheme = document.documentElement.dataset.theme ?? null;
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      const currentTheme = isTheme(datasetTheme)
        ? datasetTheme
        : isTheme(storedTheme)
          ? storedTheme
          : "day";

      setTheme(currentTheme);
      applyTheme(currentTheme);
    });
  }, []);

  function chooseTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }

  return (
    <div aria-label="Theme" className="theme-toggle" role="group">
      <button
        aria-label="Day theme"
        className="theme-toggle__option"
        data-active={theme === "day"}
        onClick={() => chooseTheme("day")}
        type="button"
      >
        <svg aria-hidden="true" focusable="false">
          <use href="#ora-sun" />
        </svg>
      </button>
      <button
        aria-label="Night theme"
        className="theme-toggle__option"
        data-active={theme === "night"}
        onClick={() => chooseTheme("night")}
        type="button"
      >
        <svg aria-hidden="true" focusable="false">
          <use href="#ora-moon" />
        </svg>
      </button>
    </div>
  );
}
