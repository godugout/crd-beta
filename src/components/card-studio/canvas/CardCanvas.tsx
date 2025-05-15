
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { ZoomIn, ZoomOut, RotateRight, RotateLeft, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface CardCanvasProps {
  cardData: Partial<Card>;
  onUpdate?: (updates: Partial<Card>) => void;
  editable?: boolean;
}

const CardCanvas: React.FC<CardCanvasProps> = ({
  cardData,
  onUpdate = () => {},
  editable = true
}) => {
  // Canvas transformation state
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [fullscreen, setFullscreen] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle mouse wheel for zooming
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      const newZoom = Math.max(0.5, Math.min(zoom + delta, 3));
      setZoom(newZoom);
    }
  };
  
  // Handle drag to move the card
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!editable) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle rotation
  const handleRotate = (direction: 'left' | 'right') => {
    const amount = direction === 'left' ? -90 : 90;
    setRotation((prev) => prev + amount);
  };
  
  // Reset transformations
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };
  
  // Toggle fullscreen
  const handleFullscreenToggle = () => {
    setFullscreen(!fullscreen);
    
    // Reset position when toggling fullscreen
    setPosition({ x: 0, y: 0 });
    
    // If exiting fullscreen, reset zoom as well
    if (fullscreen) {
      setZoom(1);
    }
  };
  
  // Determine CSS classes for the card based on any applied effects
  const getCardClasses = () => {
    const classes = ['card-preview', 'relative'];
    
    // Add effect classes if there are any
    if (cardData.effects && cardData.effects.length > 0) {
      cardData.effects.forEach(effect => {
        classes.push(`effect-${effect.toLowerCase()}`);
      });
    }
    
    return classes.join(' ');
  };
  
  // Get card style properties from design metadata
  const getCardStyle = () => {
    const designMetadata = cardData.designMetadata || {};
    const cardStyle = designMetadata.cardStyle || {};
    
    return {
      borderRadius: cardStyle.borderRadius || '8px',
      borderColor: cardStyle.borderColor || '#000000',
      borderWidth: cardStyle.borderWidth !== undefined ? `${cardStyle.borderWidth}px` : '2px',
      backgroundColor: cardStyle.backgroundColor || 'white',
      boxShadow: cardStyle.shadowColor 
        ? `0 4px 6px ${cardStyle.shadowColor}` 
        : '0 4px 6px rgba(0, 0, 0, 0.1)'
    };
  };

  return (
    <div
      className={`relative overflow-hidden bg-gray-100 border ${
        fullscreen 
          ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/90' 
          : 'aspect-[2.5/3.5] rounded-lg'
      }`}
      ref={containerRef}
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Card Canvas */}
      <div
        ref={canvasRef}
        className="relative"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* The actual card */}
        <div
          className={getCardClasses()}
          style={{
            width: fullscreen ? '70vh' : '100%',
            aspectRatio: '2.5/3.5',
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            cursor: editable ? 'move' : 'default',
            ...getCardStyle(),
            borderStyle: 'solid',
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Card Background/Image */}
          {cardData.imageUrl && (
            <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'inherit' }}>
              <img
                src={cardData.imageUrl}
                alt={cardData.title || "Card"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Handle image loading errors
                  (e.target as HTMLImageElement).src = '/placeholder-card.png';
                }}
              />
            </div>
          )}

          {/* Card Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end" style={{ borderRadius: 'inherit' }}>
            {/* Card info at bottom */}
            <div className="bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
              <h3 className="text-lg font-bold line-clamp-2">
                {cardData.title || 'Untitled Card'}
              </h3>
              
              {cardData.player && (
                <div className="mt-1 flex items-center">
                  <span className="text-sm font-medium">{cardData.player}</span>
                  {cardData.team && (
                    <>
                      <span className="mx-1">•</span>
                      <span className="text-sm">{cardData.team}</span>
                    </>
                  )}
                  {cardData.year && (
                    <>
                      <span className="mx-1">•</span>
                      <span className="text-sm">{cardData.year}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Canvas Controls */}
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-2 flex items-center space-x-1 ${fullscreen ? 'bg-white/30' : ''}`}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <div className="w-24">
          <Slider 
            value={[zoom * 100]} 
            min={50} 
            max={300} 
            step={1} 
            className="w-full"
            onValueChange={(value) => setZoom(value[0] / 100)}
          />
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={() => setZoom((prev) => Math.min(3, prev + 0.1))}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={() => handleRotate('left')}
        >
          <RotateLeft className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={() => handleRotate('right')}
        >
          <RotateRight className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={handleReset}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 12h-7" />
            <path d="M9 9l3 3-3 3" />
          </svg>
        </Button>
        
        <Button
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={handleFullscreenToggle}
        >
          {fullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Close button when in fullscreen */}
      {fullscreen && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
          onClick={handleFullscreenToggle}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </Button>
      )}
    </div>
  );
};

export default CardCanvas;
