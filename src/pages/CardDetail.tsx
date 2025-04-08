
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Edit, Heart, MessageSquare, Share } from 'lucide-react';
import PageLayout from '@/components/navigation/PageLayout';
import { useCards } from '@/context/CardContext';
import CardPreview from '@/components/card-editor/CardPreview';
import { Card } from '@/lib/types';

const CardDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { cards } = useCards();
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      try {
        // Find card by ID from the cards array
        const foundCard = cards.find(card => card.id === id);
        setCard(foundCard || null);
      } catch (error) {
        console.error("Error finding card:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, cards]);

  if (isLoading) {
    return (
      <PageLayout title="Loading">
        <div className="container mx-auto max-w-6xl px-4 py-8 flex items-center justify-center">
          <p>Loading card details...</p>
        </div>
      </PageLayout>
    );
  }

  if (!card) {
    return (
      <PageLayout title="Card Not Found">
        <div className="container mx-auto max-w-6xl px-4 py-8 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Card Not Found</h2>
          <p className="mb-6">The card you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/cards/gallery">Back to Gallery</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={card.title}
      description={card.description}
      imageUrl={card.imageUrl}
      type="article"
    >
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="-ml-4">
            <Link to="/cards/gallery" className="flex items-center">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Gallery
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="max-w-md mx-auto">
              {card.imageUrl && (
                <CardPreview 
                  imageUrl={card.imageUrl}
                  title={card.title}
                  description={card.description}
                  fabricSwatches={card.fabricSwatches || []}
                  cardStyle={card.designMetadata?.cardStyle || {}}
                  textStyle={card.designMetadata?.textStyle || {}}
                />
              )}
            </div>
          </div>
          
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">{card.title}</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {card.description && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{card.description}</p>
              </div>
            )}
            
            {card.tags && card.tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {card.fabricSwatches && card.fabricSwatches.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Card Details</h2>
                <div className="space-y-2">
                  {card.fabricSwatches.map((swatch: any, index: number) => (
                    <div key={index} className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      {swatch.team && (
                        <div>
                          <span className="font-medium text-gray-700">Team: </span>
                          <span>{swatch.team}</span>
                        </div>
                      )}
                      {swatch.year && (
                        <div>
                          <span className="font-medium text-gray-700">Year: </span>
                          <span>{swatch.year}</span>
                        </div>
                      )}
                      {swatch.type && (
                        <div>
                          <span className="font-medium text-gray-700">Type: </span>
                          <span>{swatch.type}</span>
                        </div>
                      )}
                      {swatch.manufacturer && (
                        <div>
                          <span className="font-medium text-gray-700">Manufacturer: </span>
                          <span>{swatch.manufacturer}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-auto pt-6">
              <Button asChild className="mr-4">
                <Link to={`/cards/${card.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Card
                </Link>
              </Button>
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CardDetail;
