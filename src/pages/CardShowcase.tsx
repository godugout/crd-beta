
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client'; 
import { Card } from '@/lib/types';

// Define types that match the database schema
interface DBCard {
  created_at: string;
  creator_id: string;
  description: string;
  edition_size: number;
  id: string;
  image_url: string;
  price: number;
  rarity: string;
  title: string;
  updated_at: string;
}

interface DBCollection {
  created_at: string;
  description: string;
  id: string;
  owner_id: string;
  title: string;
  updated_at: string;
}

// This component will display a showcase of cards
const CardShowcase = () => {
  const { id } = useParams<{ id: string }>();
  const [collection, setCollection] = useState<{ id: string; title: string; description: string } | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch collection
        if (id) {
          const { data: collectionData, error: collectionError } = await supabase
            .from('collections')
            .select('*')
            .eq('id', id)
            .single();
            
          if (collectionError) {
            console.error('Error fetching collection:', collectionError);
            return;
          }
          
          if (collectionData) {
            const typedCollection = collectionData as DBCollection;
            setCollection({
              id: typedCollection.id,
              title: typedCollection.title, // Using title instead of name
              description: typedCollection.description || ''
            });
            
            // Fetch cards in collection
            const { data: cardsData, error: cardsError } = await supabase
              .from('cards')
              .select('*')
              .eq('collection_id', id);
              
            if (cardsError) {
              console.error('Error fetching cards:', cardsError);
              return;
            }
            
            if (cardsData) {
              const formattedCards: Card[] = (cardsData as DBCard[]).map(card => ({
                id: card.id,
                title: card.title,
                description: card.description || '',
                imageUrl: card.image_url || '',
                thumbnailUrl: card.image_url || '', // Using image_url as thumbnailUrl
                tags: [], // Default empty array for tags
                createdAt: new Date(card.created_at),
                updatedAt: new Date(card.updated_at),
                collectionId: id // Using the collection id from params
              }));
              
              setCards(formattedCards);
            }
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Import Navbar dynamically to fix build error
  const Navbar = React.lazy(() => import('@/components/Navbar'));

  return (
    <div className="min-h-screen bg-gray-50">
      <React.Suspense fallback={<div>Loading...</div>}>
        <Navbar />
      </React.Suspense>
      
      <main className="container mx-auto px-4 py-8 mt-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : collection ? (
          <div>
            <h1 className="text-3xl font-bold mb-2">{collection.title}</h1>
            <p className="text-gray-600 mb-8">{collection.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cards.map((card) => (
                <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200">
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{card.title}</h2>
                    <p className="text-gray-600 text-sm mt-1">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {cards.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No cards found in this collection.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Collection not found.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CardShowcase;
