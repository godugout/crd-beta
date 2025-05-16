
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import { usePersonalizationContext } from '@/context/PersonalizationContext';
import { Card } from '@/lib/types/cardTypes';
import { CardTemplate } from '@/lib/types/templateTypes';
import { CardEffect } from '@/lib/types/cardTypes';
import { CardElement } from '@/lib/types/cardElements';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toastUtils from '@/lib/utils/toast-utils';

interface RecommendationProps<T> {
  title: string;
  description: string;
  items: Array<{
    item: T;
    score: number;
    reason: string;
    category?: string;
  }>;
  onSelect: (item: T) => void;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
}

function Recommendation<T extends { id: string; name: string }>({
  title,
  description,
  items,
  onSelect,
  onLike,
  onDislike,
  renderItem,
  emptyMessage = "No recommendations available"
}: RecommendationProps<T>) {
  if (items.length === 0) {
    return (
      <div className="bg-muted/30 rounded-lg p-4 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <ScrollArea className="h-[400px] pr-3">
        <div className="space-y-3">
          {items.map((rec, index) => (
            <div key={`${rec.item.id}-${index}`} className="bg-card rounded-lg border p-3 shadow-sm">
              <div className="flex items-start justify-between">
                {renderItem(rec.item, index)}
                <div className="flex flex-col items-end space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onSelect(rec.item)}
                    className="w-20"
                  >
                    <Plus size={14} className="mr-1" />
                    Select
                  </Button>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onLike(rec.item.id)}
                    >
                      <ThumbsUp size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onDislike(rec.item.id)}
                    >
                      <ThumbsDown size={14} />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{rec.reason}</span>
                  <div className="flex items-center">
                    <span className="text-xs font-medium mr-1">
                      {Math.round(rec.score * 100)}%
                    </span>
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export interface RecommendationEngineProps {
  cardData?: {
    imageUrl?: string;
    title?: string;
    tags?: string[];
    templateId?: string;
  };
  availableTemplates?: CardTemplate[];
  availableEffects?: CardEffect[];
  availableElements?: CardElement[];
  onSelectTemplate?: (template: CardTemplate) => void;
  onSelectEffect?: (effect: CardEffect) => void;
  onSelectElement?: (element: CardElement) => void;
  onGenerateColorPalette?: (colors: string[]) => void;
}

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  cardData = {},
  availableTemplates = [],
  availableEffects = [],
  availableElements = [],
  onSelectTemplate,
  onSelectEffect,
  onSelectElement,
  onGenerateColorPalette
}) => {
  const personalization = usePersonalizationContext();
  
  const [templateRecs, setTemplateRecs] = useState<Array<{item: CardTemplate; score: number; reason: string}>>([]);
  const [effectRecs, setEffectRecs] = useState<Array<{item: CardEffect; score: number; reason: string}>>([]);
  const [elementRecs, setElementRecs] = useState<Array<{item: CardElement; score: number; reason: string; category?: string}>>([]);
  const [colorPalettes, setColorPalettes] = useState<string[][]>([]);
  const [loading, setLoading] = useState({
    templates: false,
    effects: false,
    elements: false,
    colors: false
  });

  // Load recommendations when card data changes
  useEffect(() => {
    if (!cardData.imageUrl) return;
    
    const loadRecommendations = async () => {
      try {
        // Load template recommendations
        if (availableTemplates.length > 0) {
          setLoading(prev => ({ ...prev, templates: true }));
          const templateResults = await personalization.getTemplateRecommendations(
            cardData.imageUrl!, 
            availableTemplates
          );
          setTemplateRecs(templateResults);
          setLoading(prev => ({ ...prev, templates: false }));
        }
        
        // Load effect recommendations
        if (availableEffects.length > 0) {
          setLoading(prev => ({ ...prev, effects: true }));
          const effectResults = await personalization.getEffectRecommendations(
            cardData.imageUrl!,
            availableEffects
          );
          setEffectRecs(effectResults);
          setLoading(prev => ({ ...prev, effects: false }));
        }
        
        // Load element recommendations
        if (availableElements.length > 0) {
          setLoading(prev => ({ ...prev, elements: true }));
          const elementResults = await personalization.getElementRecommendations(
            {
              imageUrl: cardData.imageUrl!,
              templateId: cardData.templateId,
              cardTitle: cardData.title,
              tags: cardData.tags
            },
            availableElements
          );
          setElementRecs(elementResults);
          setLoading(prev => ({ ...prev, elements: false }));
        }
        
        // Load color recommendations
        setLoading(prev => ({ ...prev, colors: true }));
        const colorResults = await personalization.getColorRecommendations(cardData.imageUrl!);
        setColorPalettes(colorResults);
        setLoading(prev => ({ ...prev, colors: false }));
      } catch (error) {
        console.error('Failed to load recommendations:', error);
        toastUtils.error('Failed to load recommendations', 'Please try again later');
        setLoading({
          templates: false,
          effects: false,
          elements: false,
          colors: false
        });
      }
    };
    
    loadRecommendations();
  }, [cardData.imageUrl, cardData.templateId, cardData.title, cardData.tags, personalization]);

  const handleToggleFavorite = async (type: 'template' | 'effect' | 'element', itemId: string) => {
    try {
      const isFavorited = await personalization.toggleFavorite(type, itemId);
      toastUtils.success(
        isFavorited ? 'Added to favorites' : 'Removed from favorites', 
        `This ${type} has been ${isFavorited ? 'added to' : 'removed from'} your favorites`
      );
    } catch (error) {
      console.error(`Failed to toggle ${type} favorite status:`, error);
      toastUtils.error('Failed to update favorites', 'Please try again');
    }
  };

  const handleSelectTemplate = (template: CardTemplate) => {
    onSelectTemplate?.(template);
    toastUtils.success('Template applied', 'The selected template has been applied to your card');
  };

  const handleSelectEffect = (effect: CardEffect) => {
    onSelectEffect?.(effect);
    toastUtils.success('Effect applied', 'The selected effect has been applied to your card');
  };

  const handleSelectElement = (element: CardElement) => {
    onSelectElement?.(element);
    toastUtils.success('Element added', 'The selected element has been added to your card');
  };

  const handleSelectColorPalette = (palette: string[]) => {
    onGenerateColorPalette?.(palette);
    toastUtils.success('Color palette applied', 'The selected colors have been applied to your card');
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="templates">
        <TabsList className="w-full">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
          <TabsTrigger value="elements">Elements</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="pt-4">
          <Recommendation
            title="Recommended Templates"
            description="Templates that match your image and style preferences"
            items={templateRecs}
            onSelect={handleSelectTemplate}
            onLike={(id) => handleToggleFavorite('template', id)}
            onDislike={() => {}}
            renderItem={(template) => (
              <div className="flex items-center space-x-3">
                {template.thumbnail && (
                  <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="h-12 w-12 object-cover rounded" 
                  />
                )}
                <div>
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-xs text-muted-foreground">{template.category}</p>
                </div>
              </div>
            )}
            emptyMessage={loading.templates ? "Loading recommendations..." : "No templates to recommend. Try uploading an image first."}
          />
        </TabsContent>
        
        <TabsContent value="effects" className="pt-4">
          <Recommendation
            title="Recommended Effects"
            description="Effects that will enhance your card design"
            items={effectRecs}
            onSelect={handleSelectEffect}
            onLike={(id) => handleToggleFavorite('effect', id)}
            onDislike={() => {}}
            renderItem={(effect) => (
              <div className="flex items-center space-x-3">
                {effect.iconUrl && (
                  <div className="h-10 w-10 rounded bg-accent flex items-center justify-center">
                    <img 
                      src={effect.iconUrl} 
                      alt={effect.name}
                      className="h-6 w-6" 
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-medium">{effect.name}</h4>
                  <p className="text-xs text-muted-foreground">{effect.description}</p>
                </div>
              </div>
            )}
            emptyMessage={loading.effects ? "Loading recommendations..." : "No effects to recommend. Try uploading an image first."}
          />
        </TabsContent>
        
        <TabsContent value="elements" className="pt-4">
          <Recommendation
            title="Recommended Elements"
            description="Elements that complement your card design"
            items={elementRecs}
            onSelect={handleSelectElement}
            onLike={(id) => handleToggleFavorite('element', id)}
            onDislike={() => {}}
            renderItem={(element) => (
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded bg-accent flex items-center justify-center">
                  <img 
                    src={element.thumbnailUrl || element.url} 
                    alt={element.name}
                    className="h-8 w-8 object-contain" 
                  />
                </div>
                <div>
                  <h4 className="font-medium">{element.name}</h4>
                  <p className="text-xs text-muted-foreground">{element.category}</p>
                </div>
              </div>
            )}
            emptyMessage={loading.elements ? "Loading recommendations..." : "No elements to recommend. Try uploading an image first."}
          />
        </TabsContent>
        
        <TabsContent value="colors" className="pt-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Recommended Color Palettes</h3>
              <p className="text-sm text-muted-foreground">Color combinations extracted from your image</p>
            </div>
            
            {loading.colors ? (
              <div className="bg-muted/30 rounded-lg p-8 text-center">
                <p className="text-muted-foreground">Loading color recommendations...</p>
              </div>
            ) : (
              colorPalettes.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {colorPalettes.map((palette, index) => (
                    <div key={index} className="bg-card rounded-lg border p-3 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Palette {index + 1}</h4>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSelectColorPalette(palette)}
                        >
                          <Plus size={14} className="mr-1" />
                          Apply
                        </Button>
                      </div>
                      <div className="flex space-x-1">
                        {palette.map((color, colorIdx) => (
                          <div 
                            key={colorIdx}
                            className="h-8 flex-1 rounded" 
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/30 rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">No color palettes to recommend. Try uploading an image first.</p>
                </div>
              )
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecommendationEngine;
