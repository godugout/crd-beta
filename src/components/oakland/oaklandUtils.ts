
import { OaklandTemplateType } from './OaklandCardTemplates';
import { OaklandMemoryData } from '@/lib/types';

export const getTemplateForMemoryType = (
  memoryType?: string
): OaklandTemplateType => {
  switch (memoryType) {
    case 'game': 
      return 'classic';
    case 'tailgate': 
      return 'tailgate';
    case 'memorabilia': 
      return 'dynasty';
    case 'historical': 
      return 'dynasty';
    case 'fan_experience': 
      return 'coliseum';
    case 'stats': 
      return 'moneyball';
    default: 
      return 'classic';
  }
};

export const getTypographyForTemplate = (
  template: OaklandTemplateType
) => {
  switch (template) {
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

export const formatMemoryForCard = (
  memory: OaklandMemoryData, 
  template: OaklandTemplateType
): Record<string, any> => {
  return {
    title: memory.title,
    description: memory.description,
    date: memory.date,
    opponent: memory.opponent,
    score: memory.score,
    location: memory.location,
    section: memory.section,
    memoryType: memory.memoryType,
    attendees: memory.attendees,
    tags: memory.tags,
    imageUrl: memory.imageUrl,
    template: template,
  };
};
