
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import CardDetailed from '@/components/cards/CardDetailed';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types/cardTypes';
import { ensureDetailedViewCard } from '@/types/detailedCardTypes';
import { toast } from '@/components/ui/use-toast';

const CardView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getCardById } = useCards();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    try {
      const foundCard = getCardById(id);
      
      if (foundCard) {
        setCard(foundCard);
      } else {
        toast({
          title: "Card Not Found",
          description: `We couldn't find a card with ID: ${id}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error loading card:", error);
      toast({
        title: "Error",
        description: "There was a problem loading the card",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [id, getCardById]);

  if (loading) {
    return (
      <PageLayout title="Loading Card..." description="Please wait">
        <div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-t-primary border-opacity-50 rounded-full animate-spin"></div>
        </div>
      </PageLayout>
    );
  }

  if (!card) {
    return (
      <PageLayout title="Card Not Found" description="We couldn't find this card">
        <div className="container mx-auto p-4">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-amber-700">
            <p>The card you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Convert to detailed view card format
  const detailedCard = ensureDetailedViewCard(card);

  return (
    <PageLayout title={card.title} description={card.description || ""}>
      <div className="container mx-auto p-4">
        <CardDetailed 
          card={detailedCard}
          enableEffects={true}
          activeEffects={card.effects}
          onView={(id) => console.log("View card", id)}
          onEdit={(id) => console.log("Edit card", id)}
          onShare={(id) => console.log("Share card", id)}
        />
      </div>
    </PageLayout>
  );
};

export default CardView;
