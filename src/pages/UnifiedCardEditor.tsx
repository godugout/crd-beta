
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useCards } from '@/context/CardContext';
import PageLayout from '@/components/navigation/PageLayout';
import CardCreationHub from '@/components/card-creation/modern/CardCreationHub';
import DevAuthStatus from '@/components/dev/DevAuthStatus';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';
import { ensureDevUserLoggedIn } from '@/utils/devAuth';

const UnifiedCardEditor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { cards, getCardById, addCard, updateCard } = useCards();
  
  const isEditing = !!id;
  const existingCard = isEditing ? getCardById(id) : null;

  useEffect(() => {
    // Auto-login test user in development
    if (process.env.NODE_ENV === 'development') {
      ensureDevUserLoggedIn();
    }
  }, []);

  useEffect(() => {
    if (isEditing && existingCard) {
      toast.success('Card loaded for editing');
    }
  }, [isEditing, existingCard]);

  const handleSaveCard = async (cardData: any) => {
    try {
      const cardPayload = {
        title: cardData.title || 'Untitled Card',
        description: cardData.description || '',
        imageUrl: cardData.imageUrl || '',
        thumbnailUrl: cardData.imageUrl || '',
        tags: cardData.tags || [],
        metadata: {
          player: cardData.player || '',
          team: cardData.team || '',
          year: cardData.year ? parseInt(cardData.year) : undefined,
        },
        designMetadata: {
          ...DEFAULT_DESIGN_METADATA,
          type: cardData.type || 'custom',
          template: cardData.template,
          ...cardData.designMetadata
        },
        effects: cardData.effects || [],
        layers: cardData.layers || [],
      };

      if (isEditing && id) {
        await updateCard(id, cardPayload);
        toast.success('Card updated successfully! 🔥');
      } else {
        await addCard(cardPayload);
        toast.success('Card created successfully! 🔥');
      }
      
      navigate('/gallery');
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card. Please try again.');
    }
  };

  return (
    <>
      <DevAuthStatus />
      <PageLayout
        title={isEditing ? "Edit Card" : "Create Card"}
        description={isEditing ? "Update your card design" : "Design your own custom trading cards"}
        hideNavigation={true}
      >
        <CardCreationHub 
          onSave={handleSaveCard}
          isEditing={isEditing}
          initialData={existingCard}
        />
      </PageLayout>
    </>
  );
};

export default UnifiedCardEditor;
