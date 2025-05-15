
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/lib/types/cardTypes';

interface CardCanvasProps {
  cardData: Partial<Card>;
  onUpdate?: (updates: Partial<Card>) => void;
  readOnly?: boolean;
}

const DEFAULT_CARD_STYLE = {
  template: 'classic',
  effect: 'none',
  borderRadius: '8px',
  borderWidth: 2,
  borderColor: '#000000',
  backgroundColor: '#FFFFFF',
  shadowColor: 'rgba(0,0,0,0.2)',
  frameWidth: 2,
  frameColor: '#000000',
};

const DEFAULT_TEXT_STYLE = {
  fontFamily: 'Inter',
  fontSize: '16px',
  fontWeight: 'normal',
  color: '#000000',
  titleColor: '#000000',
  titleAlignment: 'center',
  titleWeight: 'bold',
  descriptionColor: '#333333',
};

const CardCanvas: React.FC<CardCanvasProps> = ({ cardData, onUpdate, readOnly = false }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Extract card style from cardData or use defaults
  const cardStyle = cardData.designMetadata?.cardStyle || DEFAULT_CARD_STYLE;
  const textStyle = cardData.designMetadata?.textStyle || DEFAULT_TEXT_STYLE;

  // Set up canvas interaction handlers
  useEffect(() => {
    if (readOnly || !canvasRef.current) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (!onUpdate) return;
      setIsInteracting(true);
      // Interaction logic could be added here
    };

    const handleMouseUp = () => {
      setIsInteracting(false);
    };

    const element = canvasRef.current;
    element.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [readOnly, onUpdate]);

  // Build card class names based on active effects
  const getCardClassNames = () => {
    const classes = ['card-canvas'];
    
    if (cardData.effects) {
      if (cardData.effects.includes('holographic')) classes.push('holographic-effect');
      if (cardData.effects.includes('refractor')) classes.push('refractor-effect');
      if (cardData.effects.includes('gold-foil')) classes.push('gold-foil-effect');
    }
    
    return classes.join(' ');
  };

  return (
    <div
      ref={canvasRef}
      className={getCardClassNames()}
      style={{
        width: '100%',
        maxWidth: '400px',
        height: '560px',
        margin: '0 auto',
        borderRadius: cardStyle.borderRadius,
        backgroundColor: cardStyle.backgroundColor,
        boxShadow: `0 4px 8px ${cardStyle.shadowColor}`,
        border: `${cardStyle.borderWidth}px solid ${cardStyle.borderColor}`,
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none',
        cursor: readOnly ? 'default' : 'pointer',
      }}
    >
      {/* Card image */}
      {cardData.imageUrl && (
        <div className="card-image-container" style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}>
          <img 
            src={cardData.imageUrl}
            alt={cardData.title || 'Card image'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>
      )}
      
      {/* Card title and description overlay */}
      <div className="card-content" style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        padding: '20px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
        color: '#fff',
        zIndex: 2,
      }}>
        {cardData.title && (
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: textStyle.titleWeight,
              marginBottom: '0.5rem',
              color: textStyle.titleColor,
              textAlign: textStyle.titleAlignment as any,
            }}
          >
            {cardData.title}
          </h3>
        )}
        
        {cardData.description && (
          <p
            style={{
              fontSize: '0.9rem',
              color: textStyle.descriptionColor,
              margin: 0,
            }}
          >
            {cardData.description}
          </p>
        )}
      </div>
      
      {/* Handle interactions overlay (only when not readOnly) */}
      {!readOnly && (
        <div className="card-interactions" style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          zIndex: isInteracting ? 100 : 3,
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
};

export default CardCanvas;
