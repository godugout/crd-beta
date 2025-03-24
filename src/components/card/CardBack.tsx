
import React from 'react';
import { Tag } from 'lucide-react';

interface CardBackProps {
  card: {
    title: string;
    description?: string;
    tags?: string[];
  };
}

export const CardBack: React.FC<CardBackProps> = ({ card }) => {
  return (
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
  );
};
