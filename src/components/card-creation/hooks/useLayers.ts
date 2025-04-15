
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CardLayer } from '../types/cardTypes';

export interface UseLayersResult {
  layers: CardLayer[];
  activeLayerId: string | null;
  setActiveLayer: (layerId: string) => void;
  addLayer: (layerType: 'image' | 'text' | 'shape' | 'effect') => string;
  updateLayer: (layerId: string, updates: Partial<CardLayer>) => void;
  deleteLayer: (layerId: string) => void;
  moveLayerUp: (layerId: string) => void;
  moveLayerDown: (layerId: string) => void;
  setLayers: (layers: CardLayer[]) => void;
}

export const useLayers = (initialLayers: CardLayer[] = []): UseLayersResult => {
  const [layers, setLayers] = useState<CardLayer[]>(
    initialLayers.map(layer => ({
      ...layer,
      id: layer.id || uuidv4()
    }))
  );
  
  const [activeLayerId, setActiveLayerId] = useState<string | null>(
    layers.length > 0 ? layers[0].id : null
  );

  const addLayer = (layerType: 'image' | 'text' | 'shape' | 'effect'): string => {
    // Create default layer based on type
    let newLayer: Omit<CardLayer, 'id'> = {
      type: layerType,
      content: '',
      position: { x: 50, y: 50, z: layers.length },
      size: { width: layerType === 'text' ? 'auto' : 200, height: layerType === 'text' ? 'auto' : 100 },
      rotation: 0,
      opacity: 1,
      zIndex: layers.length,
      visible: true,
      locked: false,
      effectIds: []
    };

    // Add type-specific defaults
    if (layerType === 'text') {
      newLayer = {
        ...newLayer,
        content: 'New Text',
        textStyle: {
          fontFamily: 'Inter, sans-serif',
          fontSize: 16,
          fontWeight: '400',
          color: '#000000',
          textAlign: 'left'
        }
      };
    } else if (layerType === 'image') {
      newLayer = {
        ...newLayer,
        imageUrl: ''
      };
    } else if (layerType === 'shape') {
      newLayer = {
        ...newLayer,
        shapeType: 'rect',
        color: '#e2e2e2'
      };
    }
    
    const id = uuidv4();
    const layerWithId = {
      ...newLayer,
      id
    } as CardLayer;
    
    setLayers(prev => [...prev, layerWithId]);
    setActiveLayerId(id);
    return id;
  };
  
  const updateLayer = (id: string, updates: Partial<CardLayer>) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === id ? { ...layer, ...updates } : layer
      )
    );
  };
  
  const deleteLayer = (id: string) => {
    setLayers(prev => prev.filter(layer => layer.id !== id));
    
    if (activeLayerId === id) {
      setActiveLayerId(prev => {
        const remainingLayers = layers.filter(layer => layer.id !== id);
        return remainingLayers.length > 0 ? remainingLayers[0].id : null;
      });
    }
  };
  
  const moveLayerUp = (id: string) => {
    setLayers(prev => {
      const index = prev.findIndex(layer => layer.id === id);
      if (index <= 0) return prev;
      
      const newLayers = [...prev];
      
      if (newLayers[index].position && newLayers[index-1].position) {
        newLayers[index].position.z = prev[index - 1].position.z - 1;
      }
      
      // Sort by z-index if position exists
      return newLayers.sort((a, b) => 
        (b.position?.z ?? 0) - (a.position?.z ?? 0)
      );
    });
  };
  
  const moveLayerDown = (id: string) => {
    setLayers(prev => {
      const index = prev.findIndex(layer => layer.id === id);
      if (index === -1 || index >= prev.length - 1) return prev;
      
      const newLayers = [...prev];
      
      if (newLayers[index].position && newLayers[index+1].position) {
        newLayers[index].position.z = prev[index + 1].position.z + 1;
      }
      
      // Sort by z-index if position exists
      return newLayers.sort((a, b) => 
        (b.position?.z ?? 0) - (a.position?.z ?? 0)
      );
    });
  };
  
  const setActiveLayer = (id: string) => {
    setActiveLayerId(id || null);
  };

  return {
    layers,
    activeLayerId,
    addLayer,
    updateLayer,
    deleteLayer,
    moveLayerUp,
    moveLayerDown,
    setActiveLayer,
    setLayers
  };
};

export default useLayers;
