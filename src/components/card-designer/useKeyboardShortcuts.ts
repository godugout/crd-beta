
import { useHotkeys } from 'react-hotkeys-hook';

interface KeyboardShortcutOptions {
  onAddLayer?: (type: 'image' | 'text' | 'shape' | 'sticker' | 'effect') => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
}

/**
 * Hook to add keyboard shortcuts to the card designer
 */
export function useKeyboardShortcuts({
  onAddLayer,
  onDelete,
  onCopy,
  onPaste,
  onUndo,
  onRedo,
  onSave
}: KeyboardShortcutOptions) {
  // Add element shortcuts
  useHotkeys('ctrl+i', (e) => {
    e.preventDefault();
    onAddLayer && onAddLayer('image');
  }, { enableOnTags: ['INPUT', 'TEXTAREA'] }, [onAddLayer]);
  
  useHotkeys('ctrl+t', (e) => {
    e.preventDefault();
    onAddLayer && onAddLayer('text');
  }, { enableOnTags: ['INPUT', 'TEXTAREA'] }, [onAddLayer]);
  
  useHotkeys('ctrl+s', (e) => {
    e.preventDefault();
    if (e.shiftKey) {
      // Ctrl+Shift+S for save
      onSave && onSave();
    } else {
      // Ctrl+S for shape
      onAddLayer && onAddLayer('shape');
    }
  }, { enableOnTags: ['INPUT', 'TEXTAREA'] }, [onAddLayer, onSave]);
  
  useHotkeys('ctrl+k', (e) => {
    e.preventDefault();
    onAddLayer && onAddLayer('sticker');
  }, { enableOnTags: ['INPUT', 'TEXTAREA'] }, [onAddLayer]);
  
  // Clipboard shortcuts
  useHotkeys('ctrl+c', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return; // Don't override default copy in text fields
    }
    e.preventDefault();
    onCopy && onCopy();
  }, [onCopy]);
  
  useHotkeys('ctrl+v', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return; // Don't override default paste in text fields
    }
    e.preventDefault();
    onPaste && onPaste();
  }, [onPaste]);
  
  // Delete shortcut
  useHotkeys('delete, backspace', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return; // Don't override default delete in text fields
    }
    e.preventDefault();
    onDelete && onDelete();
  }, [onDelete]);
  
  // History shortcuts
  useHotkeys('ctrl+z', (e) => {
    e.preventDefault();
    onUndo && onUndo();
  }, { enableOnTags: ['INPUT', 'TEXTAREA'] }, [onUndo]);
  
  useHotkeys('ctrl+y, ctrl+shift+z', (e) => {
    e.preventDefault();
    onRedo && onRedo();
  }, { enableOnTags: ['INPUT', 'TEXTAREA'] }, [onRedo]);
}
