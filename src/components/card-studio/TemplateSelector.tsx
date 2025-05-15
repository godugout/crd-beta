
import React from 'react';
import { CardTemplate } from '@/components/card-templates/TemplateLibrary';

interface TemplateSelectorProps {
  onSelect: (template: CardTemplate) => void;
}

// Update the templates to remove the 'effects' property if it's not part of the CardTemplate type
const TEMPLATES: CardTemplate[] = [
  {
    id: 'classic',
    name: 'Classic Card',
    description: 'Traditional trading card style with clean borders',
    thumbnailUrl: '/images/card-placeholder.png',
    designMetadata: {
      cardStyle: {
        template: 'classic',
        borderRadius: '8px',
        borderColor: '#000000',
      }
    },
  },
  {
    id: 'modern',
    name: 'Modern Sleek',
    description: 'Contemporary design with minimal borders',
    thumbnailUrl: '/images/card-placeholder.png',
    designMetadata: {
      cardStyle: {
        template: 'modern',
        borderRadius: '4px',
        borderColor: '#333333',
      }
    },
  },
  {
    id: 'vintage',
    name: 'Vintage Style',
    description: 'Aged look with retro styling',
    thumbnailUrl: '/images/card-placeholder.png',
    designMetadata: {
      cardStyle: {
        template: 'vintage',
        borderRadius: '0px',
        borderColor: '#8B5C29',
      }
    },
  },
  {
    id: 'premium',
    name: 'Premium Edition',
    description: 'Luxury card with gold accents',
    thumbnailUrl: '/images/card-placeholder.png',
    designMetadata: {
      cardStyle: {
        template: 'premium',
        borderRadius: '12px',
        borderColor: '#D4AF37',
      }
    },
  },
  {
    id: 'sport',
    name: 'Sports Edition',
    description: 'Dynamic design for sports cards',
    thumbnailUrl: '/images/card-placeholder.png',
    designMetadata: {
      cardStyle: {
        template: 'sport',
        borderRadius: '8px',
        borderColor: '#E53E3E',
      }
    },
  },
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {TEMPLATES.map((template) => (
        <div 
          key={template.id}
          className="border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
          onClick={() => onSelect(template)}
        >
          <div className="aspect-[2.5/3.5] bg-gray-100">
            <img 
              src={template.thumbnailUrl} 
              alt={template.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3">
            <h3 className="font-medium">{template.name}</h3>
            <p className="text-sm text-gray-500">{template.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateSelector;
