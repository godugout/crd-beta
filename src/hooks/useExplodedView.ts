
import { useState, useCallback, useMemo } from 'react';
import { LayerInfo, LayerGroup, ExplodedViewSettings } from '@/lib/types/layerTypes';
import { Card } from '@/lib/types';

interface ExplodedViewOptions {
  card?: Card;
  initialDistance?: number;
  initialExplosionType?: 'vertical' | 'radial' | 'custom';
}

export function useExplodedView(options: ExplodedViewOptions = {}) {
  const { card, initialDistance = 1.5, initialExplosionType = 'vertical' } = options;
  
  // Generate layers based on card type and effects
  const initialLayers = useMemo(() => generateCardLayers(card), [card]);
  
  // Generate layer groups
  const initialLayerGroups = useMemo(() => generateLayerGroups(initialLayers), [initialLayers]);
  
  // Initialize all layers as visible
  const initialVisibleLayerIds = useMemo(() => 
    initialLayers.map(layer => layer.id), 
    [initialLayers]
  );
  
  // Exploded view state
  const [settings, setSettings] = useState<ExplodedViewSettings>({
    active: false,
    explosionDistance: initialDistance,
    explosionType: initialExplosionType,
    selectedLayerId: null,
    visibleLayerIds: initialVisibleLayerIds,
    specialView: 'normal',
    animated: true,
    annotationsVisible: true
  });
  
  // Layers and groups state
  const [layers, setLayers] = useState<LayerInfo[]>(initialLayers);
  const [layerGroups, setLayerGroups] = useState<LayerGroup[]>(initialLayerGroups);
  
  // Toggle exploded view
  const toggleExplodedView = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      active: !prev.active
    }));
  }, []);
  
  // Update explosion distance
  const setExplosionDistance = useCallback((distance: number) => {
    setSettings(prev => ({
      ...prev,
      explosionDistance: distance
    }));
  }, []);
  
  // Update explosion type
  const setExplosionType = useCallback((type: 'vertical' | 'radial' | 'custom') => {
    setSettings(prev => ({
      ...prev,
      explosionType: type
    }));
  }, []);
  
  // Toggle layer visibility
  const toggleLayerVisibility = useCallback((layerId: string) => {
    setSettings(prev => {
      const isCurrentlyVisible = prev.visibleLayerIds.includes(layerId);
      
      const newVisibleLayerIds = isCurrentlyVisible
        ? prev.visibleLayerIds.filter(id => id !== layerId)
        : [...prev.visibleLayerIds, layerId];
      
      return {
        ...prev,
        visibleLayerIds: newVisibleLayerIds
      };
    });
  }, []);
  
  // Select layer
  const selectLayer = useCallback((layerId: string | null) => {
    setSettings(prev => ({
      ...prev,
      selectedLayerId: layerId
    }));
  }, []);
  
  // Change special view mode
  const setSpecialView = useCallback((view: 'normal' | 'cross-section' | 'wireframe' | 'xray' | 'timeline') => {
    setSettings(prev => ({
      ...prev,
      specialView: view
    }));
  }, []);
  
  // Toggle animations
  const toggleAnimations = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      animated: !prev.animated
    }));
  }, []);
  
  // Toggle annotations
  const toggleAnnotations = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      annotationsVisible: !prev.annotationsVisible
    }));
  }, []);
  
  // Calculate layer positions based on current settings
  const layerPositions = useMemo(() => {
    return calculateLayerPositions(layers, settings);
  }, [layers, settings]);
  
  return {
    settings,
    layers,
    layerGroups,
    layerPositions,
    toggleExplodedView,
    setExplosionDistance,
    setExplosionType,
    toggleLayerVisibility,
    selectLayer,
    setSpecialView,
    toggleAnimations,
    toggleAnnotations
  };
}

// Helper function to generate layers based on card
function generateCardLayers(card?: Card): LayerInfo[] {
  // Default layers that all cards have
  const baseLayers: LayerInfo[] = [
    {
      id: 'base',
      name: 'Base Card',
      type: 'image',
      position: 0,
      opacity: 1,
      visible: true,
      description: 'Base card material and structure',
      material: { name: 'Card Stock', roughness: 0.7, reflectivity: 0.1 }
    },
    {
      id: 'background',
      name: 'Background',
      type: 'image',
      position: 1,
      opacity: 1,
      visible: true,
      description: 'Card background design and color'
    },
    {
      id: 'main-image',
      name: 'Player Image',
      type: 'image',
      position: 2,
      opacity: 1,
      visible: true,
      description: 'Main subject photograph or artwork'
    },
    {
      id: 'text-info',
      name: 'Text & Info',
      type: 'text',
      position: 3,
      opacity: 1,
      visible: true,
      description: 'Player information, stats, and card details'
    },
    {
      id: 'border',
      name: 'Border',
      type: 'border',
      position: 4,
      opacity: 1,
      visible: true,
      description: 'Card border design'
    }
  ];
  
  // Special effect layers based on card effects
  const effectLayers: LayerInfo[] = [];
  
  if (card?.effects) {
    if (card.effects.includes('Holographic')) {
      effectLayers.push({
        id: 'holographic',
        name: 'Holographic Layer',
        type: 'foil',
        position: 5,
        opacity: 0.8,
        visible: true,
        description: 'Rainbow holographic foil overlay',
        material: { 
          name: 'Holographic Foil', 
          reflectivity: 0.9, 
          roughness: 0.1,
          metalness: 0.7
        }
      });
    }
    
    if (card.effects.includes('Refractor')) {
      effectLayers.push({
        id: 'refractor',
        name: 'Refractor Finish',
        type: 'foil',
        position: 5,
        opacity: 0.7,
        visible: true,
        description: 'Light-refracting prismatic layer',
        material: { 
          name: 'Refractor Film', 
          reflectivity: 0.85, 
          roughness: 0.15,
          metalness: 0.6
        }
      });
    }
    
    if (card.effects.includes('Gold Foil')) {
      effectLayers.push({
        id: 'gold-foil',
        name: 'Gold Foil Accents',
        type: 'foil',
        position: 6,
        opacity: 1,
        visible: true,
        description: 'Gold foil stamping on specific areas',
        material: { 
          name: 'Gold Foil', 
          reflectivity: 0.9, 
          roughness: 0.2,
          metalness: 1.0,
          color: '#FFD700'
        }
      });
    }
    
    if (card.effects.includes('Silver Foil')) {
      effectLayers.push({
        id: 'silver-foil',
        name: 'Silver Foil Elements',
        type: 'foil',
        position: 6,
        opacity: 1,
        visible: true,
        description: 'Silver metallic accents',
        material: { 
          name: 'Silver Foil', 
          reflectivity: 0.95, 
          roughness: 0.1,
          metalness: 1.0,
          color: '#C0C0C0'
        }
      });
    }
    
    if (card.effects.includes('Textured')) {
      effectLayers.push({
        id: 'texture',
        name: 'Textured Surface',
        type: 'texture',
        position: 7,
        opacity: 0.6,
        visible: true,
        description: 'Embossed or debossed surface pattern',
        material: { 
          name: 'Embossed Pattern', 
          roughness: 0.8
        }
      });
    }
  }
  
  // Combine and sort all layers by position
  return [...baseLayers, ...effectLayers].sort((a, b) => a.position - b.position);
}

// Helper function to generate layer groups
function generateLayerGroups(layers: LayerInfo[]): LayerGroup[] {
  // Find all layer types
  const baseLayerIds = layers
    .filter(l => ['image', 'text', 'border', 'graphic'].includes(l.type))
    .map(l => l.id);
    
  const specialEffectIds = layers
    .filter(l => ['foil', 'texture'].includes(l.type))
    .map(l => l.id);
  
  return [
    {
      id: 'base-group',
      name: 'Base Components',
      layerIds: baseLayerIds,
      isExpanded: true
    },
    {
      id: 'effects-group',
      name: 'Special Effects',
      layerIds: specialEffectIds,
      isExpanded: true
    }
  ];
}

// Helper function to calculate layer positions based on settings
function calculateLayerPositions(layers: LayerInfo[], settings: ExplodedViewSettings) {
  const { active, explosionDistance, explosionType } = settings;
  
  if (!active) {
    // When not active, all layers are at position 0
    return layers.reduce((acc, layer) => {
      acc[layer.id] = { x: 0, y: 0, z: 0 };
      return acc;
    }, {} as Record<string, { x: number, y: number, z: number }>);
  }
  
  return layers.reduce((acc, layer, index) => {
    const layerPosition = { x: 0, y: 0, z: 0 };
    
    // Skip calculation if layer is not visible
    if (!settings.visibleLayerIds.includes(layer.id)) {
      acc[layer.id] = layerPosition;
      return acc;
    }
    
    const layerOffset = (index / (layers.length - 1)) * explosionDistance;
    
    if (explosionType === 'vertical') {
      // Vertical explosion - layers stack upward
      layerPosition.z = layerOffset * 2;
    } 
    else if (explosionType === 'radial') {
      // Radial explosion - layers spread outward
      const angle = (index / layers.length) * Math.PI * 2;
      layerPosition.x = Math.cos(angle) * layerOffset * 0.5;
      layerPosition.y = Math.sin(angle) * layerOffset * 0.5;
      layerPosition.z = layerOffset;
    }
    else if (explosionType === 'custom') {
      // Custom explosion - creates a more artistic spread
      const offsetCoef = (layer.position / (layers.length - 1));
      layerPosition.z = layerOffset;
      
      // Slightly offset x and y based on layer position
      layerPosition.x = (offsetCoef - 0.5) * explosionDistance * 0.3;
      layerPosition.y = (Math.sin(offsetCoef * Math.PI) - 0.5) * explosionDistance * 0.2;
    }
    
    acc[layer.id] = layerPosition;
    return acc;
  }, {} as Record<string, { x: number, y: number, z: number }>);
}
