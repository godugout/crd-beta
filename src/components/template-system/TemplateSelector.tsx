
import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Sparkles, Filter } from 'lucide-react';
import { Template, AIRecommendation } from '@/lib/types/templateTypes';
import { templateLibrary, templateCategories, templateEras } from '@/lib/data/templateLibrary';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
  aiRecommendations?: AIRecommendation[];
  uploadedImage?: string | null;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  aiRecommendations = [],
  uploadedImage
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('browse');

  const filteredTemplates = useMemo(() => {
    return templateLibrary.filter(template => {
      if (selectedCategory !== 'all' && template.category !== selectedCategory) {
        return false;
      }
      if (selectedEra !== 'all' && template.era !== selectedEra) {
        return false;
      }
      if (searchQuery && !template.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !template.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }
      return true;
    });
  }, [selectedCategory, selectedEra, searchQuery]);

  const recommendedTemplates = useMemo(() => {
    return aiRecommendations
      .map(rec => ({
        template: templateLibrary.find(t => t.id === rec.templateId),
        recommendation: rec
      }))
      .filter(item => item.template)
      .sort((a, b) => (b.recommendation?.confidence || 0) - (a.recommendation?.confidence || 0));
  }, [aiRecommendations]);

  const handleTemplateSelect = (template: Template) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Choose a Template
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse All</TabsTrigger>
            <TabsTrigger value="recommended" disabled={recommendedTemplates.length === 0}>
              AI Recommended ({recommendedTemplates.length})
            </TabsTrigger>
            <TabsTrigger value="custom">Custom Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="flex-1 overflow-hidden">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Sports</option>
                  {templateCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                
                <select
                  value={selectedEra}
                  onChange={(e) => setSelectedEra(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Eras</option>
                  {templateEras.map(era => (
                    <option key={era.id} value={era.id}>
                      {era.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[500px] pr-2">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className="group cursor-pointer rounded-lg border bg-card hover:shadow-lg transition-all duration-200"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="aspect-[2.5/3.5] bg-gray-100 rounded-t-lg overflow-hidden">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x420?text=Template';
                      }}
                    />
                  </div>
                  
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">{template.name}</h3>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.era}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {template.effects.slice(0, 2).map((effect, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                          {effect}
                        </Badge>
                      ))}
                      {template.effects.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.effects.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommended" className="flex-1 overflow-hidden">
            {recommendedTemplates.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Based on your uploaded image, we recommend these templates:
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedTemplates.map(({ template, recommendation }) => (
                    <div
                      key={template!.id}
                      className="group cursor-pointer rounded-lg border bg-card hover:shadow-lg transition-all duration-200 relative"
                      onClick={() => handleTemplateSelect(template!)}
                    >
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-green-500 text-white">
                          {Math.round(recommendation.confidence * 100)}% match
                        </Badge>
                      </div>
                      
                      <div className="aspect-[2.5/3.5] bg-gray-100 rounded-t-lg overflow-hidden">
                        <img
                          src={template!.thumbnail}
                          alt={template!.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300x420?text=Template';
                          }}
                        />
                      </div>
                      
                      <div className="p-3">
                        <h3 className="font-semibold text-sm mb-1">{template!.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{recommendation.reason}</p>
                        
                        {recommendation.metadata && (
                          <div className="space-y-1 text-xs">
                            {recommendation.metadata.detectedSport && (
                              <div>Sport: <span className="font-medium">{recommendation.metadata.detectedSport}</span></div>
                            )}
                            {recommendation.metadata.detectedTeam && (
                              <div>Team: <span className="font-medium">{recommendation.metadata.detectedTeam}</span></div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Sparkles className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No AI Recommendations</h3>
                <p className="text-muted-foreground">Upload an image to get AI-powered template suggestions</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="custom" className="flex-1">
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Filter className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Custom Templates</h3>
              <p className="text-muted-foreground mb-4">Save your own designs as templates</p>
              <Button variant="outline">Create Custom Template</Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Blank Template Option */}
        <div className="border-t pt-4">
          <Button
            onClick={() => handleTemplateSelect({
              id: 'blank',
              name: 'Blank Canvas',
              category: 'custom',
              era: 'modern',
              thumbnail: '',
              layers: [],
              effects: [],
              metadata: { tags: ['blank', 'custom'] }
            })}
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
