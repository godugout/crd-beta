
import React from 'react';
import { cn } from '@/lib/utils';
import { CardStyle } from './CardDesignCustomization';
import { TextStyle } from './CardTextCustomization';
import FabricSwatch from '@/components/home/card-effects/FabricSwatch';

interface CardPreviewProps {
  imageUrl: string;
  title: string;
  description: string;
  fabricSwatches: Array<{
    type: string;
    team: string;
    year: string;
    manufacturer: string;
    position: string;
    size: string;
  }>;
  cardStyle: CardStyle;
  textStyle: TextStyle;
}

const CardPreview: React.FC<CardPreviewProps> = ({
  imageUrl,
  title,
  description,
  fabricSwatches,
  cardStyle,
  textStyle
}) => {
  const getFontClass = (font: string) => {
    switch (font) {
      case 'sans': return 'font-sans';
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      default: return 'font-sans';
    }
  };
  
  const getAlignmentClass = (alignment: string) => {
    switch (alignment) {
      case 'left': return 'text-left';
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };
  
  const getOverlayClass = (position: string) => {
    switch (position) {
      case 'top': return 'top-0 left-0 right-0 h-1/3';
      case 'bottom': return 'bottom-0 left-0 right-0 h-1/3';
      case 'full': return 'inset-0';
      default: return 'bottom-0 left-0 right-0 h-1/3';
    }
  };
  
  return (
    <div className="w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Final Card Preview</h2>
      
      <div className="flex justify-center">
        <div className="w-full max-w-xs">
          <div 
            className={cn(
              "w-full aspect-[2.5/3.5] overflow-hidden shadow-xl transition-all duration-300",
              cardStyle.effect === 'refractor' && "bg-gradient-to-br from-blue-400 to-purple-500 p-[2px]",
              cardStyle.effect === 'prism' && "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-[2px]",
              cardStyle.effect === 'chrome' && "bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 p-[2px]",
              cardStyle.effect === 'gold' && "bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 p-[2px]",
              cardStyle.effect === 'vintage' && "bg-amber-800/30 p-[2px]"
            )}
            style={{ 
              borderRadius: `${cardStyle.borderRadius}px`,
              borderWidth: `${cardStyle.borderWidth}px`,
              borderColor: cardStyle.borderColor,
              borderStyle: 'solid'
            }}
          >
            <div 
              className="w-full h-full relative overflow-hidden"
              style={{ 
                borderRadius: `${Math.max(0, cardStyle.borderRadius - cardStyle.borderWidth)}px`,
                backgroundColor: cardStyle.backgroundColor
              }}
            >
              {imageUrl && (
                <img 
                  src={imageUrl} 
                  alt="Card preview" 
                  className={cn(
                    "w-full h-full object-cover transition-all duration-300",
                    cardStyle.effect === 'vintage' && "sepia brightness-90 contrast-125"
                  )}
                  style={{ 
                    filter: `brightness(${cardStyle.brightness}%) contrast(${cardStyle.contrast}%) saturate(${cardStyle.saturation}%)`
                  }}
                />
              )}
              
              {/* Effect overlays */}
              {cardStyle.effect === 'refractor' && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/20 mix-blend-overlay pointer-events-none" />
              )}
              
              {cardStyle.effect === 'prism' && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/20 mix-blend-overlay pointer-events-none" />
              )}
              
              {cardStyle.effect === 'chrome' && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200/20 via-white/10 to-gray-200/20 mix-blend-overlay pointer-events-none" />
              )}
              
              {cardStyle.effect === 'gold' && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/30 via-yellow-400/20 to-yellow-200/30 mix-blend-overlay pointer-events-none" />
              )}
              
              {/* Fabric swatches */}
              {imageUrl && fabricSwatches.map((swatch, index) => (
                <div key={index} className="absolute" style={{ top: `${10 + (index * 25)}%`, right: '5%' }}>
                  <FabricSwatch 
                    fabricType={swatch.type}
                    team={swatch.team}
                    year={swatch.year}
                    manufacturer={swatch.manufacturer}
                    position={swatch.position as any}
                    size={swatch.size as any}
                  />
                </div>
              ))}
              
              {/* Text overlay */}
              {textStyle.showOverlay && (
                <div 
                  className={cn("absolute", getOverlayClass(textStyle.overlayPosition))}
                  style={{ 
                    backgroundColor: textStyle.overlayColor,
                    opacity: textStyle.overlayOpacity / 100
                  }}
                />
              )}
              
              {/* Text content */}
              <div className="absolute inset-0 p-4 flex flex-col">
                <h3 
                  className={cn(
                    getFontClass(textStyle.titleFont),
                    getAlignmentClass(textStyle.titleAlignment),
                    textStyle.titleWeight === 'bold' ? 'font-bold' : 'font-normal',
                    textStyle.titleStyle === 'italic' ? 'italic' : 'not-italic'
                  )}
                  style={{ 
                    color: textStyle.titleColor,
                    fontSize: `${textStyle.titleSize}px`,
                  }}
                >
                  {title}
                </h3>
                
                <div className="mt-auto">
                  <p 
                    className={cn(
                      getFontClass(textStyle.descriptionFont),
                      'text-sm'
                    )}
                    style={{ 
                      color: textStyle.descriptionColor,
                      fontSize: `${textStyle.descriptionSize}px`,
                    }}
                  >
                    {description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 mb-4">Your card is ready for the collection!</p>
      </div>
    </div>
  );
};

export default CardPreview;
