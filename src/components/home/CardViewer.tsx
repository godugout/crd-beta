
import React, { useState, useCallback } from 'react';
import { CardData } from '@/types/card';
import { toast } from 'sonner';
import '../card-effects/index.css';
import CardCanvas from './card-viewer/CardCanvas';
import CardControls from './card-viewer/CardControls';
import EffectControls from './card-viewer/EffectControls';
import EffectsPresets from './card-viewer/EffectsPresets';
import { useCardEffects } from './card-viewer/useCardEffects';
import { useEffectSettings } from './card-viewer/useEffectSettings';
import { usePresetsState } from './card-viewer/usePresetsState';
import CardBackground from './card-viewer/CardBackground';
import CardContainer from './card-viewer/CardContainer';

interface CardViewerProps {
  card: CardData;
  isFlipped: boolean;
  flipCard: () => void;
  onBackToCollection: () => void;
  activeEffects: string[];
  onSnapshot: () => void;
}

const CardViewer = ({ 
  card, 
  isFlipped, 
  flipCard, 
  onBackToCollection, 
  activeEffects,
  onSnapshot
}: CardViewerProps) => {
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [showPresetsPanel, setShowPresetsPanel] = useState(false);

  const { 
    cardRef,
    containerRef,
    canvasRef,
    isMoving,
    handleCanvasMouseMove,
    handleMouseMove,
    handleMouseLeave,
    setAnimationSpeed
  } = useCardEffects();

  const effectSettings = useEffectSettings(setAnimationSpeed);
  const { userPresets, builtInPresets, handleToggleFavorite, saveUserPreset } = usePresetsState();
  
  const handleSnapshot = () => {
    onSnapshot();
    toast.success('Snapshot captured!', {
      description: 'Effect combination saved to gallery'
    });
  };

  const toggleAdvancedControls = () => {
    setShowAdvancedControls(prev => !prev);
    if (showPresetsPanel) setShowPresetsPanel(false);
  };

  const togglePresetsPanel = () => {
    setShowPresetsPanel(prev => !prev);
    if (showAdvancedControls) setShowAdvancedControls(false);
  };

  const handleSaveEffectsCombination = (name: string) => {
    const newPreset = saveUserPreset(name, activeEffects, effectSettings.getCurrentSettings());
    
    toast.success('Effect combination saved!', {
      description: `"${name}" added to your presets library`
    });
  };

  const handleApplyPreset = (preset: any) => {
    // Apply the preset settings
    effectSettings.applySettings(preset.settings);
    
    toast.success(`"${preset.name}" applied!`, {
      description: `Effects combination applied to the current card`
    });
  };

  return (
    <div 
      ref={canvasRef}
      className="relative w-full h-96 md:h-[500px] flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden"
      onMouseMove={handleCanvasMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic background */}
      <CardBackground />
      
      {/* Card container with 3D perspective */}
      <CardContainer
        containerRef={containerRef}
        onMouseMove={handleMouseMove}
        isMoving={isMoving}
        effectSettings={effectSettings.getCurrentSettings()}
      >
        {/* Card representation */}
        <CardCanvas 
          card={card}
          isFlipped={isFlipped}
          activeEffects={activeEffects}
          containerRef={containerRef}
          cardRef={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
      </CardContainer>
      
      {/* Controls */}
      <CardControls 
        flipCard={flipCard}
        onBackToCollection={onBackToCollection}
        onSnapshot={handleSnapshot}
        activeEffectsCount={activeEffects.length}
        onToggleAdvancedControls={toggleAdvancedControls}
        showAdvancedControls={showAdvancedControls}
        onTogglePresetsPanel={togglePresetsPanel}
        showPresetsPanel={showPresetsPanel}
      />

      {/* Advanced Effect Controls */}
      <EffectControls 
        isOpen={showAdvancedControls}
        {...effectSettings}
        onClose={() => setShowAdvancedControls(false)}
        onSaveEffectsCombination={handleSaveEffectsCombination}
        activeEffects={activeEffects}
      />

      {/* Effects Presets Panel */}
      <EffectsPresets
        isOpen={showPresetsPanel}
        onClose={() => setShowPresetsPanel(false)}
        presets={builtInPresets}
        userPresets={userPresets}
        onApplyPreset={handleApplyPreset}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
};

export default CardViewer;
