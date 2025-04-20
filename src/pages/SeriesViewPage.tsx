
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/lib/types';
import PageLayout from '@/components/navigation/PageLayout';
import CardGrid from '@/components/gallery/CardGrid';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner'; // Import toast from sonner (or your preferred library)
import { Skeleton } from '@/components/ui/skeleton';

interface SeriesViewPageProps {}

const SeriesViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { cards, getCardById } = useCards(); // Update to use getCardById instead of getCard
  const [currentSeries, setCurrentSeries] = useState<Card | null>(null);
  const [relatedCards, setRelatedCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      try {
        // Use getCardById instead of getCard
        const seriesCard = getCardById(id);
        if (seriesCard) {
          setCurrentSeries(seriesCard);
          // Filter related cards by series
          setRelatedCards(cards.filter(card => 
            card.id !== id && 
            card.designMetadata?.cardMetadata?.series === seriesCard.designMetadata?.cardMetadata?.series
          ));
        } else {
          toast.error("Series not found");
          setError("Series not found");
        }
      } catch (err) {
        console.error("Error loading series:", err);
        toast.error("Error loading series");
        setError("Error loading series");
      }
    } else {
      toast.error("No series ID provided");
      setError("No series ID provided");
    }
  }, [id, cards, getCardById]);

  const handleCardClick = (cardId: string) => {
    // Handle card click, for example navigate to the card details page
    window.location.href = `/cards/${cardId}`;
  };

  if (loading) {
    return (
      <PageLayout title="Loading Series..." description="Please wait">
        <div className="container mx-auto p-4">
          <Skeleton className="w-full h-64" />
        </div>
      </PageLayout>
    );
  }

  if (error || !currentSeries) {
    return (
      <PageLayout title="Series Not Found" description="The requested series could not be found">
        <div className="container mx-auto p-4">
          <p className="text-red-500">{error || "Series not found"}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={currentSeries.title || "Series"}
      description={`Explore cards from the ${currentSeries.title} series`}
    >
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{currentSeries.title}</h1>
        <p className="text-gray-600 mb-8">{currentSeries.description}</p>

        <h2 className="text-2xl font-semibold mb-4">Related Cards</h2>
        {relatedCards.length > 0 ? (
          <CardGrid 
            cards={relatedCards} 
            onCardClick={handleCardClick} // Add the required onCardClick prop
          />
        ) : (
          <p>No related cards found for this series.</p>
        )}
      </div>
    </PageLayout>
  );
};

export default SeriesViewPage;
