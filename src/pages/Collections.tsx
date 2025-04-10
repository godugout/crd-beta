
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle, Grid3X3, Layers } from 'lucide-react';
import { useCards } from '@/context/CardContext';

const Collections = () => {
  const navigate = useNavigate();
  const { collections } = useCards();
  
  return (
    <PageLayout
      title="Collections"
      description="Browse your digital card collections"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Collections</h1>
            <p className="text-gray-600">
              Organize your cards in themed collections
            </p>
          </div>
          <Button asChild>
            <Link to="/collections/create" className="flex items-center">
              <PlusCircle className="mr-2 h-5 w-5" />
              New Collection
            </Link>
          </Button>
        </div>
        
        {collections && collections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {collections.map(collection => (
              <div 
                key={collection.id} 
                className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/collections/${collection.id}`)}
              >
                <div className="h-40 bg-gray-100 overflow-hidden">
                  {collection.coverImageUrl ? (
                    <img 
                      src={collection.coverImageUrl} 
                      alt={collection.name}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Layers className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{collection.name}</h3>
                  {collection.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {collection.description}
                    </p>
                  )}
                  {/* Check if collection.cardIds exists and use its length instead of cardCount */}
                  {collection.cardIds && collection.cardIds.length > 0 && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Grid3X3 className="h-3 w-3 mr-1" />
                      {collection.cardIds.length} cards
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <Layers className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-medium mb-2">No collections yet</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Create your first collection to organize your cards by theme, team, or any category you want.
            </p>
            <Button asChild>
              <Link to="/collections/create">Create Your First Collection</Link>
            </Button>
          </div>
        )}
        
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Featured Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <Link to="/collections/featured">
                <div className="h-40 bg-blue-50 flex items-center justify-center">
                  <div className="text-blue-500 text-center">
                    <Layers className="h-10 w-10 mx-auto mb-2" />
                    <p>Featured Collections</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <Link to="/packs">
                <div className="h-40 bg-green-50 flex items-center justify-center">
                  <div className="text-green-500 text-center">
                    <Layers className="h-10 w-10 mx-auto mb-2" />
                    <p>Memory Packs</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <Link to="/teams">
                <div className="h-40 bg-purple-50 flex items-center justify-center">
                  <div className="text-purple-500 text-center">
                    <Layers className="h-10 w-10 mx-auto mb-2" />
                    <p>Team Collections</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Collections;
