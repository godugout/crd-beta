
import React, { useState, useEffect } from 'react';
import { usePersonalizationContext } from '@/context/PersonalizationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sparkles, X, Lightbulb, ImageIcon } from 'lucide-react';
import { CardTemplate } from '@/lib/types/templateTypes';
import { CardEffect } from '@/lib/types/cardTypes';
import { CardElement } from '@/lib/types/cardElements';
import { RecommendationItem } from '@/lib/types/userPreferences';

interface RecommendationEngineProps {
  imageUrl?: string;
  title?: string;
  tags?: string[];
  onApplyTemplate?: (template: CardTemplate) => void;
  onApplyEffect?: (effect: CardEffect) => void;
  onAddElement?: (element: CardElement) => void;
  onClose?: () => void;
  className?: string;
  availableTemplates: CardTemplate[];
  availableEffects: CardEffect[];
  availableElements: CardElement[];
}

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  imageUrl,
  title,
  tags = [],
  onApplyTemplate,
  onApplyEffect,
  onAddElement,
  onClose,
  className = '',
  availableTemplates,
  availableEffects,
  availableElements
}) => {
  const { getTemplateRecommendations, getEffectRecommendations, getElementRecommendations } = usePersonalizationContext();
  
  const [templateRecs, setTemplateRecs] = useState<RecommendationItem<CardTemplate>[]>([]);
  const [effectRecs, setEffectRecs] = useState<RecommendationItem<CardEffect>[]>([]);
  const [elementRecs, setElementRecs] = useState<RecommendationItem<CardElement>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Load recommendations
  useEffect(() => {
    async function loadRecommendations() {
      if (!imageUrl) return;
      
      setLoading(true);
      try {
        const [templates, effects, elements] = await Promise.all([
          getTemplateRecommendations(imageUrl, availableTemplates),
          getEffectRecommendations(imageUrl, availableEffects),
          getElementRecommendations({
            imageUrl,
            cardTitle: title,
            tags
          }, availableElements)
        ]);
        
        setTemplateRecs(templates);
        setEffectRecs(effects);
        setElementRecs(elements);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadRecommendations();
  }, [imageUrl, title, tags, availableTemplates, availableEffects, availableElements]);
  
  if (!imageUrl) {
    return (
      <Card className={`${className} shadow-md border-dashed border-2`}>
        <CardContent className="p-4">
          <div className="flex flex-col items-center justify-center h-full py-10">
            <ImageIcon className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground text-center">
              Upload an image to get personalized recommendations
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={`${className} shadow-md`}>
      <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center">
          <Sparkles className="h-4 w-4 text-amber-500 mr-2" />
          <h3 className="font-medium text-sm">Smart Recommendations</h3>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <CardContent className="p-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 p-4">
            <div className="animate-pulse flex space-x-2 items-center mb-2">
              <div className="h-4 w-4 bg-primary/20 rounded-full"></div>
              <div className="h-4 w-4 bg-primary/40 rounded-full"></div>
              <div className="h-4 w-4 bg-primary/60 rounded-full"></div>
            </div>
            <p className="text-sm text-muted-foreground">Analyzing your image...</p>
          </div>
        ) : (
          <Tabs defaultValue="templates">
            <TabsList className="w-full grid grid-cols-3 rounded-none border-b h-10">
              <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
              <TabsTrigger value="effects" className="text-xs">Effects</TabsTrigger>
              <TabsTrigger value="elements" className="text-xs">Elements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="templates" className="p-0 m-0">
              <ScrollArea className="h-64">
                <div className="p-3 grid grid-cols-1 xs:grid-cols-2 gap-3">
                  {templateRecs.length > 0 ? (
                    templateRecs.map((rec) => (
                      <TemplateRecommendation 
                        key={rec.item.id}
                        recommendation={rec}
                        onApply={onApplyTemplate}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center py-8">
                      <Lightbulb className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        No template recommendations available
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="effects" className="p-0 m-0">
              <ScrollArea className="h-64">
                <div className="p-3 space-y-2">
                  {effectRecs.length > 0 ? (
                    effectRecs.map((rec) => (
                      <EffectRecommendation 
                        key={rec.item.id}
                        recommendation={rec}
                        onApply={onApplyEffect}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Lightbulb className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        No effect recommendations available
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="elements" className="p-0 m-0">
              <ScrollArea className="h-64">
                <div className="p-3 grid grid-cols-2 xs:grid-cols-3 gap-2">
                  {elementRecs.length > 0 ? (
                    elementRecs.map((rec) => (
                      <ElementRecommendation 
                        key={rec.item.id}
                        recommendation={rec}
                        onApply={onAddElement}
                      />
                    ))
                  ) : (
                    <div className="col-span-3 flex flex-col items-center justify-center py-8">
                      <Lightbulb className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        No element recommendations available
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

// Helper components
const TemplateRecommendation: React.FC<{ 
  recommendation: RecommendationItem<CardTemplate>;
  onApply?: (template: CardTemplate) => void;
}> = ({ recommendation, onApply }) => {
  const { item, reason, score } = recommendation;
  
  return (
    <div className="border rounded-md overflow-hidden bg-card hover:border-primary transition-all">
      <div className="aspect-[3/4] bg-muted">
        {item.thumbnailUrl && (
          <img 
            src={item.thumbnailUrl} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="p-2">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-medium text-xs truncate">{item.name}</h4>
          <div className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
            {Math.round(score * 100)}%
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{reason}</p>
        {onApply && (
          <Button 
            className="w-full mt-2" 
            size="sm"
            onClick={() => onApply(item)}
          >
            Apply
          </Button>
        )}
      </div>
    </div>
  );
};

const EffectRecommendation: React.FC<{ 
  recommendation: RecommendationItem<CardEffect>;
  onApply?: (effect: CardEffect) => void;
}> = ({ recommendation, onApply }) => {
  const { item, reason, score } = recommendation;
  
  return (
    <div className="border rounded-md p-2 bg-card hover:border-primary transition-all">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-sm">{item.name}</h4>
          <p className="text-xs text-muted-foreground line-clamp-1">{reason}</p>
        </div>
        {onApply && (
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => onApply(item)}
          >
            Apply
          </Button>
        )}
      </div>
    </div>
  );
};

const ElementRecommendation: React.FC<{ 
  recommendation: RecommendationItem<CardElement>;
  onApply?: (element: CardElement) => void;
}> = ({ recommendation, onApply }) => {
  const { item } = recommendation;
  
  return (
    <div className="border rounded-md overflow-hidden bg-card hover:border-primary transition-all">
      <div className="aspect-square bg-muted relative">
        <img 
          src={item.thumbnailUrl || item.assetUrl} 
          alt={item.name}
          className="w-full h-full object-contain p-1"
        />
      </div>
      <div className="p-1.5">
        <h4 className="font-medium text-xs truncate">{item.name}</h4>
        {onApply && (
          <Button 
            className="w-full mt-1" 
            size="xs" 
            variant="secondary"
            onClick={() => onApply(item)}
          >
            Add
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecommendationEngine;
