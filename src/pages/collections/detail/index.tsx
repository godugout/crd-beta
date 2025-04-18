
import React, { useEffect, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { useCollectionDetail } from './hooks/useCollectionDetail';
import { useCollectionHeader } from './CollectionHeader';
import CollectionContent from './CollectionContent';
import { EditDialog, DeleteDialog, AssetGalleryDialog } from './CollectionDialogs';
import { LoadingState } from '@/components/ui/loading-state';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCards } from '@/context/CardContext';
import { collectionOperations } from '@/lib/supabase/collections';

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const shouldRefresh = searchParams.get('refresh') === 'true';
  const { refreshCards } = useCards(); 
  
  const {
    collection,
    collectionCards,
    filteredCards,
    isLoading,
    viewMode,
    setViewMode,
    isAssetGalleryOpen,
    setIsAssetGalleryOpen,
    selectedCardId,
    isEditDialogOpen, 
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    searchTerm,
    setSearchTerm,
    editFormData,
    setEditFormData,
    handleAssetSelect,
    openAssetGalleryForCard,
    handleUpdateCollection,
    handleDeleteCollection,
    handleShareCollection,
    handleCardClick,
    refreshCollection
  } = useCollectionDetail(id);

  // Custom event listener for collection refresh
  useEffect(() => {
    const handleCollectionRefreshed = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.collectionId === id) {
        console.log('Collection refresh event detected, refreshing data');
        if (refreshCards) {
          refreshCards();
        }
      }
    };

    window.addEventListener('collection-refreshed', handleCollectionRefreshed);
    return () => {
      window.removeEventListener('collection-refreshed', handleCollectionRefreshed);
    };
  }, [id, refreshCards]);

  // Refresh collection data when the refresh param is present
  useEffect(() => {
    if (shouldRefresh && id) {
      console.log('Refreshing collection data due to refresh parameter');
      refreshCollection();
      
      // Also trigger a global cards refresh if available
      if (refreshCards) {
        refreshCards();
      }
    }
  }, [shouldRefresh, id, refreshCollection, refreshCards]);
  
  // Check collection existence in Supabase
  useEffect(() => {
    if (id && !collection && !isLoading) {
      console.log('Collection not found in state, checking Supabase directly');
      
      const checkCollection = async () => {
        try {
          const { data } = await collectionOperations.getCollection(id);
          
          if (data) {
            console.log('Collection exists in Supabase but not in state:', data);
            toast.info('Collection found. Loading data...');
            refreshCollection();
          } else {
            console.log('Collection not found in Supabase');
            toast.error('Collection not found');
          }
        } catch (err) {
          console.error('Error in direct collection check:', err);
        }
      };
      
      checkCollection();
    }
  }, [id, collection, isLoading, refreshCollection]);
  
  // Handle loading state
  if (isLoading) {
    return (
      <PageLayout title="Loading Collection..." description="Please wait">
        <div className="max-w-7xl mx-auto p-4">
          <LoadingState text="Loading collection" size="lg" />
        </div>
      </PageLayout>
    );
  }
  
  // Handle not found state
  if (!collection) {
    return (
      <PageLayout title="Collection Not Found" description="The requested collection could not be found">
        <div className="max-w-7xl mx-auto p-4 text-center py-16">
          <h1 className="text-3xl font-bold mb-4">Collection Not Found</h1>
          <p className="mb-8">The collection you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/collections">Browse Collections</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const { actionButtons, collectionStats } = useCollectionHeader({
    collection,
    onShareCollection: handleShareCollection,
    onEditCollection: () => setIsEditDialogOpen(true),
    onDeleteCollection: () => setIsDeleteDialogOpen(true),
    viewMode,
    setViewMode
  });

  return (
    <PageLayout 
      title={collection.name} 
      description={collection.description || 'View cards in this collection'}
      actions={actionButtons}
      stats={collectionStats}
      onSearch={setSearchTerm}
      searchPlaceholder="Search cards..."
    >
      <div className="container mx-auto px-4 py-4">
        {/* Edit Collection Dialog */}
        <EditDialog 
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          formData={editFormData}
          setFormData={setEditFormData}
          onSave={handleUpdateCollection}
        />

        {/* Delete Collection Dialog */}
        <DeleteDialog 
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onDelete={handleDeleteCollection}
        />

        {/* Asset Gallery Dialog */}
        <AssetGalleryDialog 
          isOpen={isAssetGalleryOpen}
          onOpenChange={setIsAssetGalleryOpen}
          onSelectAsset={handleAssetSelect}
          collectionId={collection.id}
        />

        <CollectionContent 
          filteredCards={filteredCards}
          allCardsCount={collectionCards.length}
          viewMode={viewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onCardClick={handleCardClick}
          openAssetGalleryForCard={openAssetGalleryForCard}
        />
      </div>
    </PageLayout>
  );
};

export default CollectionDetail;
