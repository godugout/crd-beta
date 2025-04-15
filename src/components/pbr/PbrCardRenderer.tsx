
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
}

const PbrCardRenderer: React.FC<PbrCardRendererProps> = ({ cardId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const { cards } = useCards();
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [settings, setSettings] = useState<PbrSettings>({
    roughness: 0.2,
    metalness: 0.8,
    exposure: 1.2,            // Increased from 1.0 for better visibility
    envMapIntensity: 1.5,     // Increased from 1.0 for stronger reflections
    reflectionStrength: 0.8,  // Increased from 0.5 for more noticeable reflections
    holographicEffect: 0.7,   // New setting for holographic effect
    chromeEffect: 0.5,        // New setting for chrome effect
    vintageEffect: 0.3        // New setting for vintage effect
  });
  const [activeTab, setActiveTab] = useState('preview');
  
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
    
    const { cleanup } = createPbrScene(
      canvasRef.current, 
      containerRef.current, 
      settings,
      cardImageUrl
    );
    
    return () => {
      cleanup();
    };
  }, [settings, currentCard]);
  
  const handleSettingsChange = (newSettings: Partial<PbrSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">Material Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="pt-4">
          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
            <div 
              ref={containerRef} 
              className="relative w-full h-[500px] flex items-center justify-center perspective-800"
            >
              <canvas 
                ref={canvasRef} 
                className="w-full h-full"
              />
              
              {/* Visual indicator for effect intensity */}
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
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="pt-4">
          <PbrControls settings={settings} onChange={handleSettingsChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PbrCardRenderer;
