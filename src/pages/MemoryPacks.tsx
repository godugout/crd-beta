
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useNavigate, Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { ChevronRight, Package, PlusCircle, Settings, ArrowUpRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/lib/types';

const MemoryPacks = () => {
  const { collections, isLoading } = useCards();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter for memory packs (collections with packType === 'memory-pack')
  const memoryPacks = collections.filter(collection => 
    collection.designMetadata?.packType === 'memory-pack'
  );
  
  // Filter packs based on search
  const filteredPacks = memoryPacks.filter(pack => 
    pack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pack.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // View pack details
  const viewPack = (id: string) => {
    navigate(`/packs/${id}`);
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
          <span className="text-cardshow-dark font-medium">Memory Packs</span>
        </div>
        
        <div className="py-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-6 w-6 text-cardshow-blue" />
            <h1 className="text-3xl font-bold text-cardshow-dark">Memory Packs</h1>
          </div>
          <p className="text-cardshow-slate">
            Create and organize bundled collections of your favorite memories
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
              placeholder="Search memory packs..."
            />
          </div>
          
          <Button
            onClick={() => navigate('/packs/new')}
            className="flex items-center"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Memory Pack
          </Button>
        </div>
        
        {filteredPacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPacks.map((pack) => {
              const wrapperColor = pack.designMetadata?.wrapperColor || '#3b82f6';
              const wrapperPattern = pack.designMetadata?.wrapperPattern || 'solid';
              
              return (
                <div 
                  key={pack.id}
                  className="rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  {/* Pack cover */}
                  <div 
                    className="h-40 relative"
                    style={{
                      backgroundColor: wrapperPattern === 'solid' ? wrapperColor : undefined,
                      backgroundImage: wrapperPattern === 'gradient' 
                        ? `linear-gradient(to right, ${wrapperColor}, white)` 
                        : undefined
                    }}
                  >
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      <div className="flex justify-end">
                        <span className="bg-white/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-cardshow-slate">
                          {pack.cards?.length || 0} {pack.cards?.length === 1 ? 'card' : 'cards'}
                        </span>
                      </div>
                      
                      <div className="mt-auto">
                        <h2 className="text-lg font-bold text-white text-shadow">{pack.name}</h2>
                        {pack.description && (
                          <p className="text-sm text-white text-shadow line-clamp-2 mt-1">{pack.description}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Preview of pack cards */}
                    <div className="absolute -bottom-4 right-4 flex -space-x-3">
                      {pack.cards && pack.cards.slice(0, 3).map((card: Card) => (
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
                      {(pack.cards?.length || 0) > 3 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-white/70 backdrop-blur-sm flex items-center justify-center text-xs text-cardshow-slate font-medium">
                          +{(pack.cards?.length || 0) - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 pt-6">
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/packs/${pack.id}/edit`);
                        }}
                        className="flex items-center"
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => viewPack(pack.id)}
                        className="flex items-center ml-auto"
                      >
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-cardshow-neutral rounded-full p-6 mb-4">
              <Package className="h-8 w-8 text-cardshow-slate" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No memory packs found</h3>
            <p className="text-cardshow-slate mb-6 max-w-md">
              {memoryPacks.length === 0
                ? "You haven't created any memory packs yet. Create your first pack to get started!"
                : "No memory packs match your search. Try a different search term."
              }
            </p>
            {memoryPacks.length === 0 && (
              <Button
                onClick={() => navigate('/packs/new')}
                className="flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Memory Pack
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MemoryPacks;
