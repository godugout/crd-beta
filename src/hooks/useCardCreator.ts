
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';

// Template and environment data
const quickTemplates = [
  { id: 'chrome', name: 'Chrome', preview: 'https://images.unsplash.com/photo-1518770660439-4636190af475', effects: ['Chrome'] },
  { id: 'vintage', name: 'Vintage', preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', effects: ['Vintage'] },
  { id: 'hologram', name: 'Hologram', preview: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43', effects: ['Hologram'] },
  { id: 'neon', name: 'Neon', preview: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab', effects: ['Neon'] },
];

const environments = [
  { id: 'studio', name: 'Studio', preset: 'studio' },
  { id: 'sunset', name: 'Sunset', preset: 'sunset' },
  { id: 'warehouse', name: 'Warehouse', preset: 'warehouse' },
  { id: 'forest', name: 'Forest', preset: 'forest' },
];

const styleVariations = [
  'Classic', 'Modern', 'Retro', 'Futuristic', 'Minimal', 'Bold'
];

interface CardCreatorState {
  selectedTemplate: typeof quickTemplates[0];
  selectedEnvironment: typeof environments[0];
  selectedStyle: string;
  autoRotate: boolean;
  showSidebar: boolean;
  isLoading: boolean;
  currentCard: any;
}

export const useCardCreator = () => {
  const navigate = useNavigate();
  const { addCard } = useCards();

  // Initialize with random style for fresh experience
  const [state, setState] = useState<CardCreatorState>(() => ({
    selectedTemplate: quickTemplates[0],
    selectedEnvironment: environments[0],
    selectedStyle: styleVariations[Math.floor(Math.random() * styleVariations.length)],
    autoRotate: true,
    showSidebar: true,
    isLoading: false,
    currentCard: {
      id: 'preview-card',
      title: 'Your Amazing Card',
      description: 'Start customizing to make it yours',
      imageUrl: quickTemplates[0].preview,
      thumbnailUrl: quickTemplates[0].preview,
      userId: 'user',
      tags: [],
      effects: quickTemplates[0].effects,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      designMetadata: {
        cardStyle: {
          template: quickTemplates[0].id,
          effect: 'chrome',
          borderRadius: '8px',
          borderColor: '#000000',
        }
      },
      layers: []
    }
  }));

  const updateState = useCallback((updates: Partial<CardCreatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleTemplateChange = useCallback((template: typeof quickTemplates[0]) => {
    const updatedCard = {
      ...state.currentCard,
      imageUrl: template.preview,
      thumbnailUrl: template.preview,
      effects: template.effects,
      designMetadata: {
        ...state.currentCard.designMetadata,
        cardStyle: {
          ...state.currentCard.designMetadata?.cardStyle,
          template: template.id,
          effect: template.effects[0]?.toLowerCase()
        }
      }
    };

    updateState({
      selectedTemplate: template,
      currentCard: updatedCard
    });

    toast.success(`Applied ${template.name} template`);
  }, [state.currentCard, updateState]);

  const handleRandomizeStyle = useCallback(() => {
    const randomTemplate = quickTemplates[Math.floor(Math.random() * quickTemplates.length)];
    const randomEnvironment = environments[Math.floor(Math.random() * environments.length)];
    const randomStyle = styleVariations[Math.floor(Math.random() * styleVariations.length)];
    
    updateState({
      selectedTemplate: randomTemplate,
      selectedEnvironment: randomEnvironment,
      selectedStyle: randomStyle
    });
    
    handleTemplateChange(randomTemplate);
    toast.success('🎲 Randomized your card style!');
  }, [handleTemplateChange, updateState]);

  const handleSaveCard = useCallback(async () => {
    try {
      updateState({ isLoading: true });

      const cardData = {
        title: state.currentCard.title,
        description: state.currentCard.description,
        imageUrl: state.currentCard.imageUrl,
        thumbnailUrl: state.currentCard.thumbnailUrl,
        tags: [state.selectedTemplate.name, state.selectedStyle, state.selectedEnvironment.name],
        metadata: {
          template: state.selectedTemplate.id,
          environment: state.selectedEnvironment.id,
          style: state.selectedStyle
        },
        designMetadata: state.currentCard.designMetadata,
        effects: state.currentCard.effects,
        layers: state.currentCard.layers || [],
      };

      await addCard(cardData);
      toast.success('Card saved successfully! 🔥');
      navigate('/gallery');
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card. Please try again.');
    } finally {
      updateState({ isLoading: false });
    }
  }, [state, addCard, navigate, updateState]);

  return {
    // State
    ...state,
    quickTemplates,
    environments,
    styleVariations,
    
    // Actions
    updateState,
    handleTemplateChange,
    handleRandomizeStyle,
    handleSaveCard,
  };
};
