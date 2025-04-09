
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CardBasicInfo from './CardBasicInfo';
import CardDesignCustomization from './CardDesignCustomization';
import CardTextCustomization from './CardTextCustomization';
import CardPreview from './CardPreview';
import CardEditorHeader from './CardEditorHeader';
import { CardStyle } from './CardDesignCustomization';
import { TextStyle } from './CardTextCustomization';
import { useCardEditorState } from './hooks/useCardEditorState';
import { Card } from '@/lib/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';
import { FabricSwatch } from './types';

interface CardCreationFlowProps {
  card?: Card;
  className?: string;
}

const CardCreationFlow: React.FC<CardCreationFlowProps> = ({ card, className }) => {
  const navigate = useNavigate();
  const { addCard, updateCard } = useCards();
  const [activeTab, setActiveTab] = useState('info');
  const cardState = useCardEditorState({ initialCard: card });

  const handleSave = async () => {
    if (!cardState.title.trim()) {
      toast.error('Please provide a title for your card');
      return;
    }

    if (!cardState.imageUrl) {
      toast.error('Please upload an image for your card');
      return;
    }

    try {
      const cardData = cardState.getCardData();
      
      if (card) {
        // Update existing card
        await updateCard(card.id, cardData);
        toast.success('Card updated successfully');
      } else {
        // Create new card
        await addCard(cardData);
        toast.success('Card created successfully');
      }
      
      // Navigate to gallery
      navigate('/gallery');
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className={`max-w-5xl mx-auto ${className || ''}`}>
      <CardEditorHeader 
        title={card ? 'Edit Card' : 'Create New Card'}
        subtitle="Upload an image and customize your card"
      />

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mt-6"
      >
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="info" className="data-[state=active]:bg-cardshow-blue/10">
            1. Card Info
          </TabsTrigger>
          <TabsTrigger value="design" className="data-[state=active]:bg-cardshow-blue/10">
            2. Design
          </TabsTrigger>
          <TabsTrigger value="text" className="data-[state=active]:bg-cardshow-blue/10">
            3. Text
          </TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-cardshow-blue/10">
            4. Preview
          </TabsTrigger>
        </TabsList>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <TabsContent value="info" className="mt-0">
            <CardBasicInfo 
              title={cardState.title}
              setTitle={cardState.setTitle}
              description={cardState.description}
              setDescription={cardState.setDescription}
              tags={cardState.tags}
              setTags={cardState.setTags}
              newTag={cardState.newTag}
              setNewTag={cardState.setNewTag}
              fabricSwatches={cardState.fabricSwatches}
              setFabricSwatches={cardState.setFabricSwatches}
              imageFile={cardState.imageFile}
              imageUrl={cardState.imageUrl}
              onImageUpload={cardState.handleImageUpload}
            />
          </TabsContent>

          <TabsContent value="design" className="mt-0">
            <CardDesignCustomization 
              imageUrl={cardState.imageUrl}
              cardStyle={cardState.cardStyle}
              setCardStyle={cardState.setCardStyle}
            />
          </TabsContent>

          <TabsContent value="text" className="mt-0">
            <CardTextCustomization 
              imageUrl={cardState.imageUrl}
              textStyle={cardState.textStyle}
              setTextStyle={cardState.setTextStyle}
              cardTitle={cardState.title}
              setCardTitle={cardState.setTitle}
              cardDescription={cardState.description}
              setCardDescription={cardState.setDescription}
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <CardPreview 
              imageUrl={cardState.imageUrl}
              title={cardState.title}
              description={cardState.description}
              fabricSwatches={cardState.fabricSwatches}
              cardStyle={cardState.cardStyle}
              textStyle={cardState.textStyle}
            />
          </TabsContent>

          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <div className="space-x-4">
              {activeTab !== 'info' && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    const tabs = ['info', 'design', 'text', 'preview'];
                    const currentIndex = tabs.indexOf(activeTab);
                    setActiveTab(tabs[currentIndex - 1]);
                  }}
                >
                  Previous
                </Button>
              )}

              {activeTab !== 'preview' ? (
                <Button 
                  onClick={() => {
                    const tabs = ['info', 'design', 'text', 'preview'];
                    const currentIndex = tabs.indexOf(activeTab);
                    setActiveTab(tabs[currentIndex + 1]);
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button onClick={handleSave}>
                  {card ? 'Update Card' : 'Create Card'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default CardCreationFlow;
