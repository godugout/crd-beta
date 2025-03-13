import React, { useState } from 'react';
import { RotateCw, ArrowRight, Camera } from 'lucide-react';
import { CardData } from '@/types/card';
import { toast } from 'sonner';
import './CardEffects.css';

interface CardViewerProps {
  card: CardData;
  isFlipped: boolean;
  flipCard: () => void;
  onBackToCollection: () => void;
  activeEffects: string[];
  onSnapshot: () => void;
}

const CardViewer = ({ 
  card, 
  isFlipped, 
  flipCard, 
  onBackToCollection, 
  activeEffects,
  onSnapshot
}: CardViewerProps) => {
  const getFilterStyle = () => {
    let filterStyle = {};
    
    if (activeEffects.includes('Classic Holographic')) {
      filterStyle = {
        ...filterStyle,
        filter: 'contrast(1.1) brightness(1.1) saturate(1.3)',
        boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)',
      };
    }
    
    if (activeEffects.includes('Refractor')) {
      filterStyle = {
        ...filterStyle,
        borderRadius: '12px',
        background: `linear-gradient(45deg, 
          rgba(255,255,255,0.1) 0%, 
          rgba(255,255,255,0.5) 50%, 
          rgba(255,255,255,0.1) 100%)`,
      };
    }
    
    if (activeEffects.includes('Prismatic')) {
      filterStyle = {
        ...filterStyle,
        backgroundImage: 'linear-gradient(45deg, #ff00ff, #00ffff, #ffff00, #ff00ff)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
        borderRadius: '12px',
      };
    }
    
    if (activeEffects.includes('Electric')) {
      filterStyle = {
        ...filterStyle,
        boxShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073',
        animation: 'pulse 2s infinite',
      };
    }
    
    return filterStyle;
  };

  const handleSnapshot = () => {
    onSnapshot();
  };

  return (
    <div className="relative w-full h-96 md:h-[500px] flex items-center justify-center p-4 bg-gray-100 rounded-lg">
      {/* Card representation */}
      <div 
        className={`w-64 h-96 relative transition-transform duration-500 rounded-lg shadow-xl overflow-hidden ${isFlipped ? 'scale-x-[-1]' : ''}`} 
        style={{ backgroundColor: card.backgroundColor, ...getFilterStyle() }}
      >
        {!isFlipped ? (
          card.imageUrl ? (
            <img 
              src={card.imageUrl} 
              alt={card.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
              {card.name}
            </div>
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl scale-x-[-1]">
            {card.set}
          </div>
        )}
        
        {!isFlipped && !card.imageUrl && (
          <div className="absolute bottom-4 left-4 text-white">
            #{card.jersey}
          </div>
        )}
      </div>
      
      {/* Flip button */}
      <button 
        className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition shadow-sm"
        onClick={flipCard}
      >
        <RotateCw className="h-6 w-6" />
      </button>
      
      {/* Return to collection button */}
      <button 
        className="absolute top-4 left-4 bg-white bg-opacity-90 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition shadow-sm"
        onClick={onBackToCollection}
      >
        <ArrowRight className="h-6 w-6 rotate-180" />
      </button>

      {/* Snapshot button */}
      <button 
        className="absolute bottom-4 right-4 bg-white bg-opacity-90 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition shadow-sm"
        onClick={handleSnapshot}
      >
        <Camera className="h-6 w-6" />
        <span className="sr-only">Take Snapshot</span>
      </button>

      {activeEffects.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-medium">
          {activeEffects.length} effect{activeEffects.length !== 1 ? 's' : ''} active
        </div>
      )}
    </div>
  );
};

export default CardViewer;
