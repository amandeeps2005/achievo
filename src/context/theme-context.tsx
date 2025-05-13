
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  storageKey = "achievo-ui-theme",
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'dark'; // Default for server-side or before hydration
    }
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
      }
      // Fallback directly to dark if not stored or invalid, making dark the default
      return 'dark';
    } catch (e) {
      console.error("Error reading theme from localStorage", e);
      return 'dark'; // Fallback to dark in case of error
    }
  });

  // This effect ensures that if localStorage is cleared or initially empty,
  // the theme state is explicitly set to 'dark'.
  // This reinforces the default if the useState initialization somehow missed it or if storage changes.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      if (!storedTheme || (storedTheme !== "light" && storedTheme !== "dark")) {
        // If nothing valid in storage, ensure theme is 'dark'.
        // The logic `prefersDark ? 'dark' : 'dark'` always results in 'dark'.
        // We can simplify this to just setThemeState('dark').
        setThemeState('dark');
      }
    }
  }, [storageKey]);


  useEffect(() => {
    // This effect runs only on the client after hydration to apply and save the theme
    const root = window.document.documentElement;

    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);

    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {
      console.error("Error saving theme to localStorage", e);
    }
  }, [theme, storageKey]);

  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    if (newTheme === "light" || newTheme === "dark") {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

