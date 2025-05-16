
import React from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import CardPreview from '@/components/card-creation/components/CardPreview';

interface PreviewStepProps {
  cardData: Partial<Card>;
}

const PreviewStep: React.FC<PreviewStepProps> = ({ cardData }) => {
  // Determine which effects are active
  const activeEffects = cardData.effects || [];
  
  // Generate effect classes from active effects
  const generateEffectClasses = () => {
    return activeEffects.map(effectId => `effect-${effectId}`).join(' ');
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Preview Your Card</h2>
      
      <Tabs defaultValue="visual" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="visual">Visual Preview</TabsTrigger>
          <TabsTrigger value="data">Card Data</TabsTrigger>
          <TabsTrigger value="render">3D Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visual" className="space-y-4">
          <div className="flex justify-center">
            <CardPreview 
              card={cardData}
              effectClasses={generateEffectClasses()}
              className="max-w-[280px]"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <div className="border rounded-lg p-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Basic Information</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm">
                  <span className="text-gray-500">Title:</span> {cardData.title || 'Not set'}
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Created:</span> {cardData.createdAt ? new Date(cardData.createdAt).toLocaleDateString() : 'Not set'}
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Last Updated:</span> {cardData.updatedAt ? new Date(cardData.updatedAt).toLocaleDateString() : 'Not set'}
                </div>
              </div>
            </div>
            
            {cardData.player && (
              <div>
                <h3 className="font-semibold mb-1">Card Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm">
                    <span className="text-gray-500">Player:</span> {cardData.player}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Team:</span> {cardData.team || 'Not set'}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Year:</span> {cardData.year || 'Not set'}
                  </div>
                </div>
              </div>
            )}
            
            {cardData.tags && cardData.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-1">Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {cardData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {cardData.effects && cardData.effects.length > 0 && (
              <div>
                <h3 className="font-semibold mb-1">Applied Effects</h3>
                <div className="flex flex-wrap gap-1">
                  {cardData.effects.map((effect, index) => (
                    <Badge key={index} variant="outline" className="capitalize">
                      {effect}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="render" className="space-y-4">
          <div className="flex justify-center items-center min-h-[400px] border rounded-lg">
            <p className="text-gray-500">
              3D preview rendering will be available soon!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PreviewStep;
