
import { useState, useEffect, useCallback } from 'react';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { Card, Collection } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { collectionOperations, convertDbCollectionToApp } from '@/lib/supabase/collections';

export const useCollectionDetail = (collectionId?: string) => {
  const { collections, cards, isLoading, updateCard, updateCollection, deleteCollection, refreshCards } = useCards();
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
  const [localCollection, setLocalCollection] = useState<Collection | null>(null);
  const [localCards, setLocalCards] = useState<Card[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const maxFetchAttempts = 3;
  
  // Refresh collection data from Supabase with improved error handling
  const refreshCollection = useCallback(async () => {
    if (!collectionId) return;
    
    setLocalLoading(true);
    setFetchError(null);
    
    try {
      console.log(`Refreshing collection data for ID: ${collectionId} (attempt ${fetchAttempts + 1})`);
      
      const { data, error } = await collectionOperations.getCollectionWithCards(collectionId);
        
      if (error) {
        console.error('Error fetching collection data:', error);
        setFetchError(error.message || 'Failed to load collection data');
        toast.error(`Failed to refresh collection data: ${error.message}`);
        return;
      }
      
      if (data?.collection) {
        // Convert DB collection to app format
        const appCollection = convertDbCollectionToApp(data.collection);
        setLocalCollection(appCollection);
        
        if (data.cards?.length > 0) {
          // Process cards
          const processedCards = data.cards.map(card => ({
            id: card.id,
            title: card.title || '',
            description: card.description || '',
            imageUrl: card.image_url || '',
            thumbnailUrl: card.thumbnail_url || card.image_url || '',
            collectionId: card.collection_id,
            userId: card.creator_id || card.user_id,
            teamId: card.team_id,
            isPublic: card.is_public,
            tags: card.tags || [],
            effects: [],
            createdAt: card.created_at,
            updatedAt: card.updated_at,
            designMetadata: card.design_metadata || {},
          })) as Card[];
          
          setLocalCards(processedCards);
          
          // Update local collection with card IDs
          setLocalCollection(prev => prev ? {
            ...prev,
            cardIds: processedCards.map(card => card.id)
          } : null);
        }
        
        console.log(`Fetched collection with ${data.cards?.length || 0} cards`);
        
        // Reset fetch attempts on success
        setFetchAttempts(0);
        
        // Dispatch refresh event
        if (typeof window !== 'undefined') {
          const refreshEvent = new CustomEvent('collection-refreshed', {
            detail: { 
              collectionId, 
              timestamp: new Date().getTime(),
              hasLocalData: true 
            }
          });
          window.dispatchEvent(refreshEvent);
        }
        
        // Also try to trigger global cards refresh if available
        if (refreshCards) {
          refreshCards();
        }
      } else {
        setFetchError('Collection not found');
        console.error('No collection data returned');
      }
    } catch (err: any) {
      console.error('Error in refreshCollection:', err);
      setFetchError(err.message || 'Unexpected error loading collection');
      
      // Increment fetch attempts
      setFetchAttempts(prevAttempts => prevAttempts + 1);
    } finally {
      setLocalLoading(false);
    }
  }, [collectionId, refreshCards, fetchAttempts]);
  
  // Find the collection in global state or use local state
  const collection = localCollection || collections.find(c => c.id === collectionId);
  
  // Get cards that belong to this collection, prioritize local cards
  const collectionCards = localCards.length > 0 
    ? localCards 
    : (collection 
      ? cards.filter(card => card.collectionId === collectionId) 
      : []);

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

  // Initial data load with limited retries
  useEffect(() => {
    if (collectionId && !collection && !localLoading && fetchAttempts < maxFetchAttempts) {
      refreshCollection();
    }
  }, [collectionId, collection, localLoading, refreshCollection, fetchAttempts, maxFetchAttempts]);

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
    refreshCollection,
    fetchError
  };
};
