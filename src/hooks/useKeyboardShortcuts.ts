
import { useEffect } from 'react';

interface KeyboardShortcutsOptions {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onDelete: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useKeyboardShortcuts = ({
  onUndo,
  onRedo,
  onSave,
  onZoomIn,
  onZoomOut,
  onResetView,
  onDelete,
  canUndo,
  canRedo
}: KeyboardShortcutsOptions) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const { ctrlKey, metaKey, shiftKey, key } = e;
      const cmdOrCtrl = ctrlKey || metaKey;

      switch (key) {
        case 'z':
        case 'Z':
          if (cmdOrCtrl && !shiftKey && canUndo) {
            e.preventDefault();
            onUndo();
          } else if ((cmdOrCtrl && shiftKey) || (cmdOrCtrl && key === 'Y')) {
            if (canRedo) {
              e.preventDefault();
              onRedo();
            }
          }
          break;
        
        case 'y':
        case 'Y':
          if (cmdOrCtrl && canRedo) {
            e.preventDefault();
            onRedo();
          }
          break;
        
        case 's':
        case 'S':
          if (cmdOrCtrl) {
            e.preventDefault();
            onSave();
          }
          break;
        
        case '=':
        case '+':
          if (cmdOrCtrl) {
            e.preventDefault();
            onZoomIn();
          }
          break;
        
        case '-':
        case '_':
          if (cmdOrCtrl) {
            e.preventDefault();
            onZoomOut();
          }
          break;
        
        case '0':
          if (cmdOrCtrl) {
            e.preventDefault();
            onResetView();
          }
          break;
        
        case 'Delete':
        case 'Backspace':
          onDelete();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, onSave, onZoomIn, onZoomOut, onResetView, onDelete, canUndo, canRedo]);
};
