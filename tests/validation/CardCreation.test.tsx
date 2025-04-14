
import React from 'react';
import { render } from '@testing-library/react';
import { CardDesignState, CardLayer, CardEffect } from '@/components/card-creation/types/cardTypes';
import CardCreator from '@/components/card-creation/CardCreator';
import { useLayers } from '@/components/card-creation/hooks/useLayers';
import { useCardEffectsStack } from '@/components/card-creation/hooks/useCardEffectsStack';

// Mock hooks
jest.mock('@/components/card-creation/hooks/useLayers');
jest.mock('@/components/card-creation/hooks/useCardEffectsStack');

describe('Card Creation Module', () => {
  beforeEach(() => {
    (useLayers as jest.Mock).mockReturnValue({
      layers: [],
      activeLayerId: null,
      addLayer: jest.fn(),
      updateLayer: jest.fn(),
      deleteLayer: jest.fn(),
      moveLayerUp: jest.fn(),
      moveLayerDown: jest.fn(),
      setActiveLayer: jest.fn(),
      setLayers: jest.fn()
    });
    
    (useCardEffectsStack as jest.Mock).mockReturnValue({
      activeEffects: [],
      setActiveEffects: jest.fn(),
      addEffect: jest.fn(),
      removeEffect: jest.fn(),
      toggleEffect: jest.fn(),
      updateEffectSettings: jest.fn(),
      getEffectSettings: jest.fn(),
      effectStack: [],
      getEffectClasses: jest.fn()
    });
  });
  
  test('CardDesignState should have all required properties', () => {
    const cardDesign: CardDesignState = {
      title: 'Test Card',
      description: 'Test Description',
      tags: ['tag1', 'tag2'],
      borderColor: '#000',
      backgroundColor: '#fff',
      borderRadius: '10px',
      imageUrl: null
    };
    
    expect(cardDesign.title).toBeDefined();
    expect(cardDesign.description).toBeDefined();
    expect(cardDesign.tags).toBeInstanceOf(Array);
    expect(cardDesign.borderColor).toBeDefined();
    expect(cardDesign.backgroundColor).toBeDefined();
    expect(cardDesign.borderRadius).toBeDefined();
    // imageUrl can be null but should be defined
    expect('imageUrl' in cardDesign).toBeTruthy();
  });
  
  test('CardLayer should have position with x, y, and z properties', () => {
    const layer: CardLayer = {
      id: '123',
      type: 'text',
      content: 'Test content',
      position: { x: 10, y: 20, z: 1 },
      size: { width: 100, height: 50 },
      rotation: 0,
      opacity: 1,
      zIndex: 1
    };
    
    expect(layer.position.x).toBeDefined();
    expect(layer.position.y).toBeDefined();
    expect(layer.position.z).toBeDefined();
    expect(typeof layer.position.x).toBe('number');
    expect(typeof layer.position.y).toBe('number');
    expect(typeof layer.position.z).toBe('number');
  });
  
  test('CardEffect should have all required properties', () => {
    const effect: CardEffect = {
      id: '123',
      name: 'Test Effect',
      enabled: true,
      settings: { intensity: 0.5 }
    };
    
    expect(effect.id).toBeDefined();
    expect(effect.name).toBeDefined();
    expect(effect.enabled).toBeDefined();
    expect(effect.settings).toBeDefined();
  });
});
