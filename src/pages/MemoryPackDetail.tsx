
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';

const MemoryPackDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { collections, isLoading, cards } = useCards();
  
  const collection = collections.find(c => c.id === id);
  const collectionCards = collection 
    ? cards.filter(card => collection.cardIds.includes(card.id))
    : [];
  
  if (isLoading) {
    return (
      <PageLayout title="Loading..." description="Loading memory pack details">
        <div className="container mx-auto p-8 text-center">Loading memory pack...</div>
      </PageLayout>
    );
  }
  
  if (!collection) {
    return (
      <PageLayout title="Not Found" description="Memory pack not found">
        <div className="container mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Memory Pack Not Found</h1>
          <p className="mb-4">The memory pack you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/memory-packs">Return to Memory Packs</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title={collection.name} description={collection.description || 'Memory pack details'}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/memory-packs">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Memory Packs
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-3xl font-bold">{collection.name}</h1>
              {collection.description && (
                <p className="text-gray-600 mt-2">{collection.description}</p>
              )}
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button variant="outline">Edit Pack</Button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Cards in this pack</h2>
          
          {collectionCards.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-gray-50">
              <p>No cards in this memory pack yet.</p>
              <Button asChild className="mt-4">
                <Link to="/cards/create">Add Cards</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {collectionCards.map(card => (
                <div key={card.id} className="border rounded-lg overflow-hidden">
                  {card.imageUrl ? (
                    <div className="h-48 bg-gray-100 overflow-hidden">
                      <img 
                        src={card.imageUrl} 
                        alt={card.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="font-bold">{card.title}</h3>
                    
                    {card.designMetadata?.oaklandMemory && (
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{card.designMetadata.oaklandMemory.date}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>vs. {card.designMetadata.oaklandMemory.opponent}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{card.designMetadata.oaklandMemory.location}</span>
                        </div>
                      </div>
                    )}
                    
                    <Button variant="link" asChild className="mt-2 px-0">
                      <Link to={`/cards/${card.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default MemoryPackDetail;
