
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useCards } from '@/context/CardContext';
import PageLayout from '@/components/navigation/PageLayout';
import CardMakerWizard from '@/components/card-creation/CardMakerWizard';
import { useCardEffectsStack } from '@/components/card-creation/hooks/useCardEffectsStack';
import { useLayers } from '@/components/card-creation/hooks/useLayers';
import { CardDesignState } from '@/components/card-creation/types/cardTypes';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

const UnifiedCardEditor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { cards, getCardById, addCard, updateCard } = useCards();
  
  const isEditing = !!id;
  const existingCard = isEditing ? getCardById(id) : null;
  
  const [cardData, setCardData] = useState<CardDesignState>({
    title: '',
    description: '',
    tags: [],
    imageUrl: null,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
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

  useEffect(() => {
    if (isEditing && existingCard) {
      setCardData({
        title: existingCard.title || '',
        description: existingCard.description || '',
        tags: existingCard.tags || [],
        imageUrl: existingCard.imageUrl || null,
        borderColor: existingCard.designMetadata?.cardStyle?.borderColor || '#000000',
        backgroundColor: existingCard.designMetadata?.cardStyle?.backgroundColor || '#FFFFFF',
        borderRadius: existingCard.designMetadata?.cardStyle?.borderRadius || '8px',
        player: existingCard.metadata?.player || '',
        team: existingCard.metadata?.team || '',
        year: existingCard.metadata?.year?.toString() || '',
      });
      
      toast.success('Card loaded for editing');
    }
  }, [isEditing, existingCard]);

  useEffect(() => {
    if (location.state && !isEditing) {
      const { imageUrl, metadata, cardType } = location.state;
      
      if (imageUrl) {
        setCardData(prev => ({
          ...prev,
          imageUrl,
          title: metadata?.title || '',
          description: metadata?.text || '',
          player: metadata?.player || '',
          team: metadata?.team || '',
          year: metadata?.year?.toString() || '',
          tags: metadata?.tags || [],
        }));
        
        toast.success('Card data loaded from detector');
      }
    }
  }, [location.state, isEditing]);

  const handleSaveCard = async () => {
    try {
      const cardPayload = {
        title: cardData.title,
        description: cardData.description,
        imageUrl: cardData.imageUrl || '',
        thumbnailUrl: cardData.imageUrl || '',
        tags: cardData.tags,
        metadata: {
          player: cardData.player,
          team: cardData.team,
          year: cardData.year ? parseInt(cardData.year) : undefined,
        },
        designMetadata: {
          ...DEFAULT_DESIGN_METADATA,
          cardStyle: {
            ...DEFAULT_DESIGN_METADATA.cardStyle,
            borderColor: cardData.borderColor,
            backgroundColor: cardData.backgroundColor,
            borderRadius: cardData.borderRadius,
          },
          effects: effectStack.map(effect => effect.name),
        },
        effects: effectStack.map(effect => effect.name),
        layers,
        effectClasses: getEffectClasses(),
      };

      if (isEditing && id) {
        await updateCard(id, cardPayload);
        toast.success('Card updated successfully!');
      } else {
        await addCard(cardPayload);
        toast.success('Card created successfully!');
      }
      
      navigate('/gallery');
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card. Please try again.');
    }
  };

  const activeLayer = layers.find(layer => layer.id === activeLayerId) || null;

  return (
    <PageLayout
      title={isEditing ? "Edit Card" : "Create Card"}
      description={isEditing ? "Update your card design" : "Design your own custom trading cards"}
      hideNavigation={false}
    >
      <div className="min-h-screen bg-[var(--bg-primary)]">
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
          onSave={handleSaveCard}
          isEditing={isEditing}
        />
      </div>
    </PageLayout>
  );
};

export default UnifiedCardEditor;
