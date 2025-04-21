
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Collection } from '@/lib/types';

interface MemoryPacksSectionProps {
  packs: Collection[];
  isLoading: boolean;
  handleViewPack: (packId: string) => void;
  teamColor?: string;
}

const MemoryPacksSection: React.FC<MemoryPacksSectionProps> = ({
  packs,
  isLoading,
  handleViewPack,
  teamColor
}) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-64"></div>
      ))}
    </div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packs.map((pack) => (
        <div 
          key={pack.id}
          className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleViewPack(pack.id)}
        >
          <div className="h-48 bg-gray-100 relative overflow-hidden">
            {pack.coverImageUrl ? (
              <img 
                src={pack.coverImageUrl} 
                alt={pack.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <span className="text-gray-400">No Cover Image</span>
              </div>
            )}
            
            {pack.featured && (
              <div 
                className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-2 py-1"
                style={teamColor ? { backgroundColor: teamColor } : {}}
              >
                Featured
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="font-bold text-lg">{pack.title || pack.name}</h3>
            
            <div className="mt-2 text-sm text-gray-600 line-clamp-2">
              {pack.description || "No description available"}
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {pack.cards?.length || pack.cardIds?.length || 0} cards
              </div>
              
              <button 
                className="text-sm font-medium hover:underline" 
                style={teamColor ? { color: teamColor } : {}}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/packs/${pack.id}`);
                }}
              >
                View Pack →
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemoryPacksSection;
