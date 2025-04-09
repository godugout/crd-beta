
import React from 'react';
import { Link } from 'react-router-dom';
import { Collection } from '@/context/CardContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock, Globe, Users, Image } from 'lucide-react';

interface CollectionGridProps {
  collections: Collection[];
  isLoading: boolean;
  className?: string;
}

const CollectionGrid: React.FC<CollectionGridProps> = ({ collections, isLoading, className = '' }) => {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ${className}`}>
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
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">No collections found.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ${className}`}>
      {collections.map((collection) => (
        <Link key={collection.id} to={`/collections/${collection.id}`}>
          <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
            <div className="h-40 bg-gray-100 relative">
              {collection.coverImageUrl ? (
                <img
                  src={collection.coverImageUrl}
                  alt={collection.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('fallback-active');
                  }}
                />
              ) : null}
              <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-100 ${collection.coverImageUrl ? 'absolute top-0 left-0 opacity-0 fallback' : ''}`}>
                <Image className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-1">{collection.name}</h3>
              {collection.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{collection.description}</p>
              )}
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
              <span className="text-xs text-gray-500">
                {collection.cardIds?.length || 0} card{collection.cardIds?.length !== 1 ? 's' : ''}
              </span>
              <span className="text-xs flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                {collection.visibility === 'private' ? (
                  <Lock className="h-3 w-3" />
                ) : collection.visibility === 'team' ? (
                  <Users className="h-3 w-3" />
                ) : (
                  <Globe className="h-3 w-3" />
                )}
                <span>{collection.visibility}</span>
              </span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CollectionGrid;
