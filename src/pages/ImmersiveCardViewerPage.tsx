import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/lib/types';
import ImmersiveCardViewer from '@/components/card-viewer/ImmersiveCardViewer';
import { useCards } from '@/hooks/useCards';
import { useToast } from '@/hooks/use-toast';
import { LoadingState } from '@/components/ui/loading-state';
import { useBaseballCard, BASEBALL_CARDS } from '@/components/baseball/hooks/useBaseballCard';
import { adaptToCard } from '@/lib/adapters/cardAdapter';

const ImmersiveCardViewerPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards, getCard } = useCards();
  const { toast } = useToast();
  const { cardData } = useBaseballCard();
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [effectIntensities, setEffectIntensities] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadCard = async () => {
      setIsLoading(true);
      try {
        console.log("ImmersiveCardViewerPage: Loading card with ID:", id);
        
        // Try multiple sources to find the card
        let foundCard = null;
        
        // 1. Try to get from useCards hook
        if (id && getCard) {
          foundCard = getCard(id);
          if (foundCard) {
            console.log("Found card in useCards:", foundCard);
          }
        }
        
        // 2. Try to find in baseball cards if not found in regular cards
        if (!foundCard && id) {
          const baseballCard = BASEBALL_CARDS.find(card => card.id === id);
          if (baseballCard) {
            console.log("Found card in BASEBALL_CARDS:", baseballCard);
            // Convert baseball card to standard card format with empty effects array if not present
            foundCard = adaptToCard({
              ...baseballCard,
              userId: 'system', 
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              effects: baseballCard.effects || [] // Safely access effects or use empty array
            });
          }
        }
        
        // 3. If still not found, check in all available cards
        if (!foundCard && cards.length > 0) {
          foundCard = cards.find(c => c.id === id);
          if (foundCard) {
            console.log("Found card in cards array:", foundCard);
          }
        }

        if (foundCard) {
          setCard(foundCard);
          // Set active effects if available
          if (foundCard.effects && foundCard.effects.length > 0) {
            setActiveEffects(foundCard.effects);
          } else {
            // Add some default effects for better visualization
            setActiveEffects(['Holographic']);
          }
          
          // Set some default effect intensities
          setEffectIntensities({
            Holographic: 0.7,
            Shimmer: 0.5,
            Refractor: 0.6,
            Vintage: 0.4
          });
        } else {
          console.error(`Card with ID "${id}" not found in any source`);
          toast({
            title: "Card not found",
            description: "The requested card could not be found",
            variant: "destructive"
          });
          
          // Navigate back to the gallery after a short delay
          setTimeout(() => {
            navigate('/cards');
          }, 3000);
        }
      } catch (error) {
        console.error('Error loading card:', error);
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
  }, [id, getCard, cards, toast, navigate]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      {isLoading ? (
        <LoadingState size="lg" text="Loading card..." />
      ) : card ? (
        <Suspense fallback={<LoadingState size="lg" text="Preparing 3D view..." />}>
          <ImmersiveCardViewer 
            card={card}
            activeEffects={activeEffects}
            effectIntensities={effectIntensities}
          />
        </Suspense>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-white">
          <h2 className="text-2xl font-bold mb-4">Card Not Found</h2>
          <p className="text-gray-400 mb-6">The card you're looking for could not be found.</p>
          <button 
            onClick={() => navigate('/cards')}
            className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Gallery
          </button>
        </div>
      )}
    </div>
  );
};

export default ImmersiveCardViewerPage;
