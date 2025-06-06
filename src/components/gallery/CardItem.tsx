
import React from 'react';
import { Star } from 'lucide-react';

interface CardItemProps {
  title: string;
  creator: string;
  likes?: number;
  category?: string;
  gradient?: string;
  border?: string;
  isNew?: boolean;
  className?: string;
}

const CardItem: React.FC<CardItemProps> = ({
  title,
  creator,
  likes,
  category,
  gradient = "from-white/10 to-white/5",
  border = "white/10",
  isNew = false,
  className = "",
}) => {
  return (
    <div className={`bento-card bg-white/5 border border-${border} hover:border-white/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden ${className}`}>
      {/* Card content placeholder */}
      <div className={`aspect-[3/4] bg-gradient-to-br ${gradient} rounded-lg mb-4 flex items-center justify-center`}>
        <div className="text-white/40 text-2xl font-bold">CARD</div>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-[var(--text-tertiary)] text-sm mb-3">by {creator}</p>
      
      <div className="flex items-center justify-between text-xs text-white/60">
        {isNew ? (
          <span className="text-xs text-[var(--brand-accent)]">New</span>
        ) : likes ? (
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            {likes.toLocaleString()}
          </span>
        ) : null}
        
        {category && (
          <span className="text-xs px-2 py-1 bg-white/10 rounded-full">
            {category}
          </span>
        )}
      </div>
    </div>
  );
};

export default CardItem;
