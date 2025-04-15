
import { createAction } from '../actionCreators';
import { CardEditorActionTypes, SetDesignPayload, UpdateDesignPayload, AddLayerPayload, UpdateLayerPayload, DeleteLayerPayload, ReorderLayerPayload, SetActiveLayerPayload, ToggleEffectPayload, SetCurrentStepPayload, SetSavingPayload, LoadCardPayload } from './types';

// Create typed action creators
export const cardEditorActions = {
  setDesign: createAction<SetDesignPayload, CardEditorActionTypes.SET_DESIGN>(CardEditorActionTypes.SET_DESIGN),
  updateDesign: createAction<UpdateDesignPayload, CardEditorActionTypes.UPDATE_DESIGN>(CardEditorActionTypes.UPDATE_DESIGN),
  addLayer: createAction<AddLayerPayload, CardEditorActionTypes.ADD_LAYER>(CardEditorActionTypes.ADD_LAYER),
  updateLayer: createAction<UpdateLayerPayload, CardEditorActionTypes.UPDATE_LAYER>(CardEditorActionTypes.UPDATE_LAYER),
  deleteLayer: createAction<DeleteLayerPayload, CardEditorActionTypes.DELETE_LAYER>(CardEditorActionTypes.DELETE_LAYER),
  reorderLayer: createAction<ReorderLayerPayload, CardEditorActionTypes.REORDER_LAYER>(CardEditorActionTypes.REORDER_LAYER),
  setActiveLayer: createAction<SetActiveLayerPayload, CardEditorActionTypes.SET_ACTIVE_LAYER>(CardEditorActionTypes.SET_ACTIVE_LAYER),
  toggleEffect: createAction<ToggleEffectPayload, CardEditorActionTypes.TOGGLE_EFFECT>(CardEditorActionTypes.TOGGLE_EFFECT),
  setCurrentStep: createAction<SetCurrentStepPayload, CardEditorActionTypes.SET_CURRENT_STEP>(CardEditorActionTypes.SET_CURRENT_STEP),
  setSaving: createAction<SetSavingPayload, CardEditorActionTypes.SET_SAVING>(CardEditorActionTypes.SET_SAVING),
  loadCard: createAction<LoadCardPayload, CardEditorActionTypes.LOAD_CARD>(CardEditorActionTypes.LOAD_CARD),
  resetEditor: createAction<void, CardEditorActionTypes.RESET_EDITOR>(CardEditorActionTypes.RESET_EDITOR),
  undo: createAction<void, CardEditorActionTypes.UNDO>(CardEditorActionTypes.UNDO),
  redo: createAction<void, CardEditorActionTypes.REDO>(CardEditorActionTypes.REDO)
};

// Type representing all possible card editor actions
export type CardEditorAction = ReturnType<typeof cardEditorActions[keyof typeof cardEditorActions]>;
