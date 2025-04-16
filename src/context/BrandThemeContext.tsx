
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface BrandTheme {
  id: string;
  name: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  cardBackgroundColor: string;
  headerBackgroundColor: string;
  navTextColor: string;
  buttonPrimaryColor: string;
  buttonSecondaryColor: string;
  buttonTextColor: string;
}

// Default themes based on the new brand images
export const brandThemes: Record<string, BrandTheme> = {
  default: {
    id: 'default',
    name: 'CardShow Default',
    primaryColor: '#0000FF', // Blue
    secondaryColor: '#FFD700', // Gold
    accentColor: '#FF6B00', // Orange
    backgroundColor: '#F8F8F8', // Light gray
    textColor: '#1A1A1A', // Near black
    cardBackgroundColor: '#FFFFFF', // White
    headerBackgroundColor: '#0000FF', // Blue
    navTextColor: '#FFFFFF', // White
    buttonPrimaryColor: '#0000FF', // Blue
    buttonSecondaryColor: '#FFD700', // Gold
    buttonTextColor: '#FFFFFF', // White
  },
  oakland: {
    id: 'oakland',
    name: 'Oakland Athletics',
    logo: '/lovable-uploads/ff2891c3-1d0a-406e-af10-5c7219a985c1.png',
    primaryColor: '#006341', // Kelly Green
    secondaryColor: '#EFB21E', // Athletic Gold
    accentColor: '#003831', // Dark green
    backgroundColor: '#F7F7F7', // Light gray
    textColor: '#333333', // Dark gray
    cardBackgroundColor: '#FFFFFF', // White
    headerBackgroundColor: '#006341', // Kelly Green
    navTextColor: '#FFFFFF', // White
    buttonPrimaryColor: '#006341', // Kelly Green
    buttonSecondaryColor: '#EFB21E', // Athletic Gold
    buttonTextColor: '#FFFFFF', // White
  },
  blue: {
    id: 'blue',
    name: 'Blue Theme',
    logo: '/lovable-uploads/d4ebcb92-549f-4a9f-aa66-b3b6aa74822c.png',
    primaryColor: '#0057B8', // Blue
    secondaryColor: '#00A3E0', // Light Blue
    accentColor: '#FFFFFF', // White
    backgroundColor: '#F0F8FF', // Alice blue
    textColor: '#333333', // Dark gray
    cardBackgroundColor: '#FFFFFF', // White
    headerBackgroundColor: '#0057B8', // Blue
    navTextColor: '#FFFFFF', // White
    buttonPrimaryColor: '#00A3E0', // Light Blue
    buttonSecondaryColor: '#0057B8', // Blue
    buttonTextColor: '#FFFFFF', // White
  },
  gold: {
    id: 'gold',
    name: 'Gold Edition',
    logo: '/lovable-uploads/580b587b-f3df-4cb5-9a15-d94e47fef42f.png',
    primaryColor: '#FFD700', // Gold
    secondaryColor: '#B8860B', // Dark gold
    accentColor: '#000000', // Black
    backgroundColor: '#FFFDF7', // Cream
    textColor: '#333333', // Dark gray
    cardBackgroundColor: '#FFFFFF', // White
    headerBackgroundColor: '#B8860B', // Dark gold
    navTextColor: '#FFFFFF', // White
    buttonPrimaryColor: '#FFD700', // Gold
    buttonSecondaryColor: '#B8860B', // Dark gold
    buttonTextColor: '#000000', // Black
  },
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    logo: '/lovable-uploads/8dcc0622-d929-41bc-9324-b6a081b77ea8.png',
    primaryColor: '#4F46E5', // Indigo
    secondaryColor: '#7C3AED', // Purple
    accentColor: '#10B981', // Green
    backgroundColor: '#121212', // Very dark gray
    textColor: '#F9FAFB', // White smoke
    cardBackgroundColor: '#1F1F1F', // Dark gray
    headerBackgroundColor: '#171717', // Darker gray
    navTextColor: '#FFFFFF', // White
    buttonPrimaryColor: '#4F46E5', // Indigo
    buttonSecondaryColor: '#7C3AED', // Purple
    buttonTextColor: '#FFFFFF', // White
  },
  vintage: {
    id: 'vintage',
    name: 'Vintage Cards',
    logo: '/lovable-uploads/05e28a2e-8c5a-48bc-887e-d73e8548611f.png',
    primaryColor: '#B85C38', // Rust/Brown
    secondaryColor: '#E0C097', // Beige
    accentColor: '#5F7161', // Olive green
    backgroundColor: '#F9F5EB', // Off-white
    textColor: '#2D2424', // Dark brown
    cardBackgroundColor: '#FFF8EA', // Cream
    headerBackgroundColor: '#B85C38', // Rust/Brown
    navTextColor: '#FFFFFF', // White
    buttonPrimaryColor: '#B85C38', // Rust/Brown
    buttonSecondaryColor: '#5F7161', // Olive green
    buttonTextColor: '#FFFFFF', // White
  },
};

interface BrandThemeContextType {
  currentTheme: BrandTheme;
  themeId: string;
  themes: Record<string, BrandTheme>;
  setTheme: (themeId: string) => void;
  addCustomTheme: (theme: BrandTheme) => void;
  removeCustomTheme: (themeId: string) => void;
  updateCustomTheme: (themeId: string, updates: Partial<BrandTheme>) => void;
}

const BrandThemeContext = createContext<BrandThemeContextType | undefined>(undefined);

interface BrandThemeProviderProps {
  children: React.ReactNode;
  defaultThemeId?: string;
}

export const BrandThemeProvider: React.FC<BrandThemeProviderProps> = ({ 
  children, 
  defaultThemeId = 'oakland' // Changed the default from 'default' to 'oakland'
}) => {
  const [allThemes, setAllThemes] = useState<Record<string, BrandTheme>>(brandThemes);
  const [themeId, setThemeId] = useState<string>(defaultThemeId);

  // Load saved themes and current theme from localStorage on mount
  useEffect(() => {
    try {
      const savedThemeId = localStorage.getItem('brand-theme-id');
      const savedCustomThemes = localStorage.getItem('custom-brand-themes');
      
      if (savedCustomThemes) {
        const customThemes = JSON.parse(savedCustomThemes);
        setAllThemes(prev => ({ ...prev, ...customThemes }));
      }
      
      if (savedThemeId && allThemes[savedThemeId]) {
        setThemeId(savedThemeId);
      }
    } catch (error) {
      console.error('Error loading theme data:', error);
    }
  }, []);

  // Save current theme to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('brand-theme-id', themeId);
    } catch (error) {
      console.error('Error saving theme id:', error);
    }
  }, [themeId]);

  // Save custom themes when they change
  useEffect(() => {
    try {
      const customThemes = Object.entries(allThemes)
        .filter(([id]) => !brandThemes[id])
        .reduce((acc, [id, theme]) => {
          acc[id] = theme;
          return acc;
        }, {} as Record<string, BrandTheme>);
      
      localStorage.setItem('custom-brand-themes', JSON.stringify(customThemes));
    } catch (error) {
      console.error('Error saving custom themes:', error);
    }
  }, [allThemes]);
  
  // Set CSS variables based on the current theme
  useEffect(() => {
    const theme = allThemes[themeId];
    if (!theme) return;
    
    const root = document.documentElement;
    
    root.style.setProperty('--primary', theme.primaryColor);
    root.style.setProperty('--secondary', theme.secondaryColor);
    root.style.setProperty('--accent', theme.accentColor);
    root.style.setProperty('--background', theme.backgroundColor);
    root.style.setProperty('--foreground', theme.textColor);
    root.style.setProperty('--card-background', theme.cardBackgroundColor);
    root.style.setProperty('--header-background', theme.headerBackgroundColor);
    root.style.setProperty('--nav-text', theme.navTextColor);
    root.style.setProperty('--button-primary', theme.buttonPrimaryColor);
    root.style.setProperty('--button-secondary', theme.buttonSecondaryColor);
    root.style.setProperty('--button-text', theme.buttonTextColor);
  }, [themeId, allThemes]);

  const setTheme = (id: string) => {
    if (allThemes[id]) {
      setThemeId(id);
    }
  };

  const addCustomTheme = (theme: BrandTheme) => {
    setAllThemes(prev => ({
      ...prev,
      [theme.id]: theme
    }));
  };
  
  const removeCustomTheme = (id: string) => {
    // Don't remove built-in themes
    if (brandThemes[id]) return;
    
    setAllThemes(prev => {
      const newThemes = { ...prev };
      delete newThemes[id];
      return newThemes;
    });
    
    // If the current theme is removed, switch to the default
    if (themeId === id) {
      setThemeId('oakland');
    }
  };
  
  const updateCustomTheme = (id: string, updates: Partial<BrandTheme>) => {
    // Don't modify built-in themes
    if (brandThemes[id]) return;
    
    setAllThemes(prev => {
      if (!prev[id]) return prev;
      
      return {
        ...prev,
        [id]: {
          ...prev[id],
          ...updates
        }
      };
    });
  };

  return (
    <BrandThemeContext.Provider 
      value={{ 
        currentTheme: allThemes[themeId] || brandThemes.oakland, 
        themeId,
        themes: allThemes,
        setTheme, 
        addCustomTheme,
        removeCustomTheme,
        updateCustomTheme
      }}
    >
      {children}
    </BrandThemeContext.Provider>
  );
};

export const useBrandTheme = () => {
  const context = useContext(BrandThemeContext);
  if (context === undefined) {
    throw new Error('useBrandTheme must be used within a BrandThemeProvider');
  }
  return context;
};
