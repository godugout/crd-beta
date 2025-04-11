
import React from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Collection } from '@/context/CardContext';
import { ChevronRight, Lock, Globe } from 'lucide-react';

interface CollectionListProps {
  collections: Collection[];
  isLoading: boolean;
}

const CollectionList: React.FC<CollectionListProps> = ({ collections, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(6).fill(0).map((_, index) => (
          <div key={index} className="flex items-center p-4 border rounded-md">
            <Skeleton className="h-12 w-12 rounded-md mr-4" />
            <div className="flex-1">
              <Skeleton className="h-5 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </div>
        ))}
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No collections found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {collections.map((collection) => (
        <Link 
          key={collection.id} 
          to={`/collection/${collection.id}`}
          className="flex items-center p-4 border rounded-md hover:bg-gray-50 transition-colors"
        >
          <div className="h-12 w-12 bg-gray-100 rounded-md mr-4 overflow-hidden flex-shrink-0">
            {collection.coverImageUrl ? (
              <img
                src={collection.coverImageUrl}
                alt={collection.name || 'Collection'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-100">
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <h3 className="font-medium text-base truncate">{collection.name}</h3>
              <div className="ml-2 flex-shrink-0">
                {collection.visibility === 'private' ? (
                  <Lock className="h-3.5 w-3.5 text-gray-400" />
                ) : (
                  <Globe className="h-3.5 w-3.5 text-gray-400" />
                )}
              </div>
            </div>
            {collection.description && (
              <p className="text-sm text-gray-600 truncate">{collection.description}</p>
            )}
          </div>
          
          <div className="flex items-center ml-4">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 mr-3">
              {collection.cardIds?.length || 0} cards
            </span>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CollectionList;
