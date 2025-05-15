
import React from 'react';
import { Card } from '@/lib/types/cardTypes';
import { DEFAULT_CARD_STYLE, DEFAULT_TEXT_STYLE } from '@/components/card-templates/TemplateTypes';

interface CardCanvasProps {
  cardData: Partial<Card>;
  onUpdate?: (updates: Partial<Card>) => void;
}

const CardCanvas: React.FC<CardCanvasProps> = ({ cardData, onUpdate }) => {
  // Ensure we have designMetadata with defaults
  const designMetadata = cardData.designMetadata || {};
  const cardStyle = designMetadata.cardStyle || DEFAULT_CARD_STYLE;
  const textStyle = designMetadata.textStyle || DEFAULT_TEXT_STYLE;

  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative aspect-[2.5/3.5] w-full max-w-[300px] border rounded-lg overflow-hidden shadow-lg"
        style={{
          borderRadius: cardStyle.borderRadius,
          borderColor: cardStyle.borderColor || DEFAULT_CARD_STYLE.borderColor,
          borderWidth: cardStyle.frameWidth || DEFAULT_CARD_STYLE.frameWidth,
          backgroundColor: cardStyle.backgroundColor || DEFAULT_CARD_STYLE.backgroundColor,
          boxShadow: `0 4px 6px ${cardStyle.shadowColor || DEFAULT_CARD_STYLE.shadowColor}`,
        }}
      >
        {/* Card background */}
        {cardData.imageUrl && (
          <div className="absolute inset-0 z-0">
            <img 
              src={cardData.imageUrl} 
              alt={cardData.title || "Card"} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Card content */}
        <div className="absolute inset-0 z-10 p-4 flex flex-col justify-between">
          <div className="text-center">
            <h3 
              className="text-lg font-bold"
              style={{ 
                color: textStyle.titleColor || DEFAULT_TEXT_STYLE.titleColor,
                fontFamily: textStyle.fontFamily || DEFAULT_TEXT_STYLE.fontFamily,
                fontWeight: textStyle.titleWeight as any || DEFAULT_TEXT_STYLE.titleWeight,
                textAlign: textStyle.titleAlignment as any || DEFAULT_TEXT_STYLE.titleAlignment,
              }}
            >
              {cardData.title || "Card Title"}
            </h3>
          </div>
          
          <div>
            <p 
              className="text-sm"
              style={{ 
                color: textStyle.descriptionColor || DEFAULT_TEXT_STYLE.descriptionColor,
                fontFamily: textStyle.fontFamily || DEFAULT_TEXT_STYLE.fontFamily,
              }}
            >
              {cardData.description || "Card description goes here"}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Interactive preview - changes update in real-time</p>
      </div>
    </div>
  );
};

export default CardCanvas;
