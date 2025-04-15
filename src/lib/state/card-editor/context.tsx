
import React, { useCallback } from 'react';
import { createStateContext } from '../createStateContext';
import { cardEditorReducer, initialCardEditorState } from './reducer';
import { CardEditorAction, cardEditorActions } from './actions';
import { CardDesignState } from './types';
import { CardLayer } from '@/components/card-creation/CardCreator';
import { useMemo } from 'react';

// Create context with reducer
const { StateProvider, useState } = createStateContext(
  cardEditorReducer,
  initialCardEditorState,
  'CardEditorContext'
);

// Create a provider component with additional methods
export const CardEditorProvider: React.FC<{
  children: React.ReactNode;
  initialCard?: any;
}> = ({ children, initialCard }) => {
  // If initial card is provided, we'll load it
  const initialStateOverride = initialCard ? undefined : undefined;

  return (
    <StateProvider initialStateOverride={initialStateOverride}>
      {initialCard ? <CardLoader card={initialCard} /> : null}
      {children}
    </StateProvider>
  );
};

// Helper component to load initial card data
const CardLoader: React.FC<{ card: any }> = ({ card }) => {
  const { dispatch } = useState();
  
  React.useEffect(() => {
    dispatch(cardEditorActions.loadCard({ card }));
  }, [card, dispatch]);
  
  return null;
};

// Main hook for card editor state and actions
export function useCardEditor() {
  const { state, dispatch } = useState();
  
  // Design actions
  const updateDesign = useCallback((updates: Partial<CardDesignState>) => {
    dispatch(cardEditorActions.updateDesign({ updates }));
  }, [dispatch]);
  
  // Layer actions
  const addLayer = useCallback((layer: Omit<CardLayer, 'id'>) => {
    dispatch(cardEditorActions.addLayer({ layer }));
  }, [dispatch]);
  
  const updateLayer = useCallback((id: string, updates: Partial<Omit<CardLayer, 'id'>>) => {
    dispatch(cardEditorActions.updateLayer({ id, updates }));
  }, [dispatch]);
  
  const deleteLayer = useCallback((id: string) => {
    dispatch(cardEditorActions.deleteLayer({ id }));
  }, [dispatch]);
  
  const moveLayerUp = useCallback((id: string) => {
    dispatch(cardEditorActions.reorderLayer({ id, direction: 'up' }));
  }, [dispatch]);
  
  const moveLayerDown = useCallback((id: string) => {
    dispatch(cardEditorActions.reorderLayer({ id, direction: 'down' }));
  }, [dispatch]);
  
  const setActiveLayer = useCallback((id: string | null) => {
    dispatch(cardEditorActions.setActiveLayer({ id }));
  }, [dispatch]);
  
  // Effect actions
  const toggleEffect = useCallback((effectId: string, active: boolean) => {
    dispatch(cardEditorActions.toggleEffect({ effectId, active }));
  }, [dispatch]);
  
  // Navigation actions
  const setCurrentStep = useCallback((step: number) => {
    dispatch(cardEditorActions.setCurrentStep({ step }));
  }, [dispatch]);
  
  // History actions
  const undo = useCallback(() => {
    dispatch(cardEditorActions.undo());
  }, [dispatch]);
  
  const redo = useCallback(() => {
    dispatch(cardEditorActions.redo());
  }, [dispatch]);
  
  // Save status
  const setSaving = useCallback((saving: boolean) => {
    dispatch(cardEditorActions.setSaving({ saving }));
  }, [dispatch]);
  
  // Reset editor
  const resetEditor = useCallback(() => {
    dispatch(cardEditorActions.resetEditor());
  }, [dispatch]);
  
  // Get card data for saving
  const getCardData = useCallback(() => {
    const { design, layers, effectsApplied } = state;
    
    return {
      title: design.title,
      description: design.description,
      imageUrl: design.imageUrl,
      tags: design.tags,
      layers,
      designMetadata: {
        cardStyle: {
          borderColor: design.borderColor,
          backgroundColor: design.backgroundColor,
          borderRadius: design.borderRadius,
        },
        effects: effectsApplied,
        player: design.player,
        team: design.team,
        year: design.year,
        cardType: design.cardType
      }
    };
  }, [state]);
  
  // Computed properties
  const canUndo = state.history.past.length > 0;
  const canRedo = state.history.future.length > 0;
  
  return {
    // State
    ...state,
    design: state.design,
    layers: state.layers,
    activeLayer: state.activeLayerId ? state.layers.find(l => l.id === state.activeLayerId) : null,
    effectsApplied: state.effectsApplied,
    
    // Design actions
    updateDesign,
    
    // Layer actions
    addLayer,
    updateLayer,
    deleteLayer,
    moveLayerUp,
    moveLayerDown,
    setActiveLayer,
    
    // Effect actions
    toggleEffect,
    
    // Navigation
    setCurrentStep,
    
    // History actions
    undo,
    redo,
    canUndo,
    canRedo,
    
    // Save related
    setSaving,
    resetEditor,
    getCardData
  };
}
