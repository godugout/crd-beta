
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
  backgroundColor: string;           // Added
  textColor: string;                 // Added
  cardBackgroundColor: string;       // Added
  buttonSecondaryColor: string;      // Added
  logo?: string;
}

interface BrandThemeContextType {
  themes: Record<string, BrandTheme>;
  themeId: string;
  setTheme: (id: string) => void;
  currentTheme: BrandTheme;
  addCustomTheme: (theme: BrandTheme) => void;     // Added
  removeCustomTheme: (id: string) => void;         // Added
  updateCustomTheme: (id: string, theme: BrandTheme) => void;  // Added
}

// Export default themes for reference in other components
export const defaultThemes: Record<string, BrandTheme> = {
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
    backgroundColor: '#F8F8F8',
    textColor: '#1A1A1A',
    cardBackgroundColor: '#FFFFFF',
    buttonSecondaryColor: '#38A169',
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
    backgroundColor: '#F8F8F8',
    textColor: '#1A1A1A',
    cardBackgroundColor: '#FFFFFF',
    buttonSecondaryColor: '#006341',
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
    backgroundColor: '#F8F8F8',
    textColor: '#1A1A1A',
    cardBackgroundColor: '#FFFFFF',
    buttonSecondaryColor: '#48BB78',
    logo: '/lovable-uploads/83c68cf9-abc8-4102-954e-6061d2bc86c5.png'
  },
};

const BrandThemeContext = createContext<BrandThemeContextType>({
  themes: defaultThemes,
  themeId: 'default',
  setTheme: () => {},
  currentTheme: defaultThemes.default,
  addCustomTheme: () => {},
  removeCustomTheme: () => {},
  updateCustomTheme: () => {},
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
      
      // Load custom themes from local storage
      const customThemesStr = localStorage.getItem('brand-custom-themes');
      if (customThemesStr) {
        const customThemes = JSON.parse(customThemesStr);
        setThemes(prevThemes => ({...prevThemes, ...customThemes}));
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
  
  // Add new custom theme
  const addCustomTheme = (theme: BrandTheme) => {
    setThemes(prevThemes => {
      const newThemes = {...prevThemes, [theme.id]: theme};
      // Save to local storage
      try {
        const customThemes = Object.entries(newThemes)
          .filter(([id]) => !Object.keys(defaultThemes).includes(id))
          .reduce((acc, [id, theme]) => ({...acc, [id]: theme}), {});
        localStorage.setItem('brand-custom-themes', JSON.stringify(customThemes));
      } catch (error) {
        console.error('Error saving custom themes to localStorage:', error);
      }
      return newThemes;
    });
  };
  
  // Remove custom theme
  const removeCustomTheme = (id: string) => {
    // Don't allow removing default themes
    if (Object.keys(defaultThemes).includes(id)) {
      return;
    }
    
    setThemes(prevThemes => {
      const {[id]: removed, ...newThemes} = prevThemes;
      // Save to local storage
      try {
        const customThemes = Object.entries(newThemes)
          .filter(([id]) => !Object.keys(defaultThemes).includes(id))
          .reduce((acc, [id, theme]) => ({...acc, [id]: theme}), {});
        localStorage.setItem('brand-custom-themes', JSON.stringify(customThemes));
      } catch (error) {
        console.error('Error saving custom themes to localStorage:', error);
      }
      
      // If the removed theme was the current one, switch to default
      if (id === themeId) {
        setThemeId('default');
        localStorage.setItem('brand-theme-id', 'default');
      }
      
      return newThemes;
    });
  };
  
  // Update existing custom theme
  const updateCustomTheme = (id: string, theme: BrandTheme) => {
    // Don't update default themes this way
    if (Object.keys(defaultThemes).includes(id)) {
      return;
    }
    
    setThemes(prevThemes => {
      const newThemes = {...prevThemes, [id]: theme};
      // Save to local storage
      try {
        const customThemes = Object.entries(newThemes)
          .filter(([id]) => !Object.keys(defaultThemes).includes(id))
          .reduce((acc, [id, theme]) => ({...acc, [id]: theme}), {});
        localStorage.setItem('brand-custom-themes', JSON.stringify(customThemes));
      } catch (error) {
        console.error('Error saving custom themes to localStorage:', error);
      }
      return newThemes;
    });
  };

  const currentTheme = themes[themeId] || themes.default;

  const value = {
    themes,
    themeId,
    setTheme,
    currentTheme,
    addCustomTheme,
    removeCustomTheme,
    updateCustomTheme
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

export { defaultThemes as brandThemes };  // Export defaultThemes as brandThemes for backward compatibility
