
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/lib/types';
import { toast } from 'sonner';
import { useCards } from '@/hooks/useCards';
import CardEditorSidebar from './CardEditorSidebar';
import CardEffectsPanel from './CardEffectsPanel';
import CardPreviewCanvas from './CardPreviewCanvas';
import CardLayersPanel from './CardLayersPanel';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useLayers } from './hooks/useLayers';
import { useCardEffectsStack } from './hooks/useCardEffectsStack';

export interface CardDesignState {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  borderRadius: string;
  borderColor: string;
  backgroundColor: string;
  effectNames: string[];
  layers: CardLayer[];
  cardType: 'sports' | 'art' | 'collectible' | 'custom';
  templateId?: string;
}

export interface CardLayer {
  id: string;
  type: 'image' | 'text' | 'shape' | 'effect' | 'decoration';
  content: string | React.ReactNode;
  position: { x: number; y: number; z: number };
  size: { width: number; height: number };
  rotation: number;
  opacity: number;
  visible: boolean;
  effectIds: string[];
}

const CardCreator: React.FC = () => {
  const navigate = useNavigate();
  const { addCard } = useCards();
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Card data state
  const [cardData, setCardData] = useState<CardDesignState>({
    title: '',
    description: '',
    imageUrl: '',
    tags: [],
    borderRadius: '12px',
    borderColor: '#48BB78',
    backgroundColor: '#FFFFFF',
    effectNames: [],
    layers: [],
    cardType: 'sports',
  });

  // Initialize layer management
  const { 
    layers, 
    activeLayerId, 
    addLayer, 
    updateLayer, 
    deleteLayer, 
    moveLayerUp, 
    moveLayerDown, 
    setActiveLayer 
  } = useLayers(cardData.layers);

  // Initialize effects management
  const { 
    effectStack, 
    addEffect, 
    removeEffect, 
    updateEffectSettings,
    getEffectClasses
  } = useCardEffectsStack();

  // Update card data when layers or effects change
  useEffect(() => {
    setCardData(prev => ({
      ...prev,
      layers,
      effectNames: effectStack.map(effect => effect.name)
    }));
  }, [layers, effectStack]);

  const handleImageUpload = (imageUrl: string) => {
    setCardData({
      ...cardData,
      imageUrl
    });
    
    // Create an image layer if it's the first image
    if (!layers.some(layer => layer.type === 'image')) {
      addLayer({
        type: 'image',
        content: imageUrl,
        position: { x: 0, y: 0, z: 0 },
        size: { width: 100, height: 100 },
        rotation: 0,
        opacity: 1,
        visible: true,
        effectIds: []
      });
    }
  };

  const handleSave = async () => {
    if (!cardData.title.trim()) {
      toast.error('Please add a title to your card');
      return;
    }

    if (!cardData.imageUrl) {
      toast.error('Please add at least one image to your card');
      return;
    }

    try {
      setSaving(true);
      
      // Prepare card data for saving
      const cardToSave: Partial<Card> = {
        title: cardData.title,
        description: cardData.description,
        imageUrl: cardData.imageUrl,
        thumbnailUrl: cardData.imageUrl, // Can be improved with a thumbnail generator
        tags: cardData.tags,
        designMetadata: {
          cardStyle: {
            borderRadius: cardData.borderRadius,
            borderColor: cardData.borderColor,
            backgroundColor: cardData.backgroundColor,
            effect: cardData.effectNames.length > 0 ? cardData.effectNames[0].toLowerCase() : 'classic'
          },
          layers: layers.map(layer => ({
            id: layer.id,
            type: layer.type,
            position: layer.position,
            size: layer.size,
            rotation: layer.rotation,
            opacity: layer.opacity,
            visible: layer.visible,
            effectIds: layer.effectIds
          })),
          effects: effectStack.map(effect => ({
            id: effect.id,
            name: effect.name,
            settings: effect.settings
          })),
          cardType: cardData.cardType,
          templateId: cardData.templateId
        }
      };

      const savedCard = await addCard(cardToSave);
      toast.success('Card created successfully!');
      navigate(`/card/${savedCard.id}`);
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-6rem)] max-h-[calc(100vh-6rem)] overflow-hidden">
      {/* Main editing canvas - 8 cols */}
      <div className="col-span-8 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center relative">
        <CardPreviewCanvas
          ref={canvasRef}
          cardData={cardData}
          layers={layers}
          activeLayerId={activeLayerId}
          onLayerSelect={setActiveLayer}
          onLayerUpdate={updateLayer}
          effectClasses={getEffectClasses()}
        />
      </div>

      {/* Right sidebar - 4 cols */}
      <div className="col-span-4 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        <Tabs defaultValue="design" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
            <TabsTrigger value="layers">Layers</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <div className="p-4 overflow-y-auto h-[calc(100vh-12rem)]">
            <TabsContent value="design" className="mt-0">
              <CardEditorSidebar 
                cardData={cardData} 
                onChange={setCardData} 
                onImageUpload={handleImageUpload}
              />
            </TabsContent>

            <TabsContent value="effects" className="mt-0">
              <CardEffectsPanel 
                effectStack={effectStack}
                onAddEffect={addEffect}
                onRemoveEffect={removeEffect}
                onUpdateSettings={updateEffectSettings}
              />
            </TabsContent>

            <TabsContent value="layers" className="mt-0">
              <CardLayersPanel 
                layers={layers}
                activeLayerId={activeLayerId}
                onLayerSelect={setActiveLayer}
                onLayerUpdate={updateLayer}
                onAddLayer={addLayer}
                onDeleteLayer={deleteLayer}
                onMoveLayerUp={moveLayerUp}
                onMoveLayerDown={moveLayerDown}
              />
            </TabsContent>

            <TabsContent value="templates" className="mt-0">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Card Templates</h3>
                <p className="text-gray-500 text-sm">
                  Choose a template to get started or create your own custom design
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {['sports', 'art', 'collectible', 'custom'].map((type) => (
                    <div 
                      key={type}
                      className={`cursor-pointer border rounded-md p-2 transition hover:border-primary ${
                        cardData.cardType === type ? 'border-primary bg-primary/10' : ''
                      }`}
                      onClick={() => setCardData({...cardData, cardType: type as any})}
                    >
                      <div className="aspect-[2.5/3.5] bg-gray-100 rounded flex items-center justify-center mb-2">
                        <span className="capitalize text-sm text-gray-500">{type}</span>
                      </div>
                      <p className="text-xs text-center capitalize">{type}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="p-4 border-t mt-auto">
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Card'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCreator;
