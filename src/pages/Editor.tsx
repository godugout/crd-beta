
import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CardEditorContainer from '@/components/card-editor/CardEditorContainer';
import PageLayout from '@/components/navigation/PageLayout';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';

const Editor = () => {
  const { id } = useParams<{ id?: string }>();
  const { cards, getCardById } = useCards();
  const location = useLocation();
  const [initialData, setInitialData] = React.useState<any>(null);
  
  // Process data passed from CardDetector
  useEffect(() => {
    if (location.state) {
      const { imageUrl, metadata, cardType } = location.state;
      
      if (imageUrl) {
        const cardData = {
          imageUrl,
          title: metadata?.title || '',
          description: metadata?.text || '',
          player: metadata?.player || '',
          team: metadata?.team || '',
          year: metadata?.year || '',
          tags: metadata?.tags || [],
          cardType
        };
        
        setInitialData(cardData);
        toast.success("Card data loaded from detector");
      }
    }
  }, [location.state]);
  
  // Get card data if editing an existing card
  const card = id ? getCardById(id) : undefined;
  
  return (
    <PageLayout
      title={card ? "Edit Card" : "Create New Card"}
      description={card ? "Edit your digital card" : "Upload an image and add details to create your digital card."}
    >
      <div className="container mx-auto max-w-6xl px-4">
        <CardEditorContainer 
          card={card} 
          initialMetadata={initialData && !card ? initialData : undefined} 
        />
      </div>
    </PageLayout>
  );
};

export default Editor;
