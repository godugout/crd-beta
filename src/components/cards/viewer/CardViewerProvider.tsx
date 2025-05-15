
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Card } from '@/types/card';

interface CardViewerContextProps {
  isFullscreen: boolean;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  isAutoRotating: boolean;
  toggleFullscreen: () => void;
  toggleFlipped: () => void;
  toggleEffect: (effect: string) => void;
  setEffectIntensity: (effect: string, intensity: number) => void;
  toggleAutoRotation: () => void;
}

const CardViewerContext = createContext<CardViewerContextProps | undefined>(undefined);

export const useCardViewer = () => {
  const context = useContext(CardViewerContext);
  if (!context) {
    throw new Error('useCardViewer must be used within a CardViewerProvider');
  }
  return context;
};

interface CardViewerProviderProps {
  children: React.ReactNode;
  initialCard?: Card;
  initialEffects?: string[];
}

export const CardViewerProvider: React.FC<CardViewerProviderProps> = ({
  children,
  initialCard,
  initialEffects = []
}) => {
  // Core viewing states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  
  // Effect management
  const [activeEffects, setActiveEffects] = useState<string[]>(
    initialCard?.effects || initialEffects || []
  );
  const [effectIntensities, setEffectIntensities] = useState<Record<string, number>>({
    'Holographic': 0.7,
    'Refractor': 0.6,
    'Prismatic': 0.8,
    'Chrome': 0.5,
    'Vintage': 0.4
  });
  
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);
  
  const toggleFlipped = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);
  
  const toggleEffect = useCallback((effect: string) => {
    setActiveEffects(prev => 
      prev.includes(effect) 
        ? prev.filter(e => e !== effect) 
        : [...prev, effect]
    );
  }, []);
  
  const setEffectIntensity = useCallback((effect: string, intensity: number) => {
    setEffectIntensities(prev => ({
      ...prev,
      [effect]: intensity
    }));
  }, []);
  
  const toggleAutoRotation = useCallback(() => {
    setIsAutoRotating(prev => !prev);
  }, []);
  
  const value: CardViewerContextProps = {
    isFullscreen,
    isFlipped,
    activeEffects,
    effectIntensities,
    isAutoRotating,
    toggleFullscreen,
    toggleFlipped,
    toggleEffect,
    setEffectIntensity,
    toggleAutoRotation
  };
  
  return (
    <CardViewerContext.Provider value={value}>
      {children}
    </CardViewerContext.Provider>
  );
};

export default CardViewerProvider;
