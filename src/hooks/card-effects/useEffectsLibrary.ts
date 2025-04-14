
import { useState, useMemo } from 'react';
import { premiumEffects } from './utils';
import { PremiumCardEffect } from './types';

export interface UseEffectsLibraryResult {
  availableEffects: PremiumCardEffect[];
  premiumEffects: PremiumCardEffect[];
  standardEffects: PremiumCardEffect[];
  getEffectByName: (name: string) => PremiumCardEffect | undefined;
  getCategoryEffects: (category: string) => PremiumCardEffect[];
  getEffectIcons: () => Record<string, string>;
}

export function useEffectsLibrary(): UseEffectsLibraryResult {
  // Convert the premiumEffects object to an array
  const effectsArray = useMemo(() => {
    return Object.values(premiumEffects);
  }, []);
  
  // Group effects by category
  const { premiumEffectsList, standardEffectsList } = useMemo(() => {
    const premium: PremiumCardEffect[] = [];
    const standard: PremiumCardEffect[] = [];
    
    effectsArray.forEach(effect => {
      if (effect.premium) {
        premium.push(effect);
      } else {
        standard.push(effect);
      }
    });
    
    return { premiumEffectsList: premium, standardEffectsList: standard };
  }, [effectsArray]);
  
  // Get an effect by name
  const getEffectByName = (name: string): PremiumCardEffect | undefined => {
    return effectsArray.find(effect => 
      effect.name.toLowerCase() === name.toLowerCase()
    );
  };
  
  // Get effects by category
  const getCategoryEffects = (category: string): PremiumCardEffect[] => {
    return effectsArray.filter(effect => effect.category === category);
  };
  
  // Get icons for effects (placeholder implementation)
  const getEffectIcons = (): Record<string, string> => {
    const icons: Record<string, string> = {};
    effectsArray.forEach(effect => {
      icons[effect.id] = effect.iconUrl || '/icons/default-effect.svg';
    });
    return icons;
  };
  
  return {
    availableEffects: effectsArray,
    premiumEffects: premiumEffectsList,
    standardEffects: standardEffectsList,
    getEffectByName,
    getCategoryEffects,
    getEffectIcons
  };
}
