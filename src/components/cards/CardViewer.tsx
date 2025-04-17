
import React, { useState } from 'react';
import { Card } from '@/lib/types';

export interface CardViewerProps {
  card: Card;
  isFlipped?: boolean;
  activeEffects?: string[];
  effectIntensities?: Record<string, number>;
  showLightingControls?: boolean;
  isFullscreen?: boolean;
  onFullscreenToggle?: () => void;
  onShare?: () => void;
  onCapture?: () => void;
  onBack?: () => void;
  onClose?: () => void;
  fullscreen?: boolean;
}

const CardViewer: React.FC<CardViewerProps> = ({ 
  card, 
  isFlipped = false, 
  activeEffects = [],
  effectIntensities = {},
  showLightingControls = false,
  isFullscreen = false,
  fullscreen = false, // Alias for isFullscreen for backwards compatibility
  onFullscreenToggle,
  onShare,
  onCapture,
  onBack,
  onClose
}) => {
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  
  // Use either isFullscreen or fullscreen
  const showFullscreen = isFullscreen || fullscreen;
  
  // Common card effect classes
  const getEffectClasses = () => {
    return activeEffects
      .map(effect => {
        switch(effect) {
          case 'Holographic': return 'card-effect-holographic';
          case 'Chrome': return 'card-effect-chrome';
          case 'Refractor': return 'card-effect-refractor';
          case 'Vintage': return 'card-effect-vintage';
          default: return '';
        }
      })
      .filter(Boolean)
      .join(' ');
  };
  
  return (
    <div className="card-viewer-container w-full h-full relative">
      <div 
        className={`card-display relative w-full aspect-[2.5/3.5] ${getEffectClasses()} ${isFlipped ? 'flipped' : ''}`}
        style={{
          transform: `perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
        }}
      >
        {/* Card Front */}
        <div className="card-side card-front absolute inset-0">
          <img 
            src={card.imageUrl} 
            alt={card.title}
            className="w-full h-full object-cover rounded-lg"
          />
          
          <div className="card-title absolute bottom-4 left-4 right-4 text-white text-xl font-bold drop-shadow-lg">
            {card.title}
          </div>
        </div>
        
        {/* Card Back */}
        <div className="card-side card-back absolute inset-0 [transform:rotateY(180deg)] bg-gray-800 rounded-lg">
          <div className="p-4 text-white">
            <h3 className="text-lg font-bold mb-2">{card.title}</h3>
            <p className="text-sm">{card.description}</p>
            
            {card.tags && card.tags.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs uppercase mb-1">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {card.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-gray-700 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Controls */}
      {(onBack || onFullscreenToggle || onShare || onCapture || onClose) && (
        <div className="card-controls absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {onBack && (
            <button 
              onClick={onBack}
              className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm"
            >
              Back
            </button>
          )}
          
          {onFullscreenToggle && (
            <button 
              onClick={onFullscreenToggle}
              className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm"
            >
              {showFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
          )}
          
          {onShare && (
            <button 
              onClick={onShare}
              className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm"
            >
              Share
            </button>
          )}
          
          {onCapture && (
            <button 
              onClick={onCapture}
              className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm"
            >
              Capture
            </button>
          )}
          
          {onClose && (
            <button 
              onClick={onClose}
              className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm"
            >
              Close
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CardViewer;
