
import { useState, useEffect, useCallback } from 'react';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { Card } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

export const useCollectionDetail = (collectionId?: string) => {
  const { collections, cards, isLoading, updateCard, updateCollection, deleteCollection, fetchCards } = useCards();
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
  const [localLoading, setLocalLoading] = useState(false);
  
  // Refresh collection data from Supabase
  const refreshCollection = useCallback(async () => {
    if (!collectionId) return;
    
    setLocalLoading(true);
    try {
      console.log(`Refreshing collection data for ID: ${collectionId}`);
      
      // Fetch directly from Supabase to bypass any caching
      const { data: collectionData, error: collectionError } = await supabase
        .from('collections')
        .select('*')
        .eq('id', collectionId)
        .single();
        
      if (collectionError) {
        console.error('Error fetching collection:', collectionError);
        toast.error('Failed to refresh collection data');
        return;
      }
      
      if (collectionData) {
        console.log('Fetched collection data:', collectionData);
        
        // Fetch cards for this collection
        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('*')
          .eq('collection_id', collectionId);
          
        if (cardsError) {
          console.error('Error fetching collection cards:', cardsError);
        } else {
          console.log(`Fetched ${cardsData?.length || 0} cards for collection`);
        }
        
        // Refresh all cards and collections in the app context
        await fetchCards();
      } else {
        console.error('No collection data returned');
      }
    } catch (err) {
      console.error('Error in refreshCollection:', err);
    } finally {
      setLocalLoading(false);
    }
  }, [collectionId, fetchCards]);
  
  // Find the collection by ID
  const collection = collections.find(c => c.id === collectionId);
  
  // Get cards that belong to this collection
  const collectionCards = collection 
    ? cards.filter(card => card.collectionId === collectionId) 
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
    isLoading: isLoading || localLoading,
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
  };
};
