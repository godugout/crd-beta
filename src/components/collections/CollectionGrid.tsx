
import React from 'react';
import { Link } from 'react-router-dom';
import { Collection } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock, Globe, Users, Image, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
          <Card key={index} className="overflow-hidden backdrop-blur-sm bg-[var(--bg-secondary)]/80 border border-[var(--border-primary)]">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-5">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className={`text-center py-14 ${className}`}>
        <p className="text-[var(--text-tertiary)] mb-4">No collections found.</p>
        <Button variant="gradient" asChild>
          <Link to="/collections/new">Create your first collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 ${className}`}>
      {collections.map((collection) => (
        <Link key={collection.id} to={`/collections/${collection.id}`}>
          <Card className="overflow-hidden card-hover backdrop-blur-sm bg-[var(--bg-secondary)]/80 border border-[var(--border-primary)] h-full">
            <div className="h-48 bg-[var(--bg-tertiary)] relative group">
              {collection.coverImageUrl ? (
                <img
                  src={collection.coverImageUrl}
                  alt={collection.name || 'Collection'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('fallback-active');
                  }}
                />
              ) : null}
              <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-elevated)] ${collection.coverImageUrl ? 'absolute top-0 left-0 opacity-0 fallback' : ''}`}>
                <Image className="h-14 w-14 text-[var(--text-quaternary)]" />
              </div>
              {collection.featured && (
                <div className="absolute top-3 right-3 bg-[var(--brand-accent)]/20 backdrop-blur-md border border-[var(--brand-accent)]/30 rounded-full p-1.5">
                  <Star className="h-4 w-4 text-[var(--brand-accent)]" />
                </div>
              )}
            </div>
            <CardContent className="p-5">
              <h3 className="font-semibold text-lg mb-2 text-[var(--text-primary)]">{collection.name}</h3>
              {(collection.description) && (
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-2">{collection.description}</p>
              )}
            </CardContent>
            <CardFooter className="px-5 pb-5 pt-0 flex justify-between">
              <span className="inline-flex items-center rounded-full bg-[var(--bg-elevated)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-tertiary)]">
                {collection.cards ? collection.cards.length : 0} card{collection.cards?.length !== 1 ? 's' : ''}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-tertiary)]">
                {collection.visibility === 'private' ? (
                  <Lock className="h-3 w-3" />
                ) : collection.visibility === 'team' ? (
                  <Users className="h-3 w-3" />
                ) : (
                  <Globe className="h-3 w-3" />
                )}
                <span className="text-xs">{collection.visibility}</span>
              </span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CollectionGrid;
