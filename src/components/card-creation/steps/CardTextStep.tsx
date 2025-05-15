
import React from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export interface CardTextStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

const CardTextStep: React.FC<CardTextStepProps> = ({ cardData, onUpdate }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Card Text & Details</h2>
      <p className="text-sm text-gray-500">
        Add text and details to personalize your card.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Card Title"
            value={cardData.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Card Description"
            value={cardData.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="player">Player</Label>
            <Input
              id="player"
              placeholder="Player Name"
              value={cardData.player || ''}
              onChange={(e) => onUpdate({ player: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Input
              id="team"
              placeholder="Team Name"
              value={cardData.team || ''}
              onChange={(e) => onUpdate({ team: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              placeholder="Year"
              value={cardData.year || ''}
              onChange={(e) => onUpdate({ year: e.target.value })}
            />
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={() => {
              // Auto-generate description based on other fields
              const player = cardData.player || '';
              const team = cardData.team || '';
              const year = cardData.year || '';
              
              let description = '';
              if (player && team && year) {
                description = `${player} ${team} card from ${year}.`;
              } else if (player && team) {
                description = `${player} ${team} card.`;
              } else if (cardData.title) {
                description = `${cardData.title} card.`;
              }
              
              if (description) {
                onUpdate({ description });
              }
            }}
          >
            Generate Description
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardTextStep;
