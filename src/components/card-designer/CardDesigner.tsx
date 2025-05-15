
import React, { useState, useEffect, useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import CardDesignerCanvas from './CardDesignerCanvas';
import LayersPanel from './LayersPanel';
import ToolsPanel from './ToolsPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { CardLayer } from '@/components/card-creation/types/cardTypes';

// Generate a unique ID for layers
const generateId = () => `layer-${Math.random().toString(36).substr(2, 9)}`;

interface CardDesignerProps {
  initialLayers?: CardLayer[];
  onChange?: (layers: CardLayer[]) => void;
  onSave?: () => void;
}

const CardDesigner: React.FC<CardDesignerProps> = ({ 
  initialLayers = [], 
  onChange,
  onSave
}) => {
  const [layers, setLayers] = useState<CardLayer[]>(initialLayers);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [effectClasses, setEffectClasses] = useState<string>('');

  // Initialize with default layers if none provided
  useEffect(() => {
    if (initialLayers.length === 0) {
      const defaultLayers: CardLayer[] = [
        {
          id: generateId(),
          type: 'image',
          content: '',
          position: { x: 50, y: 50, z: 0 },
          size: { width: 300, height: 400 },
          rotation: 0,
          opacity: 1,
          zIndex: 0,
          visible: true,
          locked: false,
          effectIds: []
        }
      ];
      setLayers(defaultLayers);
    }
  }, [initialLayers]);

  // Notify parent component of layer changes
  useEffect(() => {
    if (onChange) {
      onChange(layers);
    }
  }, [layers, onChange]);

  // Layer manipulation functions
  const addLayer = useCallback((type: 'image' | 'text' | 'shape') => {
    const newLayer: CardLayer = {
      id: generateId(),
      type,
      content: type === 'text' ? 'New Text' : '',
      position: { x: 50, y: 50, z: layers.length },
      size: { width: type === 'text' ? 'auto' : 100, height: type === 'text' ? 'auto' : 100 },
      rotation: 0,
      opacity: 1,
      zIndex: layers.length,
      visible: true,
      locked: false,
      effectIds: []
    };
    
    setLayers(prev => [...prev, newLayer]);
    setActiveLayerId(newLayer.id);
  }, [layers]);

  const updateLayer = useCallback((id: string, updates: Partial<CardLayer>) => {
    setLayers(prev => prev.map(layer => 
      layer.id === id ? { ...layer, ...updates } : layer
    ));
  }, []);

  const deleteLayer = useCallback((id: string) => {
    setLayers(prev => prev.filter(layer => layer.id !== id));
    if (activeLayerId === id) {
      setActiveLayerId(null);
    }
  }, [activeLayerId]);

  const moveLayerUp = useCallback((id: string) => {
    setLayers(prev => {
      const index = prev.findIndex(layer => layer.id === id);
      if (index < prev.length - 1) {
        const newLayers = [...prev];
        const temp = newLayers[index].zIndex;
        newLayers[index].zIndex = newLayers[index + 1].zIndex;
        newLayers[index + 1].zIndex = temp;
        return newLayers.sort((a, b) => a.zIndex - b.zIndex);
      }
      return prev;
    });
  }, []);

  const moveLayerDown = useCallback((id: string) => {
    setLayers(prev => {
      const index = prev.findIndex(layer => layer.id === id);
      if (index > 0) {
        const newLayers = [...prev];
        const temp = newLayers[index].zIndex;
        newLayers[index].zIndex = newLayers[index - 1].zIndex;
        newLayers[index - 1].zIndex = temp;
        return newLayers.sort((a, b) => a.zIndex - b.zIndex);
      }
      return prev;
    });
  }, []);

  // Set active layer - fix the parameter type to accept string
  const handleSelectLayer = useCallback((id: string) => {
    setActiveLayerId(id === activeLayerId ? null : id);
  }, [activeLayerId]);

  // Keyboard shortcuts
  useHotkeys('delete', () => {
    if (activeLayerId) {
      deleteLayer(activeLayerId);
    }
  }, [activeLayerId, deleteLayer]);

  useHotkeys('ctrl+s, meta+s', (e) => {
    e.preventDefault();
    if (onSave) onSave();
  }, [onSave]);

  useHotkeys('ctrl+d, meta+d', (e) => {
    e.preventDefault();
    if (activeLayerId) {
      const layer = layers.find(l => l.id === activeLayerId);
      if (layer) {
        const newLayer = { 
          ...layer, 
          id: generateId(),
          position: { 
            ...layer.position, 
            x: layer.position.x + 10, 
            y: layer.position.y + 10,
            z: layers.length
          },
          zIndex: layers.length
        };
        setLayers(prev => [...prev, newLayer]);
        setActiveLayerId(newLayer.id);
      }
    }
  }, [activeLayerId, layers]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-3">
        <Card>
          <CardContent className="p-4">
            <div className="relative overflow-hidden bg-gray-100 rounded-md">
              <CardDesignerCanvas
                layers={layers}
                activeLayerId={activeLayerId}
                effectClasses={effectClasses}
                onSelectLayer={handleSelectLayer}
                onUpdateLayer={updateLayer}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setEffectClasses(prev => prev.includes('holographic') ? '' : 'holographic')}
            >
              Toggle Effects
            </Button>
            {onSave && (
              <Button size="sm" onClick={onSave}>
                Save Design
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-4">
        <ToolsPanel onAddLayer={addLayer} />
        
        <LayersPanel
          layers={layers}
          activeLayerId={activeLayerId}
          onSelectLayer={handleSelectLayer}
          onDeleteLayer={deleteLayer}
          onMoveLayerUp={moveLayerUp}
          onMoveLayerDown={moveLayerDown}
          onUpdateLayer={updateLayer}
        />
      </div>
    </div>
  );
};

export default CardDesigner;
