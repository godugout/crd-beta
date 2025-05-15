
import React from 'react';

export interface CardTemplate {
  id: string;
  name: string;
  previewUrl: string;
  sport?: string;
  style?: 'standard' | 'premium';
  effects: string[];
  category?: string;
  tags?: string[];
  description?: string;
}

export interface TemplateLibraryProps {
  onSelect?: (template: CardTemplate) => void;
  filterBySport?: string;
  filterByCategory?: string;
}

// Sample templates - in a real app these would come from an API
export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: 'topps-chrome',
    name: 'Topps Chrome',
    previewUrl: '/placeholder-card.png',
    sport: 'baseball',
    style: 'premium',
    effects: ['Chrome']
  },
  {
    id: 'panini-prizm',
    name: 'Panini Prizm',
    previewUrl: '/placeholder-card.png',
    sport: 'basketball',
    style: 'premium',
    effects: ['Refractor']
  },
  {
    id: 'upper-deck',
    name: 'Upper Deck',
    previewUrl: '/placeholder-card.png',
    sport: 'hockey',
    style: 'standard',
    effects: []
  },
  {
    id: 'fleer-ultra',
    name: 'Fleer Ultra',
    previewUrl: '/placeholder-card.png',
    sport: 'baseball',
    style: 'premium',
    effects: ['Holographic']
  },
  {
    id: 'donruss',
    name: 'Donruss',
    previewUrl: '/placeholder-card.png',
    sport: 'basketball',
    style: 'standard',
    effects: []
  }
];

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  onSelect,
  filterBySport,
  filterByCategory
}) => {
  const filteredTemplates = CARD_TEMPLATES.filter(template => {
    if (filterBySport && template.sport !== filterBySport) {
      return false;
    }
    if (filterByCategory && template.category !== filterByCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredTemplates.map(template => (
        <div 
          key={template.id}
          className="cursor-pointer border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          onClick={() => onSelect?.(template)}
        >
          <img 
            src={template.previewUrl} 
            alt={template.name}
            className="w-full aspect-[2.5/3.5] object-cover"
          />
          <div className="p-3 bg-gray-50">
            <h3 className="font-medium text-sm">{template.name}</h3>
            <p className="text-xs text-gray-500">{template.sport || 'All Sports'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateLibrary;
