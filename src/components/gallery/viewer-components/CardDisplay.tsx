
import React from 'react';
import { Card } from '@/lib/types';
import { CubeFace } from './card-elements/CubeFace';
import { CubeFaceContent } from './card-elements/CubeFaceContent';
import { AccessibilityInfo } from './card-elements/AccessibilityInfo';
import '../../../styles/card-interactions.css';

interface CardDisplayProps {
  card: Card;
  rotation: { x: number; y: number; rotation?: number };
  isFlipped: boolean;
  zoom: number;
  isDragging?: boolean;
  setIsDragging?: React.Dispatch<React.SetStateAction<boolean>>;
  cardRef?: React.RefObject<HTMLDivElement>;
  containerRef?: React.RefObject<HTMLDivElement>;
  isAutoRotating?: boolean;
  activeEffects: string[];
  effectIntensities?: Record<string, number>;
  mousePosition: { x: number; y: number };
  touchImprintAreas?: Array<{ id: string; active: boolean }>;
}

const CardDisplay: React.FC<CardDisplayProps> = ({
  card,
  rotation,
  isFlipped,
  zoom,
  cardRef,
  activeEffects,
  effectIntensities = {},
  mousePosition,
}) => {
  const CUBE_SIZE = 250;

  const generateEffectStyles = () => ({
    '--mouse-x': `${mousePosition.x * 100}%`,
    '--mouse-y': `${mousePosition.y * 100}%`,
    ...Object.entries(effectIntensities).reduce((acc, [effect, intensity]) => ({
      ...acc,
      [`--${effect.toLowerCase()}-intensity`]: activeEffects.includes(effect) ? intensity : "0"
    }), {})
  } as React.CSSProperties);

  return (
    <div className="flex items-center justify-center gap-8 px-8" style={{ perspective: '2000px' }}>
      <div 
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`${card.title} trading card cube. Press F to flip, arrow keys to rotate, plus and minus to zoom.`}
        className="relative transition-all duration-700 transform-gpu"
        style={{
          transformStyle: 'preserve-3d',
          transform: `
            perspective(1000px) 
            rotateX(${rotation.x}deg) 
            rotateY(${rotation.y}deg) 
            scale(${zoom})
          `,
          width: `${CUBE_SIZE}px`,
          height: `${CUBE_SIZE}px`,
          ...generateEffectStyles()
        }}
      >
        {/* Front face */}
        <CubeFace position="front" size={CUBE_SIZE}>
          <CubeFaceContent type="image" card={card} />
        </CubeFace>

        {/* Right face */}
        <CubeFace position="right" size={CUBE_SIZE}>
          <CubeFaceContent 
            type="image" 
            card={card}
            title={card.team || 'Side View'}
            filter="grayscale(50%)"
            opacity={0.7}
          />
        </CubeFace>

        {/* Top face */}
        <CubeFace position="top" size={CUBE_SIZE}>
          <CubeFaceContent 
            type="image" 
            card={card}
            title={card.year || 'Top View'}
            filter="hue-rotate(45deg) contrast(1.2)"
            opacity={0.6}
          />
        </CubeFace>

        {/* Back face */}
        <CubeFace position="back" size={CUBE_SIZE}>
          <CubeFaceContent type="solid" title="Back" bgClass="bg-gray-700" />
        </CubeFace>

        {/* Bottom face */}
        <CubeFace position="bottom" size={CUBE_SIZE}>
          <CubeFaceContent type="solid" title="Bottom" bgClass="bg-gray-800" />
        </CubeFace>

        {/* Left face */}
        <CubeFace position="left" size={CUBE_SIZE}>
          <CubeFaceContent type="solid" title="Left" bgClass="bg-gray-900" />
        </CubeFace>
      </div>

      <AccessibilityInfo />
    </div>
  );
};

export default CardDisplay;
