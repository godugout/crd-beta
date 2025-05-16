
import React from 'react';
import { CardTemplate, DEFAULT_CARD_STYLE, DEFAULT_TEXT_STYLE } from '@/components/card-templates/TemplateTypes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TemplateSelectorProps {
  onSelect: (template: CardTemplate) => void;
}

const templates: CardTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional card with a clean design',
    thumbnail: '/images/card-placeholder.png',
    thumbnailUrl: '/images/card-placeholder.png',
    category: 'general',
    tags: ['classic', 'traditional'],
    designDefaults: {
      cardStyle: {
        ...DEFAULT_CARD_STYLE,
        template: 'classic',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
      },
      textStyle: DEFAULT_TEXT_STYLE
    }
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Sleek contemporary style',
    thumbnail: '/images/card-placeholder.png',
    thumbnailUrl: '/images/card-placeholder.png',
    category: 'general',
    tags: ['modern', 'sleek'],
    designDefaults: {
      cardStyle: {
        ...DEFAULT_CARD_STYLE,
        template: 'modern',
        effect: 'none',
        borderRadius: '16px',
        borderColor: '#3182CE',
      },
      textStyle: DEFAULT_TEXT_STYLE
    }
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Aged look with retro feel',
    thumbnail: '/images/card-placeholder.png',
    thumbnailUrl: '/images/card-placeholder.png',
    category: 'general',
    tags: ['vintage', 'retro'],
    designDefaults: {
      cardStyle: {
        ...DEFAULT_CARD_STYLE,
        template: 'vintage',
        effect: 'grunge',
        borderRadius: '4px',
        borderColor: '#A0845C',
      },
      textStyle: DEFAULT_TEXT_STYLE
    }
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Athletic-focused card design',
    thumbnail: '/images/card-placeholder.png',
    thumbnailUrl: '/images/card-placeholder.png',
    category: 'sports',
    tags: ['sports', 'athletic'],
    designDefaults: {
      cardStyle: {
        ...DEFAULT_CARD_STYLE,
        template: 'sports',
        effect: 'chrome',
        borderRadius: '12px',
        borderColor: '#E53E3E',
      },
      textStyle: DEFAULT_TEXT_STYLE
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Luxury card with elegant design',
    thumbnail: '/images/card-placeholder.png',
    thumbnailUrl: '/images/card-placeholder.png',
    category: 'premium',
    tags: ['luxury', 'premium', 'elegant'],
    designDefaults: {
      cardStyle: {
        ...DEFAULT_CARD_STYLE,
        template: 'premium',
        effect: 'gold',
        borderRadius: '8px',
        borderColor: '#D69E2E',
      },
      textStyle: DEFAULT_TEXT_STYLE
    }
  },
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Choose a Template</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary"
            onClick={() => onSelect(template)}
          >
            <div className="aspect-[2.5/3.5] relative">
              <img
                src={template.thumbnail || template.thumbnailUrl}
                alt={template.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button variant="secondary">Select Template</Button>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold">{template.name}</h3>
              <p className="text-sm text-gray-600">{template.description}</p>
              {template.tags && template.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {template.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
