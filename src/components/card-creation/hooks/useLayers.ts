
import { useState, useCallback } from 'react';
import { CardLayer } from '../types/cardTypes';
import { v4 as uuidv4 } from 'uuid';

interface UseLayersOptions {
  initialLayers?: CardLayer[];
  onChange?: (layers: CardLayer[]) => void;
}

export function useLayers({ initialLayers = [], onChange }: UseLayersOptions = {}) {
  const [layers, setLayers] = useState<CardLayer[]>(initialLayers);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);

  // Add a new layer
  const addLayer = useCallback((
    type: 'image' | 'text' | 'shape',
    options: Partial<CardLayer> = {}
  ) => {
    // Create default properties based on type
    let content = '';
    let width: number | 'auto' = 100;
    let height: number | 'auto' = 100;
    
    switch (type) {
      case 'text':
        content = 'Double click to edit text';
        width = 'auto';
        height = 'auto';
        break;
      case 'image':
        width = 200;
        height = 200;
        break;
      case 'shape':
        // Set specific shape properties
        width = 100;
        height = 100;
        break;
    }
    
    // Create the new layer
    const newLayer: CardLayer = {
      id: options.id || uuidv4(),
      type,
      content: options.content || content,
      position: options.position || {
        x: 200, // Center of canvas
        y: 250, // Center of canvas
        z: layers.length + 1
      },
      size: {
        width: options.size?.width || width,
        height: options.size?.height || height
      },
      rotation: options.rotation || 0,
      opacity: options.opacity || 1,
      zIndex: layers.length + 1,
      visible: options.visible !== undefined ? options.visible : true,
      locked: options.locked || false,
      ...(type === 'text' && {
        textStyle: options.textStyle || {
          fontFamily: 'Arial',
          fontSize: 18,
          fontWeight: 'normal',
          color: '#000000',
          textAlign: 'center'
        }
      }),
      ...(type === 'shape' && {
        shapeType: options.shapeType || 'rectangle',
        color: options.color || '#e2e2e2'
      })
    };
    
    // Add the new layer to the layers array
    const updatedLayers = [...layers, newLayer];
    setLayers(updatedLayers);
    setActiveLayerId(newLayer.id);
    
    // Call onChange if provided
    if (onChange) {
      onChange(updatedLayers);
    }
    
    return newLayer;
  }, [layers, onChange]);
  
  // Update a layer
  const updateLayer = useCallback((id: string, updates: Partial<CardLayer>) => {
    const updatedLayers = layers.map(layer => 
      layer.id === id ? { ...layer, ...updates } : layer
    );
    
    setLayers(updatedLayers);
    
    // Call onChange if provided
    if (onChange) {
      onChange(updatedLayers);
    }
  }, [layers, onChange]);
  
  // Delete a layer
  const deleteLayer = useCallback((id: string) => {
    const updatedLayers = layers.filter(layer => layer.id !== id);
    
    // If the active layer is being deleted, clear the active layer
    if (activeLayerId === id) {
      setActiveLayerId(null);
    }
    
    setLayers(updatedLayers);
    
    // Call onChange if provided
    if (onChange) {
      onChange(updatedLayers);
    }
  }, [layers, activeLayerId, onChange]);
  
  // Move a layer up in the stack
  const moveLayerUp = useCallback((id: string) => {
    const index = layers.findIndex(layer => layer.id === id);
    if (index === -1 || index === layers.length - 1) return; // Layer not found or already at top
    
    const updatedLayers = [...layers];
    const layerToMove = updatedLayers[index];
    const layerAbove = updatedLayers[index + 1];
    
    // Swap z-index values
    const tempZ = layerToMove.position.z;
    layerToMove.position.z = layerAbove.position.z;
    layerAbove.position.z = tempZ;
    
    // Swap positions in array
    updatedLayers[index] = layerAbove;
    updatedLayers[index + 1] = layerToMove;
    
    setLayers(updatedLayers);
    
    // Call onChange if provided
    if (onChange) {
      onChange(updatedLayers);
    }
  }, [layers, onChange]);
  
  // Move a layer down in the stack
  const moveLayerDown = useCallback((id: string) => {
    const index = layers.findIndex(layer => layer.id === id);
    if (index === -1 || index === 0) return; // Layer not found or already at bottom
    
    const updatedLayers = [...layers];
    const layerToMove = updatedLayers[index];
    const layerBelow = updatedLayers[index - 1];
    
    // Swap z-index values
    const tempZ = layerToMove.position.z;
    layerToMove.position.z = layerBelow.position.z;
    layerBelow.position.z = tempZ;
    
    // Swap positions in array
    updatedLayers[index] = layerBelow;
    updatedLayers[index - 1] = layerToMove;
    
    setLayers(updatedLayers);
    
    // Call onChange if provided
    if (onChange) {
      onChange(updatedLayers);
    }
  }, [layers, onChange]);
  
  // Duplicate a layer
  const duplicateLayer = useCallback((id: string) => {
    const layerToDuplicate = layers.find(layer => layer.id === id);
    if (!layerToDuplicate) return;
    
    // Create a duplicate with a new ID, slightly offset
    const duplicate: CardLayer = {
      ...layerToDuplicate,
      id: uuidv4(),
      position: {
        ...layerToDuplicate.position,
        x: layerToDuplicate.position.x + 20,
        y: layerToDuplicate.position.y + 20,
      }
    };
    
    const updatedLayers = [...layers, duplicate];
    setLayers(updatedLayers);
    setActiveLayerId(duplicate.id);
    
    // Call onChange if provided
    if (onChange) {
      onChange(updatedLayers);
    }
    
    return duplicate;
  }, [layers, onChange]);

  // Set active layer by ID
  const setActiveLayer = useCallback((id: string) => {
    setActiveLayerId(id || null);
  }, []);
  
  // Clear all layers
  const clearLayers = useCallback(() => {
    setLayers([]);
    setActiveLayerId(null);
    
    // Call onChange if provided
    if (onChange) {
      onChange([]);
    }
  }, [onChange]);
  
  // Replace all layers
  const setAllLayers = useCallback((newLayers: CardLayer[]) => {
    setLayers(newLayers);
    setActiveLayerId(null);
    
    // Call onChange if provided
    if (onChange) {
      onChange(newLayers);
    }
  }, [onChange]);

  return {
    layers,
    setLayers: setAllLayers,
    activeLayerId,
    setActiveLayer,
    addLayer,
    updateLayer,
    deleteLayer,
    moveLayerUp,
    moveLayerDown,
    duplicateLayer,
    clearLayers,
    activeLayer: activeLayerId ? layers.find(layer => layer.id === activeLayerId) : null
  };
}
