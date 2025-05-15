
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CardLayer } from './types/cardTypes';
import { PlusCircle, Trash2, Lock, Unlock, Copy, EyeOff, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useHotkeys } from 'react-hotkeys-hook';

interface InteractiveCanvasProps {
  layers: CardLayer[];
  activeLayerId: string | null;
  effectClasses?: string;
  onSelectLayer: (id: string) => void;
  onUpdateLayer: (id: string, updates: Partial<CardLayer>) => void;
  onDeleteLayer?: (id: string) => void;
  onDuplicateLayer?: (id: string) => void;
  onAddLayer?: (type: 'image' | 'text' | 'shape') => void;
  cardBackground?: string;
  readOnly?: boolean;
}

const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  layers,
  activeLayerId,
  effectClasses = '',
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onAddLayer,
  cardBackground,
  readOnly = false
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Card dimensions (using standard trading card aspect ratio)
  const cardWidth = 400; // Base width in pixels
  const cardHeight = 560; // Base height (using 2.5" x 3.5" ratio)
  
  // State to track which layer is being resized and from which handle
  const [resizing, setResizing] = useState<{
    layerId: string | null;
    handle: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null;
  }>({ layerId: null, handle: null });

  // Get active layer
  const activeLayer = layers.find(layer => layer.id === activeLayerId);

  // Handle keyboard shortcuts
  useHotkeys('delete, backspace', () => {
    if (activeLayerId && onDeleteLayer) {
      onDeleteLayer(activeLayerId);
    }
  }, [activeLayerId, onDeleteLayer]);

  useHotkeys('ctrl+d, cmd+d', (e) => {
    e.preventDefault();
    if (activeLayerId && onDuplicateLayer) {
      onDuplicateLayer(activeLayerId);
    }
  }, [activeLayerId, onDuplicateLayer]);

  useHotkeys('ctrl+c, cmd+c', (e) => {
    // Copy implementation would go here
    // We can use the clipboard API to serialize the layer
  }, [activeLayerId]);

  useHotkeys('ctrl+v, cmd+v', (e) => {
    // Paste implementation would go here
  }, []);

  // Handler for starting layer drag
  const handleLayerMouseDown = (e: React.MouseEvent, layerId: string) => {
    if (readOnly) return;
    
    e.stopPropagation();
    if (!activeLayerId || activeLayerId !== layerId) {
      onSelectLayer(layerId);
    }

    const layer = layers.find(l => l.id === layerId);
    if (layer?.locked) return;

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse move for dragging
  useEffect(() => {
    if (!isDragging || !activeLayerId || readOnly) return;

    const layer = layers.find(l => l.id === activeLayerId);
    if (!layer || layer.locked) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;

      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const scaleX = cardWidth / canvasRect.width;
      const scaleY = cardHeight / canvasRect.height;

      onUpdateLayer(activeLayerId, {
        position: {
          x: layer.position.x + (dx * scaleX),
          y: layer.position.y + (dy * scaleY),
          z: layer.position.z
        }
      });

      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, activeLayerId, layers, onUpdateLayer, readOnly]);

  // Handle resize start
  const handleResizeStart = (
    e: React.MouseEvent,
    layerId: string,
    handle: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  ) => {
    if (readOnly) return;
    e.stopPropagation();
    e.preventDefault();
    
    const layer = layers.find(l => l.id === layerId);
    if (layer?.locked) return;

    setResizing({ layerId, handle });
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle resize
  useEffect(() => {
    if (!resizing.layerId || !resizing.handle || readOnly) return;

    const layer = layers.find(l => l.id === resizing.layerId);
    if (!layer || layer.locked) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;

      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const scaleX = cardWidth / canvasRect.width;
      const scaleY = cardHeight / canvasRect.height;
      
      const scaledDx = dx * scaleX;
      const scaledDy = dy * scaleY;

      // Calculate new width and height based on which handle is being dragged
      let newWidth = typeof layer.size.width === 'number' ? layer.size.width : 100;
      let newHeight = typeof layer.size.height === 'number' ? layer.size.height : 100;
      let newX = layer.position.x;
      let newY = layer.position.y;

      switch(resizing.handle) {
        case 'top-left':
          newWidth = newWidth - scaledDx;
          newHeight = newHeight - scaledDy;
          newX = newX + scaledDx / 2;
          newY = newY + scaledDy / 2;
          break;
        case 'top-right':
          newWidth = newWidth + scaledDx;
          newHeight = newHeight - scaledDy;
          newX = newX + scaledDx / 2;
          newY = newY + scaledDy / 2;
          break;
        case 'bottom-left':
          newWidth = newWidth - scaledDx;
          newHeight = newHeight + scaledDy;
          newX = newX + scaledDx / 2;
          newY = newY + scaledDy / 2;
          break;
        case 'bottom-right':
          newWidth = newWidth + scaledDx;
          newHeight = newHeight + scaledDy;
          newX = newX + scaledDx / 2;
          newY = newY + scaledDy / 2;
          break;
      }

      // Ensure minimum size
      newWidth = Math.max(20, newWidth);
      newHeight = Math.max(20, newHeight);

      onUpdateLayer(resizing.layerId, {
        size: {
          width: newWidth,
          height: newHeight
        },
        position: {
          x: newX,
          y: newY,
          z: layer.position.z
        }
      });

      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setResizing({ layerId: null, handle: null });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, dragStart, layers, onUpdateLayer, readOnly]);

  // Render a single layer
  const renderLayer = (layer: CardLayer) => {
    if (!layer.visible) return null;
    
    const isActive = layer.id === activeLayerId;
    
    const layerStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${layer.position.x}px`,
      top: `${layer.position.y}px`,
      zIndex: layer.position.z,
      transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
      opacity: layer.opacity,
      width: typeof layer.size.width === 'number' ? `${layer.size.width}px` : layer.size.width,
      height: typeof layer.size.height === 'number' ? `${layer.size.height}px` : layer.size.height,
      cursor: layer.locked ? 'default' : 'move',
      userSelect: 'none',
    };
    
    return (
      <div
        key={layer.id}
        style={layerStyle}
        onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
        className={cn(
          "layer",
          isActive && !readOnly && "ring-2 ring-offset-2 ring-blue-500",
          layer.locked && "opacity-80"
        )}
        data-layer-id={layer.id}
      >
        {/* Layer content based on type */}
        {renderLayerContent(layer)}
        
        {/* Resize handles (only show for active, unlocked layers) */}
        {isActive && !layer.locked && !readOnly && (
          <>
            <div 
              className="absolute -top-1 -left-1 h-3 w-3 bg-white border border-blue-500 rounded-full cursor-nwse-resize"
              onMouseDown={(e) => handleResizeStart(e, layer.id, 'top-left')}
            />
            <div 
              className="absolute -top-1 -right-1 h-3 w-3 bg-white border border-blue-500 rounded-full cursor-nesw-resize"
              onMouseDown={(e) => handleResizeStart(e, layer.id, 'top-right')}
            />
            <div 
              className="absolute -bottom-1 -left-1 h-3 w-3 bg-white border border-blue-500 rounded-full cursor-nesw-resize"
              onMouseDown={(e) => handleResizeStart(e, layer.id, 'bottom-left')}
            />
            <div 
              className="absolute -bottom-1 -right-1 h-3 w-3 bg-white border border-blue-500 rounded-full cursor-nwse-resize"
              onMouseDown={(e) => handleResizeStart(e, layer.id, 'bottom-right')}
            />
          </>
        )}
      </div>
    );
  };
  
  // Render layer content based on type
  const renderLayerContent = (layer: CardLayer) => {
    switch (layer.type) {
      case 'image':
        return (
          <img
            src={layer.content as string}
            alt="Layer"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none'
            }}
            draggable={false}
          />
        );
        
      case 'text':
        const textStyle: React.CSSProperties = {
          fontFamily: layer.textStyle?.fontFamily || 'sans-serif',
          fontSize: `${layer.textStyle?.fontSize || 16}px`,
          fontWeight: layer.textStyle?.fontWeight || 'normal',
          color: layer.textStyle?.color || '#000000',
          textAlign: (layer.textStyle?.textAlign as any) || 'left',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          wordBreak: 'break-word'
        };
        
        return (
          <div style={textStyle}>
            {layer.content as string}
          </div>
        );
        
      case 'shape':
        const shapeStyle: React.CSSProperties = {
          backgroundColor: layer.color || '#e2e2e2',
          border: '1px solid #d0d0d0',
          width: '100%',
          height: '100%',
          borderRadius: layer.shapeType === 'circle' ? '50%' : '4px'
        };
        
        return <div style={shapeStyle} />;
        
      default:
        return null;
    }
  };

  // Handle canvas click (deselect active layer)
  const handleCanvasClick = () => {
    if (!readOnly) {
      onSelectLayer('');
    }
  };

  return (
    <div className="interactive-canvas-container">
      <div 
        ref={canvasRef}
        className={`card-canvas relative ${effectClasses}`}
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          background: cardBackground || '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          touchAction: readOnly ? 'auto' : 'none'
        }}
        onClick={handleCanvasClick}
      >
        {/* Safe zone indicator */}
        <div 
          className="safe-zone pointer-events-none"
          style={{
            position: 'absolute',
            top: '5%',
            left: '5%',
            right: '5%',
            bottom: '5%',
            border: '1px dashed rgba(0,0,0,0.2)',
            zIndex: 0
          }}
        />
        
        {/* Render layers in z-index order */}
        {[...layers]
          .sort((a, b) => a.position.z - b.position.z)
          .map(renderLayer)}
      </div>

      {!readOnly && activeLayer && (
        <div className="layer-actions mt-2 flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => activeLayer && onUpdateLayer(activeLayer.id, { locked: !activeLayer.locked })}
          >
            {activeLayer.locked ? <Lock className="h-4 w-4 mr-1" /> : <Unlock className="h-4 w-4 mr-1" />}
            {activeLayer.locked ? 'Unlock' : 'Lock'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => activeLayer && onUpdateLayer(activeLayer.id, { visible: !activeLayer.visible })}
          >
            {activeLayer.visible ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {activeLayer.visible ? 'Hide' : 'Show'}
          </Button>
          
          {onDuplicateLayer && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => activeLayer && onDuplicateLayer(activeLayer.id)}
            >
              <Copy className="h-4 w-4 mr-1" />
              Duplicate
            </Button>
          )}
          
          {onDeleteLayer && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => activeLayer && onDeleteLayer(activeLayer.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
        </div>
      )}
      
      {!readOnly && onAddLayer && (
        <div className="layer-add mt-4 flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddLayer('text')}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Text
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddLayer('image')}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Image
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddLayer('shape')}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Shape
          </Button>
        </div>
      )}
    </div>
  );
};

export default InteractiveCanvas;
