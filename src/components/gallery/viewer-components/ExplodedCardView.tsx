
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayerInfo } from '@/lib/types/layerTypes';
import { Card } from '@/lib/types';

interface ExplodedCardViewProps {
  card: Card;
  isActive: boolean;
  layers: LayerInfo[];
  layerPositions: Record<string, { x: number; y: number; z: number }>;
  visibleLayerIds: string[];
  selectedLayerId: string | null;
  specialView: 'normal' | 'cross-section' | 'wireframe' | 'xray' | 'timeline';
  showAnnotations?: boolean;
  transitionDuration?: number;
}

const ExplodedCardView: React.FC<ExplodedCardViewProps> = ({
  card,
  isActive,
  layers,
  layerPositions,
  visibleLayerIds,
  selectedLayerId,
  specialView,
  showAnnotations = true,
  transitionDuration = 0.8
}) => {
  // Fallback image for layer rendering
  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
  
  // State to track if the layers have been prepared for rendering
  const [isLoaded, setIsLoaded] = useState(false);
  const [layerImages, setLayerImages] = useState<Record<string, string>>({});

  // Prepare layer images
  useEffect(() => {
    // In a real implementation, this would load or generate actual layer images
    // For now, we'll simulate with the card image and overlays
    
    const baseLayerImage = card.imageUrl || fallbackImage;
    
    const simulatedLayers: Record<string, string> = {
      'base': baseLayerImage,
      'background': baseLayerImage,
      'main-image': baseLayerImage,
      'text-info': baseLayerImage,
      'border': baseLayerImage
    };
    
    // Add special effect layers if they exist
    layers.forEach(layer => {
      if (!simulatedLayers[layer.id]) {
        simulatedLayers[layer.id] = baseLayerImage;
      }
    });
    
    setLayerImages(simulatedLayers);
    setIsLoaded(true);
  }, [card, layers]);

  // Apply special view effects
  const getSpecialViewEffect = (layerId: string) => {
    switch (specialView) {
      case 'wireframe':
        return 'mix-blend-difference contrast-200 grayscale';
      case 'xray':
        return 'brightness-150 invert hue-rotate-180';
      case 'cross-section':
        return layers.findIndex(l => l.id === layerId) % 2 === 0 
          ? 'brightness-100' 
          : 'brightness-50 contrast-150';
      default:
        return '';
    }
  };

  if (!isLoaded) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full perspective-1000">
      {/* Visible layers */}
      {layers
        .filter(layer => visibleLayerIds.includes(layer.id))
        .sort((a, b) => a.position - b.position)
        .map(layer => {
          const position = layerPositions[layer.id] || { x: 0, y: 0, z: 0 };
          const isSelected = layer.id === selectedLayerId;
          const specialEffectClass = getSpecialViewEffect(layer.id);
          
          return (
            <AnimatePresence key={layer.id}>
              <motion.div
                className={`absolute inset-0 pointer-events-none ${specialEffectClass}`}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  z: 0,
                  opacity: 0 
                }}
                animate={{ 
                  x: position.x * 30, // Scale for visual effect
                  y: position.y * 30,
                  z: position.z * 30,
                  opacity: layer.opacity,
                  scale: isSelected ? 1.05 : 1,
                  filter: isSelected ? 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))' : 'none'
                }}
                transition={{ 
                  duration: transitionDuration,
                  ease: "easeInOut"
                }}
                style={{ 
                  zIndex: layer.position,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden'
                }}
              >
                <div 
                  className="w-full h-full relative rounded-xl overflow-hidden"
                  style={{
                    backgroundImage: layer.type === 'foil' 
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.3) 100%)' 
                      : 'none',
                    backgroundColor: layer.color || 'transparent'
                  }}
                >
                  {/* Layer content - in a production environment, these would be actual layer textures */}
                  {layerImages[layer.id] && layer.type !== 'text' && (
                    <div 
                      className="absolute inset-0 opacity-70"
                      style={{
                        backgroundImage: `url(${layerImages[layer.id]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: layer.type === 'border' ? 0.8 : 
                                layer.type === 'foil' ? 0.6 : 
                                layer.type === 'texture' ? 0.4 : 0.7,
                        mixBlendMode: layer.type === 'foil' ? 'overlay' : 
                                      layer.type === 'texture' ? 'multiply' : 'normal'
                      }}
                    />
                  )}
                  
                  {/* Text layer content simulation */}
                  {layer.type === 'text' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-4">
                      <div className="w-full bg-black/40 text-white p-2 rounded">
                        <div className="text-center text-sm font-bold">{card.title}</div>
                        {card.team && <div className="text-center text-xs">{card.team}</div>}
                        {card.year && <div className="text-center text-xs">{card.year}</div>}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Layer highlights for selected layer */}
                {isSelected && (
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none" />
                )}
                
                {/* Annotations */}
                {showAnnotations && layer.annotations && layer.annotations.map(annotation => (
                  <div
                    key={annotation.id}
                    className="absolute w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                    style={{
                      left: `${annotation.position.x * 100}%`,
                      top: `${annotation.position.y * 100}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 50
                    }}
                  >
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          );
      })}
    </div>
  );
};

export default ExplodedCardView;
