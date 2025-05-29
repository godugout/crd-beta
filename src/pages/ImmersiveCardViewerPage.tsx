
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/lib/types';
import { useCards } from '@/hooks/useCards';
import { basketballCards } from '@/data/basketballCards';
import { useImmersiveViewerState } from '@/hooks/useImmersiveViewerState';
import { useImmersiveViewerHandlers } from './immersive-viewer/useImmersiveViewerHandlers';
import CardLoader from './immersive-viewer/CardLoader';
import ImmersiveViewerLayout from './immersive-viewer/ImmersiveViewerLayout';

const ImmersiveCardViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { cards, getCard, loading } = useCards();
  
  // Use the custom hook for state management
  const {
    isFlipped,
    setIsFlipped,
    isSettingsPanelOpen,
    setIsSettingsPanelOpen,
    activeSettingsTab,
    setActiveSettingsTab,
    activeEffects,
    setActiveEffects,
    effectIntensities,
    setEffectIntensities,
    environmentType,
    setEnvironmentType,
    materialSettings,
    setMaterialSettings,
    lightingSettings,
    setLightingSettings
  } = useImmersiveViewerState();

  console.log('ImmersiveCardViewerPage: Looking for card with ID:', id);

  // Try to find the card using multiple sources
  let card: Card | undefined;
  
  if (id) {
    if (getCard) {
      card = getCard(id);
    }
    
    if (!card) {
      card = basketballCards.find(c => c.id === id);
    }
    
    if (!card && cards && cards.length > 0) {
      card = cards.find(c => c.id === id);
    }
  }

  // Use the handlers hook
  const handlers = useImmersiveViewerHandlers({
    card: card!,
    setIsFlipped,
    isFlipped,
    setIsSettingsPanelOpen,
    setActiveSettingsTab,
    setEnvironmentType,
    setLightingSettings,
    setActiveEffects,
    setEffectIntensities,
    setMaterialSettings
  });

  // Show loading or error states
  const loaderResult = CardLoader({ loading, card });
  if (loaderResult) {
    return loaderResult;
  }

  return (
    <ImmersiveViewerLayout
      card={card!}
      isFlipped={isFlipped}
      isSettingsPanelOpen={isSettingsPanelOpen}
      activeSettingsTab={activeSettingsTab}
      activeEffects={activeEffects}
      effectIntensities={effectIntensities}
      environmentType={environmentType}
      materialSettings={materialSettings}
      lightingSettings={lightingSettings}
      handlers={handlers}
      setIsSettingsPanelOpen={setIsSettingsPanelOpen}
      setActiveSettingsTab={setActiveSettingsTab}
    />
  );
};

export default ImmersiveCardViewerPage;
