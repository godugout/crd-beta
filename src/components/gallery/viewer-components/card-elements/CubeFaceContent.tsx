
import React from 'react';
import { Card } from '@/lib/types';

interface CubeFaceContentProps {
  type: 'image' | 'info' | 'solid';
  card: Card;
  title?: string;
  filter?: string;
  opacity?: number;
  bgClass?: string;
}

export const CubeFaceContent: React.FC<CubeFaceContentProps> = ({
  type,
  card,
  title,
  filter = '',
  opacity = 1,
  bgClass = 'bg-gray-800'
}) => {
  if (type === 'image') {
    return (
      <div className="relative w-full h-full overflow-hidden">
        <img 
          src={card.imageUrl} 
          alt={card.title || 'Card face'}
          className="w-full h-full object-cover"
          style={{ filter, opacity }}
        />
        {title && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="text-white text-xl font-bold">{title}</h3>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (type === 'solid') {
    return (
      <div className={`w-full h-full flex items-center justify-center ${bgClass}`}>
        <div className="text-white text-xl">{title}</div>
      </div>
    );
  }

  return null;
};
