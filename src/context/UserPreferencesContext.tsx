
import React, { createContext, useContext, ReactNode } from 'react';
import { useUserPreferences, UserPreference } from '@/hooks/useUserPreferences';

interface UserPreferencesContextType {
  preferences: UserPreference;
  loading: boolean;
  toggleFavorite: (type: 'template' | 'effect', id: string) => boolean;
  addColorPalette: (name: string, colors: string[]) => { id: string; name: string; colors: string[] };
  deleteColorPalette: (id: string) => boolean;
  updateLayoutPreference: (key: keyof UserPreference['layoutPreferences'], value: any) => void;
  updatePreference: <K extends keyof UserPreference>(key: K, value: UserPreference[K]) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const preferences = useUserPreferences();
  
  return (
    <UserPreferencesContext.Provider value={preferences}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferencesContext = () => {
  const context = useContext(UserPreferencesContext);
  
  if (!context) {
    throw new Error('useUserPreferencesContext must be used within a UserPreferencesProvider');
  }
  
  return context;
};
