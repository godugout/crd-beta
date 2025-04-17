
import React from 'react';
import { Card } from '@/lib/types';

interface CardViewerProps {
  card: Card;
  isFlipped?: boolean;
  activeEffects: string[];
  effectIntensities?: Record<string, number>;
  showLightingControls?: boolean;
  isFullscreen?: boolean;
  onShare?: () => void;
  onCapture?: () => void;
  onBack?: () => void;
  onClose?: () => void;
}

const CardViewer: React.FC<CardViewerProps> = ({
  card,
  isFlipped = false,
  activeEffects = [],
  effectIntensities = {},
  showLightingControls = false,
  isFullscreen = false,
  onShare,
  onCapture,
  onBack,
  onClose
}) => {
  // This is a placeholder component that will delegate to the actual implementation
  // Depending on the context, different card viewer components might be used
  
  // Get player, team, and year either directly from card or from designMetadata
  const player = card.player || (card.designMetadata?.player as string | undefined);
  const team = card.team || (card.designMetadata?.team as string | undefined);
  const year = card.year || (card.designMetadata?.year as string | undefined);
  
  return (
    <div className="card-viewer relative w-full h-full flex items-center justify-center">
      <div className="card-container relative w-full h-full overflow-hidden rounded-lg">
        {/* Card image */}
        <img
          src={card.imageUrl}
          alt={card.title}
          className="w-full h-full object-contain"
        />
        
        {/* Controls overlay */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between">
          {onBack && (
            <button
              onClick={onBack}
              className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              Back
            </button>
          )}
          
          {onClose && (
            <button
              onClick={onClose}
              className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 ml-auto"
            >
              Close
            </button>
          )}
        </div>
        
        {/* Actions overlay */}
        {(onShare || onCapture) && (
          <div className="absolute bottom-0 left-0 w-full p-4 flex justify-center space-x-4">
            {onShare && (
              <button
                onClick={onShare}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              >
                Share
              </button>
            )}
            
            {onCapture && (
              <button
                onClick={onCapture}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              >
                Capture
              </button>
            )}
          </div>
        )}
        
        {/* Card info overlay */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-bold text-lg">{card.title}</h3>
          {(player || team || year) && (
            <div className="text-white/80 text-sm flex flex-wrap gap-2">
              {player && <span>{player}</span>}
              {team && <span>{team}</span>}
              {year && <span>{year}</span>}
            </div>
          )}
        </div>
        
        {/* Effect overlays based on activeEffects */}
        {activeEffects.map(effect => (
          <div 
            key={effect}
            className={`absolute inset-0 effect-${effect.toLowerCase()}`}
            style={{
              opacity: effectIntensities?.[effect] || 0.5,
              pointerEvents: 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default CardViewer;
