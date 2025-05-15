
import React, { useRef, useState, useEffect } from 'react';
import { useDrag } from '@/hooks/useDrag';
import { Card } from '@/lib/types/cardTypes';
import { CardLayer } from '@/components/card-creation/types/cardTypes';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Maximize2, 
  Minimize2,
  Save,
  Download
} from 'lucide-react';

interface CardCanvasProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

const CardCanvas: React.FC<CardCanvasProps> = ({
  cardData,
  onUpdate
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(100);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [layers, setLayers] = useState<CardLayer[]>([]);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  
  // Initialize the canvas with the card data
  useEffect(() => {
    if (cardData.imageUrl && layers.length === 0) {
      // Create a base image layer if we have an image URL
      const baseImageLayer: CardLayer = {
        id: 'base-image',
        type: 'image',
        content: cardData.imageUrl,
        position: { x: 50, y: 50, z: 0 },
        size: { width: 400, height: 560 },
        rotation: 0,
        opacity: 1,
        zIndex: 0,
        visible: true,
        locked: false,
        effectIds: []
      };
      
      setLayers([baseImageLayer]);
    }
  }, [cardData.imageUrl, layers.length]);

  // Set up drag handling for layers
  const { handleMouseDown } = useDrag({
    onDragStart: (e, id) => {
      if (id) {
        setActiveLayerId(id);
        setIsDragging(true);
      }
    },
    onDrag: (e, id, deltaX, deltaY) => {
      if (id && isDragging) {
        setLayers(prevLayers => 
          prevLayers.map(layer => {
            if (layer.id === id && !layer.locked) {
              // Calculate new position based on drag delta and zoom level
              const scaleFactor = 100 / zoom;
              const newX = layer.position.x + deltaX * scaleFactor;
              const newY = layer.position.y + deltaY * scaleFactor;
              
              return {
                ...layer,
                position: {
                  ...layer.position,
                  x: newX,
                  y: newY
                }
              };
            }
            return layer;
          })
        );
      }
    },
    onDragEnd: () => {
      setIsDragging(false);
    }
  });
  
  // Handle zooming the canvas
  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      if (direction === 'in') {
        return Math.min(prev + 10, 200);
      } else {
        return Math.max(prev - 10, 50);
      }
    });
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setFullscreen(prev => !prev);
  };
  
  // Export the card as an image
  const exportCard = () => {
    // Implement canvas export functionality
    // This would typically use html-to-image or a similar library
    console.log("Export functionality to be implemented");
  };
  
  // Render a layer based on its type
  const renderLayer = (layer: CardLayer) => {
    if (!layer.visible) return null;
    
    const layerStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${layer.position.x}%`,
      top: `${layer.position.y}%`,
      zIndex: layer.position.z,
      transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
      opacity: layer.opacity,
      width: typeof layer.size.width === 'number' ? `${layer.size.width}px` : layer.size.width,
      height: typeof layer.size.height === 'number' ? `${layer.size.height}px` : layer.size.height,
      cursor: layer.locked ? 'not-allowed' : 'move'
    };
    
    // Element-specific props
    const elementProps = {
      'data-layer-id': layer.id,
      onMouseDown: (e: React.MouseEvent) => handleMouseDown(e, layer.id),
      className: `layer ${activeLayerId === layer.id ? 'active-layer ring-2 ring-blue-500' : ''} ${isDragging && activeLayerId === layer.id ? 'is-dragging' : ''}`
    };
    
    switch (layer.type) {
      case 'image':
        return (
          <div
            key={layer.id}
            style={layerStyle}
            {...elementProps}
          >
            <img
              src={layer.content as string}
              alt="Layer"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none'
              }}
            />
          </div>
        );
        
      case 'text':
        const textStyle: React.CSSProperties = {
          fontFamily: layer.textStyle?.fontFamily || 'sans-serif',
          fontSize: `${layer.textStyle?.fontSize || 16}px`,
          fontWeight: layer.textStyle?.fontWeight || 'normal',
          color: layer.textStyle?.color || '#000000',
          textAlign: (layer.textStyle?.textAlign as any) || 'left',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap'
        };
        
        return (
          <div
            key={layer.id}
            style={{...layerStyle, ...textStyle}}
            {...elementProps}
          >
            {layer.content as string}
          </div>
        );
        
      case 'shape':
        return (
          <div
            key={layer.id}
            style={{
              ...layerStyle,
              backgroundColor: layer.color || '#e2e2e2',
              border: '1px solid #d0d0d0'
            }}
            {...elementProps}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className={`card-canvas-container ${fullscreen ? 'fixed inset-0 z-50 bg-black/90 p-8' : ''}`}>
      {/* Canvas toolbar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom('out')}
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">{zoom}%</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom('in')}
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle grid"
            className={showGrid ? 'bg-gray-100' : ''}
          >
            <Move className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCard}
            title="Export card"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Card canvas */}
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-lg border p-4"
        style={{ height: fullscreen ? 'calc(100vh - 8rem)' : '600px' }}
      >
        <div 
          ref={canvasRef}
          className={`card-canvas relative bg-white shadow-lg rounded-lg overflow-hidden ${cardData.effects?.join(' ') || ''}`}
          style={{
            width: '400px',
            height: '560px',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center',
            transition: 'transform 0.2s ease'
          }}
        >
          {/* Grid overlay */}
          {showGrid && (
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-8 pointer-events-none">
              {Array.from({ length: 6 * 8 }).map((_, i) => (
                <div key={i} className="border border-dashed border-blue-200/50" />
              ))}
            </div>
          )}
          
          {/* Safe zone indicator */}
          <div 
            className="safe-zone pointer-events-none absolute inset-6 border border-dashed border-gray-300/50"
          />
          
          {/* Render layers */}
          {layers.map(renderLayer)}
        </div>
      </div>
    </div>
  );
};

export default CardCanvas;
