
// This file is maintained for backward compatibility
// Re-export from the centralized ThemeProvider implementation
import { useTheme as useThemeInternal, ThemeProvider } from "@/components/ui/ThemeProvider";

export { ThemeProvider };
export const useTheme = useThemeInternal;
