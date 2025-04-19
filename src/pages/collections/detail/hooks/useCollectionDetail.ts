
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Card, Collection } from '@/lib/types';
import { useCards } from '@/context/CardContext';
import { collectionOperations, cardOperations } from '@/lib/supabase';
import { useMutation } from '@tanstack/react-query';

export const useCollectionDetail = (collectionId?: string) => {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [collectionCards, setCollectionCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAssetGalleryOpen, setIsAssetGalleryOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const [editFormData, setEditFormData] = useState<Partial<Collection>>({
    title: '',
    description: '',
    coverImageUrl: '',
    visibility: 'public',
    isPublic: true,
    allowComments: true,
    tags: []
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { cards, collections, getCardById, getCollectionById } = useCards();

  // Fetch and process collection data
  const fetchCollectionData = useCallback(async () => {
    if (!collectionId) {
      setIsLoading(false);
      setFetchError('No collection ID provided');
      return;
    }

    setIsLoading(true);
    setFetchError(null);
    
    try {
      // Try to get from the context first for faster rendering
      const contextCollection = getCollectionById(collectionId);
      
      if (contextCollection) {
        console.log('Collection found in context:', contextCollection);
        setCollection(contextCollection);
        setEditFormData({
          title: contextCollection.title || contextCollection.name,
          description: contextCollection.description,
          coverImageUrl: contextCollection.coverImageUrl,
          visibility: contextCollection.visibility || 'public',
          isPublic: contextCollection.isPublic !== undefined ? contextCollection.isPublic : true,
          allowComments: contextCollection.allowComments !== undefined ? contextCollection.allowComments : true,
          tags: contextCollection.tags || []
        });
        
        // Get cards for this collection
        const collectionCardIds = contextCollection.cardIds || [];
        const collectionCardsData = collectionCardIds
          .map(id => getCardById(id))
          .filter(Boolean) as Card[];
          
        setCollectionCards(collectionCardsData);
        setFilteredCards(collectionCardsData);
      } else {
        // If not in context, fetch from the database
        console.log('Collection not in context, fetching from API');
        const { data, error } = await collectionOperations.getCollection(collectionId);
        
        if (error) {
          console.error('Error fetching collection:', error);
          setFetchError(`Failed to load collection: ${error.message}`);
          return;
        }
        
        if (data) {
          setCollection(data);
          setEditFormData({
            title: data.title || data.name,
            description: data.description,
            coverImageUrl: data.coverImageUrl,
            visibility: data.visibility || 'public',
            isPublic: data.isPublic !== undefined ? data.isPublic : true,
            allowComments: data.allowComments !== undefined ? data.allowComments : true,
            tags: data.tags || []
          });
          
          // Fetch cards for this collection
          if (data.cardIds && data.cardIds.length > 0) {
            const { data: cardsData, error: cardsError } = await cardOperations.getCardsByIds(data.cardIds);
            
            if (cardsError) {
              console.error('Error fetching collection cards:', cardsError);
            } else if (cardsData) {
              setCollectionCards(cardsData);
              setFilteredCards(cardsData);
            }
          }
        } else {
          setFetchError('Collection not found');
        }
      }
    } catch (err: any) {
      console.error('Error in collection detail fetching:', err);
      setFetchError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [collectionId, getCardById, getCollectionById]);
  
  // Load initial data
  useEffect(() => {
    fetchCollectionData();
  }, [fetchCollectionData]);
  
  // Filter cards when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCards(collectionCards);
      return;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = collectionCards.filter(card => {
      return (
        card.title?.toLowerCase().includes(lowerSearchTerm) ||
        card.description?.toLowerCase().includes(lowerSearchTerm) ||
        card.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      );
    });
    
    setFilteredCards(filtered);
  }, [searchTerm, collectionCards]);

  // Update collection mutation
  const updateCollectionMutation = useMutation({
    mutationFn: (updatedCollection: Partial<Collection>) => {
      if (!collectionId || !collection) {
        throw new Error('Collection not found');
      }
      
      return collectionOperations.updateCollection(collectionId, updatedCollection);
    },
    onSuccess: (response) => {
      if (response.error) {
        toast({
          title: "Update failed",
          description: response.error.message,
          variant: "destructive"
        });
        return;
      }
      
      if (response.data) {
        setCollection(response.data);
        toast({
          title: "Collection updated",
          description: "Your collection has been updated successfully"
        });
        setIsEditDialogOpen(false);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating the collection",
        variant: "destructive"
      });
    }
  });

  // Delete collection mutation
  const deleteCollectionMutation = useMutation({
    mutationFn: () => {
      if (!collectionId) {
        throw new Error('Collection not found');
      }
      
      return collectionOperations.deleteCollection(collectionId);
    },
    onSuccess: (response) => {
      if (response.error) {
        toast({
          title: "Delete failed",
          description: response.error.message,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Collection deleted",
        description: "Your collection has been deleted successfully"
      });
      navigate('/collections');
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "An error occurred while deleting the collection",
        variant: "destructive"
      });
    }
  });
  
  // Handler for adding card to collection
  const handleAddCardToCollection = useCallback(async (cardId: string) => {
    if (!collectionId || !collection) return;
    
    try {
      // Use the context function if available
      if (typeof cardOperations.addCardToCollection === 'function') {
        const { error } = await cardOperations.addCardToCollection(cardId, collectionId);
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Refresh collection data
        fetchCollectionData();
        
        toast({
          title: "Card added",
          description: "Card added to collection successfully"
        });
      }
    } catch (err: any) {
      console.error('Error adding card to collection:', err);
      toast({
        title: "Failed to add card",
        description: err.message || "An error occurred",
        variant: "destructive"
      });
    }
  }, [collectionId, collection, fetchCollectionData, toast]);

  // Handler for removing card from collection
  const handleRemoveCardFromCollection = useCallback(async (cardId: string) => {
    if (!collectionId || !collection) return;
    
    try {
      // Use the context function if available
      if (typeof cardOperations.removeCardFromCollection === 'function') {
        const { error } = await cardOperations.removeCardFromCollection(cardId, collectionId);
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Update local state
        setCollectionCards(prev => prev.filter(card => card.id !== cardId));
        setFilteredCards(prev => prev.filter(card => card.id !== cardId));
        
        toast({
          title: "Card removed",
          description: "Card removed from collection successfully"
        });
      }
    } catch (err: any) {
      console.error('Error removing card from collection:', err);
      toast({
        title: "Failed to remove card",
        description: err.message || "An error occurred",
        variant: "destructive"
      });
    }
  }, [collectionId, collection, toast]);

  // Handler for asset selection
  const handleAssetSelect = useCallback((assetUrl: string) => {
    if (selectedCardId) {
      // Update card image
      console.log('Update card image:', selectedCardId, assetUrl);
    } else {
      // Update collection cover
      setEditFormData(prev => ({
        ...prev,
        coverImageUrl: assetUrl
      }));
    }
    setIsAssetGalleryOpen(false);
    setSelectedCardId(null);
  }, [selectedCardId]);

  // Handler for opening asset gallery for specific card
  const openAssetGalleryForCard = useCallback((cardId: string) => {
    setSelectedCardId(cardId);
    setIsAssetGalleryOpen(true);
  }, []);

  // Handler for updating collection
  const handleUpdateCollection = useCallback((formData: Partial<Collection>) => {
    updateCollectionMutation.mutate(formData);
  }, [updateCollectionMutation]);

  // Handler for deleting collection
  const handleDeleteCollection = useCallback(() => {
    deleteCollectionMutation.mutate();
  }, [deleteCollectionMutation]);

  // Handler for sharing collection
  const handleShareCollection = useCallback(() => {
    if (!collection) return;
    
    const url = `${window.location.origin}/collections/${collection.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: collection.title || collection.name || 'Shared Collection',
        text: collection.description || 'Check out this card collection!',
        url: url
      })
      .then(() => {
        toast({
          title: "Shared successfully",
          description: "The collection has been shared"
        });
      })
      .catch((err) => {
        console.error('Error sharing:', err);
        // Fallback to clipboard
        handleCopyLink();
      });
    } else {
      // Fallback for browsers that don't support sharing
      handleCopyLink();
    }
  }, [collection, toast]);

  // Helper for copying collection link
  const handleCopyLink = useCallback(() => {
    if (!collection) return;
    
    const url = `${window.location.origin}/collections/${collection.id}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: "Link copied",
          description: "Collection link copied to clipboard"
        });
      })
      .catch((err) => {
        console.error('Error copying to clipboard:', err);
        toast({
          title: "Copy failed",
          description: "Could not copy link to clipboard",
          variant: "destructive"
        });
      });
  }, [collection, toast]);
  
  // Handler for card click
  const handleCardClick = useCallback((cardId: string) => {
    navigate(`/cards/${cardId}`);
  }, [navigate]);
  
  // Refresh collection data
  const refreshCollection = useCallback(() => {
    fetchCollectionData();
  }, [fetchCollectionData]);

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
    handleCardClick,
    handleAddCardToCollection,
    handleRemoveCardFromCollection,
    refreshCollection,
    fetchError
  };
};
