
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  category: 'sports' | 'vintage' | 'modern' | 'premium' | 'custom';
  sport?: string;
  era?: string;
  thumbnailUrl: string;
  defaultLayers: Array<{
    type: 'image' | 'text' | 'shape';
    position: { x: number; y: number };
    size: { width: number; height: number };
    defaultContent?: any;
    constraints?: {
      locked?: boolean;
      resizable?: boolean;
      moveable?: boolean;
    };
  }>;
  defaultEffects: string[];
  defaultMetadata: {
    sport?: string;
    era?: string;
    style?: string;
  };
}

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: CardTemplate) => void;
}

const defaultTemplates: CardTemplate[] = [
  {
    id: 'classic-baseball',
    name: 'Classic Baseball',
    description: 'Traditional baseball card layout with player photo and stats',
    category: 'sports',
    sport: 'baseball',
    era: 'classic',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=300&h=420&fit=crop',
    defaultLayers: [
      {
        type: 'image',
        position: { x: 75, y: 50 },
        size: { width: 600, height: 400 },
        constraints: { resizable: true, moveable: true }
      },
      {
        type: 'text',
        position: { x: 75, y: 470 },
        size: { width: 600, height: 60 },
        defaultContent: {
          text: 'Player Name',
          fontSize: 32,
          fontFamily: 'Arial',
          color: '#000000',
          fontWeight: 'bold'
        }
      },
      {
        type: 'text',
        position: { x: 75, y: 530 },
        size: { width: 600, height: 40 },
        defaultContent: {
          text: 'Team • Position',
          fontSize: 18,
          fontFamily: 'Arial',
          color: '#666666'
        }
      }
    ],
    defaultEffects: [],
    defaultMetadata: {
      sport: 'baseball',
      era: 'classic',
      style: 'traditional'
    }
  },
  {
    id: 'chrome-refractor',
    name: 'Chrome Refractor',
    description: 'Premium chrome card with refractor effects',
    category: 'premium',
    sport: 'basketball',
    era: 'modern',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=420&fit=crop',
    defaultLayers: [
      {
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width: 750, height: 1050 },
        defaultContent: {
          type: 'rectangle',
          fill: 'linear-gradient(45deg, #c0c0c0, #ffffff)'
        },
        constraints: { locked: true }
      },
      {
        type: 'image',
        position: { x: 75, y: 75 },
        size: { width: 600, height: 600 },
        constraints: { resizable: true, moveable: true }
      },
      {
        type: 'text',
        position: { x: 75, y: 700 },
        size: { width: 600, height: 80 },
        defaultContent: {
          text: 'Player Name',
          fontSize: 36,
          fontFamily: 'Arial',
          color: '#000000',
          fontWeight: 'bold'
        }
      }
    ],
    defaultEffects: ['chrome', 'refractor'],
    defaultMetadata: {
      sport: 'basketball',
      era: 'modern',
      style: 'premium'
    }
  },
  {
    id: 'vintage-sepia',
    name: 'Vintage Sepia',
    description: 'Retro-style card with sepia tones and vintage borders',
    category: 'vintage',
    era: 'vintage',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=420&fit=crop',
    defaultLayers: [
      {
        type: 'shape',
        position: { x: 25, y: 25 },
        size: { width: 700, height: 1000 },
        defaultContent: {
          type: 'rectangle',
          fill: '#f4f1e8',
          stroke: '#8b4513',
          strokeWidth: 3
        },
        constraints: { locked: true }
      },
      {
        type: 'image',
        position: { x: 125, y: 125 },
        size: { width: 500, height: 500 },
        constraints: { resizable: true, moveable: true }
      },
      {
        type: 'text',
        position: { x: 125, y: 650 },
        size: { width: 500, height: 60 },
        defaultContent: {
          text: 'Player Name',
          fontSize: 28,
          fontFamily: 'serif',
          color: '#8b4513',
          fontWeight: 'bold'
        }
      }
    ],
    defaultEffects: ['sepia', 'vintage'],
    defaultMetadata: {
      era: 'vintage',
      style: 'retro'
    }
  }
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSport, setSelectedSport] = useState<string>('all');

  const filteredTemplates = defaultTemplates.filter(template => {
    if (selectedCategory !== 'all' && template.category !== selectedCategory) {
      return false;
    }
    if (selectedSport !== 'all' && template.sport !== selectedSport) {
      return false;
    }
    return true;
  });

  const categories = ['all', 'sports', 'vintage', 'modern', 'premium', 'custom'];
  const sports = ['all', 'baseball', 'basketball', 'football', 'hockey', 'soccer'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="ml-2 px-3 py-2 border rounded-md"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Sport</label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="ml-2 px-3 py-2 border rounded-md"
            >
              {sports.map(sport => (
                <option key={sport} value={sport}>
                  {sport.charAt(0).toUpperCase() + sport.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filteredTemplates.map(template => (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                onSelectTemplate(template);
                onClose();
              }}
            >
              <div className="aspect-[2.5/3.5] bg-gray-100 rounded-t-lg overflow-hidden">
                <img
                  src={template.thumbnailUrl}
                  alt={template.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x420?text=Template';
                  }}
                />
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                  {template.sport && (
                    <Badge variant="outline" className="text-xs">
                      {template.sport}
                    </Badge>
                  )}
                  {template.era && (
                    <Badge variant="outline" className="text-xs">
                      {template.era}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Start from Scratch Option */}
        <div className="mt-6 pt-4 border-t">
          <Button
            onClick={() => {
              onSelectTemplate({
                id: 'blank',
                name: 'Blank Canvas',
                description: 'Start with a blank card',
                category: 'custom',
                thumbnailUrl: '',
                defaultLayers: [],
                defaultEffects: [],
                defaultMetadata: {}
              });
              onClose();
            }}
            variant="outline"
            className="w-full"
          >
            Start from Scratch
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelector;
