
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';
import { ArrowLeft, Share2, Edit, Trash2 } from 'lucide-react';
import { Card as CardType } from '@/lib/types';
import CardMedia from '@/components/gallery/CardMedia';

const CardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards } = useCards();
  
  // Find the card with the matching ID
  const card = cards.find(c => c.id === id);
  
  // Handle card not found
  if (!card) {
    return (
      <PageLayout
        title="Card Not Found"
        description="The requested card could not be found"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Card Not Found</h1>
            <p className="text-gray-600 mb-8">
              The card you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/cards')}>
              Browse All Cards
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout
      title={card.title || "Card Detail"}
      description={card.description || "View card details"}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Image */}
          <div className="flex justify-center">
            <div className="max-w-md w-full">
              <div className="aspect-[2.5/3.5] relative rounded-lg overflow-hidden shadow-lg">
                <CardMedia 
                  card={card} 
                  onView={() => {}} 
                  className="h-full w-full object-cover" 
                />
              </div>
            </div>
          </div>
          
          {/* Card Details */}
          <div>
            <h1 className="text-3xl font-bold mb-3">{card.title}</h1>
            
            {card.tags && card.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {card.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <p className="text-gray-600 mb-6">{card.description || "No description available"}</p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/cards/edit/${card.id}`)}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Card
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
            
            {/* Additional card info */}
            <div className="space-y-4">
              {card.createdAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created</h3>
                  <p>{new Date(card.createdAt).toLocaleDateString()}</p>
                </div>
              )}
              
              {card.updatedAt && card.updatedAt !== card.createdAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p>{new Date(card.updatedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Related Cards (placeholder for now) */}
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-4">Related Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cards.slice(0, 4).filter(c => c.id !== id).map((relatedCard) => (
              <div 
                key={relatedCard.id}
                className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/cards/${relatedCard.id}`)}
              >
                <div className="h-48">
                  <CardMedia card={relatedCard} onView={() => {}} className="h-full" />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate">{relatedCard.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CardDetail;
