
import React from 'react';
import { OaklandTemplateType } from './OaklandCardTemplates';
import OaklandCardTemplate from './OaklandCardTemplates';
import { cn } from '@/lib/utils';
import { Calendar, MapPin, Users, Award, Info } from 'lucide-react';
import { format } from 'date-fns';

interface OaklandTemplatePreviewProps {
  type: OaklandTemplateType;
  memory: {
    title: string;
    description: string;
    date?: string;
    opponent?: string;
    score?: string;
    location?: string;
    section?: string;
    attendees?: string[];
    tags?: string[];
  };
  className?: string;
}

const OaklandTemplatePreview: React.FC<OaklandTemplatePreviewProps> = ({
  type,
  memory,
  className
}) => {
  const getTypographyClasses = () => {
    switch (type) {
      case 'classic':
        return {
          title: "text-lg font-bold text-[#EFB21E]",
          subtitle: "text-sm text-white/90",
          body: "text-sm text-white/80"
        };
      case 'moneyball':
        return {
          title: "text-base font-mono font-bold text-white tracking-wide",
          subtitle: "text-xs font-mono text-white/90 tracking-tight",
          body: "text-xs text-white/80"
        };
      case 'dynasty':
        return {
          title: "text-xl font-serif font-bold text-[#EFB21E] uppercase",
          subtitle: "text-sm font-serif text-white/90",
          body: "text-sm text-white/80 font-serif"
        };
      case 'coliseum':
        return {
          title: "text-lg font-bold text-white drop-shadow-md",
          subtitle: "text-sm text-white/90 drop-shadow-sm",
          body: "text-sm text-white/90 drop-shadow-sm"
        };
      case 'tailgate':
        return {
          title: "text-lg font-bold text-white drop-shadow-md",
          subtitle: "text-sm text-white/90 drop-shadow-sm",
          body: "text-sm text-white/90"
        };
      default:
        return {
          title: "text-lg font-bold text-[#EFB21E]",
          subtitle: "text-sm text-white/90",
          body: "text-sm text-white/80"
        };
    }
  };
  
  const typography = getTypographyClasses();
  
  // Add semi-transparent overlay to coliseum and tailgate templates to improve text readability
  const hasOverlay = type === 'coliseum' || type === 'tailgate';
  
  return (
    <OaklandCardTemplate type={type} className={className}>
      {hasOverlay && (
        <div className="absolute inset-0 bg-black/30 z-0"></div>
      )}
      
      <div className="p-4 flex flex-col h-full relative z-10">
        {/* Header */}
        <div className="mb-2">
          <h3 className={typography.title}>{memory.title || "Memory Title"}</h3>
          
          {memory.date && (
            <div className="flex items-center text-xs mt-1 opacity-90">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(memory.date), 'MMM d, yyyy')}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-grow">
          <p className={cn("line-clamp-3 mb-2", typography.body)}>
            {memory.description || "Your memory description will appear here. Share what made this moment special."}
          </p>
          
          {memory.opponent && (
            <div className={cn("mb-2", typography.subtitle)}>
              <div className="flex items-center">
                <Award className="h-3 w-3 mr-1" />
                <span>vs {memory.opponent}</span>
                {memory.score && (
                  <span className="ml-2">{memory.score}</span>
                )}
              </div>
            </div>
          )}
          
          {memory.location && (
            <div className={cn("flex items-center text-xs mb-1", typography.subtitle)}>
              <MapPin className="h-3 w-3 mr-1" />
              <span>
                {memory.location}
                {memory.section && ` • ${memory.section}`}
              </span>
            </div>
          )}
          
          {memory.attendees && memory.attendees.length > 0 && (
            <div className={cn("flex items-center text-xs mb-1", typography.subtitle)}>
              <Users className="h-3 w-3 mr-1" />
              <span>
                With {memory.attendees.length === 1 ? memory.attendees[0] : `${memory.attendees[0]} +${memory.attendees.length - 1}`}
              </span>
            </div>
          )}
          
          {/* Template specific elements */}
          {type === 'dynasty' && (
            <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-[#EFB21E]/20 flex items-center justify-center border border-[#EFB21E]/30">
              <Trophy className="h-8 w-8 text-[#EFB21E]/80" />
            </div>
          )}
          
          {type === 'moneyball' && (
            <div className="absolute top-3 right-3 flex flex-col items-end">
              <div className="text-xs font-mono text-white/70">OAK.FAN</div>
              <div className="text-xs font-mono text-white/50">{memory.date ? format(new Date(memory.date), 'yyyy') : '2002'}</div>
            </div>
          )}
          
          {type === 'classic' && (
            <div className="absolute bottom-3 right-3">
              <div className="w-8 h-8 rounded-full bg-[#EFB21E] flex items-center justify-center">
                <span className="text-[#003831] text-xs font-bold">A's</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {memory.tags.slice(0, 3).map((tag, index) => (
              <div key={index} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#003831]/80 text-[#EFB21E]">
                #{tag}
              </div>
            ))}
            {memory.tags.length > 3 && (
              <div className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#003831]/80 text-[#EFB21E]">
                +{memory.tags.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </OaklandCardTemplate>
  );
};

export default OaklandTemplatePreview;
