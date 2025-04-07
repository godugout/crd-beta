
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CardPreviewProps {
  /**
   * URL of the image to display
   */
  imageUrl: string;
  
  /**
   * Title text for the card
   */
  title: string;
  
  /**
   * Optional description text
   */
  description?: string;
  
  /**
   * Optional tags to display
   */
  tags?: string[];
  
  /**
   * Whether the card is currently in a loading state
   */
  isLoading?: boolean;
  
  /**
   * Custom CSS class for styling
   */
  className?: string;
  
  /**
   * Callback for when the card is clicked
   */
  onClick?: () => void;
}

/**
 * A standardized card preview component for displaying images with metadata
 */
const CardPreview = ({
  imageUrl,
  title,
  description,
  tags = [],
  isLoading = false,
  className = '',
  onClick
}: CardPreviewProps) => {
  return (
    <Card 
      className={`overflow-hidden transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="aspect-[3/4] overflow-hidden bg-gray-100">
        {isLoading ? (
          <div className="w-full h-full bg-slate-200 animate-pulse" />
        ) : (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        )}
      </div>
      
      <CardContent className="p-4">
        {isLoading ? (
          <>
            <div className="h-6 bg-slate-200 rounded animate-pulse mb-2" />
            <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3" />
          </>
        ) : (
          <>
            <h3 className="font-medium text-cardshow-dark line-clamp-1">{title}</h3>
            
            {description && (
              <p className="text-sm text-cardshow-slate mt-1 line-clamp-2">{description}</p>
            )}
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.slice(0, 3).map((tag, i) => (
                  <span 
                    key={i} 
                    className="text-xs px-2 py-0.5 bg-cardshow-blue/10 text-cardshow-blue rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="text-xs text-cardshow-slate">+{tags.length - 3}</span>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export { CardPreview };
