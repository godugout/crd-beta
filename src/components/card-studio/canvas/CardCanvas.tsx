
import React, { useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw, RotateCcw } from 'lucide-react';

interface CardCanvasProps {
  cardData: Partial<Card>;
  onUpdate?: (updates: Partial<Card>) => void;
}

const CardCanvas: React.FC<CardCanvasProps> = ({ cardData, onUpdate }) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  
  const imageUrl = cardData.imageUrl || '/placeholder-card.png';
  
  // Default styles with proper fallbacks
  const designMetadata = cardData.designMetadata || {
    cardStyle: {
      template: 'classic',
      effect: 'none',
      borderRadius: '8px',
      borderColor: '#000000',
      frameColor: '#000000',
      frameWidth: 2,
      shadowColor: 'rgba(0,0,0,0.2)',
    },
    textStyle: {
      titleColor: '#000000',
      titleAlignment: 'center',
      titleWeight: 'bold',
      descriptionColor: '#333333',
      fontFamily: 'Inter',
      fontSize: '16px',
    }
  };
  
  const cardStyle = designMetadata.cardStyle || {};
  const textStyle = designMetadata.textStyle || {};
  
  // Zoom handling
  const handleZoomIn = () => {
    if (zoom < 2) setZoom(prev => prev + 0.1);
  };
  
  const handleZoomOut = () => {
    if (zoom > 0.5) setZoom(prev => prev - 0.1);
  };
  
  // Rotation handling
  const handleRotateClockwise = () => {
    setRotation(prev => prev + 15);
  };
  
  const handleRotateCounterClockwise = () => {
    setRotation(prev => prev - 15);
  };
  
  return (
    <div className="flex flex-col items-center">
      {/* Card preview */}
      <div className="relative w-full h-[60vh] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
        {/* Card container */}
        <div 
          className="relative transition-all duration-300"
          style={{ 
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
          }}
        >
          {/* Card itself */}
          <div 
            className="overflow-hidden"
            style={{ 
              width: '280px',
              aspectRatio: '2.5/3.5',
              borderRadius: cardStyle.borderRadius || '8px',
              borderWidth: cardStyle.borderWidth || 2,
              borderStyle: 'solid',
              borderColor: cardStyle.borderColor || '#000',
              backgroundColor: cardStyle.backgroundColor || '#fff',
              boxShadow: cardStyle.shadowColor ? `0 4px 12px ${cardStyle.shadowColor}` : 'none',
            }}
          >
            {/* Card image */}
            <div className="w-full h-full relative">
              <img 
                src={imageUrl}
                alt="Card Preview"
                className="w-full h-full object-cover"
              />
              
              {/* Text overlay */}
              {cardData.title && (
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
                >
                  <h3 
                    className="text-white font-bold text-xl"
                    style={{
                      color: textStyle.titleColor || '#fff',
                      textAlign: (textStyle.titleAlignment as any) || 'center',
                      fontWeight: textStyle.titleWeight || 'bold',
                      fontFamily: textStyle.fontFamily || 'Inter',
                      fontSize: textStyle.fontSize || '24px',
                    }}
                  >
                    {cardData.title}
                  </h3>
                  {cardData.description && (
                    <p 
                      className="text-white/80 text-sm mt-1"
                      style={{
                        color: textStyle.descriptionColor || 'rgba(255,255,255,0.8)',
                      }}
                    >
                      {cardData.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center space-x-2 rounded-lg border p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs w-16 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 2}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 rounded-lg border p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRotateCounterClockwise}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <span className="text-xs w-16 text-center">
            {rotation}°
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRotateClockwise}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardCanvas;
