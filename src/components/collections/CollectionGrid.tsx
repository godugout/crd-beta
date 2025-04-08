
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Collection } from '@/lib/types';

interface CollectionGridProps {
  collections: Collection[];
  isLoading: boolean;
}

const CollectionGrid: React.FC<CollectionGridProps> = ({ collections, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-40 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <Link key={collection.id} to={`/collections/${collection.id}`}>
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 bg-gray-100">
              {collection.coverImageUrl ? (
                <img
                  src={collection.coverImageUrl}
                  alt={collection.title || 'Collection'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-100">
                  <span className="text-gray-400">No Cover Image</span>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-1">{collection.title}</h3>
              {collection.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{collection.description}</p>
              )}
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
              <span className="text-xs text-gray-500">
                {collection.cardIds?.length || 0} cards
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                {collection.visibility}
              </span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CollectionGrid;
