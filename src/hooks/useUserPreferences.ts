
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export interface UserPreference {
  favoriteTemplates: string[];
  favoriteEffects: string[];
  defaultView: 'simple' | 'advanced' | 'expert';
  colorPalettes: {
    id: string;
    name: string;
    colors: string[];
  }[];
  recentSearches: string[];
  lastUsedTemplate?: string;
  keyboardShortcuts: Record<string, string>;
  layoutPreferences: {
    sidebarPosition: 'left' | 'right';
    panelSizes: Record<string, number>;
    visiblePanels: string[];
  };
}

const DEFAULT_PREFERENCES: UserPreference = {
  favoriteTemplates: [],
  favoriteEffects: [],
  defaultView: 'simple',
  colorPalettes: [
    {
      id: 'default',
      name: 'Default',
      colors: ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    },
  ],
  recentSearches: [],
  keyboardShortcuts: {
    save: 'ctrl+s',
    undo: 'ctrl+z',
    redo: 'ctrl+shift+z',
  },
  layoutPreferences: {
    sidebarPosition: 'left',
    panelSizes: {
      main: 70,
      sidebar: 30,
    },
    visiblePanels: ['tools', 'properties', 'layers'],
  },
};

export function useUserPreferences() {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const [preferences, setPreferences] = useState<UserPreference>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  // Load preferences from localStorage or API
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // In a real app, this would be an API call for logged-in users
        const savedPrefs = localStorage.getItem(`user_prefs_${userId}`);
        if (savedPrefs) {
          setPreferences(JSON.parse(savedPrefs));
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [userId]);

  // Save preferences whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(`user_prefs_${userId}`, JSON.stringify(preferences));
    }
  }, [preferences, userId, loading]);

  const updatePreference = <K extends keyof UserPreference>(
    key: K,
    value: UserPreference[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFavorite = (type: 'template' | 'effect', id: string) => {
    const key = type === 'template' ? 'favoriteTemplates' : 'favoriteEffects';
    const favorites = [...preferences[key]];
    const index = favorites.indexOf(id);

    if (index >= 0) {
      favorites.splice(index, 1);
    } else {
      favorites.push(id);
    }

    updatePreference(key, favorites);
    return index < 0; // Return true if added to favorites, false if removed
  };

  const addColorPalette = (name: string, colors: string[]) => {
    const newPalette = {
      id: `palette_${Date.now()}`,
      name,
      colors,
    };
    updatePreference('colorPalettes', [...preferences.colorPalettes, newPalette]);
    return newPalette;
  };

  const deleteColorPalette = (id: string) => {
    // Don't allow deletion of the default palette
    if (id === 'default') return false;
    
    const updatedPalettes = preferences.colorPalettes.filter(p => p.id !== id);
    updatePreference('colorPalettes', updatedPalettes);
    return true;
  };

  const updateLayoutPreference = (
    key: keyof UserPreference['layoutPreferences'],
    value: any
  ) => {
    updatePreference('layoutPreferences', {
      ...preferences.layoutPreferences,
      [key]: value,
    });
  };

  return {
    preferences,
    loading,
    updatePreference,
    toggleFavorite,
    addColorPalette,
    deleteColorPalette,
    updateLayoutPreference,
  };
}
