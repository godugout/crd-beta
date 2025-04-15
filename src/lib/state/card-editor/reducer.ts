
import { v4 as uuidv4 } from 'uuid';
import { CardEditorState, CardEditorActionTypes } from './types';
import { CardEditorAction } from './actions';
import { CardLayer } from '@/components/card-creation/CardCreator';

// Initial state for the card editor
export const initialCardEditorState: CardEditorState = {
  id: null,
  isNew: true,
  currentStep: 0,
  isDirty: false,
  isSaving: false,
  history: {
    past: [],
    future: []
  },
  design: {
    title: '',
    description: '',
    tags: [],
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    imageUrl: null
  },
  layers: [],
  activeLayerId: null,
  effectsApplied: [],
  metadata: {}
};

// Helper to create a snapshot of the current state for history
const createHistoryPoint = (state: CardEditorState): Partial<CardEditorState> => {
  const { history, ...stateWithoutHistory } = state;
  return stateWithoutHistory;
};

// Main reducer function
export const cardEditorReducer = (state: CardEditorState, action: CardEditorAction): CardEditorState => {
  switch (action.type) {
    case CardEditorActionTypes.SET_DESIGN:
      return {
        ...state,
        history: {
          past: [...state.history.past, createHistoryPoint(state)],
          future: []
        },
        design: action.payload.design,
        isDirty: true
      };
      
    case CardEditorActionTypes.UPDATE_DESIGN:
      return {
        ...state,
        history: {
          past: [...state.history.past, createHistoryPoint(state)],
          future: []
        },
        design: {
          ...state.design,
          ...action.payload.updates
        },
        isDirty: true
      };
      
    case CardEditorActionTypes.ADD_LAYER: {
      const newLayer: CardLayer = {
        ...action.payload.layer,
        id: uuidv4()
      };
      
      return {
        ...state,
        history: {
          past: [...state.history.past, createHistoryPoint(state)],
          future: []
        },
        layers: [...state.layers, newLayer],
        activeLayerId: newLayer.id,
        isDirty: true
      };
    }
      
    case CardEditorActionTypes.UPDATE_LAYER: {
      const updatedLayers = state.layers.map(layer => 
        layer.id === action.payload.id
          ? { ...layer, ...action.payload.updates }
          : layer
      );
      
      return {
        ...state,
        history: {
          past: [...state.history.past, createHistoryPoint(state)],
          future: []
        },
        layers: updatedLayers,
        isDirty: true
      };
    }
      
    case CardEditorActionTypes.DELETE_LAYER: {
      const filteredLayers = state.layers.filter(layer => layer.id !== action.payload.id);
      const newActiveLayerId = 
        state.activeLayerId === action.payload.id
          ? filteredLayers.length > 0 ? filteredLayers[0].id : null
          : state.activeLayerId;
      
      return {
        ...state,
        history: {
          past: [...state.history.past, createHistoryPoint(state)],
          future: []
        },
        layers: filteredLayers,
        activeLayerId: newActiveLayerId,
        isDirty: true
      };
    }
      
    case CardEditorActionTypes.REORDER_LAYER: {
      const { id, direction } = action.payload;
      const index = state.layers.findIndex(layer => layer.id === id);
      
      if (index === -1) return state;
      
      const newIndex = direction === 'up' 
        ? Math.max(0, index - 1) 
        : Math.min(state.layers.length - 1, index + 1);
      
      if (newIndex === index) return state;
      
      const newLayers = [...state.layers];
      const [movedLayer] = newLayers.splice(index, 1);
      newLayers.splice(newIndex, 0, movedLayer);
      
      // Update z-index based on array position
      const layersWithUpdatedZ = newLayers.map((layer, idx) => ({
        ...layer,
        position: {
          ...layer.position,
          z: newLayers.length - idx // Highest index = top layer
        }
      }));
      
      return {
        ...state,
        history: {
          past: [...state.history.past, createHistoryPoint(state)],
          future: []
        },
        layers: layersWithUpdatedZ,
        isDirty: true
      };
    }
      
    case CardEditorActionTypes.SET_ACTIVE_LAYER:
      return {
        ...state,
        activeLayerId: action.payload.id
      };
      
    case CardEditorActionTypes.TOGGLE_EFFECT: {
      const { effectId, active } = action.payload;
      
      const newEffects = active
        ? [...state.effectsApplied, effectId]
        : state.effectsApplied.filter(id => id !== effectId);
      
      return {
        ...state,
        history: {
          past: [...state.history.past, createHistoryPoint(state)],
          future: []
        },
        effectsApplied: newEffects,
        isDirty: true
      };
    }
      
    case CardEditorActionTypes.SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload.step
      };
      
    case CardEditorActionTypes.SET_SAVING:
      return {
        ...state,
        isSaving: action.payload.saving
      };
      
    case CardEditorActionTypes.RESET_EDITOR:
      return {
        ...initialCardEditorState,
        history: {
          past: [],
          future: []
        }
      };
      
    case CardEditorActionTypes.LOAD_CARD: {
      const { card } = action.payload;
      
      // Extract card data and convert to editor state
      return {
        ...initialCardEditorState,
        id: card.id || null,
        isNew: !card.id,
        design: {
          title: card.title || '',
          description: card.description || '',
          tags: card.tags || [],
          borderColor: card.designMetadata?.cardStyle?.borderColor || '#000000',
          backgroundColor: card.designMetadata?.cardStyle?.backgroundColor || '#FFFFFF',
          borderRadius: card.designMetadata?.cardStyle?.borderRadius || '8px',
          imageUrl: card.imageUrl || null,
          player: card.designMetadata?.player || '',
          team: card.designMetadata?.team || '',
          year: card.designMetadata?.year || '',
          cardType: card.designMetadata?.cardType || 'standard'
        },
        layers: card.layers || [],
        effectsApplied: card.designMetadata?.effects || [],
        history: {
          past: [],
          future: []
        },
        isDirty: false
      };
    }
      
    case CardEditorActionTypes.UNDO: {
      if (state.history.past.length === 0) return state;
      
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);
      
      // Create a snapshot of the current state without history
      const { history, ...currentWithoutHistory } = state;
      
      return {
        ...state,
        ...previous,
        history: {
          past: newPast,
          future: [currentWithoutHistory, ...state.history.future]
        },
        isDirty: true
      };
    }
      
    case CardEditorActionTypes.REDO: {
      if (state.history.future.length === 0) return state;
      
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      
      // Create a snapshot of the current state without history
      const { history, ...currentWithoutHistory } = state;
      
      return {
        ...state,
        ...next,
        history: {
          past: [...state.history.past, currentWithoutHistory],
          future: newFuture
        },
        isDirty: true
      };
    }
      
    default:
      return state;
  }
};
