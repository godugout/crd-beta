
import React, { useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import '../../../styles/card-interactions.css';

interface CardDisplayProps {
  card: Card;
  rotation: { x: number; y: number; rotation?: number };
  isFlipped: boolean;
  zoom: number;
  isDragging?: boolean;
  setIsDragging?: React.Dispatch<React.SetStateAction<boolean>>;
  cardRef?: React.RefObject<HTMLDivElement>;
  containerRef?: React.RefObject<HTMLDivElement>;
  isAutoRotating?: boolean;
  mousePosition: { x: number; y: number };
}

const CardDisplay: React.FC<CardDisplayProps> = ({
  card,
  rotation,
  isFlipped,
  zoom,
  isDragging,
  setIsDragging,
  cardRef,
  containerRef,
  isAutoRotating,
  mousePosition,
}: CardDisplayProps) => {
  const [flipProgress, setFlipProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setFlipProgress(isFlipped ? 100 : 0);
    }, 50);
    return () => clearTimeout(timer);
  }, [isFlipped]);

  return (
    <div 
      className="flex items-center justify-center gap-8 px-8"
      style={{ perspective: '2000px' }}
    >
      <div 
        ref={cardRef}
        className="relative transition-all duration-700 transform-gpu preserve-3d"
        style={{
          transformStyle: 'preserve-3d',
          transform: `
            perspective(1000px) 
            rotateX(${rotation.x}deg) 
            rotateY(${rotation.y}deg) 
            scale(${zoom})
          `
        }}
      >
        <div className="relative w-72 sm:w-80 md:w-96 aspect-[2.5/3.5] rounded-xl overflow-hidden shadow-2xl preserve-3d">
          {/* Front face */}
          <div 
            className={`absolute inset-0 backface-hidden ${!isFlipped ? 'z-10' : 'z-0'}`}
            style={{ transform: 'rotateY(0deg)' }}
          >
            <div className="relative w-full h-full overflow-hidden">
              <img 
                src={card.imageUrl} 
                alt={card.title || 'Card'} 
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h2 className="font-bold text-xl mb-1">{card.title}</h2>
                {card.player && <p className="text-sm opacity-90">{card.player}</p>}
                {card.team && <p className="text-xs opacity-80">{card.team}</p>}
              </div>
            </div>
          </div>

          {/* Back face */}
          <div 
            className={`absolute inset-0 backface-hidden ${isFlipped ? 'z-10' : 'z-0'}`}
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="absolute inset-0 p-6 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                {card.title}
              </h3>
              
              {card.description && (
                <p className="text-sm mb-4 opacity-90">{card.description}</p>
              )}
              
              {/* Card stats */}
              <div className="grid grid-cols-2 gap-3 my-4">
                {card.year && (
                  <div className="bg-white/10 backdrop-blur-sm rounded p-2 text-center">
                    <span className="text-xs text-blue-300 block">Year</span>
                    <span className="text-md font-semibold">{card.year}</span>
                  </div>
                )}
                
                {card.designMetadata?.cardMetadata?.cardNumber && (
                  <div className="bg-white/10 backdrop-blur-sm rounded p-2 text-center">
                    <span className="text-xs text-blue-300 block">Card #</span>
                    <span className="text-md font-semibold">
                      {String(card.designMetadata.cardMetadata.cardNumber)}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Card tags */}
              {card.tags && card.tags.length > 0 && (
                <div className="my-4">
                  <p className="text-xs text-blue-300 mb-1">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.map((tag, index) => (
                      <span key={index} className="bg-white/10 text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card interaction effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Auto-rotation indicator */}
          <div 
            className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent transition-opacity duration-300"
            style={{
              opacity: isAutoRotating ? 0.5 : 0,
              transform: `rotate(${rotation.y}deg)`,
            }}
          />
          
          {/* Light reflection effect that follows mouse */}
          <div 
            className="card-highlight absolute inset-0 pointer-events-none"
            style={{
              '--mouse-x': `${mousePosition.x * 100}%`, 
              '--mouse-y': `${mousePosition.y * 100}%`
            } as React.CSSProperties}
          />
          
          {/* Edge glow effect for when card is being flipped */}
          <div 
            className="flip-indicator absolute inset-0 pointer-events-none"
            style={{ opacity: flipProgress > 0 && flipProgress < 100 ? 0.7 : 0 }}
          />
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
