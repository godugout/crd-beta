
import React from 'react';
import { RotateCw, ArrowRight, Camera } from 'lucide-react';

interface CardControlsProps {
  flipCard: () => void;
  onBackToCollection: () => void;
  onSnapshot: () => void;
  activeEffectsCount: number;
}

const CardControls = ({ 
  flipCard, 
  onBackToCollection, 
  onSnapshot,
  activeEffectsCount
}: CardControlsProps) => {
  return (
    <>
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
        className="absolute bottom-4 right-4 bg-white bg-opacity-90 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition shadow-sm group"
        onClick={onSnapshot}
      >
        <Camera className="h-6 w-6 group-hover:text-blue-500 transition-colors" />
        <span className="sr-only">Take Snapshot</span>
      </button>

      {activeEffectsCount > 0 && (
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1.5 rounded-full text-xs font-medium">
          {activeEffectsCount} effect{activeEffectsCount !== 1 ? 's' : ''} active
        </div>
      )}

      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-xs text-white opacity-60 rotate-[-90deg] origin-center">
        Move your mouse over the card area
      </div>
    </>
  );
};

export default CardControls;
