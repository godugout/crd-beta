
import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextValue {
  theme: "dark";
  setTheme: React.Dispatch<React.SetStateAction<"dark">>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Default mock theme context for when the hook is used outside the provider
const mockThemeContext: ThemeContextValue = {
  theme: "dark",
  setTheme: () => console.warn("Using mock theme context. ThemeProvider not found."),
};

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme] = useState<"dark">("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    console.warn("useTheme used outside of ThemeProvider, using mock theme context");
    return mockThemeContext;
  }
  
  return context;
};
