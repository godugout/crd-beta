
import React, { useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';

interface CardViewerProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
}

const CardViewer: React.FC<CardViewerProps> = ({
  card,
  isFlipped,
  activeEffects,
  effectIntensities,
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  useKeyboardControls({
    onRotateLeft: () => setRotation(prev => ({ ...prev, x: prev.x - 5 })),
    onRotateRight: () => setRotation(prev => ({ ...prev, x: prev.x + 5 })),
    onRotateUp: () => setRotation(prev => ({ ...prev, y: prev.y - 5 })),
    onRotateDown: () => setRotation(prev => ({ ...prev, y: prev.y + 5 })),
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX - rotation.x, y: e.clientY - rotation.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setRotation({
        x: (e.clientX - startPosition.x) * 0.5,
        y: (e.clientY - startPosition.y) * 0.5,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <motion.div
        className={`card-container w-80 h-120 relative perspective-1000 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotation.x}deg) rotateX(${rotation.y}deg)`,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isFlipped ? 'back' : 'front'}
            className="absolute inset-0 w-full h-full backface-hidden"
            initial={{ rotateY: isFlipped ? 180 : 0 }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            exit={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className={`w-full h-full rounded-xl overflow-hidden shadow-xl ${
              activeEffects.map(effect => `effect-${effect.toLowerCase()}`).join(' ')
            }`}>
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-full object-cover"
              />
              {/* Effect overlays */}
              {activeEffects.map(effect => (
                <div
                  key={effect}
                  className={`absolute inset-0 effect-overlay-${effect.toLowerCase()}`}
                  style={{
                    opacity: effectIntensities[effect] || 0.5,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CardViewer;
