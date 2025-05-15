
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types/cardTypes';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share, Heart, MessageCircle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CardView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getCardById } = useCards();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      try {
        const cardData = getCardById(id);
        setCard(cardData || null);
      } catch (error) {
        console.error("Error loading card:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [id, getCardById]);

  if (loading) {
    return (
      <PageLayout title="Loading Card" description="Please wait...">
        <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-64 h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!card) {
    return (
      <PageLayout title="Card Not Found" description="The requested card could not be found">
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Card Not Found</h2>
            <p className="text-gray-500 mb-6">
              The card you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/gallery')}>
              Return to Gallery
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Effects classes based on card's applied effects
  const getEffectClasses = () => {
    if (!card.effects || card.effects.length === 0) return '';
    return card.effects.map(effect => effect.toLowerCase().replace(' ', '-')).join(' ');
  };

  return (
    <PageLayout
      title={card.title}
      description={card.description || 'Card Details'}
    >
      <div className="container mx-auto py-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card Display */}
          <div className="md:col-span-2 flex justify-center">
            <div 
              className={`relative max-w-md aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-xl ${getEffectClasses()}`}
              style={{
                borderRadius: card.designMetadata?.cardStyle?.borderRadius || '8px',
                borderColor: card.designMetadata?.cardStyle?.borderColor || '#000',
                borderWidth: '2px',
                borderStyle: 'solid',
              }}
            >
              <img 
                src={card.imageUrl} 
                alt={card.title}
                className="w-full h-full object-cover"
              />
              
              {/* Overlays and effects could be added here */}
            </div>
          </div>
          
          {/* Card Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{card.title}</h1>
            {card.description && (
              <p className="text-gray-700 mb-4">{card.description}</p>
            )}
            
            {/* Meta Information */}
            <div className="space-y-4 mb-6">
              {card.player && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Player</h3>
                  <p className="text-lg">{card.player}</p>
                </div>
              )}
              
              {card.team && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Team</h3>
                  <p className="text-lg">{card.team}</p>
                </div>
              )}
              
              {card.year && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Year</h3>
                  <p className="text-lg">{card.year}</p>
                </div>
              )}
            </div>
            
            {/* Tags */}
            {card.tags && card.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mt-8">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Comment
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            
            {/* Created date */}
            <p className="text-xs text-gray-500 mt-6">
              Created: {new Date(card.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CardView;
