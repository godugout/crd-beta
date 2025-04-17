
import React from 'react';
import { Card } from '@/lib/types';
import { Heart, Share2, Camera, X, ArrowLeft } from 'lucide-react';

export interface CardViewerProps {
  card: Card;
  isFlipped?: boolean;
  activeEffects?: string[];
  effectIntensities?: Record<string, number>;
  showLightingControls?: boolean;
  isFullscreen?: boolean;
  onShare?: () => void;
  onCapture?: () => void;
  onBack?: () => void;
  onClose?: () => void;
}

/**
 * Universal Card Viewer component that renders a card with various display options
 * and interactive controls based on the provided props.
 */
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
  // Get player, team, and year either directly from card or from designMetadata
  const player = card.player || (card.designMetadata?.player as string | undefined);
  const team = card.team || (card.designMetadata?.team as string | undefined);
  const year = card.year || (card.designMetadata?.year as string | undefined);
  
  return (
    <div className={`card-viewer relative w-full h-full flex items-center justify-center ${isFullscreen ? 'bg-black/90' : ''}`}>
      <div className={`card-container relative ${isFullscreen ? 'w-full max-w-lg' : 'w-full'} h-full overflow-hidden rounded-lg`}>
        {/* Card image */}
        <div className="relative w-full h-full">
          <img
            src={card.imageUrl}
            alt={card.title}
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error('Image failed to load:', card.imageUrl);
              e.currentTarget.src = '/images/card-placeholder.png';
            }}
          />
          
          {/* Apply effect overlays */}
          {activeEffects.map((effect, index) => (
            <div 
              key={index}
              className={`absolute inset-0 pointer-events-none effect-${effect.toLowerCase()}`}
              style={{ 
                opacity: effectIntensities[effect] || 0.5,
                mixBlendMode: 'overlay' 
              }}
            />
          ))}
        </div>
        
        {/* Controls overlay */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between">
          {onBack && (
            <button
              onClick={onBack}
              className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </button>
          )}
          
          {onClose && (
            <button
              onClick={onClose}
              className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 ml-auto"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
        </div>
        
        {/* Actions overlay */}
        {(onShare || onCapture) && (
          <div className="absolute bottom-0 left-0 w-full p-4 flex justify-center space-x-4">
            {onShare && (
              <button
                onClick={onShare}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </button>
            )}
            
            {onCapture && (
              <button
                onClick={onCapture}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Capture</span>
              </button>
            )}
          </div>
        )}
        
        {/* Card info overlay */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-bold text-lg">{card.title}</h3>
          {card.description && (
            <p className="text-white/80 text-sm line-clamp-2">{card.description}</p>
          )}
          {(player || team || year) && (
            <div className="text-white/80 text-sm flex flex-wrap gap-2 mt-1">
              {player && <span>{player}</span>}
              {team && <span>{team}</span>}
              {year && <span>{year}</span>}
            </div>
          )}
          {card.isFavorite && (
            <div className="absolute bottom-4 right-4">
              <Heart className="h-5 w-5 text-red-500 fill-current" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardViewer;
