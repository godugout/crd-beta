import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/lib/types';

interface CardInteractiveProps {
  card: Card;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  isFlipped: boolean;
  onFlip: () => void;
}

/**
 * Interactive card component with 3D effects, lighting, and touch controls
 */
const CardInteractive: React.FC<CardInteractiveProps> = ({
  card,
  activeEffects,
  effectIntensities,
  isFlipped,
  onFlip
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Handle mouse movement for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    // Calculate card dimensions and center point
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate normalized position relative to center (-1 to 1)
    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);
    
    // Update CSS variables for effect positioning
    if (cardRef.current) {
      cardRef.current.style.setProperty('--mouse-x', `${(e.clientX - rect.left) / rect.width}`);
      cardRef.current.style.setProperty('--mouse-y', `${(e.clientY - rect.top) / rect.height}`);
    }
    
    // If dragging, update position
    if (isDragging) {
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y
      });
    } else {
      // Otherwise update rotation for tilt effect
      setRotation({
        x: normalizedY * -20, // Reversed for natural tilt
        y: normalizedX * 20
      });
    }
  };
  
  const handleMouseLeave = () => {
    // Reset card rotation when mouse leaves
    setRotation({ x: 0, y: 0 });
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Add event listeners for mouse up outside the card
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);
  
  // Set effect CSS variables
  useEffect(() => {
    if (!cardRef.current) return;
    
    Object.entries(effectIntensities).forEach(([effect, intensity]) => {
      const cssVarName = `--${effect.toLowerCase().replace(' ', '-')}-intensity`;
      cardRef.current?.style.setProperty(cssVarName, intensity.toString());
    });
  }, [effectIntensities]);
  
  return (
    <div 
      className="card-container relative w-full h-full perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div
        ref={cardRef}
        className={`
          card-interactive w-full h-full transform-gpu transition-transform duration-200
          ${isFlipped ? 'rotate-y-180' : ''}
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          ${activeEffects.map(effect => `effect-${effect.toLowerCase().replace(' ', '')}`).join(' ')}
        `}
        style={{
          transform: isDragging
            ? `translate(${position.x}px, ${position.y}px)`
            : `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
      >
        {/* Card Front */}
        <div className="absolute inset-0 backface-hidden">
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            {/* Card Image */}
            <img 
              src={card.imageUrl} 
              alt={card.title || 'Card'} 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Error loading image:', card.imageUrl);
                e.currentTarget.src = 'https://via.placeholder.com/400x560?text=Card+Image';
              }}
            />
            
            {/* Card Title */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white text-xl font-bold">{card.title}</h3>
              {card.team && <p className="text-white/80 text-sm">{card.team}</p>}
            </div>
            
            {/* Effects Overlays */}
            <div className="effects-layer absolute inset-0 pointer-events-none z-10"></div>
            
            {/* Interactive Controls */}
            <div 
              className="absolute top-2 right-2 p-2 bg-black/50 rounded-full cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onFlip();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8z" />
                <path d="M12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Card Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-800">
            {/* Card Back Content */}
            <div className="p-6 flex flex-col h-full">
              <h3 className="text-white text-xl font-bold mb-4">{card.title}</h3>
              
              {card.description && (
                <p className="text-white/80 text-sm mb-4">{card.description}</p>
              )}
              
              {card.player && (
                <div className="mb-4">
                  <h4 className="text-white/60 text-xs uppercase mb-1">Player</h4>
                  <p className="text-white text-md">{card.player}</p>
                </div>
              )}
              
              {card.team && (
                <div className="mb-4">
                  <h4 className="text-white/60 text-xs uppercase mb-1">Team</h4>
                  <p className="text-white text-md">{card.team}</p>
                </div>
              )}
              
              {card.year && (
                <div className="mb-4">
                  <h4 className="text-white/60 text-xs uppercase mb-1">Year</h4>
                  <p className="text-white text-md">{card.year}</p>
                </div>
              )}
              
              <div className="mt-auto">
                {card.tags && card.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {card.tags.map((tag, i) => (
                      <span key={i} className="bg-white/20 px-2 py-1 rounded-md text-xs text-white">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Effects Overlays */}
            <div className="effects-layer absolute inset-0 pointer-events-none z-10"></div>
            
            {/* Interactive Controls */}
            <div 
              className="absolute top-2 right-2 p-2 bg-black/50 rounded-full cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onFlip();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8z" />
                <path d="M12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardInteractive;
