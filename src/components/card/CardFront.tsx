
import React from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import { MoreHorizontal, RefreshCw, Share2, Trash2, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CrdButton } from '@/components/ui/crd-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CardFrontProps {
  card: Card;
  activeEffects?: string[];
  onFlip: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const CardFront: React.FC<CardFrontProps> = ({ 
  card, 
  activeEffects = [],
  onFlip,
  onShare,
  onDelete
}) => {
  const navigate = useNavigate();
  
  const effectClasses = activeEffects.map(effect => {
    switch (effect.toLowerCase()) {
      case 'holographic':
        return 'effect-holographic';
      case 'shimmer':
        return 'effect-shimmer';
      case 'vintage':
        return 'effect-vintage';
      case 'refractor':
      default:
        return 'effect-refractor';
    }
  });

  const handleLaunchAR = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/ar-card-viewer/${card.id}`);
  };
  
  return (
    <div className="card-face card-front absolute inset-0 bg-white rounded-lg shadow-lg overflow-hidden select-none">
      {/* Card image */}
      <div className={cn(
        "relative w-full h-full bg-cover bg-center overflow-hidden",
        ...effectClasses
      )}>
        <img 
          src={card.imageUrl}
          alt={card.title}
          className="w-full h-full object-cover"
        />
        
        {/* Card info overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="crd-display-medium text-white text-lg leading-tight">{card.title}</h3>
          
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {card.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex crd-text-small bg-cardshow-blue/80 text-white px-1.5 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
              
              {card.tags.length > 3 && (
                <span className="crd-text-small text-gray-300">+{card.tags.length - 3}</span>
              )}
            </div>
          )}
          
          {/* AR View Button */}
          <CrdButton
            variant="gradient"
            size="sm"
            className="mt-3"
            onClick={handleLaunchAR}
          >
            <Smartphone className="h-4 w-4 mr-1" />
            <span className="crd-text-small font-medium">View in AR</span>
          </CrdButton>
        </div>
        
        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={onFlip}
            className="p-1.5 bg-white/80 hover:bg-white rounded-full text-cardshow-dark"
            title="Flip card"
          >
            <RefreshCw size={14} />
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="p-1.5 bg-white/80 hover:bg-white rounded-full text-cardshow-dark"
                title="More options"
              >
                <MoreHorizontal size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onShare}>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
