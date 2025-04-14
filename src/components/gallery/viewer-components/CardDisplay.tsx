
import React from 'react';
import { Card } from '@/lib/types';

interface CardDisplayProps {
  card: Card;
  rotation: { x: number; y: number };
  isFlipped: boolean;
  onMouseMove: (e: React.MouseEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

const CardDisplay = ({
  card,
  rotation,
  isFlipped,
  onMouseMove,
  onTouchMove,
  onTouchStart,
  onTouchEnd,
}: CardDisplayProps) => {
  return (
    <div className="flex items-center justify-center gap-8 px-8">
      <div 
        className="relative transition-transform duration-700 transform-gpu"
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        <div className="relative w-72 sm:w-80 md:w-96 aspect-[2.5/3.5] rounded-xl overflow-hidden shadow-2xl">
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
      </div>

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
