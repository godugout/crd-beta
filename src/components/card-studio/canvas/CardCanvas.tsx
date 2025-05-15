
import React from 'react';
import { Card } from '@/lib/types/cardTypes';

interface CardCanvasProps {
  cardData: Partial<Card>;
  onUpdate?: (updates: Partial<Card>) => void;
}

const CardCanvas: React.FC<CardCanvasProps> = ({ 
  cardData,
  onUpdate
}) => {
  // Safely access nested properties with default values
  const designMetadata = cardData.designMetadata || {};
  const cardStyle = designMetadata.cardStyle || {};
  const textStyle = designMetadata.textStyle || {};
  
  return (
    <div className="relative w-full aspect-[2.5/3.5] max-w-md mx-auto">
      <div className="card-canvas w-full h-full overflow-hidden relative flex flex-col">
        {/* Card Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            backgroundColor: cardStyle.backgroundColor || '#FFFFFF',
          }}
        />
        
        {/* Card Image */}
        {cardData.imageUrl && (
          <div 
            className="w-full h-full z-10 relative"
          >
            <img 
              src={cardData.imageUrl} 
              alt={cardData.title || "Card image"} 
              className="w-full h-full object-cover"
              style={{
                filter: cardStyle.effect === 'vintage' ? 'sepia(0.5)' : 
                       cardStyle.effect === 'chrome' ? 'contrast(1.1) brightness(1.1)' : 'none'
              }}
            />
          </div>
        )}
        
        {/* Card Border/Frame */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ 
            borderRadius: cardStyle.borderRadius || '8px',
            borderWidth: cardStyle.borderWidth || 2,
            borderStyle: 'solid',
            borderColor: cardStyle.borderColor || '#000000',
            backgroundColor: 'transparent',
            boxShadow: `0 4px 8px ${cardStyle.shadowColor || 'rgba(0,0,0,0.2)'}`,
          }}
        />
        
        {/* Text Content */}
        <div className="absolute inset-0 z-30 p-4 flex flex-col">
          {cardData.title && (
            <h3 
              className="card-title"
              style={{ 
                color: textStyle.titleColor || '#000000',
                textAlign: (textStyle.titleAlignment as any) || 'center',
                fontWeight: textStyle.titleWeight || 'bold',
                fontFamily: textStyle.fontFamily || 'sans-serif',
                fontSize: textStyle.fontSize || '16px',
              }}
            >
              {cardData.title}
            </h3>
          )}
          
          {cardData.description && (
            <p 
              className="card-description mt-auto"
              style={{ 
                color: textStyle.descriptionColor || '#333333',
              }}
            >
              {cardData.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardCanvas;
