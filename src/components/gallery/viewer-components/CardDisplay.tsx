
import React from 'react';
import { Card } from '@/lib/types';

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
}

const CardDisplay = ({
  card,
  rotation,
  isFlipped,
  zoom,
  isDragging,
  setIsDragging,
  cardRef,
  containerRef,
  isAutoRotating,
}: CardDisplayProps) => {
  return (
    <div 
      className="flex items-center justify-center gap-8 px-8"
      ref={containerRef}
    >
      <div 
        ref={cardRef}
        className="relative transition-all duration-700 transform-gpu"
        style={{
          transformStyle: 'preserve-3d',
          transform: `
            perspective(1000px) 
            rotateX(${rotation.x}deg) 
            rotateY(${rotation.y + (isFlipped ? 180 : 0)}deg) 
            scale(${zoom})
          `,
        }}
      >
        <div className="relative w-72 sm:w-80 md:w-96 aspect-[2.5/3.5] rounded-xl overflow-hidden shadow-2xl">
          {/* Front face */}
          <div 
            className="absolute inset-0 backface-hidden"
            style={{ transform: 'rotateY(0deg)' }}
          >
            <img 
              src={card.imageUrl} 
              alt={card.title || 'Card'} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h2 className="font-bold text-xl mb-1">{card.title}</h2>
              {card.player && <p className="text-sm opacity-90">{card.player}</p>}
              {card.team && <p className="text-xs opacity-80">{card.team}</p>}
            </div>
          </div>

          {/* Back face */}
          <div 
            className="absolute inset-0 backface-hidden bg-gray-900"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="absolute inset-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-4">{card.title}</h3>
              {card.description && (
                <p className="text-sm mb-4 opacity-90">{card.description}</p>
              )}
              <div className="mt-auto">
                {card.year && (
                  <p className="text-sm opacity-80">Year: {card.year}</p>
                )}
                {/* Fix the cardNumber access by checking if it exists */}
                {card.designMetadata?.cardMetadata?.cardNumber ? (
                  <p className="text-sm opacity-80">Card #: {card.designMetadata.cardMetadata.cardNumber}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Card effects layer */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent transition-opacity duration-300"
            style={{
              opacity: isAutoRotating ? 0.5 : 0,
              transform: `rotate(${rotation.y}deg)`,
            }}
          />
        </div>
      </div>

      {/* Side view card (desktop only) */}
      <div className="relative w-72 sm:w-80 md:w-96 aspect-[2.5/3.5] rounded-xl overflow-hidden shadow-2xl hidden md:block">
        <img 
          src={card.imageUrl} 
          alt={card.title || 'Card Side View'} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent"></div>
      </div>
    </div>
  );
};

export default CardDisplay;
