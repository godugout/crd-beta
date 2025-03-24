
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useCardData } from '@/components/gallery/useCardData';
import { Link } from 'react-router-dom';
import { Card, Collection } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { ChevronRight, Layers, Camera, Box } from 'lucide-react';
import { useCardEffects } from '@/components/home/card-viewer/useCardEffects';

// Define interfaces that match the actual database schema
interface CollectionRecord {
  id: string;
  name?: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

interface CardRecord {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  thumbnail_url?: string | null;
  tags?: string[];
  collection_id?: string;
  created_at: string;
  updated_at: string;
}

const CardShowcase = () => {
  const { cards, isLoading: isLoadingCards } = useCardData();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  
  // Get card effects for special display
  const effects = useCardEffects();

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoadingCollections(true);
      
      try {
        const { data, error } = await supabase
          .from('collections')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching collections:', error);
          return;
        }
        
        // Transform to our Collection type
        const formattedCollections: Collection[] = (data as CollectionRecord[]).map(col => ({
          id: col.id,
          name: col.title, // Use 'title' field from the database as 'name'
          description: col.description || '',
          cards: [],
          createdAt: new Date(col.created_at),
          updatedAt: new Date(col.updated_at)
        }));
        
        setCollections(formattedCollections);
        
        // Now get cards for each collection
        for (const collection of formattedCollections) {
          const { data: collectionCards, error: cardsError } = await supabase
            .from('cards')
            .select('*')
            .eq('collection_id', collection.id);
            
          if (!cardsError && collectionCards) {
            // Update the collection with its cards
            setCollections(prev => 
              prev.map(col => 
                col.id === collection.id 
                  ? {
                      ...col,
                      cards: (collectionCards as CardRecord[]).map(card => ({
                        id: card.id,
                        title: card.title,
                        description: card.description || '',
                        imageUrl: card.image_url || '',
                        thumbnailUrl: card.thumbnail_url || card.image_url || '',
                        tags: card.tags || [],
                        createdAt: new Date(card.created_at),
                        updatedAt: new Date(card.updated_at),
                        collectionId: card.collection_id
                      }))
                    }
                  : col
              )
            );
          }
        }
      } catch (err) {
        console.error('Unexpected error fetching collections:', err);
      } finally {
        setIsLoadingCollections(false);
      }
    };
    
    fetchCollections();
  }, []);
  
  // Simple card display component with effects
  const CardDisplay = ({ card }: { card: Card }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <Link 
        to={`/ar-card-viewer/${card.id}`}
        className="block transition-all duration-300 transform hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={`relative aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-md ${
            isHovered ? 'shadow-lg card-holographic' : ''
          }`}
          style={{ 
            '--shimmer-speed': '3s',
            '--hologram-intensity': '0.7',
            '--motion-speed': '1'
          } as React.CSSProperties}
        >
          <img 
            src={card.imageUrl} 
            alt={card.title} 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay with card info */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <h3 className="text-white font-medium text-sm">{card.title}</h3>
            {card.tags && card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {card.tags.slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="text-xs bg-blue-500/80 text-white px-1.5 py-0.5 rounded-sm">
                    {tag}
                  </span>
                ))}
                {card.tags.length > 2 && (
                  <span className="text-xs text-white/80 mt-0.5">+{card.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
          
          {/* View options */}
          {isHovered && (
            <div className="absolute top-2 right-2 flex gap-1">
              <Link 
                to={`/ar-card-viewer/${card.id}`}
                className="p-1.5 bg-white/80 rounded-full text-black hover:bg-white"
              >
                <Camera size={16} />
              </Link>
            </div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Card Showcase</h1>
          <p className="text-gray-600 mb-8">
            Browse our collection of premium sports trading cards and view them in AR
          </p>
          
          {/* Collections Section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <Layers className="mr-2 h-5 w-5 text-blue-600" />
                Collections
              </h2>
              <Link to="/collections" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                View All Collections
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            {isLoadingCollections ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-white rounded-lg p-4 shadow-sm">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-100 rounded w-full mb-4"></div>
                    <div className="flex gap-2">
                      {[1, 2, 3].map(j => (
                        <div key={j} className="w-12 h-16 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map(collection => (
                  <div key={collection.id} className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-semibold mb-2">{collection.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{collection.description}</p>
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                      {collection.cards.slice(0, 5).map(card => (
                        <div key={card.id} className="flex-shrink-0 w-12 h-16 rounded overflow-hidden shadow-sm">
                          <img src={card.thumbnailUrl || card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {collection.cards.length > 5 && (
                        <div className="flex-shrink-0 w-12 h-16 rounded flex items-center justify-center bg-gray-100 text-gray-500 text-xs font-medium">
                          +{collection.cards.length - 5}
                        </div>
                      )}
                    </div>
                    <Link 
                      to={`/collections/${collection.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      View Collection
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                ))}
                
                {collections.length === 0 && (
                  <div className="col-span-3 text-center py-12 bg-white rounded-lg shadow-sm">
                    <Box className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-600 mb-1">No Collections Yet</h3>
                    <p className="text-gray-500">Collections will appear here once created</p>
                  </div>
                )}
              </div>
            )}
          </section>
          
          {/* Featured Cards Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Featured Cards</h2>
              <Link to="/gallery" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                View All Cards
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            {isLoadingCards ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[2.5/3.5] bg-gray-200 rounded-lg mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {cards.map(card => (
                  <CardDisplay key={card.id} card={card} />
                ))}
                
                {cards.length === 0 && (
                  <div className="col-span-5 text-center py-12 bg-white rounded-lg shadow-sm">
                    <Box className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-600 mb-1">No Cards Yet</h3>
                    <p className="text-gray-500">Cards will appear here once added</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default CardShowcase;
