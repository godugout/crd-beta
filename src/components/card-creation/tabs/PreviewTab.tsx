
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardDesignState } from '../types/cardTypes';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface PreviewTabProps {
  onSave: () => void;
  cardImage?: string;
  cardTitle?: string;
  cardEffect?: string;
  cardData?: CardDesignState;
}

const PreviewTab: React.FC<PreviewTabProps> = ({
  onSave,
  cardImage,
  cardTitle,
  cardEffect,
  cardData
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Preview Your CRD</h2>
        <p className="text-gray-500">Review your card before saving</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <div className={`aspect-[2.5/3.5] max-w-xs w-full border-2 border-litmus-green overflow-hidden rounded-lg shadow-lg ${cardEffect}`}>
            {cardImage ? (
              <img 
                src={cardImage} 
                alt={cardTitle || "Card preview"} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                No image uploaded
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <Label className="text-sm text-gray-500">Title</Label>
            <h3 className="text-xl font-bold">{cardTitle || "Untitled CRD"}</h3>
          </div>
          
          {cardData?.description && (
            <div>
              <Label className="text-sm text-gray-500">Description</Label>
              <p className="text-gray-700">{cardData.description}</p>
            </div>
          )}
          
          {cardData?.tags && cardData.tags.length > 0 && (
            <div>
              <Label className="text-sm text-gray-500">Tags</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {cardData.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-4">
            {cardData?.player && (
              <div>
                <Label className="text-sm text-gray-500">Player</Label>
                <p>{cardData.player}</p>
              </div>
            )}
            
            {cardData?.team && (
              <div>
                <Label className="text-sm text-gray-500">Team</Label>
                <p>{cardData.team}</p>
              </div>
            )}
            
            {cardData?.year && (
              <div>
                <Label className="text-sm text-gray-500">Year</Label>
                <p>{cardData.year}</p>
              </div>
            )}
          </div>
          
          <div className="pt-6 border-t">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium">Ready to save your CRD?</h4>
                <p className="text-sm text-gray-500">Click Save to add this card to your collection</p>
              </div>
              <Button 
                onClick={onSave}
                className="bg-litmus-green hover:bg-litmus-green/90 text-white"
              >
                Save CRD
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewTab;
