
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CardEditor from '@/components/CardEditor';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';

const Editor = () => {
  const { id } = useParams<{ id?: string }>();
  const { cards, getCardById } = useCards();
  const location = useLocation();
  const [initialData, setInitialData] = useState<any>(null);
  
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
  const editorData = card || initialData;
  
  return (
    <div className="h-screen">
      <CardEditor card={editorData} />
    </div>
  );
};

export default Editor;
