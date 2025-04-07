
import React from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import OaklandCardTemplate, { OaklandTemplateType } from './OaklandCardTemplates';
import { OaklandMemoryData } from './OaklandMemoryForm';

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
  // Determine template based on memory type if not explicitly provided
  const effectiveTemplate = templateType || 
    memory.memoryType === 'game' ? 'classic' : 
    memory.memoryType === 'tailgate' ? 'tailgate' : 
    memory.memoryType === 'memorabilia' ? 'dynasty' : 'coliseum';

  return (
    <OaklandCardTemplate 
      type={effectiveTemplate as OaklandTemplateType}
      className={cn("group cursor-pointer transition-all duration-300 hover:scale-[1.02]", className)}
      onClick={onClick}
    >
      <div className="p-4 flex flex-col h-full text-white">
        {/* Header */}
        <div className="mb-2">
          <h3 className="text-lg font-bold text-[#EFB21E] line-clamp-2">{memory.title}</h3>
          
          {memory.date && (
            <div className="flex items-center text-xs mt-1 opacity-90">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(memory.date), 'MMM d, yyyy')}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-grow">
          <p className="text-sm line-clamp-3 mb-2">{memory.description}</p>
          
          {memory.memoryType === 'game' && memory.opponent && (
            <div className="mb-2">
              <Badge variant="outline" className="bg-[#EFB21E]/20 text-[#EFB21E] border-[#EFB21E]/40">
                vs {memory.opponent}
              </Badge>
              {memory.score && (
                <span className="ml-2 text-sm text-[#EFB21E]">{memory.score}</span>
              )}
            </div>
          )}
          
          {memory.location && (
            <div className="flex items-center text-xs mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="opacity-90">
                {memory.location}
                {memory.section && ` • ${memory.section}`}
              </span>
            </div>
          )}
          
          {memory.attendees && memory.attendees.length > 0 && (
            <div className="flex items-center text-xs mb-2">
              <Users className="h-3 w-3 mr-1" />
              <span className="opacity-90">
                With {memory.attendees.length === 1 ? memory.attendees[0] : `${memory.attendees[0]} +${memory.attendees.length - 1}`}
              </span>
            </div>
          )}
        </div>
        
        {/* Footer */}
        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {memory.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-[10px] bg-[#003831] text-[#EFB21E]">
                #{tag}
              </Badge>
            ))}
            {memory.tags.length > 3 && (
              <Badge variant="secondary" className="text-[10px] bg-[#003831] text-[#EFB21E]">
                +{memory.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </OaklandCardTemplate>
  );
};

export default OaklandMemoryCard;
