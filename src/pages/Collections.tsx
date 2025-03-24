
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PlusCircle, ArrowDown, X, Folder, Grid3X3 } from 'lucide-react';

import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { useCards } from '@/context/CardContext';
import OldCardCreator from '@/components/OldCardCreator';
import DugoutLabs from '@/components/experimental/DugoutLabs';

const Collections = () => {
  const navigate = useNavigate();
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const { user } = useAuth();
  const { collections, addCollection, isLoading, refreshCollections } = useCards();
  
  // Fetch collections when component mounts
  useEffect(() => {
    if (user) {
      refreshCollections();
    }
  }, [user, refreshCollections]);
  
  // Create a demo collection if user has none
  const createDemoCollection = async () => {
    if (!user) {
      toast.error("You need to be logged in to create collections");
      return;
    }
    
    try {
      await addCollection({
        name: "Baseball Legends",
        description: "A collection of legendary baseball players throughout history"
      });
      
      toast.success("Demo collection created!");
    } catch (error) {
      console.error("Error creating demo collection:", error);
      toast.error("Failed to create demo collection");
    }
  };
  
  const handleTitleClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 5) {
        toast.success("You found the easter egg! Original card creator unlocked!", {
          description: "This is where it all began - the first build of CardShow!"
        });
        setShowEasterEgg(true);
        return 0;
      }
      return newCount;
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="py-8 flex justify-between items-center">
            <div>
              <h1 
                className="text-3xl font-bold text-cardshow-dark mb-2"
                onClick={handleTitleClick}
                style={{ cursor: 'pointer' }}
              >
                Your Collections
              </h1>
              <p className="text-cardshow-slate">
                Organize your cards into themed collections
              </p>
            </div>
            
            <div className="flex gap-2">
              <DugoutLabs />
              
              <Button 
                onClick={() => navigate('/editor')}
                className="flex items-center gap-2"
              >
                <PlusCircle size={18} />
                New Card
              </Button>
            </div>
          </div>
          
          {showEasterEgg ? (
            <div className="mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-blue-800">Original Card Creator (circa 2023)</h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowEasterEgg(false)}
                    className="h-8 w-8 text-blue-600"
                  >
                    <X size={18} />
                  </Button>
                </div>
                <p className="text-blue-600 mb-4">
                  This is where it all began! The original card creator from the first build of CardShow. Browse the collection, view cards, and even try uploading a new one!
                </p>
                <div className="flex items-center justify-center mt-2 text-blue-500">
                  <ArrowDown className="animate-bounce" size={24} />
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <OldCardCreator />
              </div>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <CardContent className="p-4">
                        <Skeleton className="h-6 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : collections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collections.map((collection) => (
                    <Card 
                      key={collection.id} 
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/collections/${collection.id}`)}
                    >
                      <div className="h-48 bg-gradient-to-br from-cardshow-primary/20 to-cardshow-primary/40 flex items-center justify-center">
                        {collection.cards.length > 0 ? (
                          <Grid3X3 size={64} className="text-cardshow-primary/60" />
                        ) : (
                          <Folder size={64} className="text-cardshow-primary/60" />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-xl mb-1">{collection.name}</h3>
                        <p className="text-cardshow-slate text-sm mb-2">{collection.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-cardshow-neutral px-2 py-1 rounded-full">
                            {collection.cards.length} {collection.cards.length === 1 ? 'card' : 'cards'}
                          </span>
                          <span className="text-xs text-cardshow-slate">
                            Created {new Date(collection.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Card 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow border-dashed border-2 flex flex-col justify-center items-center h-[272px]"
                    onClick={() => navigate('/editor')}
                  >
                    <div className="text-center p-6">
                      <PlusCircle size={48} className="mx-auto mb-4 text-cardshow-primary/60" />
                      <h3 className="font-semibold text-lg mb-1">Add New Collection</h3>
                      <p className="text-cardshow-slate text-sm">Create a new themed collection</p>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-cardshow-neutral rounded-full p-6 mb-4">
                    <PlusCircle className="h-8 w-8 text-cardshow-slate" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No collections yet</h3>
                  <p className="text-cardshow-slate mb-6 max-w-md">
                    Start organizing your cards into collections. Create your first collection to get started!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={createDemoCollection}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Folder size={18} />
                      Create Demo Collection
                    </Button>
                    <Button 
                      onClick={() => navigate('/editor')}
                      className="flex items-center gap-2"
                    >
                      <PlusCircle size={18} />
                      Create a Card First
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Collections;
