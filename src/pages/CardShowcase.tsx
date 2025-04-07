
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Keep this import separate to avoid circular references
import dynamic from 'react-router-dom';

// Define a simpler type for database records to avoid deep type instantiation
interface CardRecord {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  creator_id?: string;
  price?: number;
  edition_size?: number;
  rarity?: string;
  // Optional fields that might not exist in all records
  thumbnail_url?: string | null;
  tags?: string[] | null;
  collection_id?: string | null;
}

interface CollectionRecord {
  id: string;
  title: string;
  description: string | null;
  owner_id?: string;
  created_at: string;
  updated_at: string;
}

const CardShowcase = () => {
  const [featuredCards, setFeaturedCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch cards
        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);
          
        if (cardsError) throw cardsError;
        
        // Fetch collections
        const { data: collectionsData, error: collectionsError } = await supabase
          .from('collections')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (collectionsError) throw collectionsError;
        
        // Type-safe conversion of database records to application types
        const formattedCards: Card[] = (cardsData as CardRecord[]).map(card => ({
          id: card.id,
          title: card.title,
          description: card.description || '',
          imageUrl: card.image_url || '',
          thumbnailUrl: card.thumbnail_url || card.image_url || '',
          tags: card.tags || [],
          createdAt: card.created_at, // Fix: Use string directly, not converting to Date
          updatedAt: card.updated_at, // Fix: Use string directly, not converting to Date
          collectionId: card.collection_id || undefined
        }));
        
        setFeaturedCards(formattedCards);
        setCollections(collectionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleViewCard = (cardId: string) => {
    navigate(`/ar-card-viewer/${cardId}`);
  };

  const handleViewCollection = (collectionId: string) => {
    navigate(`/collections/${collectionId}`);
  };

  const handleCreateCard = () => {
    navigate('/editor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-blue-50 opacity-50 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your Digital Card Collection
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create, collect, and showcase your trading cards with advanced AR features
              and stunning visual effects.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                onClick={handleCreateCard}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create New Card
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/gallery')}
              >
                Browse Gallery
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </section>
      
      {/* Featured Cards Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Cards</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {featuredCards.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500 mb-4">No cards found in your collection</p>
                  <Button onClick={handleCreateCard}>Create Your First Card</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredCards.map(card => (
                    <div 
                      key={card.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer"
                      onClick={() => handleViewCard(card.id)}
                    >
                      <div className="h-64 bg-gray-100 overflow-hidden">
                        <img 
                          src={card.imageUrl} 
                          alt={card.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2">{card.description}</p>
                        
                        {card.tags && card.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {card.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                            {card.tags.length > 3 && (
                              <span className="text-xs text-gray-400">+{card.tags.length - 3} more</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-8 text-center">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/gallery')}
                >
                  View All Cards
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Collections Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Collections</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-100 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {collections.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500 mb-4">No collections created yet</p>
                  <Button onClick={() => navigate('/collections/new')}>Create Collection</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {collections.map((collection: CollectionRecord) => (
                    <div 
                      key={collection.id}
                      className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-[1.02] cursor-pointer"
                      onClick={() => handleViewCollection(collection.id)}
                    >
                      <h3 className="font-semibold text-xl mb-2">{collection.title}</h3>
                      <p className="text-gray-500 mb-4 line-clamp-2">{collection.description}</p>
                      <Button variant="outline" size="sm">View Collection</Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-8 text-center">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/collections')}
                >
                  Manage Collections
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* AR Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Experience Cards in AR</h2>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Place your cards in the real world with our augmented reality features.
              Interact with your collection like never before.
            </p>
            
            <div className="bg-blue-50 rounded-xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold mb-4">AR Card Viewer</h3>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-600 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span>Place multiple cards in your environment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-600 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span>Interact with cards using touch gestures</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-600 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span>See holographic effects in real-time</span>
                    </li>
                  </ul>
                  <Button onClick={() => navigate('/ar-card-viewer')}>
                    Try AR Viewer
                  </Button>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="aspect-video bg-gray-100 rounded overflow-hidden relative">
                    <img 
                      src="/images/ar-demo.jpg" 
                      alt="AR Demo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/600x400?text=AR+Demo';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/60 text-white rounded-full p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CardShow</h3>
              <p className="text-gray-400">
                The ultimate platform for digital card collectors and enthusiasts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/gallery" className="text-gray-400 hover:text-white">Gallery</a></li>
                <li><a href="/collections" className="text-gray-400 hover:text-white">Collections</a></li>
                <li><a href="/ar-card-viewer" className="text-gray-400 hover:text-white">AR Viewer</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">
                Have questions or feedback? Reach out to our team.
              </p>
              <a href="mailto:support@cardshow.app" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
                support@cardshow.app
              </a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} CardShow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CardShowcase;
