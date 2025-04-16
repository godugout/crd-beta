import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { X, ChevronDown, ChevronUp, Lightbulb, Sparkles, Layers } from 'lucide-react';
import CardDisplay from './viewer-components/CardDisplay';
import ViewerControls from './viewer-components/ViewerControls';
import InfoPanel from './viewer-components/InfoPanel';
import MiniActionBar from '@/components/ui/MiniActionBar';
import { useCardInteraction } from '@/hooks/useCardInteraction';
import CardEffectsPanel from './viewer-components/CardEffectsPanel';
import { useFeatureEnabled } from '@/hooks/useFeatureFlag';
import { Card } from '@/lib/types/cardTypes';
import LightingControls from './viewer-components/LightingControls';
import { useCardLighting } from '@/hooks/useCardLighting';
import { useParticleEffects } from '@/hooks/useParticleEffects';
import CardParticleSystem from '@/components/particles/CardParticleSystem';
import ParticleEffectsControls from './viewer-components/ParticleEffectsControls';
import { useExplodedView } from '@/hooks/useExplodedView';
import ExplodedViewControls from './viewer-components/ExplodedViewControls';
import ExplodedCardView from './viewer-components/ExplodedCardView';

interface FullscreenViewerProps {
  cardId: string;
  onClose: () => void;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ cardId, onClose }) => {
  const { cards, getCardById } = useCards();
  const card = getCardById ? getCardById(cardId) : cards.find(c => c.id === cardId);
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const {
    position,
    zoom,
    isAutoRotating,
    isDragging,
    mousePosition,
    setIsDragging,
    handleMouseMove,
    handleCardReset,
    handleKeyboardControls,
    handleZoomIn,
    handleZoomOut,
    toggleAutoRotation,
    setPosition,
    setupWheelListener
  } = useCardInteraction({ containerRef, cardRef });

  // Add lighting system
  const {
    lightingSettings,
    updateLightPosition,
    toggleFollowPointer,
    toggleAutoRotate,
    updateLightSetting,
    applyPreset
  } = useCardLighting('display_case');

  // Add particle effects system
  const {
    particleState,
    toggleEffect,
    updateEffectSettings,
    applyPreset: applyParticlePreset,
    toggleSystem,
    toggleAutoAdjust,
    setPerformanceLevel
  } = useParticleEffects({
    card,
    shouldAutoDetectCardType: true
  });
  
  // Add exploded view system
  const {
    settings: explodedViewSettings,
    layers,
    layerGroups,
    layerPositions,
    toggleExplodedView,
    setExplosionDistance,
    setExplosionType,
    toggleLayerVisibility,
    selectLayer,
    setSpecialView
  } = useExplodedView({ card });

  const [isFlipped, setIsFlipped] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [effectIntensities, setEffectIntensities] = useState<Record<string, number>>({
    Holographic: 0.7,
    Refractor: 0.8,
    Chrome: 0.6,
    Vintage: 0.5,
  });
  const [touchImprintAreas, setTouchImprintAreas] = useState([
    { id: 'flip-corner', active: false },
    { id: 'zoom-center', active: false },
    { id: 'rotate-edges', active: false }
  ]);

  const [featuresBarMinimized, setFeaturesBarMinimized] = useState(false);
  const [showExplodedView, setShowExplodedView] = useState(false);
  const [showLighting, setShowLighting] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  // Handle mouse move for both card interaction and lighting
  const handleCombinedMouseMove = (e: React.MouseEvent) => {
    handleMouseMove(e);
    
    // Update lighting if container ref exists
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      updateLightPosition(x, y);
    }
  };

  useEffect(() => {
    // Update position to include z coordinate
    setPosition({ x: 10, y: 15, z: 0 });
  }, [setPosition]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardControls);
    return () => {
      window.removeEventListener('keydown', handleKeyboardControls);
    };
  }, [handleKeyboardControls]);

  useEffect(() => {
    const cleanup = setupWheelListener();
    return () => {
      if (cleanup) cleanup();
    };
  }, [setupWheelListener]);

  // Sync the internal exploded view state with component state
  useEffect(() => {
    setShowExplodedView(explodedViewSettings.active);
  }, [explodedViewSettings.active]);

  const handleToggleFullscreen = () => {
    toast.info('Fullscreen toggle - feature coming soon');
  };

  const handleShare = () => {
    toast.info('Share feature coming soon');
  };

  const handleToggleExplodedView = () => {
    toggleExplodedView();
    
    if (!explodedViewSettings.active) {
      toast.info('Exploded view activated', {
        description: 'Explore the card layers in 3D'
      });
    } else {
      toast.info('Exploded view deactivated');
    }
  };

  const handleEffectToggle = (effect: string) => {
    setActiveEffects(prev => 
      prev.includes(effect) ? prev.filter(e => e !== effect) : [...prev, effect]
    );
  };

  const handleToggleLighting = () => {
    setShowLighting(prev => !prev);
    if (!showLighting) {
      toast.info('Lighting controls activated');
    }
  };

  const handleToggleParticles = () => {
    setShowParticles(prev => !prev);
    if (!showParticles) {
      toast.info('Particle effects activated');
    }
  };

  if (!card) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white text-lg">Card not found</div>
        <button 
          className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50"
          onClick={onClose}
        >
          <X size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="absolute top-0 left-0 right-0 z-30 flex justify-center">
        <div className={`${featuresBarMinimized ? 'w-20' : 'w-auto px-6'} transition-all duration-300 bg-gray-900/80 backdrop-blur-md rounded-b-lg`}>
          {featuresBarMinimized ? (
            <button 
              onClick={() => setFeaturesBarMinimized(false)}
              className="w-full py-2 text-white font-bold flex items-center justify-center hover:bg-gray-800/50 transition-colors"
            >
              CRD <ChevronDown size={16} className="ml-1" />
            </button>
          ) : (
            <div className="py-3 flex items-center space-x-4 relative">
              <button 
                onClick={() => setFeaturesBarMinimized(true)}
                className="absolute right-1 top-1 text-gray-400 hover:text-white p-1"
                aria-label="Minimize"
              >
                <ChevronUp size={18} />
              </button>
              
              <button 
                onClick={handleCardReset} 
                className="text-white hover:text-blue-300 transition-colors"
                title="Reset View"
              >
                Reset View
              </button>
              
              <button 
                onClick={() => setIsFlipped(!isFlipped)} 
                className={`text-white hover:text-blue-300 transition-colors ${isFlipped ? 'text-blue-400' : ''}`}
                title="Flip Card"
              >
                Flip Card
              </button>
              
              <button 
                onClick={toggleAutoRotation}
                className={`text-white hover:text-blue-300 transition-colors ${isAutoRotating ? 'text-blue-400' : ''}`}
                title="Auto Rotate"
              >
                Auto Rotate
              </button>
              
              <button 
                onClick={handleToggleExplodedView}
                className={`text-white hover:text-blue-300 transition-colors ${showExplodedView ? 'text-blue-400' : ''}`}
                title="Exploded View"
              >
                <Layers size={16} className="inline mr-1" /> Exploded View
              </button>
              
              <button 
                onClick={handleToggleLighting}
                className={`text-white hover:text-blue-300 transition-colors ${showLighting ? 'text-blue-400' : ''}`}
                title="Lighting"
              >
                <Lightbulb size={16} className="inline mr-1" /> Lighting
              </button>
              
              <button 
                onClick={handleToggleParticles}
                className={`text-white hover:text-blue-300 transition-colors ${showParticles ? 'text-blue-400' : ''}`}
                title="Particles"
              >
                <Sparkles size={16} className="inline mr-1" /> Particles
              </button>
              
              <button 
                onClick={() => setShowInfo(!showInfo)}
                className={`text-white hover:text-blue-300 transition-colors ${showInfo ? 'text-blue-400' : ''}`}
                title="Info"
              >
                Info
              </button>
            </div>
          )}
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative flex-1 flex items-center justify-center overflow-hidden z-10"
        onMouseMove={handleCombinedMouseMove}
      >
        {/* Regular card display when exploded view is not active */}
        {!showExplodedView && (
          <CardDisplay
            card={card}
            rotation={{ x: position.x, y: position.y, z: position.z }}
            isFlipped={isFlipped}
            zoom={zoom}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            cardRef={cardRef}
            containerRef={containerRef}
            isAutoRotating={isAutoRotating}
            activeEffects={activeEffects}
            effectIntensities={effectIntensities}
            mousePosition={mousePosition}
            touchImprintAreas={touchImprintAreas}
            showExplodedView={showExplodedView}
            lightingSettings={lightingSettings}
          />
        )}
        
        {/* Exploded view when active */}
        {showExplodedView && (
          <div 
            className="relative w-80 h-120"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${position.x}deg) rotateX(${position.y}deg) scale(${zoom})`,
            }}
          >
            <ExplodedCardView
              card={card}
              isActive={showExplodedView}
              layers={layers}
              layerPositions={layerPositions}
              visibleLayerIds={explodedViewSettings.visibleLayerIds}
              selectedLayerId={explodedViewSettings.selectedLayerId}
              specialView={explodedViewSettings.specialView}
              showAnnotations={true}
            />
          </div>
        )}
        
        {/* Particle Effects System */}
        {!showExplodedView && (
          <CardParticleSystem
            containerRef={containerRef}
            particleState={particleState}
            cardRotation={{ x: position.x, y: position.y, z: position.z }}
            isFlipped={isFlipped}
            isMoving={isDragging || isAutoRotating}
          />
        )}
        
        <div className="absolute left-4 top-20 bottom-4 w-80 pointer-events-auto flex flex-col gap-4 overflow-y-auto">
          {showLighting && (
            <LightingControls
              lightingSettings={lightingSettings}
              onToggleFollowPointer={toggleFollowPointer}
              onToggleAutoRotate={toggleAutoRotate}
              onUpdateLightSetting={updateLightSetting}
              onApplyPreset={applyPreset}
            />
          )}
          
          {showParticles && (
            <ParticleEffectsControls
              particleState={particleState}
              onToggleEffect={toggleEffect}
              onUpdateEffectSettings={updateEffectSettings}
              onApplyPreset={applyParticlePreset}
              onToggleSystem={toggleSystem}
              onToggleAutoAdjust={toggleAutoAdjust}
              onSetPerformanceLevel={setPerformanceLevel}
            />
          )}
          
          {showExplodedView && (
            <ExplodedViewControls
              isActive={showExplodedView}
              layers={layers}
              layerGroups={layerGroups}
              explosionDistance={explodedViewSettings.explosionDistance}
              explosionType={explodedViewSettings.explosionType}
              selectedLayerId={explodedViewSettings.selectedLayerId}
              visibleLayerIds={explodedViewSettings.visibleLayerIds}
              specialView={explodedViewSettings.specialView}
              onExplosionDistanceChange={setExplosionDistance}
              onExplosionTypeChange={setExplosionType}
              onLayerVisibilityToggle={toggleLayerVisibility}
              onLayerSelect={selectLayer}
              onSpecialViewChange={setSpecialView}
              onClose={handleToggleExplodedView}
            />
          )}
          
          {!showExplodedView && (
            <CardEffectsPanel 
              activeEffects={activeEffects}
              onToggleEffect={handleEffectToggle}
              onEffectIntensityChange={(effect, intensity) => {
                setEffectIntensities(prev => ({ ...prev, [effect]: intensity }));
              }}
              effectIntensities={effectIntensities}
            />
          )}
        </div>
      </div>

      <ViewerControls
        isFlipped={isFlipped}
        isAutoRotating={isAutoRotating}
        showInfo={showInfo}
        onFlipCard={() => setIsFlipped(!isFlipped)}
        onToggleAutoRotation={toggleAutoRotation}
        onToggleInfo={() => setShowInfo(!showInfo)}
        onToggleFullscreen={handleToggleFullscreen}
        onShare={handleShare}
        onClose={onClose}
      />

      <InfoPanel card={card} showInfo={showInfo} />
      
      <MiniActionBar />
    </div>
  );
};

export default FullscreenViewer;
