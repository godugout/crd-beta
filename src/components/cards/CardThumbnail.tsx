
import React from 'react';
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
      className={cn("group", className)}
      onClick={onClick}
      enableEffects={enableEffects}
      activeEffects={activeEffects}
      style={{ ...styleFromMetadata, ...cardStyle }}
      {...props}
    >
      <CardImage card={card} />
      
      {showInfo && (
        <CardInfoOverlay card={card} showOnHover={infoOnHover} />
      )}
    </CardBase>
  );
};

export default CardThumbnail;
