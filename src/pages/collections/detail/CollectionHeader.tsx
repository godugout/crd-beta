
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Edit, Trash2 } from 'lucide-react';
import { Collection } from '@/lib/types';

interface CollectionHeaderProps {
  collection: Collection;
  onShareCollection: () => void;
  onEditCollection: () => void;
  onDeleteCollection: () => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

interface CollectionHeaderResult {
  actionButtons: React.ReactNode;
  collectionStats: Array<{ count?: number; label: string }>;
}

// Change the function to return CollectionHeaderResult instead of being a React component
export const useCollectionHeader = ({
  collection,
  onShareCollection,
  onEditCollection,
  onDeleteCollection,
  viewMode,
  setViewMode
}: CollectionHeaderProps): CollectionHeaderResult => {
  // Collection stats for secondary navbar
  const collectionStats = [
    { count: collection.cardIds.length, label: `card${collection.cardIds.length !== 1 ? 's' : ''}` },
    { label: collection.visibility || 'private' }
  ];

  // Action buttons for secondary navigation
  const actionButtons = (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setViewMode('grid')}
        className={viewMode === 'grid' ? 'bg-gray-100' : ''}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setViewMode('list')}
        className={viewMode === 'list' ? 'bg-gray-100' : ''}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onShareCollection}
      >
        <Share2 className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onEditCollection}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onDeleteCollection}
        className="text-red-500 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );
  
  return { actionButtons, collectionStats };
};
