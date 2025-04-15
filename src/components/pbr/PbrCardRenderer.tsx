
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
    exposure: 1.0,
    envMapIntensity: 1.0,
    reflectionStrength: 0.5,
  });
  const [activeTab, setActiveTab] = useState('preview');
  
  useEffect(() => {
    // Determine which card ID to use - from props or URL params
    const targetCardId = cardId || id;
    
    // Find the card in the context
    if (targetCardId && cards) {
      const foundCard = cards.find(card => card.id === targetCardId);
      setCurrentCard(foundCard || null);
    }
  }, [cardId, id, cards]);
  
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    // Get the card image URL for texture mapping
    const cardImageUrl = currentCard?.imageUrl;
    
    const { cleanup } = createPbrScene(
      canvasRef.current, 
      containerRef.current, 
      settings,
      cardImageUrl // Pass the image URL to apply as a texture
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
          <TabsTrigger value="settings">PBR Settings</TabsTrigger>
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
              
              {/* CSS backdrop-filter for card surface interactions */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent backdrop-blur-[1px] opacity-30" />
              
              {!currentCard && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <p>No card selected</p>
                </div>
              )}
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
