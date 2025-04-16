
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define theme types
export interface BrandTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  navTextColor: string;
  headerBackgroundColor: string;
  buttonPrimaryColor: string;
  buttonTextColor: string;
  logo?: string;
}

interface BrandThemeContextType {
  themes: Record<string, BrandTheme>;
  themeId: string;
  setTheme: (id: string) => void;
  currentTheme: BrandTheme;
}

const defaultThemes: Record<string, BrandTheme> = {
  'default': {
    id: 'default',
    name: 'CardShow Default',
    primaryColor: '#48BB78', // litmus green
    secondaryColor: '#38A169', // litmus green secondary
    accentColor: '#F97316', // orange
    navTextColor: '#FFFFFF',
    headerBackgroundColor: '#2D3748', // dark background
    buttonPrimaryColor: '#48BB78',
    buttonTextColor: '#FFFFFF',
  },
  'athletics': {
    id: 'athletics',
    name: 'Oakland Athletics',
    primaryColor: '#006341', // Kelly Green
    secondaryColor: '#EFB21E', // Gold
    accentColor: '#003831', // Dark Green
    navTextColor: '#FFFFFF',
    headerBackgroundColor: '#006341',
    buttonPrimaryColor: '#EFB21E',
    buttonTextColor: '#000000',
    logo: '/lovable-uploads/83c68cf9-abc8-4102-954e-6061d2bc86c5.png'
  },
  'crd': {
    id: 'crd',
    name: 'CRD',
    primaryColor: '#48BB78',
    secondaryColor: '#0000FF',
    accentColor: '#FFC300',
    navTextColor: '#FFFFFF',
    headerBackgroundColor: '#1A1A1A',
    buttonPrimaryColor: '#0000FF',
    buttonTextColor: '#FFFFFF',
    logo: '/lovable-uploads/83c68cf9-abc8-4102-954e-6061d2bc86c5.png'
  },
};

const BrandThemeContext = createContext<BrandThemeContextType>({
  themes: defaultThemes,
  themeId: 'default',
  setTheme: () => {},
  currentTheme: defaultThemes.default,
});

export const BrandThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themes, setThemes] = useState(defaultThemes);
  const [themeId, setThemeId] = useState('default');

  // Initialize from local storage
  useEffect(() => {
    try {
      const savedThemeId = localStorage.getItem('brand-theme-id');
      if (savedThemeId && themes[savedThemeId]) {
        setThemeId(savedThemeId);
      }
    } catch (error) {
      console.error('Error loading theme from localStorage:', error);
    }
  }, []);

  // Save theme selection to local storage
  const setTheme = (id: string) => {
    if (themes[id]) {
      setThemeId(id);
      localStorage.setItem('brand-theme-id', id);
    }
  };

  const currentTheme = themes[themeId] || themes.default;

  const value = {
    themes,
    themeId,
    setTheme,
    currentTheme,
  };

  return (
    <BrandThemeContext.Provider value={value}>
      {children}
    </BrandThemeContext.Provider>
  );
};

export const useBrandTheme = () => {
  const context = useContext(BrandThemeContext);
  if (!context) {
    throw new Error('useBrandTheme must be used within a BrandThemeProvider');
  }
  return context;
};
