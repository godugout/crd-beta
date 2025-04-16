
import React from 'react';
import { Card } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Sparkles, 
  Tag,
  CalendarIcon,
  UserIcon,
  BookIcon
} from 'lucide-react';

interface CardDetailPanelProps {
  card: Card;
  availableEffects?: Array<{id: string, name: string}>;
  activeEffects?: string[];
  onToggleEffect?: (effectId: string) => void;
  effectIntensities?: Record<string, number>;
  onAdjustIntensity?: (effectId: string, value: number) => void;
}

const CardDetailPanel: React.FC<CardDetailPanelProps> = ({
  card,
  availableEffects = [],
  activeEffects = [],
  onToggleEffect,
  effectIntensities = {},
  onAdjustIntensity
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h1 className="text-2xl font-bold mb-2">{card.title}</h1>
      
      {card.description && (
        <p className="text-gray-600 mb-4">{card.description}</p>
      )}
      
      <div className="space-y-6">
        {/* Card Metadata Section */}
        <div className="grid grid-cols-2 gap-4">
          {card.player && (
            <div>
              <span className="text-sm text-gray-500 block">Player</span>
              <span className="font-medium">{card.player}</span>
            </div>
          )}
          
          {card.team && (
            <div>
              <span className="text-sm text-gray-500 block">Team</span>
              <span className="font-medium">{card.team}</span>
            </div>
          )}
          
          {card.year && (
            <div>
              <span className="text-sm text-gray-500 block">Year</span>
              <span className="font-medium">{card.year}</span>
            </div>
          )}
          
          {card.set && (
            <div>
              <span className="text-sm text-gray-500 block">Set</span>
              <span className="font-medium">{card.set}</span>
            </div>
          )}
        </div>
        
        {/* Tags Section */}
        {card.tags && card.tags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
              <Tag className="h-4 w-4 mr-1" /> Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Effects Section */}
        {availableEffects.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
              <Sparkles className="h-4 w-4 mr-1" /> Effects
            </h3>
            <div className="space-y-3">
              {availableEffects.map((effect) => (
                <div key={effect.id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Switch
                        id={`effect-${effect.id}`}
                        checked={activeEffects.includes(effect.id)}
                        onCheckedChange={() => onToggleEffect && onToggleEffect(effect.id)}
                      />
                      <Label htmlFor={`effect-${effect.id}`} className="ml-2">{effect.name}</Label>
                    </div>
                  </div>
                  
                  {activeEffects.includes(effect.id) && onAdjustIntensity && (
                    <div className="pl-10">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs">Intensity</span>
                        <span className="text-xs font-medium ml-auto">
                          {Math.round((effectIntensities[effect.id] || 0.5) * 100)}%
                        </span>
                      </div>
                      <Slider
                        value={[effectIntensities[effect.id] || 0.5]}
                        min={0}
                        max={1}
                        step={0.05}
                        onValueChange={(values) => onAdjustIntensity(effect.id, values[0])}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Additional Info */}
        <div className="border-t pt-4 text-sm text-gray-500 space-y-1">
          <div className="flex items-center">
            <CalendarIcon className="h-3 w-3 mr-2" />
            <span>Created: {new Date(card.createdAt).toLocaleDateString()}</span>
          </div>
          
          {card.userId && (
            <div className="flex items-center">
              <UserIcon className="h-3 w-3 mr-2" />
              <span>Creator: {card.userId}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <BookIcon className="h-3 w-3 mr-2" />
            <span>Rarity: {card.rarity || 'Common'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailPanel;
