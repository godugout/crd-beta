
import { CardLayer, Position, Size } from '@/components/card-creation/CardCreator';

// Card editor state types
export interface CardDesignState {
  title: string;
  description: string;
  tags: string[];
  borderColor: string;
  backgroundColor: string;
  borderRadius: string;
  imageUrl: string | null;
  player?: string;
  team?: string;
  year?: string;
  cardType?: string;
}

export interface CardEditorState {
  id: string | null;
  isNew: boolean;
  currentStep: number;
  isDirty: boolean;
  isSaving: boolean;
  history: CardEditorHistoryState;
  design: CardDesignState;
  layers: CardLayer[];
  activeLayerId: string | null;
  effectsApplied: string[];
  metadata: Record<string, any>;
}

export interface CardEditorHistoryState {
  past: Partial<CardEditorState>[];
  future: Partial<CardEditorState>[];
}

// Base action types
export enum CardEditorActionTypes {
  SET_DESIGN = 'cardEditor/SET_DESIGN',
  UPDATE_DESIGN = 'cardEditor/UPDATE_DESIGN',
  ADD_LAYER = 'cardEditor/ADD_LAYER',
  UPDATE_LAYER = 'cardEditor/UPDATE_LAYER',
  DELETE_LAYER = 'cardEditor/DELETE_LAYER',
  REORDER_LAYER = 'cardEditor/REORDER_LAYER',
  SET_ACTIVE_LAYER = 'cardEditor/SET_ACTIVE_LAYER',
  TOGGLE_EFFECT = 'cardEditor/TOGGLE_EFFECT',
  SET_CURRENT_STEP = 'cardEditor/SET_CURRENT_STEP',
  SET_SAVING = 'cardEditor/SET_SAVING',
  RESET_EDITOR = 'cardEditor/RESET_EDITOR',
  LOAD_CARD = 'cardEditor/LOAD_CARD',
  UNDO = 'cardEditor/UNDO',
  REDO = 'cardEditor/REDO'
}

// Payload types for actions
export interface SetDesignPayload {
  design: CardDesignState;
}

export interface UpdateDesignPayload {
  updates: Partial<CardDesignState>;
}

export interface AddLayerPayload {
  layer: Omit<CardLayer, 'id'>;
}

export interface UpdateLayerPayload {
  id: string;
  updates: Partial<Omit<CardLayer, 'id'>>;
}

export interface DeleteLayerPayload {
  id: string;
}

export interface ReorderLayerPayload {
  id: string;
  direction: 'up' | 'down';
}

export interface SetActiveLayerPayload {
  id: string | null;
}

export interface ToggleEffectPayload {
  effectId: string;
  active: boolean;
}

export interface SetCurrentStepPayload {
  step: number;
}

export interface SetSavingPayload {
  saving: boolean;
}

export interface LoadCardPayload {
  card: any;
}

// No payload for UNDO, REDO, RESET_EDITOR
