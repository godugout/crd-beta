
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import CardMakerWizard from '@/components/card-creation/CardMakerWizard';
import TemplateSelector from '@/components/template-system/TemplateSelector';
import AITemplateAnalyzer from '@/components/template-system/AITemplateAnalyzer';
import { useCardEffectsStack } from '@/components/card-creation/hooks/useCardEffectsStack';
import { useLayers } from '@/components/card-creation/hooks/useLayers';
import { useTemplateSystem } from '@/hooks/useTemplateSystem';
import { CardDesignState, CardLayer } from '@/components/card-creation/types/cardTypes';
import { Template } from '@/lib/types/templateTypes';
import { Button } from '@/components/ui/button';
import { Sparkles, Palette } from 'lucide-react';

const CardCreatorPage: React.FC = () => {
  const [cardData, setCardData] = useState<CardDesignState>({
    title: '',
    description: '',
    tags: [],
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    imageUrl: null,
    player: '',
    team: '',
    year: '',
  });
  
  const {
    layers,
    activeLayerId,
    setActiveLayer,
    addLayer,
    updateLayer,
    deleteLayer,
    moveLayerUp,
    moveLayerDown,
    setLayers
  } = useLayers();
  
  const { 
    activeEffects,
    addEffect, 
    removeEffect, 
    updateEffectSettings,
    effectStack = [],
    getEffectClasses = () => ""
  } = useCardEffectsStack();

  const {
    selectedTemplate,
    aiRecommendations,
    isTemplateModalOpen,
    isAnalyzing,
    openTemplateSelector,
    closeTemplateSelector,
    handleTemplateSelect,
    handleAIRecommendations,
    startAIAnalysis
  } = useTemplateSystem({
    onApplyTemplate: (template: Template, templateLayers: CardLayer[], effects: string[]) => {
      // Apply template layers
      setLayers(templateLayers);
      
      // Apply template effects
      effects.forEach(effect => {
        addEffect(effect);
      });
      
      // Update card data with template metadata
      setCardData(prev => ({
        ...prev,
        tags: [...prev.tags, ...template.metadata.tags]
      }));
    }
  });

  const activeLayer = layers.find(layer => layer.id === activeLayerId) || null;

  // Trigger AI analysis when image is uploaded
  React.useEffect(() => {
    if (cardData.imageUrl && !isAnalyzing && aiRecommendations.length === 0) {
      startAIAnalysis();
    }
  }, [cardData.imageUrl, isAnalyzing, aiRecommendations.length, startAIAnalysis]);

  return (
    <PageLayout
      title="Create a CRD"
      description="Design your own custom trading cards with advanced effects and 3D visualization."
    >
      <div className="container mx-auto max-w-[1400px] px-4 pt-6 pb-20">
        {/* Template Selection Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create Your Card</h1>
            <p className="text-muted-foreground">Choose a template or start from scratch</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={openTemplateSelector}
              className="flex items-center gap-2"
            >
              <Palette className="h-4 w-4" />
              {selectedTemplate ? 'Change Template' : 'Choose Template'}
            </Button>
            
            {aiRecommendations.length > 0 && (
              <Button
                variant="secondary"
                onClick={openTemplateSelector}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                AI Suggestions ({aiRecommendations.length})
              </Button>
            )}
          </div>
        </div>

        {/* Current Template Info */}
        {selectedTemplate && (
          <div className="mb-6 p-4 bg-card rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{selectedTemplate.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedTemplate.category} • {selectedTemplate.era} • {selectedTemplate.effects.length} effects
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={openTemplateSelector}>
                Change
              </Button>
            </div>
          </div>
        )}

        {/* Card Creation Wizard */}
        <CardMakerWizard 
          cardData={cardData}
          setCardData={setCardData}
          layers={layers}
          setLayers={setLayers}
          activeLayer={activeLayer}
          setActiveLayerId={setActiveLayer}
          updateLayer={updateLayer}
          effectStack={effectStack}
          addEffect={addEffect}
          removeEffect={removeEffect}
          updateEffectSettings={updateEffectSettings}
          effectClasses={getEffectClasses()}
        />

        {/* Template Selector Modal */}
        <TemplateSelector
          isOpen={isTemplateModalOpen}
          onClose={closeTemplateSelector}
          onSelectTemplate={handleTemplateSelect}
          aiRecommendations={aiRecommendations}
          uploadedImage={cardData.imageUrl}
        />

        {/* AI Template Analyzer */}
        {cardData.imageUrl && (
          <AITemplateAnalyzer
            imageUrl={cardData.imageUrl}
            onRecommendations={handleAIRecommendations}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default CardCreatorPage;
