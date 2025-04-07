
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Collection, Card } from '@/lib/types';

interface MemoryPacksSectionProps {
  isLoading: boolean;
  packs: Collection[];
  handleViewPack: (packId: string) => void;
}

const MemoryPacksSection: React.FC<MemoryPacksSectionProps> = ({
  isLoading,
  packs,
  handleViewPack
}) => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Package className="h-6 w-6 text-cardshow-blue mr-3" />
          <h2 className="text-3xl font-bold text-gray-900">Memory Packs</h2>
        </div>
        
        <p className="text-lg text-gray-600 mb-8 max-w-3xl">
          Bundle your favorite cards together into themed memory packs. 
          Each pack provides a unified way to share and relive related memories.
        </p>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                <div className="p-6">
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-100 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {packs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Create your first memory pack</p>
                <Button onClick={() => navigate('/packs/new')}>
                  Create Memory Pack
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {packs.slice(0, 3).map((pack) => {
                  const wrapperColor = pack.designMetadata?.wrapperColor || '#3b82f6';
                  const wrapperPattern = pack.designMetadata?.wrapperPattern || 'solid';
                  
                  return (
                    <div 
                      key={pack.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer"
                      onClick={() => handleViewPack(pack.id)}
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
                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                          <h3 className="font-bold text-lg text-white text-shadow">{pack.name}</h3>
                          {pack.description && (
                            <p className="text-sm text-white text-shadow line-clamp-2 mt-1">
                              {pack.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                          {pack.cards?.length || 0} cards
                        </div>
                      </div>
                      
                      <div className="p-4 pt-6 relative">
                        {/* Card previews */}
                        <div className="absolute -top-4 right-4 flex -space-x-3">
                          {pack.cards?.slice(0, 3).map((card: Card) => (
                            <div 
                              key={card.id}
                              className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-md"
                            >
                              <img 
                                src={card.thumbnailUrl || card.imageUrl} 
                                alt={card.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {(pack.cards?.length || 0) > 3 && (
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600 font-medium shadow-md">
                              +{(pack.cards?.length || 0) - 3}
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-3"
                        >
                          View Pack
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {packs.length > 0 && (
              <div className="mt-8 text-center">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/packs')}
                >
                  View All Memory Packs
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default MemoryPacksSection;
