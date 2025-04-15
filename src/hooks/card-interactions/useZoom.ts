
import { useState, useCallback } from 'react';

export function useZoom() {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(3.0, prev + 0.1));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(0.5, prev - 0.1));
  }, []);

  const handleKeyboardZoom = useCallback((e: KeyboardEvent) => {
    const zoomStep = 0.1;
    const maxZoom = 3.0;
    const minZoom = 0.5;

    switch (e.key) {
      case '+':
      case '=':
        setZoom(prev => Math.min(maxZoom, prev + zoomStep));
        e.preventDefault();
        break;
      case '-':
      case '_':
        setZoom(prev => Math.max(minZoom, prev - zoomStep));
        e.preventDefault();
        break;
    }
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  return {
    zoom,
    handleZoomIn,
    handleZoomOut,
    handleKeyboardZoom,
    resetZoom,
  };
}
