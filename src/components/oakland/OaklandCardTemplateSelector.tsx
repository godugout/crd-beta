
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OAKLAND_CARD_TEMPLATES, OAKLAND_CARD_CATEGORIES, OaklandCardTemplate } from '@/lib/data/oaklandCardTemplates';
import OaklandCardPreview from './OaklandCardPreview';

interface OaklandCardTemplateSelectorProps {
  onSelectTemplate: (template: OaklandCardTemplate) => void;
  selectedTemplateId?: string;
}

const OaklandCardTemplateSelector: React.FC<OaklandCardTemplateSelectorProps> = ({
  onSelectTemplate,
  selectedTemplateId
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTemplates = selectedCategory === 'all' 
    ? OAKLAND_CARD_TEMPLATES 
    : OAKLAND_CARD_TEMPLATES.filter(template => template.category === selectedCategory);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Oakland A's Card Templates</h2>
        <p className="text-yellow-400">Choose from authentic Oakland Athletics designs</p>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-gray-800/50">
          {OAKLAND_CARD_CATEGORIES.map((category) => {
            const count = category.id === 'all' 
              ? OAKLAND_CARD_TEMPLATES.length 
              : OAKLAND_CARD_TEMPLATES.filter(t => t.category === category.id).length;
            
            return (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-display text-xs"
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {count}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="relative">
            <OaklandCardPreview
              template={template}
              title={template.name}
              subtitle={`${template.category} • A's`}
              isInteractive
              onSelect={() => onSelectTemplate(template)}
              className={`
                rounded-lg border-2 transition-all duration-200
                ${selectedTemplateId === template.id 
                  ? 'border-yellow-500 ring-2 ring-yellow-500/50' 
                  : 'border-gray-600 hover:border-gray-400'
                }
              `}
            />
            
            {/* Template Info */}
            <div className="mt-2 text-center">
              <h4 className="text-white text-sm font-medium truncate">{template.name}</h4>
              <p className="text-gray-400 text-xs">{template.description}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-1 mt-1">
                {template.metadata.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Selection Indicator */}
            {selectedTemplateId === template.id && (
              <div className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚾</div>
          <h3 className="text-xl font-display text-white mb-2">
            No templates found
          </h3>
          <p className="text-gray-400">
            Try selecting a different category
          </p>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
        <h4 className="text-white font-medium mb-2">Template Features:</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Perfect 2.5" x 3.5" trading card proportions</li>
          <li>• Authentic Oakland Athletics imagery</li>
          <li>• Smart backgrounds for optimal composition</li>
          <li>• Category-specific effects and styling</li>
        </ul>
      </div>
    </div>
  );
};

export default OaklandCardTemplateSelector;
