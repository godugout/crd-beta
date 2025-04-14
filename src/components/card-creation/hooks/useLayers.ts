
import { useState, useCallback } from 'react';

export interface CardLayer {
  id: string;
  type: 'image' | 'text' | 'shape' | 'effect';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  zIndex: number;
  style?: Record<string, any>;
  opacity?: number; // Add opacity property
}

export const useLayers = () => {
  const [layers, setLayers] = useState<CardLayer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  
  const addLayer = useCallback((layer: Omit<CardLayer, 'id'> & { id?: string }) => {
    const newLayer: CardLayer = {
      id: layer.id || `layer-${Date.now()}`,
      type: layer.type,
      content: layer.content,
      position: layer.position,
      size: layer.size,
      rotation: layer.rotation,
      zIndex: layer.zIndex,
      style: layer.style,
      opacity: layer.opacity || 1 // Default opacity to 1
    };
    
    setLayers(prevLayers => [...prevLayers, newLayer]);
    return newLayer.id;
  }, []);
  
  const updateLayer = useCallback((id: string, updates: Partial<CardLayer>) => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === id ? { ...layer, ...updates } : layer
      )
    );
  }, []);
  
  const deleteLayer = useCallback((id: string) => {
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== id));
    if (activeLayerId === id) {
      setActiveLayerId(null);
    }
  }, [activeLayerId]);
  
  const moveLayerUp = useCallback((id: string) => {
    setLayers(prevLayers => {
      const index = prevLayers.findIndex(layer => layer.id === id);
      if (index === -1 || index === prevLayers.length - 1) return prevLayers;
      
      const newLayers = [...prevLayers];
      const temp = newLayers[index];
      newLayers[index] = newLayers[index + 1];
      newLayers[index + 1] = temp;
      
      return newLayers;
    });
  }, []);
  
  const moveLayerDown = useCallback((id: string) => {
    setLayers(prevLayers => {
      const index = prevLayers.findIndex(layer => layer.id === id);
      if (index <= 0) return prevLayers;
      
      const newLayers = [...prevLayers];
      const temp = newLayers[index];
      newLayers[index] = newLayers[index - 1];
      newLayers[index - 1] = temp;
      
      return newLayers;
    });
  }, []);
  
  const setActiveLayer = useCallback((id: string | null) => {
    setActiveLayerId(id);
  }, []);
  
  return {
    layers,
    activeLayerId,
    setActiveLayer,
    addLayer,
    updateLayer,
    deleteLayer,
    moveLayerUp,
    moveLayerDown,
    setLayers
  };
};
