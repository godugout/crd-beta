
import React from 'react';
import { Card } from '@/lib/types/cardTypes';

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  defaultCardData: Partial<Card>;
}

export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: 'template-classic',
    name: 'Classic Sport',
    description: 'A classic sports card design with traditional styling',
    imageUrl: '/placeholder-card.png',
    category: 'Sports',
    tags: ['Baseball', 'Classic', 'Traditional'],
    defaultCardData: {
      title: 'Classic Player Card',
      description: 'A traditional sports card featuring player statistics and team information',
      tags: ['Sports', 'Classic'],
      designMetadata: {
        cardStyle: {
          template: 'classic',
          effect: 'none',
          borderRadius: '8px',
          borderColor: '#000000',
          backgroundColor: '#FFFFFF',
          shadowColor: 'rgba(0,0,0,0.2)',
          frameWidth: 2,
          frameColor: '#000000',
        },
        textStyle: {
          titleFont: 'Inter',
          titleSize: '24px',
          titleColor: '#000000',
          titleAlignment: 'center',
          descriptionFont: 'Inter',
          descriptionSize: '16px',
          descriptionColor: '#333333',
        },
        cardMetadata: {
          category: 'Sports',
          series: 'Classic',
          cardType: 'Player',
        },
        marketMetadata: {
          isPrintable: true,
          isForSale: false,
          includeInCatalog: true,
        }
      },
    }
  },
  {
    id: 'template-modern',
    name: 'Modern Sport',
    description: 'A sleek, modern design with bold colors and clean lines',
    imageUrl: '/placeholder-card.png',
    category: 'Sports',
    tags: ['Basketball', 'Modern', 'Bold'],
    defaultCardData: {
      title: 'Modern Player Card',
      description: 'A contemporary sports card with minimalist design and bold graphics',
      tags: ['Sports', 'Modern'],
      designMetadata: {
        cardStyle: {
          template: 'modern',
          effect: 'shadow',
          borderRadius: '16px',
          borderColor: '#2563EB',
          backgroundColor: '#FFFFFF',
          shadowColor: 'rgba(37, 99, 235, 0.3)',
          frameWidth: 1,
          frameColor: '#2563EB',
        },
        textStyle: {
          titleFont: 'Montserrat',
          titleSize: '28px',
          titleColor: '#1E293B',
          titleAlignment: 'left',
          descriptionFont: 'Inter',
          descriptionSize: '16px',
          descriptionColor: '#64748B',
        },
        cardMetadata: {
          category: 'Sports',
          series: 'Modern',
          cardType: 'Player',
        },
        marketMetadata: {
          isPrintable: true,
          isForSale: false,
          includeInCatalog: true,
        }
      },
    }
  },
  {
    id: 'template-vintage',
    name: 'Vintage',
    description: 'A nostalgic design reminiscent of cards from bygone eras',
    imageUrl: '/placeholder-card.png',
    category: 'Collectible',
    tags: ['Vintage', 'Retro', 'Nostalgic'],
    defaultCardData: {
      title: 'Vintage Collection Card',
      description: 'A nostalgic card design reminiscent of the golden era of trading cards',
      tags: ['Vintage', 'Collectible'],
      designMetadata: {
        cardStyle: {
          template: 'vintage',
          effect: 'none',
          borderRadius: '4px',
          borderColor: '#8B5CF6',
          backgroundColor: '#F3F4F6',
          shadowColor: 'rgba(0,0,0,0.15)',
          frameWidth: 3,
          frameColor: '#8B5CF6',
        },
        textStyle: {
          titleFont: 'Playfair Display',
          titleSize: '24px',
          titleColor: '#1F2937',
          titleAlignment: 'center',
          descriptionFont: 'Playfair Display',
          descriptionSize: '14px',
          descriptionColor: '#4B5563',
        },
        cardMetadata: {
          category: 'Collectible',
          series: 'Vintage',
          cardType: 'Memorabilia',
        },
        marketMetadata: {
          isPrintable: true,
          isForSale: false,
          includeInCatalog: true,
        }
      },
    }
  }
];

interface TemplateCardProps {
  template: CardTemplate;
  onClick: () => void;
  selected?: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onClick, selected = false }) => {
  return (
    <div 
      className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
        selected ? 'ring-2 ring-blue-500 shadow-md' : ''
      }`}
      onClick={onClick}
    >
      <div className="aspect-[2.5/3.5] bg-gray-100">
        <img 
          src={template.imageUrl} 
          alt={template.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-card.png';
          }}
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm">{template.name}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.description}</p>
      </div>
    </div>
  );
};

interface TemplateSelectorProps {
  onSelect: (template: CardTemplate) => void;
  selectedTemplateId?: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect, selectedTemplateId }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Select a Template</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {CARD_TEMPLATES.map((template) => (
          <TemplateCard 
            key={template.id}
            template={template}
            onClick={() => onSelect(template)}
            selected={selectedTemplateId === template.id}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
