
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { useCollectionDetail } from './hooks/useCollectionDetail';
import { CollectionHeader } from './CollectionHeader';
import CollectionContent from './CollectionContent';
import { EditDialog, DeleteDialog, AssetGalleryDialog } from './CollectionDialogs';
import { LoadingState } from '@/components/ui/loading-state';

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
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
    handleCardClick
  } = useCollectionDetail(id);

  // Debug log
  console.log('CollectionDetail rendering with collection:', collection?.name);
  
  if (isLoading) {
    return (
      <PageLayout title="Loading Collection..." description="Please wait">
        <div className="max-w-7xl mx-auto p-4">
          <LoadingState text="Loading collection" size="lg" />
        </div>
      </PageLayout>
    );
  }
  
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

  const { actionButtons, collectionStats } = CollectionHeader({
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
