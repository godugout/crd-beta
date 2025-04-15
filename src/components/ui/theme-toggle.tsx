
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
      className="bg-design-neutral-200 hover:bg-design-neutral-300 dark:bg-design-neutral-800 dark:hover:bg-design-neutral-700"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-design-secondary-700" />
      ) : (
        <Sun className="h-5 w-5 text-design-primary-300" />
      )}
    </Button>
  );
}
