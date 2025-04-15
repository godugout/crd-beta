
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define theme types
export interface TeamTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  background: string;
  text: string;
  headerBackground?: string;
  cardBackground?: string;
  buttonBackground?: string;
  buttonText?: string;
}

interface ThemeContextType {
  themes: TeamTheme[];
  currentTheme: TeamTheme | null;
  setCurrentTheme: (themeId: string) => void;
  addTheme: (theme: TeamTheme) => void;
  updateTheme: (id: string, updates: Partial<TeamTheme>) => void;
  deleteTheme: (id: string) => void;
}

const defaultThemes: TeamTheme[] = [
  {
    id: 'default',
    name: 'Default Theme',
    primary: '#006341', // A's Kelly Green
    secondary: '#EFB21E', // A's Gold
    accent: '#004F33', // Dark Kelly Green
    neutral: '#8E9196',
    background: '#FFFFFF',
    text: '#1A202C',
  },
  {
    id: 'oakland',
    name: 'Oakland A\'s',
    primary: '#006341', // Kelly Green
    secondary: '#EFB21E', // Gold
    accent: '#003831', // Dark green
    neutral: '#CCCCCC',
    background: '#FFFFFF',
    text: '#000000',
  },
  {
    id: 'sf-giants',
    name: 'SF Giants',
    primary: '#FD5A1E', // Orange
    secondary: '#27251F', // Black
    accent: '#8B6F4E', // Sand
    neutral: '#CCCCCC',
    background: '#FFFFFF',
    text: '#27251F',
  },
  {
    id: 'dark',
    name: 'Dark Theme',
    primary: '#006341', // A's Kelly Green (changed from purple)
    secondary: '#EFB21E', // A's Gold
    accent: '#004F33', // Dark kelly green
    neutral: '#8E9196',
    background: '#1A1F2C',
    text: '#FFFFFF',
  },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const TeamThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themes, setThemes] = useState<TeamTheme[]>(defaultThemes);
  const [currentTheme, setCurrentThemeState] = useState<TeamTheme | null>(defaultThemes[0]);

  // Initialize from local storage
  useEffect(() => {
    try {
      const savedThemes = localStorage.getItem('team-themes');
      if (savedThemes) {
        setThemes(JSON.parse(savedThemes));
      }
      
      const lastThemeId = localStorage.getItem('current-theme-id');
      if (lastThemeId) {
        const theme = themes.find(t => t.id === lastThemeId) || themes[0];
        setCurrentThemeState(theme);
      }
    } catch (error) {
      console.error('Error loading themes from localStorage:', error);
    }
  }, []);

  // Save to local storage when themes change
  useEffect(() => {
    try {
      localStorage.setItem('team-themes', JSON.stringify(themes));
    } catch (error) {
      console.error('Error saving themes to localStorage:', error);
    }
  }, [themes]);

  // Set current theme and save to local storage
  const setCurrentTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId) || themes[0];
    setCurrentThemeState(theme);
    localStorage.setItem('current-theme-id', themeId);
  };

  const addTheme = (theme: TeamTheme) => {
    setThemes(prev => [...prev, theme]);
  };

  const updateTheme = (id: string, updates: Partial<TeamTheme>) => {
    setThemes(prev => 
      prev.map(theme => 
        theme.id === id ? { ...theme, ...updates } : theme
      )
    );
    
    // If we're updating the current theme, update it as well
    if (currentTheme && currentTheme.id === id) {
      setCurrentThemeState(prev => prev ? { ...prev, ...updates } : prev);
    }
  };

  const deleteTheme = (id: string) => {
    // Don't allow deleting the default theme
    if (id === 'default') return;
    
    setThemes(prev => prev.filter(theme => theme.id !== id));
    
    // If we're deleting the current theme, switch to default
    if (currentTheme && currentTheme.id === id) {
      setCurrentTheme('default');
    }
  };

  const value = {
    themes,
    currentTheme,
    setCurrentTheme,
    addTheme,
    updateTheme,
    deleteTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTeamTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTeamTheme must be used within a TeamThemeProvider');
  }
  return context;
};
