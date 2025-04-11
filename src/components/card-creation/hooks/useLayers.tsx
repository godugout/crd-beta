
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CardLayer } from '../CardCreator';

export interface UseLayersResult {
  layers: CardLayer[];
  activeLayerId?: string;
  addLayer: (layer: Omit<CardLayer, 'id'>) => void;
  updateLayer: (id: string, updates: Partial<CardLayer>) => void;
  deleteLayer: (id: string) => void;
  moveLayerUp: (id: string) => void;
  moveLayerDown: (id: string) => void;
  setActiveLayer: (id: string) => void;
}

export const useLayers = (initialLayers: CardLayer[] = []): UseLayersResult => {
  const [layers, setLayers] = useState<CardLayer[]>(initialLayers);
  const [activeLayerId, setActiveLayerId] = useState<string | undefined>(
    initialLayers.length > 0 ? initialLayers[0].id : undefined
  );
  
  // Add a new layer
  const addLayer = useCallback((layer: Omit<CardLayer, 'id'>) => {
    const newLayer: CardLayer = {
      ...layer,
      id: uuidv4()
    };
    
    setLayers(prevLayers => [...prevLayers, newLayer]);
    setActiveLayerId(newLayer.id);
  }, []);
  
  // Update an existing layer
  const updateLayer = useCallback((id: string, updates: Partial<CardLayer>) => {
    setLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === id ? { ...layer, ...updates } : layer
      )
    );
  }, []);
  
  // Delete a layer
  const deleteLayer = useCallback((id: string) => {
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== id));
    
    // If the active layer is deleted, select another one
    if (activeLayerId === id) {
      setActiveLayerId(prevLayers => {
        const filteredLayers = layers.filter(layer => layer.id !== id);
        return filteredLayers.length > 0 ? filteredLayers[0].id : undefined;
      });
    }
  }, [layers, activeLayerId]);
  
  // Move a layer up in the stack (visually, but down in the array)
  const moveLayerUp = useCallback((id: string) => {
    setLayers(prevLayers => {
      const index = prevLayers.findIndex(layer => layer.id === id);
      if (index <= 0) return prevLayers; // Already at the top
      
      const newLayers = [...prevLayers];
      const layer = newLayers[index];
      newLayers[index] = newLayers[index - 1];
      newLayers[index - 1] = layer;
      
      return newLayers;
    });
  }, []);
  
  // Move a layer down in the stack (visually, but up in the array)
  const moveLayerDown = useCallback((id: string) => {
    setLayers(prevLayers => {
      const index = prevLayers.findIndex(layer => layer.id === id);
      if (index === -1 || index >= prevLayers.length - 1) return prevLayers; // Not found or already at the bottom
      
      const newLayers = [...prevLayers];
      const layer = newLayers[index];
      newLayers[index] = newLayers[index + 1];
      newLayers[index + 1] = layer;
      
      return newLayers;
    });
  }, []);
  
  // Set active layer
  const setActiveLayer = useCallback((id: string) => {
    setActiveLayerId(id);
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
};
