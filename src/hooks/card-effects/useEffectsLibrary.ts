import { useState, useEffect } from 'react';

// Define the full PremiumCardEffect type
export interface PremiumCardEffect {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  isPremium: boolean;
  isOwned: boolean;
  iconUrl: string;
  previewUrl: string;
  category: string; // Add the missing category property
  settings: {
    intensity?: number;
    color?: string;
    animation?: boolean;
    [key: string]: any;
  };
  className: string;
}

export const useEffectsLibrary = () => {
  const [effects, setEffects] = useState<PremiumCardEffect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Fetch effects from API or use mock data
    const fetchEffects = async () => {
      try {
        // In a real implementation, this would be an API call
        // Mock data for now
        const mockEffects: PremiumCardEffect[] = [
          {
            id: 'effect-1',
            name: 'Holographic',
            description: 'Shimmering holographic effect',
            type: 'premium',
            price: 5.99,
            isPremium: true,
            isOwned: false,
            iconUrl: '/icons/holographic.png',
            previewUrl: '/previews/holographic.mp4',
            category: 'Premium',
            settings: {
              intensity: 0.8,
              color: '#00ff00',
              animation: true
            },
            className: 'effect-holographic'
          },
          // ... other effects
        ];

        setEffects(mockEffects);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(mockEffects.map(effect => effect.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load effects');
        setLoading(false);
      }
    };

    fetchEffects();
  }, []);

  // Filter effects by category
  const getEffectsByCategory = (category: string) => {
    return effects.filter(effect => effect.category === category);
  };

  // Get effect by ID
  const getEffectById = (id: string) => {
    return effects.find(effect => effect.id === id);
  };

  return {
    effects,
    loading,
    error,
    categories,
    getEffectsByCategory,
    getEffectById,
  };
};

export default useEffectsLibrary;
