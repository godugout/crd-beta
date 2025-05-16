
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CardElement } from '@/lib/types/cardElements';

interface ElementCardProps {
  element: CardElement;
  isSelected?: boolean;
  onClick?: () => void;
  showDetails?: boolean;
  className?: string;
}

const ElementCard: React.FC<ElementCardProps> = ({
  element,
  isSelected = false,
  onClick,
  showDetails = false,
  className = '',
}) => {
  return (
    <Card 
      className={`
        cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'}
        ${className}
      `}
      onClick={onClick}
    >
      <CardContent className="p-2">
        <div className="aspect-square relative rounded-sm overflow-hidden mb-2">
          <img 
            src={element.imageUrl} 
            alt={element.name}
            className="w-full h-full object-contain"
          />
          {element.type !== 'standard' && (
            <Badge className="absolute top-1 right-1 text-xs">
              {element.type}
            </Badge>
          )}
        </div>
        
        <div className="text-sm font-medium truncate">{element.name}</div>
        
        {showDetails && (
          <>
            {element.description && (
              <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                {element.description}
              </p>
            )}
            
            {element.tags && element.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {element.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                    {tag}
                  </Badge>
                ))}
                {element.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    +{element.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ElementCard;
