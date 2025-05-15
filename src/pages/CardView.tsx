
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types/cardTypes';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Heart, MessageSquare, Share2, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const CardView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getCard } = useCards();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadCard = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error('No card ID provided');
        }
        const cardData = await getCard(id);
        if (!cardData) {
          throw new Error('Card not found');
        }
        setCard(cardData);
        setError(null);
      } catch (err) {
        console.error('Error loading card:', err);
        setError('Failed to load card');
        toast({
          title: "Error",
          description: "Failed to load the card",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadCard();
  }, [id, getCard, toast]);

  if (loading) {
    return (
      <PageLayout title="Loading Card..." description="Please wait">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-[2.5/3.5] bg-gray-100 rounded-lg">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !card) {
    return (
      <PageLayout title="Card Not Found" description="The requested card could not be found">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Card Not Found</h2>
            <p className="text-gray-500 mb-6">
              The card you're looking for doesn't exist or couldn't be loaded.
            </p>
            <Button asChild>
              <Link to="/gallery">Back to Gallery</Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={card.title}
      description={card.description || 'View card details'}
    >
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <Link to="/gallery" className="inline-flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Gallery
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Preview */}
          <div className="aspect-[2.5/3.5] rounded-lg overflow-hidden border bg-white shadow-lg">
            <img
              src={card.imageUrl}
              alt={card.title}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-card.png';
              }}
            />
          </div>

          {/* Card Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{card.title}</h1>
              
              {card.player && (
                <div className="flex items-center text-gray-600 mt-1">
                  <span>{card.player}</span>
                  {card.team && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{card.team}</span>
                    </>
                  )}
                  {card.year && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{card.year}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div>
              <p className="text-gray-700 whitespace-pre-line">{card.description}</p>
            </div>

            {/* Tags */}
            {card.tags && card.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag, index) => (
                  <div
                    key={`${tag}-${index}`}
                    className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5 text-gray-600" />
              </Button>
              <Button variant="outline" size="icon">
                <MessageSquare className="h-5 w-5 text-gray-600" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5 text-gray-600" />
              </Button>
              <div className="ml-auto">
                <Button variant="default" className="flex items-center gap-2" asChild>
                  <Link to={`/editor/${card.id}`}>
                    <Pencil className="h-4 w-4" />
                    Edit Card
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CardView;
