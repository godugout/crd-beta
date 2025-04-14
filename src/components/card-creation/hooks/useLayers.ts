
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CardLayer } from '../types/cardTypes';

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

  const addLayer = useCallback((layerType: 'image' | 'text' | 'shape') => {
    // Create default layer based on type
    const newLayer: Omit<CardLayer, 'id'> = {
      type: layerType,
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      position: { x: 50, y: 50, z: 1 },
      size: { width: 200, height: 100 },
      effectIds: []
    };
    
    const layerWithId = {
      ...newLayer,
      id: uuidv4()
    };
    
    setLayers(prev => [...prev, layerWithId]);
    setActiveLayerId(layerWithId.id);
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
      
      if (newLayers[index].position && newLayers[index-1].position) {
        newLayers[index].position.z = prev[index - 1].position.z - 1;
      }
      
      // Sort by z-index if position exists
      return newLayers.sort((a, b) => 
        (b.position?.z ?? 0) - (a.position?.z ?? 0)
      );
    });
  }, []);
  
  const moveLayerDown = useCallback((id: string) => {
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
