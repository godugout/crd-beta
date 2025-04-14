
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CardLayer } from '../CardCreator';

export const useLayers = (initialLayers: Omit<CardLayer, 'id'>[] = []) => {
  const [layers, setLayers] = useState<CardLayer[]>(
    initialLayers.map(layer => ({
      ...layer,
      id: uuidv4()
    }))
  );
  
  const [activeLayerId, setActiveLayerId] = useState<string | null>(
    layers.length > 0 ? layers[0].id : null
  );

  const addLayer = useCallback((layer: Omit<CardLayer, 'id'>) => {
    const newLayer = {
      ...layer,
      id: uuidv4()
    };
    
    setLayers(prev => [...prev, newLayer]);
    setActiveLayerId(newLayer.id);
  }, []);
  
  const updateLayer = useCallback((id: string, updates: Partial<CardLayer>) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === id ? { ...layer, ...updates } : layer
      )
    );
  }, []);
  
  const deleteLayer = useCallback((id: string) => {
    setLayers(prev => prev.filter(layer => layer.id !== id));
    
    if (activeLayerId === id) {
      setActiveLayerId(prev => {
        const remainingLayers = layers.filter(layer => layer.id !== id);
        return remainingLayers.length > 0 ? remainingLayers[0].id : null;
      });
    }
  }, [activeLayerId, layers]);
  
  const moveLayerUp = useCallback((id: string) => {
    setLayers(prev => {
      const index = prev.findIndex(layer => layer.id === id);
      if (index <= 0) return prev;
      
      const newLayers = [...prev];
      newLayers[index].position.z = prev[index - 1].position.z - 1;
      
      // Sort by z-index
      return newLayers.sort((a, b) => b.position.z - a.position.z);
    });
  }, []);
  
  const moveLayerDown = useCallback((id: string) => {
    setLayers(prev => {
      const index = prev.findIndex(layer => layer.id === id);
      if (index === -1 || index >= prev.length - 1) return prev;
      
      const newLayers = [...prev];
      newLayers[index].position.z = prev[index + 1].position.z + 1;
      
      // Sort by z-index
      return newLayers.sort((a, b) => b.position.z - a.position.z);
    });
  }, []);
  
  const setActiveLayer = useCallback((id: string) => {
    setActiveLayerId(id || null);
  }, []);

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
