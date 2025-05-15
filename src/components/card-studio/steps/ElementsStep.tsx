
import React, { useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Plus,
  Type,
  Image as ImageIcon,
  Square,
  Move,
  Trash2,
  Lock,
  Unlock,
  EyeOff,
  Eye,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ElementsStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

// Mock layer data - would ideally come from card data
const MOCK_LAYERS = [
  { id: 'l1', type: 'image', name: 'Background Image', visible: true, locked: false, zIndex: 0 },
  { id: 'l2', type: 'shape', name: 'Frame', visible: true, locked: false, zIndex: 1 },
  { id: 'l3', type: 'text', name: 'Player Name', visible: true, locked: false, zIndex: 2 },
  { id: 'l4', type: 'text', name: 'Team Name', visible: true, locked: false, zIndex: 3 },
  { id: 'l5', type: 'shape', name: 'Badge', visible: true, locked: false, zIndex: 4 },
];

const ElementsStep: React.FC<ElementsStepProps> = ({ cardData, onUpdate }) => {
  const [layers, setLayers] = useState(MOCK_LAYERS);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);

  const handleAddLayer = (type: 'text' | 'image' | 'shape') => {
    const newLayer = {
      id: `l${Date.now()}`,
      type: type,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      visible: true,
      locked: false,
      zIndex: layers.length, // Add on top
    };
    
    setLayers([...layers, newLayer]);
    setActiveLayerId(newLayer.id);
  };
  
  const handleLayerVisibility = (id: string) => {
    setLayers(layers.map(layer => 
      layer.id === id 
        ? { ...layer, visible: !layer.visible } 
        : layer
    ));
  };
  
  const handleLayerLock = (id: string) => {
    setLayers(layers.map(layer => 
      layer.id === id 
        ? { ...layer, locked: !layer.locked } 
        : layer
    ));
  };
  
  const handleDeleteLayer = (id: string) => {
    setLayers(layers.filter(layer => layer.id !== id));
    if (activeLayerId === id) {
      setActiveLayerId(null);
    }
  };
  
  const moveLayerUp = (id: string) => {
    const index = layers.findIndex(layer => layer.id === id);
    if (index < layers.length - 1) {
      const newLayers = [...layers];
      [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
      // Update zIndex values
      newLayers.forEach((layer, i) => {
        layer.zIndex = i;
      });
      setLayers(newLayers);
    }
  };
  
  const moveLayerDown = (id: string) => {
    const index = layers.findIndex(layer => layer.id === id);
    if (index > 0) {
      const newLayers = [...layers];
      [newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]];
      // Update zIndex values
      newLayers.forEach((layer, i) => {
        layer.zIndex = i;
      });
      setLayers(newLayers);
    }
  };

  const activeLayer = layers.find(layer => layer.id === activeLayerId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Card Elements</h2>
        <p className="text-sm text-gray-500 mt-1">
          Add and manage text, images, and shapes on your card
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Layers Panel */}
        <div className="bg-gray-50 rounded-lg border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Layers</h3>
            <div className="flex space-x-1">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 w-7 p-0" 
                onClick={() => handleAddLayer('text')}
                title="Add Text"
              >
                <Type className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 w-7 p-0" 
                onClick={() => handleAddLayer('image')}
                title="Add Image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 w-7 p-0" 
                onClick={() => handleAddLayer('shape')}
                title="Add Shape"
              >
                <Square className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <ScrollArea className="h-[250px] pr-4">
            <div className="space-y-1">
              {layers.map((layer) => (
                <div 
                  key={layer.id}
                  className={`flex items-center justify-between p-2 rounded-md ${
                    activeLayerId === layer.id 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveLayerId(layer.id)}
                >
                  <div className="flex items-center space-x-2">
                    {layer.type === 'text' && <Type className="h-4 w-4 text-blue-500" />}
                    {layer.type === 'image' && <ImageIcon className="h-4 w-4 text-green-500" />}
                    {layer.type === 'shape' && <Square className="h-4 w-4 text-purple-500" />}
                    <span className={`text-sm ${layer.visible ? '' : 'text-gray-400'}`}>
                      {layer.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLayerVisibility(layer.id);
                      }}
                      title={layer.visible ? "Hide" : "Show"}
                    >
                      {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLayerLock(layer.id);
                      }}
                      title={layer.locked ? "Unlock" : "Lock"}
                    >
                      {layer.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0 text-red-500" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLayer(layer.id);
                      }}
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {layers.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500">No layers yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleAddLayer('text')}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Layer
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Layer Order Controls */}
          <div className="flex justify-between pt-2 mt-2 border-t">
            <div>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => activeLayerId && moveLayerDown(activeLayerId)}
                disabled={!activeLayerId || layers.findIndex(l => l.id === activeLayerId) === 0}
              >
                <ChevronDown className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>
            <div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => activeLayerId && moveLayerUp(activeLayerId)}
                disabled={!activeLayerId || layers.findIndex(l => l.id === activeLayerId) === layers.length - 1}
              >
                <ChevronUp className="h-4 w-4 mr-1" />
                Front
              </Button>
            </div>
          </div>
        </div>
        
        {/* Element Properties */}
        <div className="lg:col-span-2 bg-white rounded-lg border p-4">
          {activeLayer ? (
            <div>
              <h3 className="text-sm font-medium mb-4">
                {activeLayer.name} Properties
              </h3>
              
              <Accordion type="single" collapsible defaultValue="position">
                <AccordionItem value="position">
                  <AccordionTrigger className="text-sm">Position & Size</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pos-x" className="text-xs">X Position</Label>
                        <div className="flex items-center mt-1">
                          <input
                            id="pos-x"
                            type="number"
                            className="w-full rounded-md border py-1 px-2 text-sm"
                            placeholder="X"
                          />
                          <span className="text-xs ml-1">px</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="pos-y" className="text-xs">Y Position</Label>
                        <div className="flex items-center mt-1">
                          <input
                            id="pos-y"
                            type="number"
                            className="w-full rounded-md border py-1 px-2 text-sm"
                            placeholder="Y"
                          />
                          <span className="text-xs ml-1">px</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="width" className="text-xs">Width</Label>
                        <div className="flex items-center mt-1">
                          <input
                            id="width"
                            type="number"
                            className="w-full rounded-md border py-1 px-2 text-sm"
                            placeholder="Width"
                          />
                          <span className="text-xs ml-1">px</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="height" className="text-xs">Height</Label>
                        <div className="flex items-center mt-1">
                          <input
                            id="height"
                            type="number"
                            className="w-full rounded-md border py-1 px-2 text-sm"
                            placeholder="Height"
                          />
                          <span className="text-xs ml-1">px</span>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {activeLayer.type === 'text' && (
                  <AccordionItem value="text">
                    <AccordionTrigger className="text-sm">Text Options</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="text-content" className="text-xs">Text Content</Label>
                          <textarea
                            id="text-content"
                            className="w-full rounded-md border py-1 px-2 text-sm mt-1"
                            placeholder="Enter text"
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="font-family" className="text-xs">Font Family</Label>
                          <select
                            id="font-family"
                            className="w-full rounded-md border py-1 px-2 text-sm mt-1"
                          >
                            <option value="arial">Arial</option>
                            <option value="times">Times New Roman</option>
                            <option value="georgia">Georgia</option>
                            <option value="verdana">Verdana</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="font-size" className="text-xs">Font Size</Label>
                            <div className="flex items-center mt-1">
                              <input
                                id="font-size"
                                type="number"
                                className="w-full rounded-md border py-1 px-2 text-sm"
                                placeholder="Size"
                                defaultValue={16}
                              />
                              <span className="text-xs ml-1">px</span>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="text-color" className="text-xs">Text Color</Label>
                            <div className="flex items-center mt-1">
                              <input
                                id="text-color"
                                type="color"
                                className="h-7 w-10 rounded-md border"
                                defaultValue="#000000"
                              />
                              <input
                                type="text"
                                className="w-full rounded-md border py-1 px-2 text-sm ml-2"
                                placeholder="#000000"
                                defaultValue="#000000"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
                
                {activeLayer.type === 'image' && (
                  <AccordionItem value="image">
                    <AccordionTrigger className="text-sm">Image Options</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div className="border rounded-md p-2 bg-gray-50 text-center">
                          <div className="h-24 bg-white border flex items-center justify-center mb-2">
                            <ImageIcon className="h-8 w-8 text-gray-300" />
                          </div>
                          <Button size="sm" variant="outline">
                            Change Image
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="opacity" className="text-xs">Opacity</Label>
                            <div className="flex items-center mt-1">
                              <input
                                id="opacity"
                                type="range"
                                min="0"
                                max="100"
                                defaultValue="100"
                                className="w-full"
                              />
                              <span className="text-xs ml-1 w-8">100%</span>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="rotation" className="text-xs">Rotation</Label>
                            <div className="flex items-center mt-1">
                              <input
                                id="rotation"
                                type="range"
                                min="0"
                                max="360"
                                defaultValue="0"
                                className="w-full"
                              />
                              <span className="text-xs ml-1 w-8">0°</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
                
                {activeLayer.type === 'shape' && (
                  <AccordionItem value="shape">
                    <AccordionTrigger className="text-sm">Shape Options</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="shape-type" className="text-xs">Shape Type</Label>
                          <select
                            id="shape-type"
                            className="w-full rounded-md border py-1 px-2 text-sm mt-1"
                          >
                            <option value="rectangle">Rectangle</option>
                            <option value="circle">Circle</option>
                            <option value="triangle">Triangle</option>
                            <option value="star">Star</option>
                          </select>
                        </div>
                        
                        <div>
                          <Label htmlFor="fill-color" className="text-xs">Fill Color</Label>
                          <div className="flex items-center mt-1">
                            <input
                              id="fill-color"
                              type="color"
                              className="h-7 w-10 rounded-md border"
                              defaultValue="#CCCCCC"
                            />
                            <input
                              type="text"
                              className="w-full rounded-md border py-1 px-2 text-sm ml-2"
                              placeholder="#CCCCCC"
                              defaultValue="#CCCCCC"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="border-color" className="text-xs">Border Color</Label>
                          <div className="flex items-center mt-1">
                            <input
                              id="border-color"
                              type="color"
                              className="h-7 w-10 rounded-md border"
                              defaultValue="#000000"
                            />
                            <input
                              type="text"
                              className="w-full rounded-md border py-1 px-2 text-sm ml-2"
                              placeholder="#000000"
                              defaultValue="#000000"
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
                
                <AccordionItem value="effects">
                  <AccordionTrigger className="text-sm">Effects</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="shadow" className="text-xs flex items-center">
                          <input
                            id="shadow"
                            type="checkbox"
                            className="mr-2"
                          />
                          Drop Shadow
                        </Label>
                        
                        {/* Shadow settings would appear if checkbox selected */}
                      </div>
                      
                      <div>
                        <Label htmlFor="border" className="text-xs flex items-center">
                          <input
                            id="border"
                            type="checkbox"
                            className="mr-2"
                          />
                          Custom Border
                        </Label>
                        
                        {/* Border settings would appear if checkbox selected */}
                      </div>
                      
                      <div>
                        <Label htmlFor="glow" className="text-xs flex items-center">
                          <input
                            id="glow"
                            type="checkbox"
                            className="mr-2"
                          />
                          Glow Effect
                        </Label>
                        
                        {/* Glow settings would appear if checkbox selected */}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <div className="text-center py-12">
              <Move className="h-12 w-12 text-gray-300 mx-auto" />
              <h3 className="text-lg font-medium mt-4">Select a Layer</h3>
              <p className="text-sm text-gray-500 mt-1">
                Click on a layer from the list to edit its properties
              </p>
              
              <div className="mt-6 space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleAddLayer('text')}
                >
                  <Type className="h-4 w-4 mr-1" />
                  Add Text
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleAddLayer('image')}
                >
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Add Image
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleAddLayer('shape')}
                >
                  <Square className="h-4 w-4 mr-1" />
                  Add Shape
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElementsStep;
