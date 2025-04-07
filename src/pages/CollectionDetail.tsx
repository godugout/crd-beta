import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, Collection } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CardGrid from '@/components/gallery/CardGrid';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CollectionDetailParams {
  id: string;
}

const CollectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>('');
  const [editedDescription, setEditedDescription] = useState<string>('');
  const [editedCoverImageUrl, setEditedCoverImageUrl] = useState<string>('');
  const [editedVisibility, setEditedVisibility] = useState<'public' | 'private' | 'team'>('public');
  const [editedAllowComments, setEditedAllowComments] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    async function fetchCollectionDetails() {
      setIsLoading(true);
      try {
        const { data: collectionData, error: collectionError } = await supabase
          .from('collections')
          .select('*')
          .eq('id', id)
          .single();

        if (collectionError) {
          console.error('Error fetching collection:', collectionError);
          toast.error('Failed to load collection details');
          setIsLoading(false);
          return;
        }

        const fetchedCollection: Collection = {
          id: collectionData.id,
          name: collectionData.title || '',
          description: collectionData.description || '',
          coverImageUrl: collectionData.cover_image_url || '',
          userId: collectionData.owner_id,
          teamId: collectionData.team_id,
          visibility: collectionData.visibility as 'public' | 'private' | 'team' || 'public',
          allowComments: collectionData.allow_comments !== undefined ? collectionData.allow_comments : true,
          createdAt: collectionData.created_at,
          updatedAt: collectionData.updated_at,
          designMetadata: collectionData.design_metadata
        };

        setCollection(fetchedCollection);
        setEditedName(fetchedCollection.name);
        setEditedDescription(fetchedCollection.description || '');
        setEditedCoverImageUrl(fetchedCollection.coverImageUrl || '');
        setEditedVisibility(fetchedCollection.visibility || 'public');
        setEditedAllowComments(fetchedCollection.allowComments !== undefined ? fetchedCollection.allowComments : true);

        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('*')
          .eq('collection_id', id)
          .order('created_at', { ascending: false });

        if (cardsError) {
          console.error('Error fetching cards:', cardsError);
          toast.error('Failed to load cards');
        } else if (cardsData) {
          const processedCards: Card[] = cardsData.map(card => ({
            id: card.id,
            title: card.title || '',
            description: card.description || '',
            imageUrl: card.image_url || '',
            thumbnailUrl: card.thumbnail_url || card.image_url || '',
            collectionId: card.collection_id,
            userId: card.user_id,
            teamId: card.team_id,
            createdAt: card.created_at,
            updatedAt: card.updated_at,
            isPublic: card.is_public || false,
            tags: card.tags || [],
            designMetadata: card.design_metadata || {}
          }));
          setCards(processedCards);
        }
      } catch (err) {
        console.error('Error fetching collection details:', err);
        toast.error('An error occurred while loading the collection');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCollectionDetails();
  }, [id]);

  const handleSaveChanges = async () => {
    if (!collection) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('collections')
        .update({
          title: editedName,
          description: editedDescription,
          cover_image_url: editedCoverImageUrl,
          visibility: editedVisibility,
          allow_comments: editedAllowComments
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating collection:', error);
        toast.error('Failed to update collection');
      } else {
        setCollection({
          ...collection,
          name: editedName,
          description: editedDescription,
          coverImageUrl: editedCoverImageUrl,
          visibility: editedVisibility,
          allowComments: editedAllowComments
        });
        toast.success('Collection updated successfully');
      }
    } catch (err) {
      console.error('Error updating collection:', err);
      toast.error('An error occurred while updating the collection');
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleCardClick = (cardId: string) => {
    navigate(`/card/${cardId}`);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  if (!collection) {
    return <div className="container mx-auto p-6">Collection not found</div>;
  }

  const isOwner = user && user.id === collection.userId;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-3xl font-bold border-b-2 border-blue-500 outline-none w-full mb-3"
            />
          ) : (
            <h1 className="text-3xl font-bold">{collection.name}</h1>
          )}
          {isEditing ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full border rounded-md p-2 outline-none"
              rows={3}
            />
          ) : (
            collection.description && (
              <p className="text-gray-600 mt-2">{collection.description}</p>
            )
          )}
          
          {isOwner && !isEditing && (
            <Button 
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setIsEditing(true)}
            >
              Edit Collection
            </Button>
          )}
        </div>
        {isOwner && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this collection and all of the cards inside.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="mb-8">
        {isEditing ? (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Cover Image URL</label>
            <input
              type="text"
              value={editedCoverImageUrl}
              onChange={(e) => setEditedCoverImageUrl(e.target.value)}
              className="w-full border rounded-md p-2"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        ) : (
          collection.coverImageUrl && (
            <img 
              src={collection.coverImageUrl} 
              alt={`Cover for ${collection.name}`}
              className="w-full max-h-64 object-cover rounded-lg shadow-md"
            />
          )
        )}
        
        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Visibility</label>
              <select
                value={editedVisibility}
                onChange={(e) => setEditedVisibility(e.target.value as 'public' | 'private' | 'team')}
                className="w-full border rounded-md p-2"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="team">Team Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Allow Comments</label>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={editedAllowComments}
                  onChange={(e) => setEditedAllowComments(e.target.checked)}
                  className="mr-2"
                />
                <span>Enable comments on this collection</span>
              </div>
            </div>
          </div>
        )}
        
        {isEditing && (
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Cards in this Collection</h2>
        {cards.length > 0 ? (
          <CardGrid 
            cards={cards}
            cardEffects={{}}
            onCardClick={handleCardClick}
            className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          />
        ) : (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-gray-500">No cards in this collection yet.</p>
            <Button className="mt-4">Add Cards</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;
