
import React, { useState } from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CardBase, CardBaseProps } from './CardBase';
import { CardImage } from './CardImage';
import { CardInfoOverlay } from './CardInfoOverlay';

export interface CardThumbnailProps extends Omit<CardBaseProps, 'children'> {
  /**
   * Whether to show the info overlay
   * @default true
   */
  showInfo?: boolean;
  
  /**
   * Whether to only show the info overlay on hover
   * @default true
   */
  infoOnHover?: boolean;
  
  /**
   * Custom styles for the card
   */
  cardStyle?: React.CSSProperties;
}

/**
 * Card thumbnail component for displaying in grids and lists
 */
export const CardThumbnail: React.FC<CardThumbnailProps> = ({
  card,
  className,
  onClick,
  enableEffects = false,
  activeEffects = [],
  showInfo = true,
  infoOnHover = true,
  cardStyle,
  ...props
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isImageError, setIsImageError] = useState(false);

  // Extract card styling from design metadata if available
  const styleFromMetadata = React.useMemo(() => {
    const style: React.CSSProperties = {};
    const metadata = card.designMetadata?.cardStyle || {};
    
    if (metadata.borderColor) style.borderColor = metadata.borderColor;
    if (metadata.borderWidth) style.borderWidth = `${metadata.borderWidth}px`;
    if (metadata.borderRadius) style.borderRadius = metadata.borderRadius;
    if (metadata.shadowColor) style.boxShadow = `0 0 20px ${metadata.shadowColor}`;
    
    return style;
  }, [card.designMetadata]);

  return (
    <CardBase
      card={card}
      className={cn("group relative overflow-hidden", className)}
      onClick={onClick}
      enableEffects={enableEffects}
      activeEffects={activeEffects}
      style={{ ...styleFromMetadata, ...cardStyle }}
      {...props}
    >
      {/* Loading state */}
      {!isImageLoaded && !isImageError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center z-20">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-gray-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      )}
      
      {/* Error state */}
      {isImageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
          <div className="text-center text-gray-400">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 mx-auto mb-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <p>Failed to load image</p>
          </div>
        </div>
      )}
      
      {/* Card image */}
      {card.imageUrl && (
        <img 
          src={card.imageUrl} 
          alt={card.title || "Card"} 
          className="absolute inset-0 w-full h-full object-cover z-10"
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setIsImageError(true)}
          loading="lazy"
        />
      )}
      
      {/* Fallback for no image */}
      {!card.imageUrl && !isImageError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 z-10">
          No Image
        </div>
      )}
      
      {showInfo && (
        <CardInfoOverlay card={card} showOnHover={infoOnHover} />
      )}
    </CardBase>
  );
};

export default CardThumbnail;
