
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'compact' | 'sidepanel'>('compact');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [selectedTemplateForDetails, setSelectedTemplateForDetails] = useState<OaklandCardTemplate | null>(null);

  const filteredTemplates = selectedCategory === 'all' 
    ? OAKLAND_CARD_TEMPLATES 
    : OAKLAND_CARD_TEMPLATES.filter(template => template.category === selectedCategory);

  const toggleCardExpansion = (templateId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(templateId)) {
      newExpanded.delete(templateId);
    } else {
      newExpanded.add(templateId);
    }
    setExpandedCards(newExpanded);
  };

  const handleTemplateSelect = (template: OaklandCardTemplate) => {
    onSelectTemplate(template);
    if (viewMode === 'sidepanel') {
      setSelectedTemplateForDetails(template);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-white">Oakland A's Card Templates</h2>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'compact' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('compact')}
              className="text-xs"
            >
              Expandable Cards
            </Button>
            <Button 
              variant={viewMode === 'sidepanel' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('sidepanel')}
              className="text-xs"
            >
              Side Panel
            </Button>
          </div>
        </div>
        <p className="text-yellow-400">Choose from authentic Oakland Athletics designs</p>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-gray-800/50">
          {OAKLAND_CARD_CATEGORIES.map((category) => {
            const count = category.id === 'all' 
              ? OAKLAND_CARD_TEMPLATES.length 
              : OAKLAND_CARD_TEMPLATES.filter(t => t.category === category.id).length;
            
            const IconComponent = category.icon;
            
            return (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-display text-xs"
              >
                <IconComponent className="w-4 h-4 mr-1" />
                {category.name}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {count}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {viewMode === 'compact' ? (
        /* Compact Cards with Expandable Details */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredTemplates.map((template) => {
            const isExpanded = expandedCards.has(template.id);
            const isSelected = selectedTemplateId === template.id;
            
            return (
              <div key={template.id} className="relative">
                <div 
                  className={`
                    rounded-lg border-2 transition-all duration-200 bg-gray-800/50
                    ${isSelected 
                      ? 'border-yellow-500 ring-2 ring-yellow-500/50' 
                      : 'border-gray-600 hover:border-gray-400'
                    }
                  `}
                >
                  {/* Template Preview */}
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <OaklandCardPreview
                      template={template}
                      title={template.name}
                      subtitle={`${template.category} • A's`}
                      className="rounded-t-lg"
                    />
                  </div>
                  
                  {/* Basic Info */}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white text-sm font-medium truncate">{template.name}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCardExpansion(template.id)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </Button>
                    </div>
                    
                    <Badge variant="outline" className="text-xs mb-2">
                      {template.category}
                    </Badge>
                    
                    {/* Expandable Details */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <p className="text-gray-300 text-xs mb-2">{template.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {template.metadata.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Side Panel View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTemplates.map((template) => {
                const isSelected = selectedTemplateId === template.id;
                const isHighlighted = selectedTemplateForDetails?.id === template.id;
                
                return (
                  <div key={template.id} className="relative">
                    <div 
                      className={`
                        rounded-lg border-2 transition-all duration-200 cursor-pointer
                        ${isSelected 
                          ? 'border-yellow-500 ring-2 ring-yellow-500/50' 
                          : isHighlighted
                            ? 'border-blue-400'
                            : 'border-gray-600 hover:border-gray-400'
                        }
                      `}
                      onClick={() => {
                        handleTemplateSelect(template);
                        setSelectedTemplateForDetails(template);
                      }}
                    >
                      <OaklandCardPreview
                        template={template}
                        title={template.name}
                        subtitle={`${template.category} • A's`}
                      />
                      
                      {/* Minimal Info */}
                      <div className="p-2 text-center">
                        <h4 className="text-white text-xs font-medium truncate">{template.name}</h4>
                      </div>
                      
                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Details Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-lg p-4 sticky top-4">
              {selectedTemplateForDetails ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="h-4 w-4 text-yellow-400" />
                    <h3 className="text-white font-medium">Template Details</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-yellow-400 text-sm font-medium mb-1">{selectedTemplateForDetails.name}</h4>
                      <p className="text-gray-300 text-sm">{selectedTemplateForDetails.description}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-white text-sm font-medium mb-2">Category</h5>
                      <Badge variant="outline">{selectedTemplateForDetails.category}</Badge>
                    </div>
                    
                    <div>
                      <h5 className="text-white text-sm font-medium mb-2">Features</h5>
                      <div className="flex flex-wrap gap-1">
                        {selectedTemplateForDetails.metadata.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-white text-sm font-medium mb-2">Effects</h5>
                      <div className="flex flex-wrap gap-1">
                        {selectedTemplateForDetails.effects.map(effect => (
                          <Badge key={effect} variant="outline" className="text-xs">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                      onClick={() => onSelectTemplate(selectedTemplateForDetails)}
                    >
                      Use This Template
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Click on a template to see details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
