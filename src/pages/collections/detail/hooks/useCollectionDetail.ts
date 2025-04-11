
import { useState, useEffect } from 'react';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { Card } from '@/lib/types';

export const useCollectionDetail = (collectionId?: string) => {
  const { collections, cards, isLoading, updateCard, updateCollection, deleteCollection } = useCards();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAssetGalleryOpen, setIsAssetGalleryOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: ''
  });
  
  // Find the collection by ID
  const collection = collections.find(c => c.id === collectionId);
  
  // Get cards that belong to this collection
  const collectionCards = collection 
    ? cards.filter(card => collection.cardIds?.includes(card.id)) 
    : [];

  // Filter cards based on search term
  const filteredCards = !searchTerm.trim() 
    ? collectionCards 
    : collectionCards.filter(card => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          (card.title?.toLowerCase().includes(lowerSearchTerm) || false) || 
          (card.description && card.description.toLowerCase().includes(lowerSearchTerm))
        );
      });

  // Initialize edit form data when collection changes
  useEffect(() => {
    if (collection) {
      setEditFormData({
        name: collection.name,
        description: collection.description || ''
      });
    }
  }, [collection]);

  // Handle asset selection from gallery
  const handleAssetSelect = (asset: any) => {
    if (selectedCardId) {
      updateCard(selectedCardId, { 
        imageUrl: asset.publicUrl,
        thumbnailUrl: asset.thumbnailUrl || asset.publicUrl 
      });
      toast.success('Card image updated successfully');
      setIsAssetGalleryOpen(false);
      setSelectedCardId(null);
    }
  };

  // Open asset gallery for a specific card
  const openAssetGalleryForCard = (cardId: string) => {
    setSelectedCardId(cardId);
    setIsAssetGalleryOpen(true);
  };
  
  // Update collection details
  const handleUpdateCollection = () => {
    if (collectionId && collection) {
      updateCollection(collectionId, {
        name: editFormData.name,
        description: editFormData.description
      });
      setIsEditDialogOpen(false);
      toast.success('Collection updated successfully');
    }
  };

  // Delete collection and navigate back
  const handleDeleteCollection = () => {
    if (collectionId) {
      deleteCollection(collectionId);
      toast.success('Collection deleted successfully');
      // Navigate back to collections list
      window.location.href = '/collections';
    }
  };

  const handleShareCollection = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Collection link copied to clipboard'))
      .catch(() => toast.error('Failed to copy collection link'));
  };

  const handleCardClick = (cardId: string) => {
    // Navigate to card detail view
    console.log('Card clicked:', cardId);
  };

  return {
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
  };
};
