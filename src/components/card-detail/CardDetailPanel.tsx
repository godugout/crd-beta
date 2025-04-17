
import React, { useState } from 'react';
import { Card } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Layers, PanelLeft, Share2, Wand2 } from 'lucide-react';
import RelatedCardsSlider from '../card-viewer/RelatedCardsSlider';

interface CardDetailPanelProps {
  card: Card;
  availableEffects: { id: string; name: string }[];
  activeEffects: string[];
  onToggleEffect: (effectId: string) => void;
  effectIntensities: Record<string, number>;
  onAdjustIntensity: (effectId: string, value: number) => void;
}

const CardDetailPanel: React.FC<CardDetailPanelProps> = ({
  card,
  availableEffects,
  activeEffects,
  onToggleEffect,
  effectIntensities,
  onAdjustIntensity
}) => {
  const [activeTab, setActiveTab] = useState('details');
  
  // Helper function to safely extract string properties
  const getStringProp = (value: any): string => {
    return typeof value === 'string' ? value : '';
  };
  
  // Safely extract card properties
  const cardPlayer = getStringProp(card.player);
  const cardTeam = getStringProp(card.team);
  const cardYear = getStringProp(card.year);
  const cardSeries = getStringProp(card.designMetadata?.cardMetadata?.series);
  
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-bold">{card.title}</h2>
        {card.description && <p className="mt-1 text-sm text-gray-300">{card.description}</p>}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
          <TabsTrigger value="related">Related</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {cardPlayer && (
              <div>
                <h4 className="text-xs text-gray-400">Player</h4>
                <p className="font-medium">{cardPlayer}</p>
              </div>
            )}
            
            {cardTeam && (
              <div>
                <h4 className="text-xs text-gray-400">Team</h4>
                <p className="font-medium">{cardTeam}</p>
              </div>
            )}
            
            {cardYear && (
              <div>
                <h4 className="text-xs text-gray-400">Year</h4>
                <p className="font-medium">{cardYear}</p>
              </div>
            )}
            
            {cardSeries && (
              <div>
                <h4 className="text-xs text-gray-400">Series</h4>
                <p className="font-medium">{cardSeries}</p>
              </div>
            )}
          </div>
          
          {card.tags && card.tags.length > 0 && (
            <div>
              <h4 className="text-xs text-gray-400 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-white/10 hover:bg-white/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" size="sm" className="flex gap-1">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="outline" size="sm" className="flex gap-1">
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="effects" className="p-4">
          <div className="space-y-4">
            {availableEffects.map((effect) => (
              <div key={effect.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`effect-${effect.id}`} className="cursor-pointer">
                    {effect.name}
                  </Label>
                  <Switch
                    id={`effect-${effect.id}`}
                    checked={activeEffects.includes(effect.id)}
                    onCheckedChange={() => onToggleEffect(effect.id)}
                  />
                </div>
                
                {activeEffects.includes(effect.id) && (
                  <div className="pl-1">
                    <Label className="text-xs text-gray-400 mb-1 block">Intensity</Label>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[effectIntensities[effect.id] || 50]}
                      onValueChange={(values) => onAdjustIntensity(effect.id, values[0])}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="pt-4 flex justify-between">
            <Button variant="outline" size="sm" className="flex gap-1">
              <Layers className="h-4 w-4" /> Exploded View
            </Button>
            <Button variant="outline" size="sm" className="flex gap-1">
              <PanelLeft className="h-4 w-4" /> Show Stats
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="related" className="p-4">
          <h3 className="text-sm font-medium mb-3">Similar Cards</h3>
          <RelatedCardsSlider 
            cards={[]} // This would be populated with actual related cards
            onCardClick={(cardId) => console.log('Navigate to card:', cardId)}
          />
          
          <h3 className="text-sm font-medium mt-6 mb-3">From Same Collection</h3>
          <div className="flex justify-center p-4 text-gray-400 text-sm">
            <Wand2 className="mr-2 h-4 w-4" /> 
            Loading related cards...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CardDetailPanel;
