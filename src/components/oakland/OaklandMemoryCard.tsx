
import React from 'react';
import { format } from 'date-fns';
import { OaklandMemoryData } from '@/lib/types';
import { OaklandTemplateType } from './OaklandCardTemplates';
import OaklandCardTemplate from './OaklandCardTemplates';

interface OaklandMemoryCardProps {
  memory: OaklandMemoryData;
  templateType?: OaklandTemplateType;
  className?: string;
  onClick?: () => void;
}

const OaklandMemoryCard: React.FC<OaklandMemoryCardProps> = ({
  memory,
  templateType = 'classic',
  className,
  onClick
}) => {
  return (
    <OaklandCardTemplate
      type={templateType}
      className={className}
      onClick={onClick}
    >
      {memory.imageUrl && (
        <img 
          src={memory.imageUrl} 
          alt={memory.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      )}
      
      <div className="relative z-10 p-5 flex flex-col h-full">
        <h3 className="text-xl font-bold text-[#EFB21E] mb-2">{memory.title}</h3>
        
        {memory.date && (
          <div className="flex items-center text-sm text-white mb-2">
            <span>{format(new Date(memory.date), 'MMM d, yyyy')}</span>
          </div>
        )}
        
        <p className="flex-grow text-sm text-white line-clamp-3">{memory.description}</p>
        
        {memory.opponent && (
          <div className="mt-3 p-2 bg-black/50 rounded text-center">
            <div className="font-semibold text-[#EFB21E]">vs {memory.opponent}</div>
            {memory.score && <div className="text-sm text-white">{memory.score}</div>}
          </div>
        )}
        
        {memory.tags && memory.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {memory.tags.slice(0, 2).map((tag) => (
              <div key={tag} className="text-xs px-1.5 py-0.5 bg-[#006341] text-white rounded">
                #{tag}
              </div>
            ))}
            {memory.tags.length > 2 && (
              <div className="text-xs px-1.5 py-0.5 bg-[#006341] text-white rounded">
                +{memory.tags.length - 2}
              </div>
            )}
          </div>
        )}
      </div>
    </OaklandCardTemplate>
  );
};

export default OaklandMemoryCard;
