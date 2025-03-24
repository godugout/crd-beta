
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useNavigate, Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { ChevronRight, FolderOpen, PlusCircle, Settings, ArrowUpRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/lib/types';

const Collections = () => {
  const { collections, isLoading } = useCards();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  console.log("Collections page rendering, collections:", collections.length, collections);
  
  // Filter collections based on search
  const filteredCollections = collections.filter(collection => 
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // View collection details
  const viewCollection = (id: string) => {
    navigate(`/collections/${id}`);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto max-w-6xl px-4 pt-20">
          <div className="animate-pulse mt-8">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-full bg-gray-100 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto max-w-6xl px-4 pt-16 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 py-4 mt-4">
          <Link to="/" className="hover:text-cardshow-blue">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-cardshow-dark font-medium">Collections</span>
        </div>
        
        <div className="py-6">
          <div className="flex items-center gap-3 mb-2">
            <FolderOpen className="h-6 w-6 text-cardshow-blue" />
            <h1 className="text-3xl font-bold text-cardshow-dark">Collections</h1>
          </div>
          <p className="text-cardshow-slate">
            Organize your cards into themed collections
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-cardshow-slate" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-cardshow-blue focus:ring-1 focus:ring-cardshow-blue transition-colors"
              placeholder="Search collections..."
            />
          </div>
          
          <Button
            onClick={() => navigate('/collections/new')}
            className="flex items-center"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        </div>
        
        {filteredCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((collection) => (
              <div 
                key={collection.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 flex items-center justify-between">
                    {collection.name}
                    <span className="text-xs font-normal bg-gray-100 px-2 py-1 rounded-full text-cardshow-slate">
                      {collection.cards.length} {collection.cards.length === 1 ? 'card' : 'cards'}
                    </span>
                  </h2>
                  <p className="text-cardshow-slate text-sm mb-4">
                    {collection.description}
                  </p>
                  
                  {/* Preview of collection cards */}
                  {collection.cards.length > 0 && (
                    <div className="flex -space-x-3 mb-4 overflow-hidden">
                      {collection.cards.slice(0, 5).map((card: Card) => (
                        <div 
                          key={card.id}
                          className="w-10 h-10 rounded-full border-2 border-white overflow-hidden"
                        >
                          <img 
                            src={card.thumbnailUrl || card.imageUrl} 
                            alt={card.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {collection.cards.length > 5 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-cardshow-slate font-medium">
                          +{collection.cards.length - 5}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/collections/${collection.id}/edit`);
                      }}
                      className="flex items-center"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => viewCollection(collection.id)}
                      className="flex items-center ml-auto"
                    >
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-cardshow-neutral rounded-full p-6 mb-4">
              <PlusCircle className="h-8 w-8 text-cardshow-slate" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No collections found</h3>
            <p className="text-cardshow-slate mb-6 max-w-md">
              {collections.length === 0
                ? "You haven't created any collections yet. Create your first collection to get started!"
                : "No collections match your search. Try a different search term."
              }
            </p>
            {collections.length === 0 && (
              <Button
                onClick={() => navigate('/collections/new')}
                className="flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Collection
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Collections;
