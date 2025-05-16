
import React from 'react';
import { Card } from '@/lib/types/cardTypes';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface CardPreviewProps {
  card?: Card;
  effectClasses?: string;
  className?: string;
}

const CardPreview: React.FC<CardPreviewProps> = ({
  card,
  effectClasses = '',
  className = '',
}) => {
  const { reduceEffects, optimizedRendering } = useMobileOptimization();
  const isMobile = useIsMobile();

  // Default placeholder state
  if (!card || !card.imageUrl) {
    return (
      <div className={cn("aspect-[2.5/3.5] bg-muted flex items-center justify-center p-4 rounded-lg", className)}>
        <div className="text-center text-muted-foreground">
          <p>Upload an image to see your card preview</p>
        </div>
      </div>
    );
  }
  
  // Get style properties from card design metadata
  // Handle cases where properties might be undefined
  const cardStyle = card.designMetadata?.cardStyle || {};
  const textStyle = card.designMetadata?.textStyle || {};
  
  // Extract player/team info with fallbacks
  const playerName = card.player || '';
  const teamName = card.team || '';
  const playerTeamDisplay = playerName && teamName 
    ? `${playerName} • ${teamName}`
    : playerName || teamName;

  // Card container styles from design metadata (with defaults)
  const containerStyle = {
    backgroundColor: (cardStyle as any).backgroundColor || '#ffffff',
    borderRadius: (cardStyle as any).borderRadius || '8px',
    borderColor: (cardStyle as any).borderColor || '#000000',
    boxShadow: (cardStyle as any).shadowColor ? `0 4px 12px ${(cardStyle as any).shadowColor}` : undefined,
    borderWidth: (cardStyle as any).frameWidth ? `${(cardStyle as any).frameWidth}px` : '2px'
  };
  
  // Text styles from design metadata (with defaults)
  const titleStyle = {
    color: (textStyle as any).titleColor || '#000000',
    fontWeight: (textStyle as any).titleWeight || 'bold',
    textAlign: (textStyle as any).titleAlignment || 'center'
  };
  
  const descStyle = {
    color: (textStyle as any).descriptionColor || '#333333',
  };

  return (
    <div 
      className={cn(
        "aspect-[2.5/3.5] rounded-lg overflow-hidden border relative", 
        effectClasses,
        className
      )}
      style={containerStyle}
    >
      {/* Card image */}
      <div className="w-full h-[65%] overflow-hidden">
        <img 
          src={card.imageUrl}
          alt={card.title}
          width={optimizedRendering.resolution * 400}
          height={optimizedRendering.resolution * 520}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      {/* Card content */}
      <div className="p-3 h-[35%] flex flex-col justify-between bg-gradient-to-b from-transparent to-black/10">
        {/* Card title */}
        <h3 
          className="text-lg font-bold leading-tight mb-1" 
          style={titleStyle as React.CSSProperties}
        >
          {card.title}
        </h3>
        
        {/* Player/Team */}
        {playerTeamDisplay && (
          <div className="text-sm mb-2" style={descStyle as React.CSSProperties}>
            {playerTeamDisplay}
          </div>
        )}
        
        {/* Year (if available) */}
        {card.year && (
          <div className="text-xs opacity-80" style={descStyle as React.CSSProperties}>
            {card.year}
          </div>
        )}
        
        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1">
            {card.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag} 
                className="text-xs bg-black/20 px-2 py-0.5 rounded"
                style={descStyle as React.CSSProperties}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardPreview;
