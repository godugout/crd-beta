import { useState, useCallback, useRef, useEffect } from 'react';
import { ExtendedCanvas } from '@/types/extendedCanvas';
import { toast } from 'sonner';

export interface ImageEditorState {
  canvas: ExtendedCanvas | null;
  zoom: number;
  rotation: number;
  brightness: number;
  contrast: number;
  saturation: number;
  history: ImageHistoryState[];
  historyIndex: number;
  isDirty: boolean;
}

export interface ImageHistoryState {
  imageData: ImageData;
  zoom: number;
  rotation: number;
  brightness: number;
  contrast: number;
  saturation: number;
}

export const useImageEditorState = (initialCanvas: ExtendedCanvas | null) => {
  const [state, setState] = useState<ImageEditorState>({
    canvas: initialCanvas,
    zoom: 1,
    rotation: 0,
    brightness: 0,
    contrast: 0,
    saturation: 0,
    history: [],
    historyIndex: -1,
    isDirty: false,
  });
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Initialize canvas and context
  useEffect(() => {
    if (state.canvas) {
      canvasRef.current = state.canvas;
      ctxRef.current = state.canvas.getContext('2d');
      
      // If no history, initialize with current state
      if (state.history.length === 0 && ctxRef.current) {
        const imageData = ctxRef.current.getImageData(
          0, 0, state.canvas.width, state.canvas.height
        );
        
        setState(prev => ({
          ...prev,
          history: [{
            imageData,
            zoom: prev.zoom,
            rotation: prev.rotation,
            brightness: prev.brightness,
            contrast: prev.contrast,
            saturation: prev.saturation,
          }],
          historyIndex: 0,
        }));
      }
    }
  }, [state.canvas]);
  
  const setCanvas = useCallback((newCanvas: ExtendedCanvas | null) => {
    setState(prev => ({
      ...prev,
      canvas: newCanvas,
      history: [],
      historyIndex: -1,
      isDirty: false,
    }));
  }, []);
  
  const applyChanges = useCallback(() => {
    if (!state.canvas || !ctxRef.current) return;
    
    // Apply current adjustments to canvas
    const ctx = ctxRef.current;
    const { brightness, contrast, saturation, rotation } = state;
    
    // Get original image data from history
    const originalState = state.history[0];
    if (!originalState) return;
    
    // Create a temporary canvas to work with
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = state.canvas.width;
    tempCanvas.height = state.canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    // Put original image data
    tempCtx.putImageData(originalState.imageData, 0, 0);
    
    // Clear main canvas
    ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
    
    // Apply rotation
    if (rotation !== 0) {
      ctx.save();
      ctx.translate(state.canvas.width / 2, state.canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(
        tempCanvas,
        -state.canvas.width / 2,
        -state.canvas.height / 2
      );
      ctx.restore();
    } else {
      ctx.drawImage(tempCanvas, 0, 0);
    }
    
    // Apply filters
    if (brightness !== 0 || contrast !== 0 || saturation !== 0) {
      const imageData = ctx.getImageData(0, 0, state.canvas.width, state.canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        // Apply brightness
        if (brightness !== 0) {
          data[i] += brightness;     // R
          data[i + 1] += brightness; // G
          data[i + 2] += brightness; // B
        }
        
        // Apply contrast
        if (contrast !== 0) {
          const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
          data[i] = factor * (data[i] - 128) + 128;         // R
          data[i + 1] = factor * (data[i + 1] - 128) + 128; // G
          data[i + 2] = factor * (data[i + 2] - 128) + 128; // B
        }
        
        // Apply saturation
        if (saturation !== 0) {
          const gray = 0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          const factor = 1 + saturation / 100;
          
          data[i] = Math.min(255, Math.max(0, gray + factor * (data[i] - gray)));
          data[i + 1] = Math.min(255, Math.max(0, gray + factor * (data[i + 1] - gray)));
          data[i + 2] = Math.min(255, Math.max(0, gray + factor * (data[i + 2] - gray)));
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    }
    
    // Update canvas URL and file
    state.canvas.url = state.canvas.toDataURL('image/jpeg');
    state.canvas.toBlob(blob => {
      if (blob && state.canvas) {
        state.canvas.file = new File([blob], `edited-${Date.now()}.jpg`, { type: 'image/jpeg' });
      }
    }, 'image/jpeg');
    
    return state.canvas;
  }, [state]);
  
  const saveChanges = useCallback(() => {
    if (!state.canvas) {
      toast.error('No canvas to save');
      return null;
    }
    
    const updatedCanvas = applyChanges();
    if (!updatedCanvas) {
      toast.error('Failed to apply changes');
      return null;
    }
    
    return {
      canvas: updatedCanvas,
      file: updatedCanvas.file,
      url: updatedCanvas.url,
      metadata: {
        ...updatedCanvas.metadata,
        adjustments: {
          brightness: state.brightness,
          contrast: state.contrast,
          saturation: state.saturation,
          rotation: state.rotation,
          zoom: state.zoom,
        }
      },
    };
  }, [state, applyChanges]);
  
  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({
      ...prev,
      zoom,
      isDirty: true,
    }));
  }, []);
  
  const setRotation = useCallback((rotation: number) => {
    setState(prev => ({
      ...prev,
      rotation,
      isDirty: true,
    }));
  }, []);
  
  const setBrightness = useCallback((brightness: number) => {
    setState(prev => ({
      ...prev,
      brightness,
      isDirty: true,
    }));
  }, []);
  
  const setContrast = useCallback((contrast: number) => {
    setState(prev => ({
      ...prev,
      contrast,
      isDirty: true,
    }));
  }, []);
  
  const setSaturation = useCallback((saturation: number) => {
    setState(prev => ({
      ...prev,
      saturation,
      isDirty: true,
    }));
  }, []);
  
  const addHistoryState = useCallback(() => {
    if (!state.canvas || !ctxRef.current) return;
    
    const imageData = ctxRef.current.getImageData(
      0, 0, state.canvas.width, state.canvas.height
    );
    
    const newState: ImageHistoryState = {
      imageData,
      zoom: state.zoom,
      rotation: state.rotation,
      brightness: state.brightness,
      contrast: state.contrast,
      saturation: state.saturation,
    };
    
    setState(prev => {
      // Remove any future history states if we're not at the end
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      
      return {
        ...prev,
        history: [...newHistory, newState],
        historyIndex: newHistory.length,
        isDirty: true,
      };
    });
  }, [state]);
  
  const undo = useCallback(() => {
    if (state.historyIndex <= 0) return;
    
    setState(prev => ({
      ...prev,
      historyIndex: prev.historyIndex - 1,
      isDirty: true,
    }));
    
    // Apply the previous state
    const prevState = state.history[state.historyIndex - 1];
    if (prevState && state.canvas && ctxRef.current) {
      ctxRef.current.putImageData(prevState.imageData, 0, 0);
      
      setState(prev => ({
        ...prev,
        zoom: prevState.zoom,
        rotation: prevState.rotation,
        brightness: prevState.brightness,
        contrast: prevState.contrast,
        saturation: prevState.saturation,
      }));
    }
  }, [state]);
  
  const redo = useCallback(() => {
    if (state.historyIndex >= state.history.length - 1) return;
    
    setState(prev => ({
      ...prev,
      historyIndex: prev.historyIndex + 1,
      isDirty: true,
    }));
    
    // Apply the next state
    const nextState = state.history[state.historyIndex + 1];
    if (nextState && state.canvas && ctxRef.current) {
      ctxRef.current.putImageData(nextState.imageData, 0, 0);
      
      setState(prev => ({
        ...prev,
        zoom: nextState.zoom,
        rotation: nextState.rotation,
        brightness: nextState.brightness,
        contrast: nextState.contrast,
        saturation: nextState.saturation,
      }));
    }
  }, [state]);
  
  const resetChanges = useCallback(() => {
    if (state.history.length === 0 || !state.canvas || !ctxRef.current) return;
    
    // Reset to initial state
    const initialState = state.history[0];
    ctxRef.current.putImageData(initialState.imageData, 0, 0);
    
    setState(prev => ({
      ...prev,
      zoom: initialState.zoom,
      rotation: initialState.rotation,
      brightness: initialState.brightness,
      contrast: initialState.contrast,
      saturation: initialState.saturation,
      historyIndex: 0,
      isDirty: false,
    }));
  }, [state]);
  
  return {
    canvas: state.canvas,
    zoom: state.zoom,
    rotation: state.rotation,
    brightness: state.brightness,
    contrast: state.contrast,
    saturation: state.saturation,
    isDirty: state.isDirty,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    setCanvas,
    setZoom,
    setRotation,
    setBrightness,
    setContrast,
    setSaturation,
    applyChanges,
    saveChanges,
    addHistoryState,
    undo,
    redo,
    resetChanges,
  };
};

export default useImageEditorState;
