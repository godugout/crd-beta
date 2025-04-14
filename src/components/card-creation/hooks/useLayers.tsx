
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CardLayer } from '../CardCreator'; // Assuming CardLayer type is defined here

export interface UseLayersResult {
  layers: CardLayer[];
  activeLayerId: string | null;
  setActiveLayer: (layerId: string) => void;
  addLayer: (layer: Omit<CardLayer, 'id'>) => string;
  updateLayer: (layerId: string, updates: Partial<CardLayer>) => void;
  deleteLayer: (layerId: string) => void;
  moveLayerUp: (layerId: string) => void;
  moveLayerDown: (layerId: string) => void;
  setLayers: (layers: CardLayer[]) => void;  // Make sure this is defined
}

export const useLayers = (): UseLayersResult => {
  const [layers, setLayers] = useState<CardLayer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);

  const setActiveLayer = (layerId: string) => {
    setActiveLayerId(layerId);
  };

  const addLayer = (layer: Omit<CardLayer, 'id'>) => {
    const id = uuidv4();
    const newLayer = { ...layer, id };
    setLayers(prevLayers => [...prevLayers, newLayer]);
    setActiveLayerId(id);
    return id;
  };

  const updateLayer = (layerId: string, updates: Partial<CardLayer>) => {
    setLayers(prevLayers =>
      prevLayers.map(layer => 
        layer.id === layerId ? { ...layer, ...updates } : layer
      )
    );
  };

  const deleteLayer = (layerId: string) => {
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== layerId));
    if (activeLayerId === layerId) {
      const remainingLayers = layers.filter(layer => layer.id !== layerId);
      setActiveLayerId(remainingLayers.length > 0 ? remainingLayers[0].id : null);
    }
  };

  const moveLayerUp = (layerId: string) => {
    setLayers(prevLayers => {
      const index = prevLayers.findIndex(layer => layer.id === layerId);
      if (index <= 0) return prevLayers;
      
      const newLayers = [...prevLayers];
      const temp = newLayers[index - 1];
      newLayers[index - 1] = newLayers[index];
      newLayers[index] = temp;
      return newLayers;
    });
  };

  const moveLayerDown = (layerId: string) => {
    setLayers(prevLayers => {
      const index = prevLayers.findIndex(layer => layer.id === layerId);
      if (index === -1 || index >= prevLayers.length - 1) return prevLayers;
      
      const newLayers = [...prevLayers];
      const temp = newLayers[index + 1];
      newLayers[index + 1] = newLayers[index];
      newLayers[index] = temp;
      return newLayers;
    });
  };

  return {
    layers,
    activeLayerId,
    setActiveLayer,
    addLayer,
    updateLayer,
    deleteLayer,
    moveLayerUp,
    moveLayerDown,
    setLayers  // Explicitly return the setLayers function
  };
};
