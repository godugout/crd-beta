
import React, { useState } from 'react';
import { CardEffect, CardEffectSettings } from './types/cardTypes';
import EffectItem from './effects/EffectItem';
import EffectSelector from './effects/EffectSelector';
import EffectSettings from './effects/EffectSettings';
import EffectInfo from './effects/EffectInfo';
import { AVAILABLE_EFFECTS, getDefaultEffectSettings } from './effects/constants';

interface CardEffectsPanelProps {
  effectStack: CardEffect[];
  onAddEffect: (name: string, settings?: CardEffectSettings) => void;
  onRemoveEffect: (id: string) => void;
  onUpdateSettings: (id: string, settings: Partial<CardEffectSettings>) => void;
}

const CardEffectsPanel: React.FC<CardEffectsPanelProps> = ({
  effectStack,
  onAddEffect,
  onRemoveEffect,
  onUpdateSettings
}) => {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [expandedEffectId, setExpandedEffectId] = useState<string | null>(null);
  
  const handleAddEffect = () => {
    if (!selectedEffect) return;
    
    const defaultSettings = getDefaultEffectSettings(selectedEffect);
    onAddEffect(selectedEffect, defaultSettings);
    setSelectedEffect(null);
  };
  
  const toggleEffectExpansion = (id: string) => {
    setExpandedEffectId(prevId => prevId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Card Effects</h3>
        <p className="text-sm text-gray-500">
          Add special effects to enhance your card's appearance and make it stand out.
        </p>
      </div>
      
      <div className="space-y-3">
        {effectStack.length === 0 ? (
          <div className="text-center py-4 bg-gray-50 rounded-md">
            <p className="text-gray-500">No effects added yet</p>
          </div>
        ) : (
          effectStack.map(effect => (
            <EffectItem
              key={effect.id}
              effect={effect}
              onRemove={onRemoveEffect}
              onToggleSettings={toggleEffectExpansion}
              isExpanded={expandedEffectId === effect.id}
              renderSettings={(effect) => (
                <EffectSettings 
                  effect={effect} 
                  onUpdateSettings={onUpdateSettings}
                />
              )}
            />
          ))
        )}
      </div>
      
      <EffectSelector 
        options={AVAILABLE_EFFECTS}
        selectedEffect={selectedEffect}
        onSelectEffect={setSelectedEffect}
        onAddEffect={handleAddEffect}
      />
      
      <EffectInfo />
    </div>
  );
};

export default CardEffectsPanel;
