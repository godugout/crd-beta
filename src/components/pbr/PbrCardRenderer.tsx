
import React, { useEffect, useRef, useState } from 'react';
import { createPbrScene } from './pbrEngine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PbrControls from './PbrControls';
import { PbrSettings } from './types';
import { Card } from '@/lib/types';
import { useParams } from 'react-router-dom';
import { useCards } from '@/context/CardContext';

interface PbrCardRendererProps {
  cardId?: string;
  isFlipped?: boolean;
}

const PbrCardRenderer: React.FC<PbrCardRendererProps> = ({ cardId, isFlipped = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const { cards } = useCards();
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [settings, setSettings] = useState<PbrSettings>({
    roughness: 0.2,
    metalness: 0.8,
    exposure: 1.2,
    envMapIntensity: 1.5,
    reflectionStrength: 0.8,
    holographicEffect: 0.7,
    chromeEffect: 0.5,
    vintageEffect: 0.3
  });
  const [activeTab, setActiveTab] = useState('preview');
  const [cleanupFunction, setCleanupFunction] = useState<(() => void) | null>(null);
  
  useEffect(() => {
    const targetCardId = cardId || id;
    
    if (targetCardId && cards) {
      const foundCard = cards.find(card => card.id === targetCardId);
      setCurrentCard(foundCard || null);
    }
  }, [cardId, id, cards]);
  
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const cardImageUrl = currentCard?.imageUrl;
    
    // Clean up previous scene if it exists
    if (cleanupFunction) {
      cleanupFunction();
    }
    
    try {
      const result = createPbrScene(
        canvasRef.current, 
        containerRef.current, 
        settings,
        cardImageUrl
      );
      
      setCleanupFunction(() => result.cleanup);
    } catch (error) {
      console.error('Error creating PBR scene:', error);
    }
    
    return () => {
      if (cleanupFunction) {
        cleanupFunction();
      }
    };
  }, [settings, currentCard, isFlipped]);
  
  const handleSettingsChange = (newSettings: Partial<PbrSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  const showControls = activeTab === 'settings' && !isFlipped;
  
  return (
    <div className="flex flex-col gap-6">
      {!isFlipped && (
        <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Material Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="pt-4">
            <PbrControls settings={settings} onChange={handleSettingsChange} />
          </TabsContent>
        </Tabs>
      )}
      
      <div className={`bg-gray-900 rounded-lg overflow-hidden shadow-lg ${isFlipped ? 'h-full' : ''}`}>
        <div 
          ref={containerRef} 
          className={`relative w-full ${isFlipped ? 'h-full' : 'h-[500px]'} flex items-center justify-center perspective-800`}
        >
          <canvas 
            ref={canvasRef} 
            className="w-full h-full"
          />
          
          {/* Visual indicator for effect intensity */}
          {!isFlipped && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
              <div className="flex justify-between items-center">
                <span>Effect Intensity:</span>
                <div className="flex gap-2">
                  {settings.holographicEffect > 0 && (
                    <span className="px-2 py-1 rounded bg-blue-500/50">
                      Holo: {Math.round(settings.holographicEffect * 100)}%
                    </span>
                  )}
                  {settings.chromeEffect > 0 && (
                    <span className="px-2 py-1 rounded bg-gray-500/50">
                      Chrome: {Math.round(settings.chromeEffect * 100)}%
                    </span>
                  )}
                  {settings.vintageEffect > 0 && (
                    <span className="px-2 py-1 rounded bg-amber-500/50">
                      Vintage: {Math.round(settings.vintageEffect * 100)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PbrCardRenderer;
