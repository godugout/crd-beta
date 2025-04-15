
import React from 'react';
import { Card } from '@/lib/types';
import { Sparkles, Award, Calendar, Layers, Tag, Users } from 'lucide-react';

interface CardMetadataPanelProps {
  card: Card;
}

const CardMetadataPanel: React.FC<CardMetadataPanelProps> = ({ card }) => {
  return (
    <div className="h-full bg-black/40 backdrop-blur-md border-l border-white/10 p-4 overflow-y-auto">
      <div className="flex flex-col gap-6">
        {/* Card Title */}
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-xl font-bold text-white">{card.title}</h2>
          <p className="text-white/70 text-sm">{card.description}</p>
        </div>
        
        {/* Card Stats */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white/90">
            <Award className="h-5 w-5 text-amber-400" />
            <div>
              <div className="text-sm font-medium">Rarity</div>
              <div className="text-xs text-white/60">Premium Gold</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-white/90">
            <Calendar className="h-5 w-5 text-blue-400" />
            <div>
              <div className="text-sm font-medium">Release Date</div>
              <div className="text-xs text-white/60">2023 Series 2</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-white/90">
            <Layers className="h-5 w-5 text-green-400" />
            <div>
              <div className="text-sm font-medium">Card Number</div>
              <div className="text-xs text-white/60">#42 of 100</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-white/90">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <div>
              <div className="text-sm font-medium">Special Features</div>
              <div className="text-xs text-white/60">Holographic Signature, AR Enhanced</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-white/90">
            <Users className="h-5 w-5 text-orange-400" />
            <div>
              <div className="text-sm font-medium">Owned By</div>
              <div className="text-xs text-white/60">823 collectors</div>
            </div>
          </div>
        </div>
        
        {/* Card Tags */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4 text-white/70" />
            <span className="text-sm text-white/80">Tags</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {card.tags?.map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-md hover:bg-white/20 transition-colors"
              >
                {tag}
              </span>
            )) || (
              <span className="text-xs text-white/50">No tags available</span>
            )}
          </div>
        </div>
        
        {/* Card Details */}
        <div className="border-t border-white/10 pt-4">
          <div className="text-sm text-white/80 mb-2">Card Details</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Created</span>
              <span className="text-white/80">April 15, 2023</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Last Modified</span>
              <span className="text-white/80">June 22, 2023</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Edition</span>
              <span className="text-white/80">First Edition</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Print Run</span>
              <span className="text-white/80">Limited (100)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardMetadataPanel;
