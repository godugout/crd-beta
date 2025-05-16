
import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/lib/types/cardTypes';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { useIsMobile } from '@/hooks/use-mobile';

interface CardPreviewProps {
  card?: Partial<Card>;
  className?: string;
  effectClasses?: string;
}

const CardPreview = React.forwardRef<HTMLDivElement, CardPreviewProps>(({
  card,
  className,
  effectClasses = ''
}, ref) => {
  const { reduceEffects, optimizedRendering } = useMobileOptimization();
  const isMobile = useIsMobile();
  
  if (!card || !card.imageUrl) {
    return (
      <div 
        ref={ref}
        className={cn(
          "aspect-[2.5/3.5] bg-gray-100 rounded-lg border flex flex-col items-center justify-center text-gray-400",
          className
        )}
      >
        <p className="text-center px-4">
          Upload an image to see your card preview
        </p>
      </div>
    );
  }
  
  // Ensure we have default values for required properties with proper type safety
  const designMetadata = card.designMetadata || {
    cardStyle: {
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      borderColor: '#000000',
      template: 'classic',
      effect: 'none',
      frameWidth: 2,
      shadowColor: 'rgba(0,0,0,0.2)',
      frameColor: '#000000'
    },
    textStyle: {
      titleColor: '#FFFFFF',
      titleWeight: 'bold',
      titleAlignment: 'center',
      descriptionColor: '#DDDDDD'
    },
    cardMetadata: {},
    marketMetadata: {
      isPrintable: false,
      isForSale: false,
      includeInCatalog: false
    }
  };
  
  const cardStyle = designMetadata.cardStyle || {}; 
  const textStyle = designMetadata.textStyle || {};
  
  // Extract properties with defaults
  const backgroundColor = cardStyle.backgroundColor || '#FFFFFF';
  const borderRadius = cardStyle.borderRadius || '8px';
  const borderColor = cardStyle.borderColor || '#000000';
  const titleColor = textStyle.titleColor || '#FFFFFF';
  const titleWeight = textStyle.titleWeight || 'bold';
  const titleAlignment = (textStyle.titleAlignment || 'center') as any;
  const descriptionColor = textStyle.descriptionColor || '#DDDDDD';

  // Apply lower quality effects on mobile devices to improve performance
  const appliedEffectClasses = reduceEffects ? 
    effectClasses.replace('premium-', 'standard-').replace('-high', '') : 
    effectClasses;
  
  return (
    <div className="relative" ref={ref}>
      <div 
        className={cn(
          "aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-xl transition-all duration-300",
          appliedEffectClasses,
          className
        )}
        style={{
          backgroundColor,
          borderRadius,
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor,
          transform: `scale(${optimizedRendering.resolution})`,
          transformOrigin: 'center',
        }}
      >
        <div className="relative w-full h-full">
          <ResponsiveImage 
            src={card.imageUrl}
            srcMobile={card.imageUrl}
            lowQualitySrc={card.thumbnailUrl || card.imageUrl}
            alt={card.title || "Card preview"} 
            className="w-full h-full object-cover"
            loading={isMobile ? "lazy" : "eager"}
          />
          
          {card.title && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <h3 
                className="text-white text-sm font-bold truncate"
                style={{ 
                  color: titleColor,
                  fontWeight: titleWeight,
                  textAlign: titleAlignment
                }}
              >
                {card.title}
              </h3>
              {card.player && (
                <p 
                  className="text-white/80 text-xs truncate"
                  style={{ 
                    color: descriptionColor,
                  }}
                >
                  {card.player}
                  {card.team && ` • ${card.team}`}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

CardPreview.displayName = 'CardPreview';

export default CardPreview;
