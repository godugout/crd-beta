
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/lib/types';
import { useCardEffects } from '@/hooks/useCardEffects';
import CardToolbar from './CardToolbar';
import EffectsPanel from './panels/EffectsPanel';
import CardStyleSwitcher from './CardStyleSwitcher';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { toast } from 'sonner';

interface CardViewerProps {
  card: Card;
  onClose?: () => void;
  fullscreen?: boolean;
  onFullscreenToggle?: () => void;
  onShare?: () => void;
  onCapture?: () => void;
  onBack?: () => void;
}

const CardViewer: React.FC<CardViewerProps> = ({
  card,
  fullscreen = false,
  onClose,
  onFullscreenToggle,
  onShare,
  onCapture,
  onBack
}) => {
  const [showEffectsPanel, setShowEffectsPanel] = useState<boolean>(true);
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    cardRef,
    rotation,
    isFlipped,
    zoom,
    isMoving,
    mousePosition,
    effects,
    flipCard,
    resetCard,
    generateEffectStyles,
    generateEffectClasses,
    toggleEffect,
    updateEffectIntensity,
    activeEffects,
    setActiveEffects
  } = useCardEffects({
    enableLighting: true,
    enableReflections: true
  });

  // Bind keyboard shortcuts
  useKeyboardShortcut('f', () => {
    flipCard();
    toast.info(`Card flipped to ${isFlipped ? 'back' : 'front'}`);
  });
  
  useKeyboardShortcut('r', () => {
    resetCard();
    toast.info('Card view reset');
  });
  
  useKeyboardShortcut('e', () => {
    setShowEffectsPanel(prev => !prev);
  });
  
  useKeyboardShortcut('Escape', () => {
    if (fullscreen && onFullscreenToggle) {
      onFullscreenToggle();
    } else if (showEffectsPanel) {
      setShowEffectsPanel(false);
    }
  });

  // Handle toolbar actions
  const handleToolbarAction = (action: string) => {
    switch (action) {
      case 'flip':
        flipCard();
        break;
      case 'reset':
        resetCard();
        break;
      case 'effects':
        setShowEffectsPanel(prev => !prev);
        break;
      case 'fullscreen':
        if (onFullscreenToggle) onFullscreenToggle();
        break;
      case 'camera':
        if (onCapture) onCapture();
        break;
      case 'share':
        if (onShare) onShare();
        break;
      case 'back':
        if (onClose) onClose();
        else if (onBack) onBack();
        break;
      default:
        break;
    }
  };

  // Apply style from the style switcher
  const handleSelectStyle = (styleId: string) => {
    // Toggle the selected style
    if (styleId === activeStyle) {
      setActiveStyle(null);
      
      // Find and toggle off the effect
      const effectToToggle = effects.find(effect => effect.id.toLowerCase() === styleId.toLowerCase());
      if (effectToToggle && effectToToggle.active) {
        toggleEffect(effectToToggle.id);
      }
    } else {
      // Set the new active style
      setActiveStyle(styleId);
      
      // Find and toggle on the effect
      const effectToToggle = effects.find(effect => effect.id.toLowerCase() === styleId.toLowerCase());
      if (effectToToggle && !effectToToggle.active) {
        toggleEffect(effectToToggle.id);
      }
    }
  };

  // Card container style including 3D transforms
  const cardStyle = {
    transform: `
      perspective(1000px)
      rotateX(${rotation.x}deg)
      rotateY(${rotation.y}deg)
      scale(${zoom})
    `,
    transition: isMoving ? 'none' : 'transform 0.5s ease',
    ...generateEffectStyles()
  };

  const effectClasses = generateEffectClasses();

  return (
    <div className="card-viewer relative flex flex-col h-full overflow-hidden bg-gray-900">
      {/* Top toolbar */}
      <div className="sticky top-0 z-10">
        <CardToolbar 
          activePanel={showEffectsPanel ? 'effects' : null}
          onAction={handleToolbarAction}
          fullscreen={fullscreen}
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden relative flex items-center justify-center">
        {/* Card container */}
        <div
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
        >
          {/* Card with 3D effects */}
          <div
            ref={cardRef}
            className={`relative w-64 h-96 rounded-lg ${effectClasses}`}
            style={cardStyle}
          >
            {/* Card front */}
            <div 
              className={`absolute inset-0 rounded-lg overflow-hidden transition-opacity duration-500 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
              style={{ backfaceVisibility: 'hidden' }}
            >
              <img 
                src={card.imageUrl || '/images/card-placeholder.png'}
                alt={card.title}
                className="w-full h-full object-cover"
              />
              
              {/* Front overlay for effects */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 mix-blend-overlay" />
              
              {/* Card info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white font-bold truncate">{card.title}</h3>
                {card.player && <p className="text-white/70 text-sm truncate">{card.player}</p>}
                {card.team && <p className="text-white/70 text-sm truncate">{card.team}</p>}
              </div>
            </div>
            
            {/* Card back */}
            <div 
              className={`absolute inset-0 rounded-lg overflow-hidden transition-opacity duration-500 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center p-6">
                <h4 className="text-white font-bold mb-2">{card.title}</h4>
                {card.description && (
                  <p className="text-white/70 text-sm text-center">{card.description}</p>
                )}
                <div className="mt-auto">
                  {card.year && (
                    <p className="text-white/50 text-xs text-center">
                      {card.year}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Effects panel */}
        {showEffectsPanel && (
          <CardStyleSwitcher
            onSelectStyle={handleSelectStyle}
            activeStyle={activeStyle}
          />
        )}
      </div>
      
      {/* Keyboard controls help */}
      <div className="absolute bottom-6 right-4 bg-black/70 text-white text-xs rounded-lg p-2 z-10">
        <h5 className="font-medium mb-2 text-center">Keyboard Controls:</h5>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div><kbd className="bg-gray-700 px-1 rounded">←/→</kbd> <span className="ml-1">Rotate Card</span></div>
          <div><kbd className="bg-gray-700 px-1 rounded">F</kbd> <span className="ml-1">Flip card</span></div>
          <div><kbd className="bg-gray-700 px-1 rounded">E</kbd> <span className="ml-1">Effects panel</span></div>
          <div><kbd className="bg-gray-700 px-1 rounded">I</kbd> <span className="ml-1">Stats panel</span></div>
          <div><kbd className="bg-gray-700 px-1 rounded">+/-</kbd> <span className="ml-1">Zoom in/out</span></div>
          <div><kbd className="bg-gray-700 px-1 rounded">M</kbd> <span className="ml-1">Multi-card view</span></div>
          <div><kbd className="bg-gray-700 px-1 rounded">R</kbd> <span className="ml-1">Reset position</span></div>
          <div><kbd className="bg-gray-700 px-1 rounded">A</kbd> <span className="ml-1">Auto movement</span></div>
          <div><kbd className="bg-gray-700 px-1 rounded">B</kbd> <span className="ml-1">Card back</span></div>
          <div><kbd className="bg-gray-700 px-1 rounded">ESC</kbd> <span className="ml-1">Close panels</span></div>
        </div>
        <div className="text-gray-400 text-[10px] mt-2 text-center">
          Scroll with Ctrl/⌘ + wheel to zoom. Mouse over to see card effects.
        </div>
      </div>
    </div>
  );
};

export default CardViewer;
