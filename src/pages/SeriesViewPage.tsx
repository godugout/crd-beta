import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/lib/types';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Share2, Star } from 'lucide-react';
import { useCards } from '@/hooks/useCards';
// Fix import to use default import
import CardGallery from '@/components/CardGallery';

// Define Series type
export interface Series {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  coverImageUrl?: string;
  year: string;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
}

// Define loading enum
enum LoadingState {
  IDLE,
  LOADING,
  LOADED,
  ERROR
}

const SeriesViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [series, setSeries] = useState<Series | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [activeTab, setActiveTab] = useState('cards');
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { getCard } = useCards();

  useEffect(() => {
    const fetchSeriesAndCards = async () => {
      setLoadingState(LoadingState.LOADING);
      try {
        // Mock data for series
        const mockSeries: Series = {
          id: id || '1',
          name: '2023 Topps Baseball',
          description: 'The flagship Topps Baseball series for the 2023 season.',
          imageUrl: '/images/series-placeholder.png',
          coverImageUrl: '/images/series-cover.png',
          year: '2023',
          cardCount: 350,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setSeries(mockSeries);

        // Mock data for cards in the series
        const mockCardIds = ['1', '2', '3', '4'];
        const mockCards: Card[] = mockCardIds.map(cardId => {
          const card = getCard(cardId);
          return card;
        }).filter(card => card !== undefined) as Card[];
        setCards(mockCards);

        setLoadingState(LoadingState.LOADED);
      } catch (err) {
        setError('Failed to load series and cards.');
        setLoadingState(LoadingState.ERROR);
      }
    };

    fetchSeriesAndCards();

    // Generate share URL
    setShareUrl(window.location.href);
  }, [id, getCard]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share URL copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy share URL.');
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(`Series ${isFavorite ? 'removed from' : 'added to'} favorites!`);
  };

  const renderContent = () => {
    switch (loadingState) {
      case LoadingState.LOADING:
        return <div className="text-center py-12">Loading...</div>;
      case LoadingState.ERROR:
        return <div className="text-center py-12 text-red-500">{error}</div>;
      case LoadingState.LOADED:
        return (
          <>
            <Tabs defaultValue="cards" className="w-full">
              <TabsList>
                <TabsTrigger value="cards" onClick={() => setActiveTab('cards')}>Cards</TabsTrigger>
                <TabsTrigger value="details" onClick={() => setActiveTab('details')}>Details</TabsTrigger>
              </TabsList>
              <TabsContent value="cards" className="mt-4">
                {cards.length > 0 ? (
                  <CardGallery cards={cards} onCardClick={(cardId) => navigate(`/cards/${cardId}`)} />
                ) : (
                  <div className="text-center py-8">No cards found in this series.</div>
                )}
              </TabsContent>
              <TabsContent value="details" className="mt-4">
                {series && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold">Description</h4>
                      <p>{series.description}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Year</h4>
                      <p>{series.year}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Card Count</h4>
                      <p>{series.cardCount}</p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout
      title={series ? series.name : 'Series Details'}
      description={series ? series.description : 'View details about this card series.'}
    >
      <div className="container mx-auto max-w-6xl p-4">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleToggleFavorite}>
              <Star className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
            </Button>
          </div>
        </div>
        {renderContent()}
      </div>
    </PageLayout>
  );
};

export default SeriesViewPage;
