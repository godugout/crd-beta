
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
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const cardEffects = useCardEffects({
    enableLighting: true,
    enableReflections: true
  });
  
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
    activeEffects
  } = cardEffects;

  // Bind keyboard shortcuts
  useKeyboardShortcut('f', () => {
    flipCard();
    toast.info(`Card flipped to ${isFlipped ? 'back' : 'front'}`);
  });
  
  useKeyboardShortcut('r', () => {
    resetCard();
    toast.info('Card view reset');
  });
  
  useKeyboardShortcut('Escape', () => {
    if (fullscreen && onFullscreenToggle) {
      onFullscreenToggle();
    } else if (activePanel) {
      setActivePanel(null);
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
        setActivePanel(activePanel === 'effects' ? null : 'effects');
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
    // Clear all active effects first
    effects.forEach(effect => {
      if (effect.active) toggleEffect(effect.id);
    });
    
    // Apply the selected style
    if (styleId === activeStyle) {
      setActiveStyle(null);
      return;
    }
    
    setActiveStyle(styleId);
    toggleEffect(styleId);
    
    // Close any open panels
    setActivePanel(null);
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
      <div className="sticky top-0 z-20">
        <CardToolbar 
          activePanel={activePanel}
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
        <div 
          className={`absolute top-0 bottom-0 right-0 w-72 bg-black/80 backdrop-blur-sm transform transition-transform duration-300 z-30 ${
            activePanel === 'effects' ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <EffectsPanel 
            effects={effects}
            onToggleEffect={toggleEffect}
            onUpdateIntensity={updateEffectIntensity}
          />
        </div>
      </div>
      
      {/* Bottom style switcher */}
      <CardStyleSwitcher 
        onSelectStyle={handleSelectStyle}
        activeStyle={activeStyle}
      />
      
      {/* Keyboard controls help */}
      <div className="absolute bottom-16 right-4 bg-black/80 text-white text-xs rounded-lg p-3 z-30">
        <div className="flex flex-col gap-y-1">
          <div><kbd className="bg-gray-700 px-1 rounded">F</kbd> <span className="ml-1">Flip card</span></div>
          <div><kbd className="bg-gray-700 px-1 rounded">R</kbd> <span className="ml-1">Reset view</span></div>
          <div><kbd className="bg-gray-700 px-1 rounded">ESC</kbd> <span className="ml-1">Close panel/fullscreen</span></div>
        </div>
      </div>
    </div>
  );
};

export default CardViewer;
