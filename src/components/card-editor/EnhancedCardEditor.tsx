
import React, { useState, useCallback } from 'react';
import { Card } from '@/lib/types';
import { CardEditorCore } from './CardEditorCore';
import { TemplateSelector, CardTemplate } from './TemplateSelector';
import { toast } from 'sonner';

interface EnhancedCardEditorProps {
  initialCard?: Partial<Card>;
  onSave: (card: Card) => Promise<void>;
  onPreview: (card: Card) => void;
  className?: string;
}

export const EnhancedCardEditor: React.FC<EnhancedCardEditorProps> = ({
  initialCard,
  onSave,
  onPreview,
  className
}) => {
  const [showTemplateSelector, setShowTemplateSelector] = useState(!initialCard);
  const [currentCard, setCurrentCard] = useState<Partial<Card> | null>(initialCard || null);

  const handleTemplateSelect = useCallback((template: CardTemplate) => {
    const newCard: Partial<Card> = {
      id: `card-${Date.now()}`,
      title: 'Untitled Card',
      description: '',
      imageUrl: '',
      thumbnailUrl: '',
      userId: 'current-user',
      tags: [],
      effects: template.defaultEffects || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      designMetadata: {
        cardStyle: {
          template: template.id,
          effect: 'none',
          borderRadius: '8px',
          borderColor: '#000000',
          frameWidth: 2,
          frameColor: '#000000',
          shadowColor: 'rgba(0,0,0,0.2)'
        },
        textStyle: {
          titleColor: '#000000',
          titleAlignment: 'center',
          titleWeight: 'bold',
          descriptionColor: '#333333'
        },
        cardMetadata: {
          category: 'Standard',
          series: 'Base',
          cardType: 'Standard',
          ...template.defaultMetadata
        },
        marketMetadata: {
          isPrintable: false,
          isForSale: false,
          includeInCatalog: false
        }
      },
      layers: template.defaultLayers.map((layerTemplate, index) => ({
        id: `layer-${Date.now()}-${index}`,
        type: layerTemplate.type,
        content: layerTemplate.defaultContent?.text || '',
        position: { ...layerTemplate.position, z: index },
        size: layerTemplate.size,
        rotation: 0,
        opacity: 1,
        zIndex: index,
        visible: true,
        locked: layerTemplate.constraints?.locked || false,
        textStyle: layerTemplate.defaultContent?.fontSize ? {
          fontSize: layerTemplate.defaultContent.fontSize,
          fontFamily: layerTemplate.defaultContent.fontFamily,
          color: layerTemplate.defaultContent.color,
          fontWeight: layerTemplate.defaultContent.fontWeight,
          textAlign: layerTemplate.defaultContent.textAlign || 'left'
        } : undefined,
        color: layerTemplate.defaultContent?.fill,
        shapeType: layerTemplate.defaultContent?.type
      }))
    };

    setCurrentCard(newCard);
    setShowTemplateSelector(false);
    
    toast.success(`Applied ${template.name} template`);
  }, []);

  const handleSave = useCallback(async (card: Card) => {
    try {
      await onSave(card);
      setCurrentCard(card);
    } catch (error) {
      console.error('Save failed:', error);
      throw error;
    }
  }, [onSave]);

  if (showTemplateSelector) {
    return (
      <TemplateSelector
        isOpen={true}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={handleTemplateSelect}
      />
    );
  }

  if (!currentCard) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Card Selected</h2>
          <button
            onClick={() => setShowTemplateSelector(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Choose Template
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Template Change Button */}
      <button
        onClick={() => setShowTemplateSelector(true)}
        className="absolute top-4 left-4 z-10 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        Change Template
      </button>

      <CardEditorCore
        initialCard={currentCard}
        onSave={handleSave}
        onPreview={onPreview}
        className={className}
      />
    </div>
  );
};

export default EnhancedCardEditor;
