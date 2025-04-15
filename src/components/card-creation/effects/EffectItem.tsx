import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardEffect } from '../types/cardTypes';

interface EffectItemProps {
  effect: CardEffect;
  onRemove: (id: string) => void;
  onToggleSettings: (id: string) => void;
  isExpanded: boolean;
  renderSettings: (effect: CardEffect) => React.ReactNode;
}

const EffectItem: React.FC<EffectItemProps> = ({
  effect,
  onRemove,
  onToggleSettings,
  isExpanded,
  renderSettings
}) => {
  return (
    <div 
      key={effect.id} 
      className="border rounded-md overflow-hidden"
    >
      <div className="flex items-center justify-between p-3 bg-gray-50">
        <div className="flex items-center">
          <span className="font-medium">{effect.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onToggleSettings(effect.id)}
            className="h-8 w-8"
          >
            <Settings size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-red-500"
            onClick={() => onRemove(effect.id)}
          >
            <X size={16} />
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-3 border-t bg-gray-50/50">
          {renderSettings(effect)}
        </div>
      )}
    </div>
  );
};

export default EffectItem;
