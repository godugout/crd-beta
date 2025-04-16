
import React, { useState } from 'react';
import { Card } from '@/lib/types';
import { useCardEffects } from '@/hooks/useCardEffects';
import CardToolbar from './CardToolbar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Share2, Camera, Expand, Maximize2 } from 'lucide-react';
import EffectsPanel from './panels/EffectsPanel';

interface CardViewerProps {
  card: Card;
  className?: string;
  fullscreen?: boolean;
  onFullscreenToggle?: () => void;
  onCapture?: () => void;
  onShare?: () => void;
  onBack?: () => void;
}

const CardViewer: React.FC<CardViewerProps> = ({
  card,
  className,
  fullscreen = false,
  onFullscreenToggle,
  onCapture,
  onShare,
  onBack
}) => {
  const [activePanelId, setActivePanelId] = useState<string | null>(null);
  
  const {
    cardRef,
    containerRef,
    rotation,
    zoom,
    isFlipped,
    flipCard,
    resetCard,
    generateEffectStyles,
    generateEffectClasses,
    activeEffects,
    effects,
    toggleEffect,
    updateEffectIntensity
  } = useCardEffects();

  const handleToolAction = (action: string) => {
    switch (action) {
      case 'flip':
        flipCard();
        break;
      case 'reset':
        resetCard();
        break;
      case 'effects':
        setActivePanelId(prev => prev === 'effects' ? null : 'effects');
        break;
      case 'share':
        if (onShare) {
          onShare();
        } else {
          // Default share behavior
          navigator.clipboard.writeText(window.location.href)
            .then(() => toast.success('Link copied to clipboard'))
            .catch(() => toast.error('Failed to copy link'));
        }
        break;
      case 'capture':
        if (onCapture) {
          onCapture();
        } else {
          toast.info('Card snapshot feature coming soon');
        }
        break;
      case 'fullscreen':
        if (onFullscreenToggle) {
          onFullscreenToggle();
        }
        break;
      case 'back':
        if (onBack) {
          onBack();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div 
      className={cn(
        "card-viewer relative w-full h-full flex flex-col",
        fullscreen ? "fixed inset-0 z-50 bg-black/90" : "",
        className
      )}
    >
      {/* Toolbar at top */}
      <CardToolbar 
        activePanel={activePanelId}
        onAction={handleToolAction}
        fullscreen={fullscreen}
      />
      
      {/* Card display area */}
      <div 
        className="flex-1 flex items-center justify-center overflow-hidden"
        ref={containerRef}
      >
        <div
          ref={cardRef}
          className={cn(
            "card aspect-[2.5/3.5] w-full max-w-[320px] rounded-lg shadow-xl transition-all duration-300",
            generateEffectClasses(),
            isFlipped ? "flipped" : ""
          )}
          style={{
            ...generateEffectStyles() as React.CSSProperties,
            transform: `
              perspective(1000px)
              rotateY(${isFlipped ? 180 : 0}deg)
              rotateX(${rotation.x}deg)
              rotateY(${rotation.y}deg)
              scale(${zoom})
            `,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Card front */}
          <div 
            className="card-face card-front absolute inset-0 backface-hidden rounded-lg overflow-hidden"
            style={{
              backgroundImage: card.imageUrl ? `url(${card.imageUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: !card.imageUrl ? '#f3f4f6' : undefined
            }}
          >
            {!card.imageUrl && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-white font-bold">{card.title}</h3>
              {card.player && <p className="text-white/90 text-sm">{card.player}</p>}
              {card.team && <p className="text-white/80 text-xs">{card.team} • {card.year || ''}</p>}
            </div>
            
            {/* Interactive highlight overlay */}
            <div className="card-highlight absolute inset-0 pointer-events-none"></div>
          </div>
          
          {/* Card back */}
          <div 
            className="card-face card-back absolute inset-0 backface-hidden rounded-lg overflow-hidden bg-gray-800"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="p-4 text-white h-full flex flex-col">
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              {card.description && <p className="text-sm mb-4">{card.description}</p>}
              
              <div className="mt-auto text-sm">
                {card.tags && card.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {card.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {card.year && (
                  <div className="text-gray-400 text-xs mt-2">
                    {card.year}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Side panels */}
      <div className={`absolute top-16 bottom-0 right-0 w-80 bg-black/70 backdrop-blur-sm transition-transform duration-300 
        ${activePanelId === 'effects' ? 'translate-x-0' : 'translate-x-full'}`}>
        {activePanelId === 'effects' && (
          <EffectsPanel 
            effects={effects}
            onToggleEffect={toggleEffect}
            onUpdateIntensity={updateEffectIntensity}
          />
        )}
      </div>
      
      {/* Fullscreen controls */}
      {fullscreen && (
        <div className="absolute right-4 bottom-4 flex gap-2">
          <button 
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            onClick={() => handleToolAction('capture')}
          >
            <Camera size={20} />
          </button>
          <button 
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            onClick={() => handleToolAction('share')}
          >
            <Share2 size={20} />
          </button>
          <button 
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            onClick={() => handleToolAction('fullscreen')}
          >
            {fullscreen ? <Maximize2 size={20} /> : <Expand size={20} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default CardViewer;
