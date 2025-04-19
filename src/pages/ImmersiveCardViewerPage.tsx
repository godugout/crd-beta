import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/lib/types';
import ImmersiveCardViewer from '@/components/card-viewer/ImmersiveCardViewer';
import { useCards } from '@/context/CardContext';
import { useToast } from '@/hooks/use-toast';

const ImmersiveCardViewerPage: React.FC = () => {
  const { id } = useParams();
  const { cards, getCardById } = useCards();
  const { toast } = useToast();
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [effectIntensities, setEffectIntensities] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadCard = async () => {
      setIsLoading(true);
      try {
        if (id && getCardById) {
          const foundCard = getCardById(id);
          if (foundCard) {
            setCard(foundCard);
            // Assuming card has an effects property
            if (foundCard.effects) {
              setActiveEffects(foundCard.effects);
            }
          } else {
            toast({
              title: "Card not found",
              description: "The requested card could not be found",
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Card ID missing",
            description: "No card ID was provided",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error loading card",
          description: "There was a problem loading the card",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCard();
  }, [id, getCardById, toast]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-t-blue-500 border-blue-300/30 rounded-full animate-spin"></div>
        </div>
      ) : card ? (
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="h-12 w-12 border-4 border-t-blue-500 border-blue-300/30 rounded-full animate-spin"></div>
          </div>
        }>
          <ImmersiveCardViewer 
            card={card}
            activeEffects={activeEffects}
            effectIntensities={effectIntensities}
          />
        </Suspense>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white">
          Card not found
        </div>
      )}
    </div>
  );
};

export default ImmersiveCardViewerPage;
