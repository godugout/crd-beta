
import React, { useEffect, useRef, useState } from 'react';
import { CardData } from '@/types/card';
import { cn } from '@/lib/utils';

interface CardCanvasProps {
  card: CardData;
  isFlipped?: boolean;
  activeEffects: string[];
  effectSettings?: Record<string, any>;
  containerRef?: React.RefObject<HTMLDivElement>;
  cardRef?: React.RefObject<HTMLDivElement>;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: () => void;
  debug?: boolean;
}

const CardCanvas: React.FC<CardCanvasProps> = ({
  card,
  isFlipped = false,
  activeEffects = [],
  effectSettings = {},
  containerRef,
  cardRef,
  onMouseMove,
  onMouseLeave,
  debug = false
}) => {
  const [loaded, setLoaded] = useState(false);
  const innerCardRef = useRef<HTMLDivElement>(null);
  const localRef = cardRef || innerCardRef;

  useEffect(() => {
    // Apply card effects logic here
    const element = localRef.current;
    if (!element) return;
    
    // Set up effect classes
    const effectClasses = activeEffects.map(e => e.toLowerCase().replace(/\s+/g, '-')).join(' ');
    element.className = cn(
      element.className.split(' ').filter(c => !c.includes('effect-')).join(' '),
      activeEffects.map(e => `effect-${e.toLowerCase().replace(/\s+/g, '-')}`).join(' ')
    );
    
    // Add debug info
    if (debug) {
      console.log("CardCanvas: Active effects:", activeEffects);
      console.log("CardCanvas: Effect settings:", effectSettings);
    }
  }, [activeEffects, effectSettings, localRef, debug]);

  // Handle image loading
  const handleImageLoad = () => {
    setLoaded(true);
    if (debug) console.log("CardCanvas: Image loaded");
  };

  return (
    <div 
      className={cn(
        "relative transition-transform duration-500 w-full h-full",
        isFlipped ? "rotate-y-180" : "",
        !loaded && "opacity-50"
      )}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Front of card */}
      <div 
        ref={localRef}
        className={cn(
          "absolute inset-0 rounded-lg overflow-hidden preserve-3d backface-hidden shadow-lg",
          activeEffects.map(e => `effect-${e.toLowerCase().replace(/\s+/g, '-')}`).join(' ')
        )}
        style={{
          visibility: isFlipped ? 'hidden' : 'visible',
        }}
      >
        <div className="relative w-full h-full">
          <img 
            src={card.imageUrl} 
            alt={card.title} 
            onLoad={handleImageLoad}
            className="w-full h-full object-cover"
          />
          
          {/* Card Frame */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              boxShadow: `inset 0 0 0 ${card.designMetadata?.cardStyle?.frameWidth || 4}px ${card.designMetadata?.cardStyle?.frameColor || '#000'}`,
              borderRadius: card.designMetadata?.cardStyle?.borderRadius || '8px'
            }}
          />
        </div>
      </div>
      
      {/* Back of card */}
      <div 
        className={cn(
          "absolute inset-0 rounded-lg overflow-hidden rotate-y-180 preserve-3d backface-hidden bg-gray-800",
          activeEffects.map(e => `effect-${e.toLowerCase().replace(/\s+/g, '-')}-back`).join(' ')
        )}
        style={{
          visibility: isFlipped ? 'visible' : 'hidden',
        }}
      >
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <h3 className="text-xl font-bold text-white">{card.title}</h3>
          {card.description && (
            <p className="mt-2 text-sm text-gray-300">{card.description}</p>
          )}
        </div>
      </div>
      
      {/* Loading overlay */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default CardCanvas;
