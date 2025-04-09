
import React from 'react';
import { Link } from 'react-router-dom';
import { Collection } from '@/lib/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export interface MemoryPacksSectionProps {
  isLoading: boolean;
  packs: Collection[];
  handleViewPack: (packId: string) => void;
}

const MemoryPacksSection: React.FC<MemoryPacksSectionProps> = ({
  isLoading,
  packs,
  handleViewPack
}) => {
  if (isLoading) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-6">Memory Packs</h2>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={40} />
        </div>
      </section>
    );
  }
  
  if (packs.length === 0) {
    return null; // Don't show this section if no memory packs
  }
  
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Memory Packs</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packs.map(pack => (
          <Link 
            key={pack.id} 
            to={`/memory-packs/${pack.id}`}
            className="rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-blue-100 border border-blue-200"
            onClick={() => handleViewPack(pack.id)}
          >
            <div className="h-48 overflow-hidden">
              {pack.coverImageUrl ? (
                <img 
                  src={pack.coverImageUrl} 
                  alt={pack.name}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-blue-50 to-green-100">
                  <span className="text-xl font-medium text-blue-800">Memory Pack</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-blue-800">{pack.name}</h3>
              {pack.description && (
                <p className="text-sm text-blue-700 mt-1">
                  {pack.description}
                </p>
              )}
              <div className="mt-3 inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-sm">
                Explore Pack
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MemoryPacksSection;
