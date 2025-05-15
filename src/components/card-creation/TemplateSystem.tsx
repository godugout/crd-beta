import React, { useState, useEffect } from 'react';
import { CardTemplate } from '@/lib/types/cardTypes';
import { CardStyle, TextStyle } from '@/lib/types/cardTypes';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface TemplateSystemProps {
  onSelectTemplate: (template: CardTemplate) => void;
  selectedTemplate: CardTemplate | null;
  cardStyle: Partial<CardStyle> | null;
  textStyle: Partial<TextStyle> | null;
}

const TemplateSystem: React.FC<TemplateSystemProps> = ({
  onSelectTemplate,
  selectedTemplate,
  cardStyle,
  textStyle
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Popularity');
  
  useEffect(() => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  }, [selectedTemplate, onSelectTemplate]);
  
  const handleSelectTemplate = (template: CardTemplate) => {
    onSelectTemplate(template);
  };
  
  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
  };
  
  const handleSortBy = (sortBy: string) => {
    setSortBy(sortBy);
  };

  const baseballTemplates: CardTemplate[] = [
    {
      id: 'baseball-classic',
      name: 'Classic Baseball',
      description: 'Traditional baseball card design with clean lines and bold text',
      thumbnail: '/templates/baseball-classic.jpg',
      category: 'Baseball',
      isOfficial: true,
      popularity: 95,
      designDefaults: {
        cardStyle: {
          template: 'baseball-classic',
          effect: 'holographic',
          borderRadius: '8px',
          borderWidth: 4,
          borderColor: '#d4af37',
          backgroundColor: '#ffffff'
        },
        textStyle: {
          fontFamily: 'Inter',
          titleColor: '#1a202c',
          titleAlignment: 'center'
        },
        effects: ['Holographic']
      }
    },
    {
      id: 'baseball-vintage',
      name: 'Vintage Baseball',
      description: 'Aged baseball card design with a classic, nostalgic feel',
      thumbnail: '/templates/baseball-vintage.jpg',
      category: 'Baseball',
      isOfficial: false,
      popularity: 80,
      designDefaults: {
        cardStyle: {
          template: 'baseball-vintage',
          effect: 'vintage',
          borderRadius: '12px',
          borderWidth: 2,
          borderColor: '#a52a2a',
          backgroundColor: '#f5f5dc'
        },
        textStyle: {
          fontFamily: 'Times New Roman',
          titleColor: '#8b4513',
          titleAlignment: 'left'
        },
        effects: ['Vintage']
      }
    },
    {
      id: 'baseball-modern',
      name: 'Modern Baseball',
      description: 'Sleek, contemporary baseball card design with dynamic graphics',
      thumbnail: '/templates/baseball-modern.jpg',
      category: 'Baseball',
      isOfficial: true,
      popularity: 70,
      designDefaults: {
        cardStyle: {
          template: 'baseball-modern',
          effect: 'chrome',
          borderRadius: '10px',
          borderWidth: 0,
          borderColor: '#000000',
          backgroundColor: '#ffffff'
        },
        textStyle: {
          fontFamily: 'Arial',
          titleColor: '#000080',
          titleAlignment: 'right'
        },
        effects: ['Chrome']
      }
    }
  ];

  const basketballTemplates: CardTemplate[] = [
    {
      id: 'basketball-classic',
      name: 'Classic Basketball',
      description: 'Traditional basketball card design with clean lines and bold text',
      thumbnail: '/templates/basketball-classic.jpg',
      category: 'Basketball',
      isOfficial: true,
      popularity: 90,
      designDefaults: {
        cardStyle: {
          template: 'basketball-classic',
          effect: 'refractor',
          borderRadius: '8px',
          borderWidth: 4,
          borderColor: '#ffa500',
          backgroundColor: '#ffffff'
        },
        textStyle: {
          fontFamily: 'Inter',
          titleColor: '#1a202c',
          titleAlignment: 'center'
        },
        effects: ['Refractor']
      }
    },
    {
      id: 'basketball-vintage',
      name: 'Vintage Basketball',
      description: 'Aged basketball card design with a classic, nostalgic feel',
      thumbnail: '/templates/basketball-vintage.jpg',
      category: 'Basketball',
      isOfficial: false,
      popularity: 75,
      designDefaults: {
        cardStyle: {
          template: 'basketball-vintage',
          effect: 'vintage',
          borderRadius: '12px',
          borderWidth: 2,
          borderColor: '#800000',
          backgroundColor: '#f5f5dc'
        },
        textStyle: {
          fontFamily: 'Times New Roman',
          titleColor: '#8b4513',
          titleAlignment: 'left'
        },
        effects: ['Vintage']
      }
    },
    {
      id: 'basketball-modern',
      name: 'Modern Basketball',
      description: 'Sleek, contemporary basketball card design with dynamic graphics',
      thumbnail: '/templates/basketball-modern.jpg',
      category: 'Basketball',
      isOfficial: true,
      popularity: 65,
      designDefaults: {
        cardStyle: {
          template: 'basketball-modern',
          effect: 'chrome',
          borderRadius: '10px',
          borderWidth: 0,
          borderColor: '#000000',
          backgroundColor: '#ffffff'
        },
        textStyle: {
          fontFamily: 'Arial',
          titleColor: '#000080',
          titleAlignment: 'right'
        },
        effects: ['Chrome']
      }
    }
  ];

  const footballTemplates: CardTemplate[] = [
    {
      id: 'football-classic',
      name: 'Classic Football',
      description: 'Traditional football card design with clean lines and bold text',
      thumbnail: '/templates/football-classic.jpg',
      category: 'Football',
      isOfficial: true,
      popularity: 85,
      designDefaults: {
        cardStyle: {
          template: 'football-classic',
          effect: 'holographic',
          borderRadius: '8px',
          borderWidth: 4,
          borderColor: '#008000',
          backgroundColor: '#ffffff'
        },
        textStyle: {
          fontFamily: 'Inter',
          titleColor: '#1a202c',
          titleAlignment: 'center'
        },
        effects: ['Holographic']
      }
    },
    {
      id: 'football-vintage',
      name: 'Vintage Football',
      description: 'Aged football card design with a classic, nostalgic feel',
      thumbnail: '/templates/football-vintage.jpg',
      category: 'Football',
      isOfficial: false,
      popularity: 70,
      designDefaults: {
        cardStyle: {
          template: 'football-vintage',
          effect: 'vintage',
          borderRadius: '12px',
          borderWidth: 2,
          borderColor: '#8b4513',
          backgroundColor: '#f5f5dc'
        },
        textStyle: {
          fontFamily: 'Times New Roman',
          titleColor: '#a0522d',
          titleAlignment: 'left'
        },
        effects: ['Vintage']
      }
    },
    {
      id: 'football-modern',
      name: 'Modern Football',
      description: 'Sleek, contemporary football card design with dynamic graphics',
      thumbnail: '/templates/football-modern.jpg',
      category: 'Football',
      isOfficial: true,
      popularity: 60,
      designDefaults: {
        cardStyle: {
          template: 'football-modern',
          effect: 'chrome',
          borderRadius: '10px',
          borderWidth: 0,
          borderColor: '#000000',
          backgroundColor: '#ffffff'
        },
        textStyle: {
          fontFamily: 'Arial',
          titleColor: '#006400',
          titleAlignment: 'right'
        },
        effects: ['Chrome']
      }
    }
  ];

  const allTemplates = [
    ...baseballTemplates,
    ...basketballTemplates,
    ...footballTemplates
  ];

  const filteredTemplates = categoryFilter === 'All'
    ? allTemplates
    : allTemplates.filter(template => template.category === categoryFilter);

  const sortedTemplates = filteredTemplates.sort((a, b) => {
    if (sortBy === 'Popularity') {
      return (b.popularity || 0) - (a.popularity || 0);
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  const renderTemplateItem = (template: CardTemplate) => (
    <div 
      key={template.id}
      className={cn(
        "group relative aspect-[2.5/3.5] overflow-hidden rounded-lg border cursor-pointer hover:border-primary transition-all",
        selectedTemplate?.id === template.id ? "border-primary ring-2 ring-primary ring-offset-2" : "border-border"
      )}
      onClick={() => handleSelectTemplate(template)}
    >
      <img
        src={template.thumbnail}
        alt={template.name}
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
        loading="lazy"
      />
      
      <div className="absolute top-2 left-2 flex gap-1">
        {template.isOfficial && (
          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">Official</span>
        )}
        
        {(template.popularity && template.popularity > 90) && (
          <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">Popular</span>
        )}
      </div>
      
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
        <p className="font-medium text-sm">{template.name}</p>
        <p className="text-xs text-white/70 truncate">{template.category}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Select a Template</h3>
        <p className="text-sm text-gray-500">
          Choose a pre-designed template to quickly get started with your card creation.
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className={categoryFilter === 'All' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''}
            onClick={() => handleCategoryFilter('All')}
          >
            All
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={categoryFilter === 'Baseball' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''}
            onClick={() => handleCategoryFilter('Baseball')}
          >
            Baseball
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={categoryFilter === 'Basketball' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''}
            onClick={() => handleCategoryFilter('Basketball')}
          >
            Basketball
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={categoryFilter === 'Football' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''}
            onClick={() => handleCategoryFilter('Football')}
          >
            Football
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sort by:</label>
          <select 
            id="sort" 
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={sortBy}
            onChange={(e) => handleSortBy(e.target.value)}
          >
            <option value="Popularity">Popularity</option>
            <option value="Name">Name</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedTemplates.map(renderTemplateItem)}
      </div>
    </div>
  );
};

export default TemplateSystem;
