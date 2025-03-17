
import React, { useState } from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Trash2, Edit, Share2, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { useCards } from '@/context/CardContext';
import '../components/home/CardEffects.css';

interface CardItemProps {
  card: Card;
  className?: string;
  onClick?: () => void;
  activeEffects?: string[];
}

const CardItem: React.FC<CardItemProps> = ({ card, className, onClick, activeEffects = [] }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { deleteCard } = useCards();
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Share API is not available in all browsers
    if (navigator.share) {
      navigator.share({
        title: card.title,
        text: card.description,
        url: window.location.href,
      })
        .then(() => toast.success('Card shared successfully'))
        .catch((error) => console.error('Error sharing card:', error));
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCard(card.id);
  };
  
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(card.createdAt);

  // Build card front classes based on active effects
  const getCardFrontClasses = () => {
    const classes = ["card-front rounded-xl overflow-hidden shadow-card bg-white"];
    
    if (activeEffects.includes('Classic Holographic')) {
      classes.push('card-holographic');
    }
    
    if (activeEffects.includes('Refractor')) {
      classes.push('card-refractor');
    }
    
    if (activeEffects.includes('Prismatic')) {
      classes.push('card-prismatic');
    }
    
    if (activeEffects.includes('Electric')) {
      classes.push('card-electric');
    }
    
    if (activeEffects.includes('Gold Foil')) {
      classes.push('card-gold-foil');
    }
    
    if (activeEffects.includes('Chrome')) {
      classes.push('card-chrome');
    }
    
    if (activeEffects.includes('Vintage')) {
      classes.push('card-vintage');
    }
    
    return cn(...classes);
  };
  
  return (
    <div 
      className={cn(
        "card-container relative w-full aspect-[2.5/3.5] cursor-pointer group",
        className
      )}
      onClick={onClick || handleFlip}
    >
      <div className={cn("card-inner w-full h-full", isFlipped ? "flipped" : "")}>
        {/* Card Front */}
        <div className={getCardFrontClasses()}>
          <div className="relative w-full h-full">
            <img
              src={card.imageUrl}
              alt={card.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-white font-semibold truncate">{card.title}</h3>
              
              {activeEffects.length > 0 && (
                <span className="text-xs text-white/90 bg-black/40 px-2 py-0.5 rounded-full">
                  {activeEffects[0]}
                </span>
              )}
            </div>
            
            {/* Hover Actions */}
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex space-x-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-subtle">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.info('Edit feature coming soon');
                  }}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Edit size={16} className="text-cardshow-slate" />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Share2 size={16} className="text-cardshow-slate" />
                </button>
                <button 
                  onClick={handleDelete}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>

            {/* Card indicator and created date */}
            <div className="absolute top-0 left-0 p-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-cardshow-slate shadow-subtle">
                {formattedDate}
              </div>
            </div>
          </div>
        </div>
        
        {/* Card Back */}
        <div className="card-back rounded-xl overflow-hidden shadow-card bg-white p-4 flex flex-col">
          <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
          <p className="text-cardshow-slate text-sm flex-grow overflow-y-auto">
            {card.description || "No description provided."}
          </p>
          
          {card.tags && card.tags.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag, index) => (
                  <div 
                    key={index}
                    className="flex items-center bg-cardshow-blue-light text-cardshow-blue text-xs px-2 py-1 rounded-full"
                  >
                    <Tag size={10} className="mr-1" />
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-auto pt-4 text-xs text-cardshow-slate-light text-right">
            Tap to flip
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardItem;
