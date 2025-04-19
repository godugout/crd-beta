import { useState, useCallback } from 'react';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { Card, Collection } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { collectionOperations, convertDbCollectionToApp } from '@/lib/supabase/collections';

export function useCollectionDetail(collectionId: string) {
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
        const appCollection = convertDbCollectionToApp(data.collection);
        setLocalCollection(appCollection);
        
        if (data.cards?.length > 0) {
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
          
          setLocalCollection(prev => prev ? {
            ...prev,
            cardIds: processedCards.map(card => card.id)
          } : null);
        }
        
        console.log(`Fetched collection with ${data.cards?.length || 0} cards`);
        
        setFetchAttempts(0);
        
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
      
      setFetchAttempts(prevAttempts => prevAttempts + 1);
    } finally {
      setLocalLoading(false);
    }
  }, [collectionId, refreshCards, fetchAttempts]);
  
  const collection = localCollection || collections.find(c => c.id === collectionId);
  
  const collectionCards = localCards.length > 0 
    ? localCards 
    : (collection 
      ? cards.filter(card => card.collectionId === collectionId) 
      : []);

  const filteredCards = !searchTerm.trim() 
    ? collectionCards 
    : collectionCards.filter(card => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          (card.title?.toLowerCase().includes(lowerSearchTerm) || false) || 
          (card.description && card.description.toLowerCase().includes(lowerSearchTerm))
        );
      });

  useEffect(() => {
    if (collection) {
      setEditFormData({
        name: collection.name,
        description: collection.description || ''
      });
    }
  }, [collection]);

  useEffect(() => {
    if (collectionId && !collection && !localLoading && fetchAttempts < maxFetchAttempts) {
      refreshCollection();
    }
  }, [collectionId, collection, localLoading, refreshCollection, fetchAttempts, maxFetchAttempts]);

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

  const openAssetGalleryForCard = (cardId: string) => {
    setSelectedCardId(cardId);
    setIsAssetGalleryOpen(true);
  };

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

  const handleDeleteCollection = () => {
    if (collectionId) {
      deleteCollection(collectionId);
      toast.success('Collection deleted successfully');
      window.location.href = '/collections';
    }
  };

  const handleShareCollection = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Collection link copied to clipboard'))
      .catch(() => toast.error('Failed to copy collection link'));
  };

  const handleCardClick = (cardId: string) => {
    console.log('Card clicked:', cardId);
  };

  const handleAddCard = async (cardId: string) => {
    try {
      await addCardToCollection({
        collectionId,
        cardId
      });
      
      toast.success('Card added to collection successfully');
    } catch (error) {
      console.error('Error adding card to collection:', error);
      toast.error('Failed to add card to collection');
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await removeCardFromCollection({
        collectionId,
        cardId
      });
      
      toast.success('Card removed from collection successfully');
    } catch (error) {
      console.error('Error removing card from collection:', error);
      toast.error('Failed to remove card from collection');
    }
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
}
