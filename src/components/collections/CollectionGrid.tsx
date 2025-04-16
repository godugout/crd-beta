import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Collection } from '@/lib/types';
import { CardThumbnail } from '@/components/cards';
import { Button } from '@/components/ui/button';
import { EyeIcon, LayoutGridIcon } from 'lucide-react';

interface CollectionGridProps {
  collections: Collection[];
  className?: string;
}

const CollectionGrid: React.FC<CollectionGridProps> = ({ collections, className }) => {
  const navigate = useNavigate();
  
  const handleCollectionClick = (collectionId: string) => {
    navigate(`/collections/${collectionId}`);
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {collections.map(collection => (
        <div 
          key={collection.id}
          className="relative bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => handleCollectionClick(collection.id)}
        >
          {collection.coverImageUrl && (
            <div className="aspect-w-4 aspect-h-3">
              <CardThumbnail 
                src={collection.coverImageUrl} 
                alt={collection.name} 
                className="object-cover rounded-t-md"
              />
            </div>
          )}
          
          <div className="p-4">
            <h3 className="font-semibold text-md line-clamp-1">{collection.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{collection.description}</p>
          </div>
          
          {collection.visibility && collection.visibility !== 'private' && (
            <div className="w-full py-2 flex justify-between items-center text-xs border-t border-gray-200 text-gray-500">
              <div className="flex items-center">
                <EyeIcon className="h-3.5 w-3.5 mr-1" />
                {collection.visibility === 'public' && <span>Public</span>}
                {collection.visibility === 'unlisted' && <span>Unlisted</span>}
                {collection.visibility === 'team' && <span>Team Only</span>}
              </div>
              
              {collection.cardIds && collection.cardIds.length > 0 && (
                <div className="flex items-center">
                  <LayoutGridIcon className="h-3.5 w-3.5 mr-1" />
                  <span>{collection.cardIds.length} card{collection.cardIds.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CollectionGrid;
