import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import CardEffectsPanel from '../CardEffectsPanel';
import { CardEffect } from '../types/cardTypes';

interface EffectsTabProps {
  onContinue: () => void;
  effectStack: CardEffect[];
  addEffect: (name: string, settings?: any) => void;
  removeEffect: (id: string) => void;
  updateEffectSettings: (id: string, settings: any) => void;
}

const EffectsTab: React.FC<EffectsTabProps> = ({
  onContinue,
  effectStack,
  addEffect,
  removeEffect,
  updateEffectSettings
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div>
      <h2 className={`text-xl font-semibold mb-4 ${isMobile ? 'text-center' : 'text-left'}`}>Apply Effects</h2>
      <div className="space-y-6">
        <CardEffectsPanel 
          effectStack={effectStack}
          onAddEffect={addEffect}
          onRemoveEffect={removeEffect}
          onUpdateSettings={updateEffectSettings}
        />
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          className="bg-litmus-green hover:bg-litmus-green/90 text-white px-6"
          onClick={onContinue}
        >
          Continue <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default EffectsTab;
