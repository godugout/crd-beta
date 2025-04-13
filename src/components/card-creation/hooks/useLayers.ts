
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CardLayer } from '../CardCreator';

export function useLayers() {
  const [layers, setLayers] = useState<CardLayer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  
  const addLayer = useCallback((layer: Omit<CardLayer, 'id'>) => {
    const newLayer = {
      ...layer,
      id: uuidv4()
    };
    
    setLayers(prev => [...prev, newLayer]);
    setActiveLayerId(newLayer.id);
    return newLayer.id;
  }, []);
  
  const updateLayer = useCallback((layerId: string, updates: Partial<CardLayer>) => {
    setLayers(prev => 
      prev.map(layer => 
        layer.id === layerId ? { ...layer, ...updates } : layer
      )
    );
  }, []);
  
  const deleteLayer = useCallback((layerId: string) => {
    setLayers(prev => prev.filter(layer => layer.id !== layerId));
    
    // Reset active layer if the deleted layer was active
    if (activeLayerId === layerId) {
      setActiveLayerId(null);
    }
  }, [activeLayerId]);
  
  const moveLayerUp = useCallback((layerId: string) => {
    setLayers(prev => {
      const index = prev.findIndex(layer => layer.id === layerId);
      if (index <= 0) return prev; // Already at the top
      
      const newLayers = [...prev];
      [newLayers[index - 1], newLayers[index]] = [newLayers[index], newLayers[index - 1]];
      
      return newLayers;
    });
  }, []);
  
  const moveLayerDown = useCallback((layerId: string) => {
    setLayers(prev => {
      const index = prev.findIndex(layer => layer.id === layerId);
      if (index === -1 || index === prev.length - 1) return prev; // Not found or already at the bottom
      
      const newLayers = [...prev];
      [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
      
      return newLayers;
    });
  }, []);
  
  const setActiveLayer = useCallback((layerId: string) => {
    setActiveLayerId(layerId);
  }, []);

  return {
    layers,
    activeLayerId,
    addLayer,
    updateLayer,
    deleteLayer,
    moveLayerUp,
    moveLayerDown,
    setActiveLayer
  };
}
