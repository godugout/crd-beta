
import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { CardTemplate } from '../card-templates/TemplateLibrary';
import { ChevronLeft, ChevronRight, Save, Download, Layers, Image, Type, Palette, Settings } from 'lucide-react';
import CardDesignerCanvas from './CardDesignerCanvas';
import LayersPanel from './panels/LayersPanel';
import EffectsPanel from './panels/EffectsPanel';
import TypographyPanel from './panels/TypographyPanel';
import ElementsPanel from './panels/ElementsPanel';
import SettingsPanel from './panels/SettingsPanel';
import { useLayers } from '@/components/card-creation/hooks/useLayers';
import useCardEffectsStack from '@/components/card-creation/hooks/useCardEffectsStack';
import { CardLayer } from '@/components/card-creation/types/cardTypes';

interface CardDesignerProps {
  selectedTemplate?: CardTemplate;
  userImage?: string | null;
  onSave?: (designData: any) => void;
  initialData?: any;
  className?: string;
}

const CardDesigner: React.FC<CardDesignerProps> = ({
  selectedTemplate,
  userImage,
  onSave,
  initialData,
  className = ''
}) => {
  const [activePanel, setActivePanel] = useState<string>('layers');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const {
    layers,
    activeLayerId,
    addLayer,
    updateLayer,
    deleteLayer,
    moveLayerUp,
    moveLayerDown,
    setActiveLayer,
    setLayers
  } = useLayers(initialData?.layers);
  
  const {
    activeEffects,
    addEffect,
    removeEffect,
    updateEffectSettings,
    getEffectSettings,
    effectStack,
    getEffectClasses
  } = useCardEffectsStack();
  
  useEffect(() => {
    if (layers.length > 0 || effectStack.length > 0) {
      setIsDirty(true);
    }
  }, [layers, effectStack]);
  
  useEffect(() => {
    if (selectedTemplate && !initialData) {
      if (selectedTemplate.name.includes('Chrome')) {
        addEffect('Chrome');
      } else if (selectedTemplate.name.includes('Prizm')) {
        addEffect('Refractor');
      } else if (selectedTemplate.name.includes('Black Diamond')) {
        addEffect('Cracked Ice');
      }
      
      if (userImage) {
        const newLayer: Partial<CardLayer> = {
          type: 'image',
          content: userImage,
          position: { x: 50, y: 50, z: 0 },
          size: { width: 300, height: 400 },
          rotation: 0,
          opacity: 1,
          zIndex: 0,
          visible: true
        };
        
        // Add the new layer
        const layerId = addLayer('image');
        // Update the newly created layer with the image
        const layers = document.querySelectorAll('[data-layer-id]');
        if (layers.length > 0) {
          const lastLayerId = layers[layers.length - 1].getAttribute('data-layer-id');
          if (lastLayerId) {
            updateLayer(lastLayerId, { content: userImage });
          }
        }
      }
    }
  }, [selectedTemplate, userImage, initialData, addEffect, addLayer, updateLayer]);
  
  const handleSave = () => {
    if (onSave) {
      onSave({
        layers,
        effects: effectStack,
        template: selectedTemplate
      });
    }
    setIsDirty(false);
  };
  
  const handleExport = () => {
    // Implementation for exporting the card design as an image
    // This would typically use html-to-image or a similar library
    // to capture the canvas and download it
  };
  
  const handleAddElement = (element: {url: string, type: 'image' | 'shape' | 'icon', name: string}) => {
    const layerId = addLayer(element.type === 'icon' ? 'image' : element.type);
    updateLayer(layerId, { 
      content: element.url,
      position: { x: 50, y: 50, z: layers.length },
      size: { width: 100, height: 100 },
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Card Designer
            {selectedTemplate && <span className="ml-2 text-gray-500">- {selectedTemplate.name}</span>}
          </h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              variant={isDirty ? "default" : "outline"} 
              size="sm"
              onClick={handleSave}
              disabled={!isDirty}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Design
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
        <div className="border-r">
          <Tabs value={activePanel} onValueChange={setActivePanel} className="w-full">
            <TabsList className="w-full grid grid-cols-5">
              <TabsTrigger value="layers" className="flex flex-col items-center gap-1 py-2">
                <Layers className="h-4 w-4" />
                <span className="text-xs">Layers</span>
              </TabsTrigger>
              <TabsTrigger value="effects" className="flex flex-col items-center gap-1 py-2">
                <div className="h-4 w-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm" />
                <span className="text-xs">Effects</span>
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex flex-col items-center gap-1 py-2">
                <Type className="h-4 w-4" />
                <span className="text-xs">Text</span>
              </TabsTrigger>
              <TabsTrigger value="elements" className="flex flex-col items-center gap-1 py-2">
                <Image className="h-4 w-4" />
                <span className="text-xs">Elements</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex flex-col items-center gap-1 py-2">
                <Settings className="h-4 w-4" />
                <span className="text-xs">Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="h-[calc(100vh-16rem)] overflow-auto">
              <TabsContent value="layers" className="m-0">
                <LayersPanel 
                  layers={layers}
                  activeLayerId={activeLayerId}
                  onSelectLayer={setActiveLayer}
                  onAddLayer={(layerType) => {
                    addLayer(layerType);
                  }}
                  onUpdateLayer={updateLayer}
                  onDeleteLayer={deleteLayer}
                  onMoveLayerUp={moveLayerUp}
                  onMoveLayerDown={moveLayerDown}
                />
              </TabsContent>
              
              <TabsContent value="effects" className="m-0">
                <EffectsPanel 
                  effectStack={effectStack}
                  onAddEffect={(effectName) => addEffect(effectName)}
                  onRemoveEffect={removeEffect}
                  onUpdateEffectSettings={updateEffectSettings}
                />
              </TabsContent>
              
              <TabsContent value="typography" className="m-0">
                <TypographyPanel 
                  layers={layers}
                  activeLayerId={activeLayerId}
                  onUpdateLayer={updateLayer}
                  onAddTextLayer={() => {
                    addLayer('text');
                  }}
                />
              </TabsContent>
              
              <TabsContent value="elements" className="m-0">
                <ElementsPanel 
                  onAddElement={handleAddElement}
                  sportType={selectedTemplate?.sport}
                />
              </TabsContent>
              
              <TabsContent value="settings" className="m-0">
                <SettingsPanel 
                  template={selectedTemplate}
                  onUpdateSettings={(settings) => {
                    // Update template settings
                  }}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        <div className="col-span-1 lg:col-span-3 bg-gray-100 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="w-24">
                <Slider 
                  value={[zoomLevel]} 
                  min={50} 
                  max={150} 
                  step={10} 
                  onValueChange={(value) => setZoomLevel(value[0])}
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium ml-2">{zoomLevel}%</span>
            </div>
            
            <div className="text-sm text-gray-500">
              Safe Zone / Bleed Area: 
              <Button variant="ghost" size="sm" className="h-6 ml-1">
                Toggle
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-center min-h-[600px]">
            <div 
              ref={canvasRef}
              className="transition-all"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              <CardDesignerCanvas 
                layers={layers}
                activeLayerId={activeLayerId}
                effectClasses={getEffectClasses()}
                onSelectLayer={setActiveLayer}
                onUpdateLayer={updateLayer}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDesigner;
