
import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Canvas, Object as FabricObject } from 'fabric';

interface UseFabricKeyboardProps {
  canvas: Canvas | null;
  onSave?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export function useFabricKeyboard({
  canvas,
  onSave,
  onDelete,
  onDuplicate
}: UseFabricKeyboardProps) {
  // Delete selected objects
  const handleDelete = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
      
      // Call the onDelete callback if provided
      if (onDelete) {
        onDelete();
      }
      
      toast("Object deleted");
    }
  }, [canvas, onDelete]);

  // Copy selected objects
  const handleCopy = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    // Store selected object in clipboard
    // Note: This uses a simplified approach. In a real app, you'd serialize the object properly.
    (canvas as any)._clipboard = activeObject;
  }, [canvas]);

  // Paste copied objects
  const handlePaste = useCallback(() => {
    if (!canvas || !(canvas as any)._clipboard) return;
    
    // Clone the clipboard object
    (canvas as any)._clipboard.clone((cloned: FabricObject) => {
      // Position slightly offset from original
      cloned.set({
        left: (cloned.left || 0) + 10,
        top: (cloned.top || 0) + 10,
        evented: true
      });
      
      // If it's a group, remake it a proper group
      if (cloned.type === 'group') {
        (cloned as any).canvas = canvas;
        (cloned as any).forEachObject((obj: FabricObject) => {
          canvas.add(obj);
        });
        (canvas as any).setActiveGroup(cloned as any).renderAll();
      } else {
        canvas.add(cloned);
      }
      
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      
      toast("Object pasted");
    });
  }, [canvas]);

  // Duplicate selected objects
  const handleDuplicate = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    // Clone the active object
    activeObject.clone((cloned: FabricObject) => {
      // Position slightly offset from original
      cloned.set({
        left: (activeObject.left || 0) + 10,
        top: (activeObject.top || 0) + 10,
        evented: true
      });
      
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      
      // Call the onDuplicate callback if provided
      if (onDuplicate) {
        onDuplicate();
      }
      
      toast("Object duplicated");
    });
  }, [canvas, onDuplicate]);

  // Save the canvas
  const handleSave = useCallback(() => {
    if (!onSave) return;
    
    onSave();
    toast("Card saved");
  }, [onSave]);

  // Set up keyboard event listeners
  useEffect(() => {
    if (!canvas) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if focus is on an input field
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement) {
        return;
      }
      
      // Check for key combinations
      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDelete();
      }
      
      if (e.ctrlKey || e.metaKey) { // Ctrl or Command key
        switch (e.key.toLowerCase()) {
          case 'c':
            handleCopy();
            break;
          case 'v':
            handlePaste();
            break;
          case 'd':
            e.preventDefault(); // Prevent browser's bookmark action
            handleDuplicate();
            break;
          case 's':
            e.preventDefault(); // Prevent browser's save action
            handleSave();
            break;
        }
      }
    };
    
    // Add event listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas, handleCopy, handlePaste, handleDelete, handleDuplicate, handleSave]);

  // Return methods for external use
  return {
    copy: handleCopy,
    paste: handlePaste,
    delete: handleDelete,
    duplicate: handleDuplicate,
    save: handleSave
  };
}
