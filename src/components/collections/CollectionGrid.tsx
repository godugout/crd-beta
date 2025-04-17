
import React from 'react';
import { Collection } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { GalleryHorizontal, Lock, Globe, Tag } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';

interface CollectionGridProps {
  collections: Collection[];
  isLoading?: boolean;
}

const CollectionGrid: React.FC<CollectionGridProps> = ({ 
  collections,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingState text="Loading collections..." />
      </div>
    );
  }
  
  if (collections.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <Link 
          to={`/collections/${collection.id}`} 
          key={collection.id}
          className="transition-transform hover:scale-[1.02]"
        >
          <Card className="h-full overflow-hidden">
            <div className="aspect-[16/9] overflow-hidden bg-muted">
              {collection.coverImageUrl ? (
                <img 
                  src={collection.coverImageUrl} 
                  alt={collection.name || 'Collection'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                  <GalleryHorizontal className="h-12 w-12 text-muted-foreground opacity-40" />
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg line-clamp-2">
                  {collection.name || 'Untitled Collection'}
                </h3>
                
                {collection.visibility && (
                  <Badge variant={collection.visibility === 'public' ? 'outline' : 'secondary'} className="ml-2 flex-shrink-0">
                    {collection.visibility === 'public' ? (
                      <Globe className="h-3 w-3 mr-1" />
                    ) : (
                      <Lock className="h-3 w-3 mr-1" />
                    )}
                    {collection.visibility}
                  </Badge>
                )}
              </div>
              
              {collection.description && (
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                  {collection.description}
                </p>
              )}
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center text-xs text-muted-foreground">
                  <GalleryHorizontal className="h-3 w-3 mr-1" />
                  {collection.cards?.length || 0} cards
                </div>
                
                {collection.tags && collection.tags.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Tag className="h-3 w-3 mr-1" />
                    {collection.tags.slice(0, 2).join(', ')}
                    {collection.tags.length > 2 && '...'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CollectionGrid;
