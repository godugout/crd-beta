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
  backgroundColor: string;
  textColor: string;
  cardBackgroundColor: string;
  buttonSecondaryColor: string;
  logo?: string;
}

interface BrandThemeContextType {
  themes: Record<string, BrandTheme>;
  themeId: string;
  setTheme: (id: string) => void;
  currentTheme: BrandTheme;
  addCustomTheme: (theme: BrandTheme) => void;
  removeCustomTheme: (id: string) => void;
  updateCustomTheme: (id: string, theme: BrandTheme) => void;
}

// Export default themes for reference in other components
export const defaultThemes: Record<string, BrandTheme> = {
  'default': {
    id: 'default',
    name: 'CardShow Dark',
    primaryColor: '#8B5CF6',
    secondaryColor: '#6D28D9',
    accentColor: '#F97316',
    navTextColor: '#FFFFFF',
    headerBackgroundColor: '#1A1A1A',
    buttonPrimaryColor: '#8B5CF6',
    buttonTextColor: '#FFFFFF',
    backgroundColor: '#121212',
    textColor: '#E2E8F0',
    cardBackgroundColor: '#1E1E1E',
    buttonSecondaryColor: '#6D28D9',
  },
  'athletics': {
    id: 'athletics',
    name: 'Oakland Athletics',
    primaryColor: '#006341',
    secondaryColor: '#EFB21E',
    accentColor: '#003831',
    navTextColor: '#FFFFFF',
    headerBackgroundColor: '#111111',
    buttonPrimaryColor: '#EFB21E',
    buttonTextColor: '#000000',
    backgroundColor: '#0F0F0F',
    textColor: '#E2E8F0',
    cardBackgroundColor: '#1A1A1A',
    buttonSecondaryColor: '#006341',
    logo: '/lovable-uploads/83c68cf9-abc8-4102-954e-6061d2bc86c5.png'
  },
  'crd': {
    id: 'crd',
    name: 'CRD',
    primaryColor: '#48BB78',
    secondaryColor: '#4C51BF',
    accentColor: '#FFC300',
    navTextColor: '#FFFFFF',
    headerBackgroundColor: '#111111',
    buttonPrimaryColor: '#4C51BF',
    buttonTextColor: '#FFFFFF',
    backgroundColor: '#0A0A0A',
    textColor: '#E2E8F0',
    cardBackgroundColor: '#1A1A1A',
    buttonSecondaryColor: '#48BB78',
    logo: '/lovable-uploads/83c68cf9-abc8-4102-954e-6061d2bc86c5.png'
  },
  'neon': {
    id: 'neon',
    name: 'Neon Night',
    primaryColor: '#00FFFF',
    secondaryColor: '#FF00FF',
    accentColor: '#FFFF00',
    navTextColor: '#FFFFFF',
    headerBackgroundColor: '#121212',
    buttonPrimaryColor: '#00FFFF',
    buttonTextColor: '#000000',
    backgroundColor: '#0A0A0A',
    textColor: '#FFFFFF',
    cardBackgroundColor: '#1A1A1A',
    buttonSecondaryColor: '#FF00FF',
  },
  'midnight': {
    id: 'midnight',
    name: 'Midnight Blue',
    primaryColor: '#60A5FA',
    secondaryColor: '#3B82F6',
    accentColor: '#F472B6',
    navTextColor: '#FFFFFF',
    headerBackgroundColor: '#0F172A',
    buttonPrimaryColor: '#60A5FA',
    buttonTextColor: '#0F172A',
    backgroundColor: '#0F172A',
    textColor: '#E2E8F0',
    cardBackgroundColor: '#1E293B',
    buttonSecondaryColor: '#3B82F6',
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

  useEffect(() => {
    try {
      const savedThemeId = localStorage.getItem('brand-theme-id');
      if (savedThemeId && themes[savedThemeId]) {
        setThemeId(savedThemeId);
      }
      
      const customThemesStr = localStorage.getItem('brand-custom-themes');
      if (customThemesStr) {
        const customThemes = JSON.parse(customThemesStr);
        setThemes(prevThemes => ({...prevThemes, ...customThemes}));
      }
    } catch (error) {
      console.error('Error loading theme from localStorage:', error);
    }
  }, []);

  const setTheme = (id: string) => {
    if (themes[id]) {
      setThemeId(id);
      localStorage.setItem('brand-theme-id', id);
    }
  };
  
  const addCustomTheme = (theme: BrandTheme) => {
    setThemes(prevThemes => {
      const newThemes = {...prevThemes, [theme.id]: theme};
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
  
  const removeCustomTheme = (id: string) => {
    if (Object.keys(defaultThemes).includes(id)) {
      return;
    }
    
    setThemes(prevThemes => {
      const {[id]: removed, ...newThemes} = prevThemes;
      try {
        const customThemes = Object.entries(newThemes)
          .filter(([id]) => !Object.keys(defaultThemes).includes(id))
          .reduce((acc, [id, theme]) => ({...acc, [id]: theme}), {});
        localStorage.setItem('brand-custom-themes', JSON.stringify(customThemes));
      } catch (error) {
        console.error('Error saving custom themes to localStorage:', error);
      }
      
      if (id === themeId) {
        setThemeId('default');
        localStorage.setItem('brand-theme-id', 'default');
      }
      
      return newThemes;
    });
  };
  
  const updateCustomTheme = (id: string, theme: BrandTheme) => {
    if (Object.keys(defaultThemes).includes(id)) {
      return;
    }
    
    setThemes(prevThemes => {
      const newThemes = {...prevThemes, [id]: theme};
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

export { defaultThemes as brandThemes };
